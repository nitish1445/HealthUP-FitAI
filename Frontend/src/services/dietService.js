import api from "../config/Api";

export const getActiveDietPlan = () => api.get("/diet").then((r) => r.data);
export const regenerateDietPlan = () => api.post("/diet/generate").then((r) => r.data);
export const logDiet = (payload) => api.post("/diet/log", payload).then((r) => r.data);
export const getDietLogs = (limit = 30) => api.get(`/diet/logs?limit=${limit}`).then((r) => r.data);
export const swapMeal = (mealName, itemName) => api.post("/diet/swap", { mealName, itemName }).then((r) => r.data);
