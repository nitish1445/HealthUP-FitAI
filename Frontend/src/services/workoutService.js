import api from "../config/Api";

export const getActiveWorkoutPlan = () => api.get("/workouts").then((r) => r.data);
export const getTodayWorkout = () => api.get("/workouts/today").then((r) => r.data);
export const regenerateWorkoutPlan = () => api.post("/workouts/generate").then((r) => r.data);
export const logWorkout = (planId, payload) => api.post(`/workouts/${planId}/log`, payload).then((r) => r.data);
export const getWorkoutLogs = (limit = 30) => api.get(`/workouts/logs?limit=${limit}`).then((r) => r.data);
