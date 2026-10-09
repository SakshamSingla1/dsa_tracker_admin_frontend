import { request } from "./client.js";

// --- Sheets ---
export const fetchSheets = () => request("/admin/sheets");
export const createSheet = (body) => request("/admin/sheets", { method: "POST", body: JSON.stringify(body) });
export const updateSheet = (id, body) => request(`/admin/sheets/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteSheet = (id) => request(`/admin/sheets/${id}`, { method: "DELETE" });

// --- Topics ---
export const fetchTopics = () => request("/admin/topics");
export const createTopic = (body) => request("/admin/topics", { method: "POST", body: JSON.stringify(body) });
export const updateTopic = (id, body) => request(`/admin/topics/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteTopic = (id) => request(`/admin/topics/${id}`, { method: "DELETE" });
export const reorderTopics = (sheetId, orderedTopicIds) =>
  request("/admin/topics/reorder", { method: "POST", body: JSON.stringify({ sheetId, orderedTopicIds }) });

// --- Problems ---
export const fetchProblems = () => request("/admin/problems");
export const fetchProblem = (id) => request(`/admin/problems/${id}`);
export const createProblem = (body) => request("/admin/problems", { method: "POST", body: JSON.stringify(body) });
export const updateProblem = (id, body) => request(`/admin/problems/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteProblem = (id) => request(`/admin/problems/${id}`, { method: "DELETE" });

// --- Users ---
export const fetchUsers = () => request("/admin/users");
export const assignUserRole = (id, roleId) =>
  request(`/admin/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ roleId }) });
export const setUserEnabled = (id, enabled) =>
  request(`/admin/users/${id}/enabled`, { method: "PATCH", body: JSON.stringify({ enabled }) });

// --- Roles & permissions ---
export const fetchRoles = () => request("/admin/roles");
export const fetchPermissions = () => request("/admin/permissions");
export const createRole = (body) => request("/admin/roles", { method: "POST", body: JSON.stringify(body) });
export const updateRole = (id, body) => request(`/admin/roles/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteRole = (id) => request(`/admin/roles/${id}`, { method: "DELETE" });

// --- Meta config ---
export const fetchConfigs = () => request("/admin/configs");
export const upsertConfig = (context, data) =>
  request(`/admin/configs/${encodeURIComponent(context)}`, { method: "PUT", body: JSON.stringify({ data }) });
export const deleteConfig = (context) => request(`/admin/configs/${encodeURIComponent(context)}`, { method: "DELETE" });

// --- Dashboard ---
export const fetchDashboardStats = () => request("/admin/dashboard/stats");
