import api from "../config/Api";

export const getProfile = () =>
  api.get("/profile/user-profile").then((r) => r.data);
export const createProfile = (payload) =>
  api.post("/profile/complete-profile", payload).then((r) => r.data);
export const updateProfile = (payload) =>
  api.put("/profile/update-profile", payload).then((r) => r.data);
