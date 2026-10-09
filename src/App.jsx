import { Route, Routes } from "react-router-dom";
import RequireAuth from "./auth/RequireAuth.jsx";
import RequirePermission from "./auth/RequirePermission.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import LoginPage from "./pages/Login.page.jsx";
import DashboardPage from "./pages/Dashboard.page.jsx";
import SheetListPage from "./pages/sheets/SheetList.page.jsx";
import TopicListPage from "./pages/topics/TopicList.page.jsx";
import ProblemListPage from "./pages/problems/ProblemList.page.jsx";
import UserListPage from "./pages/users/UserList.page.jsx";
import RoleListPage from "./pages/roles/RoleList.page.jsx";
import ConfigListPage from "./pages/config/ConfigList.page.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route element={<RequirePermission permission="DASHBOARD_VIEW" />}>
            <Route index element={<DashboardPage />} />
          </Route>
          <Route element={<RequirePermission permission="SHEET_MANAGE" />}>
            <Route path="/sheets" element={<SheetListPage />} />
          </Route>
          <Route element={<RequirePermission permission="TOPIC_MANAGE" />}>
            <Route path="/topics" element={<TopicListPage />} />
          </Route>
          <Route element={<RequirePermission permission="PROBLEM_MANAGE" />}>
            <Route path="/problems" element={<ProblemListPage />} />
          </Route>
          <Route element={<RequirePermission permission="USER_MANAGE" />}>
            <Route path="/users" element={<UserListPage />} />
          </Route>
          <Route element={<RequirePermission permission="ROLE_MANAGE" />}>
            <Route path="/roles" element={<RoleListPage />} />
          </Route>
          <Route element={<RequirePermission permission="CONFIG_MANAGE" />}>
            <Route path="/config" element={<ConfigListPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
