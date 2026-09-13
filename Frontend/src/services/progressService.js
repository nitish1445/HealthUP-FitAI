import api from "../config/Api";

export const getProgress = (weeks = 4) => api.get(`/progress?weeks=${weeks}`).then((r) => r.data);
export const logWeight = (payload) => api.post("/progress/weight", payload).then((r) => r.data);
export const logMeasurements = (payload) => api.post("/progress/measurements", payload).then((r) => r.data);
