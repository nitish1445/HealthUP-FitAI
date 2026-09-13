import api from "../config/Api";

export const getOverview = () => api.get("/admin/overview").then((r) => r.data);
export const listUsers = () => api.get("/admin/users").then((r) => r.data);
