import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "../../ui/components/Navbar";
import { MoviesForm } from "../components/MoviesForm";

import { ActorsPage } from "../pages/ActorsPage";
import { MoviesPage } from "../pages/MoviesPage";

export const MoviesRoutes = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="movies" element={<MoviesPage />} />
          <Route path="actors" element={<ActorsPage />} />
          <Route path="movies/new" element={<MoviesForm />} />
          <Route path="movies/edit/:id" element={<MoviesForm />} />

          <Route path="/*" element={<Navigate to="/movies" />} />
        </Routes>
      </div>
    </>
  );
};
