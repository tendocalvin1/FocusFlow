import { mockAnalyticsData } from "@/data/mockAnalytics";

const delay = (data, ms = 150) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

const clone = (obj) => JSON.parse(JSON.stringify(obj));

export const analyticsService = {
  getAnalytics: async (range = "7d") => {
    const payload = clone(mockAnalyticsData);
    if (range === "30d") {
      payload.trend7Days = Array.from({ length: 30 }, (_, i) => ({
        label: `D${i + 1}`,
        hours: +(1 + Math.random() * 6).toFixed(1),
        tasks: Math.round(2 + Math.random() * 10),
      }));
    }
    if (range === "90d") {
      payload.heatmapGrid = Array.from({ length: 90 }, (_, i) => ({
        day: i + 1,
        intensity: Math.floor(Math.random() * 4),
      }));
    }
    return delay(payload);
  },

  getSummary: async () => {
    return delay(clone(mockAnalyticsData.summary));
  },

  getProductivityTrend: async (range = "7d") => {
    const data = await analyticsService.getAnalytics(range);
    return data.trend7Days;
  },

  getCategoryDistribution: async () => {
    return delay(clone(mockAnalyticsData.categoryDistribution));
  },

  getHeatmapGrid: async (range = "28d") => {
    let grid = mockAnalyticsData.heatmapGrid;
    if (range === "90d") {
      grid = Array.from({ length: 90 }, (_, i) => ({
        day: i + 1,
        intensity: Math.floor(Math.random() * 4),
      }));
    }
    return delay(clone(grid));
  },
};
