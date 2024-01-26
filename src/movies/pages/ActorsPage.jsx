import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { moviesApi } from "../../api/moviesApi";
import { ActorsCard } from "../components/ActorsCard";
import { ListGroup } from "../components/ListGroup";
import { SearchBox } from "../components/SearchBox";

export const ActorsPage = () => {
  const [sex, setSex] = useState([]);
  const [selectedSex, setSelectedSex] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [actors, setActors] = useState([]);
  console.log(actors);

  const getActors = async () => {
    try {
      const { data: actorsData } = await moviesApi.get("/actors");
      setActors(actorsData);

      const { data } = await moviesApi.get("/actor/sex");
      setSex(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getActors();
  }, []);

  const handleSexSelect = ({ target }) => {
    setSelectedSex(target.value);
    setSearchQuery("");
  };

  const handleSearch = (searchQuery) => {
    setSearchQuery(searchQuery);
    setSelectedSex("");
  };

  // const hasGenresByMovieId = (actor, selectedGenre) => {
  //   const hasSelectedGenre = actor.sex
  //     ?.map(({ id }) => id)
  //     ?.includes(Number(selectedGenre));
  //   return hasSelectedGenre;
  // };

  const filteredActors = actors.filter((actor) => {
    const filteredBySearch = actor.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (searchQuery) {
      return filteredBySearch;
    }
    if (selectedSex) {
      return hasGenresByMovieId(actor, selectedSex);
    }

    return true;
  });

  return (
    <>
      <h1>Actors</h1>
      <hr />
    </>
  );
};
