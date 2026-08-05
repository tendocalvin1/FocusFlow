import api from "@/services/api";

export const goalsService = {
  async getGoals() {
    const response = await api.get("/api/goals/");
    return response.data;
  },

  async getGoalById(id) {
    const response = await api.get(`/api/goals/${id}/`);
    return response.data;
  },

  async createGoal(goalData) {
    const response = await api.post("/api/goals/", goalData);
    return response.data;
  },

  async updateGoal(id, goalData) {
    const response = await api.put(`/api/goals/${id}/`, goalData);
    return response.data;
  },

  async deleteGoal(id) {
    await api.delete(`/api/goals/${id}/`);
    return true;
  },
};