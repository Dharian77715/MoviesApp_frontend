import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../auth/pages/LoginPage";
import { MoviesRoutes } from "../movies/routes/MoviesRoutes";

export const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="/*" element={<MoviesRoutes />} />
      </Routes>
    </>
  );
};
