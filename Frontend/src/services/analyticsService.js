import api from "../config/Api";

export const getAnalytics = () => api.get("/analytics").then((r) => r.data);
export const getRoadmap = () => api.get("/roadmap").then((r) => r.data);
export const getDashboardSummary = () => api.get("/dashboard").then((r) => r.data);
