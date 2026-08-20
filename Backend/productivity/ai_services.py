import json
import logging
import os
from datetime import timedelta

from django.utils import timezone
from openai import OpenAI

from .models import FocusSession, Goal, Streak, Task


logger = logging.getLogger(__name__)

AI_PLANNER_SYSTEM_PROMPT = """
You are FocusFlow's productivity planning assistant. Build a realistic weekly execution plan from only the supplied user data. Prioritize deadlines, task priority, workload, recent focus behavior, and sustainable daily capacity. Prefer concrete existing tasks and reference their IDs. Explain recommendations briefly, distinguish observed facts from recommendations, and never invent user facts or database entities. The plan is advisory only and must not mutate application data.
""".strip()

PLAN_SCHEMA = {
    "type": "object",
    "properties": {
        "summary": {"type": "string"},
        "priorities": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "goal_id": {"type": ["integer", "null"]},
                    "reason": {"type": "string"},
                    "priority": {"type": "string", "enum": ["HIGH", "MEDIUM", "LOW"]},
                },
                "required": ["goal_id", "reason", "priority"],
                "additionalProperties": False,
            },
        },
        "plan": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "day": {"type": "string"},
                    "tasks": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "task_id": {"type": ["integer", "null"]},
                                "title": {"type": "string"},
                                "estimated_minutes": {"type": "integer", "minimum": 15, "maximum": 240},
                                "reason": {"type": "string"},
                            },
                            "required": ["task_id", "title", "estimated_minutes", "reason"],
                            "additionalProperties": False,
                        },
                    },
                },
                "required": ["day", "tasks"],
                "additionalProperties": False,
            },
        },
        "risks": {"type": "array", "items": {"type": "string"}},
        "recommendations": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["summary", "priorities", "plan", "risks", "recommendations"],
    "additionalProperties": False,
}


class AIConfigurationError(Exception):
    pass


class AIProviderError(Exception):
    pass


class AIResponseValidationError(Exception):
    pass


def _duration_minutes(session):
    if not session.end_time or not session.start_time:
        return None
    return max(0, round((session.end_time - session.start_time).total_seconds() / 60))


def build_productivity_context(user, today=None):
    today = today or timezone.localdate()
    week_start = today - timedelta(days=6)
    approaching_deadline = today + timedelta(days=7)

    goals = list(Goal.objects.filter(user=user).prefetch_related("tasks"))
    tasks = list(Task.objects.filter(goal__user=user).select_related("goal"))
    sessions = list(FocusSession.objects.filter(user=user, completed=True).select_related("task"))
    streak = Streak.objects.filter(user=user).first()

    active_goals = [goal for goal in goals if not goal.completed and goal.status != "COMPLETED"]
    recent_sessions = [session for session in sessions if timezone.localdate(session.start_time) >= week_start]
    recent_minutes = [duration for session in recent_sessions if (duration := _duration_minutes(session)) is not None]
    all_minutes = [duration for session in sessions if (duration := _duration_minutes(session)) is not None]
    incomplete_tasks = [task for task in tasks if not task.completed]

    context = {
        "current_date": today.isoformat(),
        "goals": [
            {
                "id": goal.id,
                "title": goal.title,
                "category": goal.category,
                "priority": goal.priority,
                "status": goal.status,
                "progress": goal.progress,
                "target_date": goal.target_date.isoformat(),
                "completed": goal.completed,
                "active_task_count": sum(not task.completed for task in goal.tasks.all()),
            }
            for goal in goals
        ],
        "tasks": [
            {
                "id": task.id,
                "title": task.title,
                "priority": task.priority,
                "completed": task.completed,
                "goal_id": task.goal_id,
                "goal_title": task.goal.title,
                "created_at": task.created_at.isoformat(),
                "updated_at": task.updated_at.isoformat(),
            }
            for task in tasks
        ],
        "focus_metrics": {
            "last_7_days_minutes": sum(recent_minutes),
            "completed_sessions": len(sessions),
            "average_completed_session_minutes": round(sum(all_minutes) / len(all_minutes)) if all_minutes else 0,
            "last_7_days_completed_sessions": len(recent_sessions),
        },
        "streak": {
            "current": streak.current_streak if streak else 0,
            "longest": streak.longest_streak if streak else 0,
        },
        "productivity_metrics": {
            "active_goals": len(active_goals),
            "completed_goals": sum(goal.completed or goal.status == "COMPLETED" for goal in goals),
            "overdue_goals": sum(goal.target_date < today and goal in active_goals for goal in goals),
            "goals_approaching_deadline": sum(today <= goal.target_date <= approaching_deadline and goal in active_goals for goal in goals),
            "incomplete_tasks": len(incomplete_tasks),
            "completed_tasks": len(tasks) - len(incomplete_tasks),
            "high_priority_incomplete_tasks": sum(task.priority == "HIGH" for task in incomplete_tasks),
        },
    }
    return context


def _validate_plan(payload, context=None):
    if not isinstance(payload, dict):
        raise AIResponseValidationError("The model response was not an object.")
    required = ("summary", "priorities", "plan", "risks", "recommendations")
    if any(key not in payload for key in required):
        raise AIResponseValidationError("The model response omitted required fields.")
    if not isinstance(payload["summary"], str) or not all(isinstance(payload[key], list) for key in required[1:]):
        raise AIResponseValidationError("The model response had invalid field types.")
    goal_ids = {goal["id"] for goal in context["goals"]} if context else None
    task_ids = {task["id"] for task in context["tasks"]} if context else None
    for item in payload["priorities"]:
        if not isinstance(item, dict) or not {"goal_id", "reason", "priority"}.issubset(item):
            raise AIResponseValidationError("The model returned an invalid priority.")
        if item["goal_id"] is not None and not isinstance(item["goal_id"], int):
            raise AIResponseValidationError("The model returned an invalid goal ID.")
        if goal_ids is not None and item["goal_id"] is not None and item["goal_id"] not in goal_ids:
            raise AIResponseValidationError("The model referenced a goal outside the supplied context.")
        if item["priority"] not in {"HIGH", "MEDIUM", "LOW"}:
            raise AIResponseValidationError("The model returned an invalid priority level.")
    for day in payload["plan"]:
        if not isinstance(day, dict) or not isinstance(day.get("day"), str) or not isinstance(day.get("tasks"), list):
            raise AIResponseValidationError("The model returned an invalid plan day.")
        for task in day["tasks"]:
            if not isinstance(task, dict) or not {"task_id", "title", "estimated_minutes", "reason"}.issubset(task):
                raise AIResponseValidationError("The model returned an invalid planned task.")
            if task["task_id"] is not None and not isinstance(task["task_id"], int):
                raise AIResponseValidationError("The model returned an invalid task ID.")
            if task_ids is not None and task["task_id"] is not None and task["task_id"] not in task_ids:
                raise AIResponseValidationError("The model referenced a task outside the supplied context.")
            if not isinstance(task["estimated_minutes"], int) or not 15 <= task["estimated_minutes"] <= 240:
                raise AIResponseValidationError("The model returned an invalid task estimate.")
    if not all(isinstance(value, str) for key in ("risks", "recommendations") for value in payload[key]):
        raise AIResponseValidationError("The model returned invalid recommendations.")
    return payload


def generate_productivity_plan(user):
    context = build_productivity_context(user)
    if not context["goals"] and not context["tasks"]:
        return {
            "summary": "You don't have enough productivity data yet.",
            "priorities": [],
            "plan": [],
            "risks": [],
            "recommendations": ["Create a goal and a few tasks first, then I can build a personalized execution plan for you."],
            "empty": True,
        }

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise AIConfigurationError

    try:
        client = OpenAI(api_key=api_key, timeout=20.0, max_retries=1)
        response = client.responses.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            instructions=AI_PLANNER_SYSTEM_PROMPT,
            input=json.dumps(context),
            text={"format": {"type": "json_schema", "name": "focusflow_productivity_plan", "strict": True, "schema": PLAN_SCHEMA}},
            max_output_tokens=3000,
        )
        return _validate_plan(json.loads(response.output_text), context)
    except AIResponseValidationError:
        raise
    except Exception as exc:
        logger.exception("AI productivity plan provider request failed: %s", type(exc).__name__)
        raise AIProviderError from exc