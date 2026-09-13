import api from "../config/Api";

export const getHabits = () => api.get("/habits").then((r) => r.data);
export const checkInEnergy = (payload) => api.post("/recovery/check-in", payload).then((r) => r.data);
export const getRecovery = () => api.get("/recovery").then((r) => r.data);
export const getForecast = () => api.get("/forecast").then((r) => r.data);
export const evaluatePlan = () => api.post("/plans/evaluate").then((r) => r.data);
export const getAdjustments = () => api.get("/plans/adjustments").then((r) => r.data);
export const getCoachContext = () => api.get("/coach/context").then((r) => r.data);
export const sendCoachMessage = (message) => api.post("/coach/message", { message }).then((r) => r.data);
