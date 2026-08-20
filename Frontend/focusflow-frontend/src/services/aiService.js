import api from "@/services/api";

export const aiService = {
  async generateProductivityPlan() {
    const response = await api.post("/api/ai/productivity-plan/", {});
    return response.data;
  },
};