import api from "@/services/api";

export const goalsService = {
  // Get all goals
  async getGoals() {
    const response = await api.get("/productivity/goals/");
    return response.data;
  },

  // Get one goal
  async getGoalById(id) {
    const response = await api.get(`/productivity/goals/${id}/`);
    return response.data;
  },

  // Create goal
  async createGoal(goalData) {
    const response = await api.post("/productivity/goals/", goalData);
    return response.data;
  },

  // Update goal
  async updateGoal(id, goalData) {
    const response = await api.put(
      `/productivity/goals/${id}/`,
      goalData
    );

    return response.data;
  },

  // Delete goal
  async deleteGoal(id) {
    await api.delete(`/productivity/goals/${id}/`);
    return true;
  },
};