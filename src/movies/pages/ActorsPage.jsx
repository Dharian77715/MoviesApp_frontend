import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { moviesApi } from "../../api/moviesApi";
import { ActorsCard } from "../components/ActorsCard";
import { ListGroup } from "../components/ListGroup";
import { SearchBox } from "../components/SearchBox";

export const ActorsPage = () => {
  const [sex, setSex] = useState([]);
  const [selectedSex, setSelectedSex] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [actors, setActors] = useState([]);

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

  const hasSexByMovieId = (actor, selectedSex) => {
    const actorSex = selectedSex === "Masculino" ? 1 : 2;
    return actor.sex_id === actorSex;
  };

  const filteredActors = actors.filter((actor) => {
    const filteredBySearch = actor.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (searchQuery) {
      return filteredBySearch;
    }
    if (selectedSex) {
      return hasSexByMovieId(actor, selectedSex);
    }
    return true;
  });

  const deleteActor = async (id) => {
    try {
      await moviesApi.delete(`/actors/${id}`);
      setActors(filteredActors.filter((actor) => actor.id !== id));

      await Swal.fire({
        icon: "success",
        title: "Actor eliminado",
        text: "¡El actor ha sido eliminado con éxito!",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>Actores</h1>
      <hr />

      <div className="row">
        <div className="col-3">
          <SearchBox value={searchQuery} onChange={handleSearch} />
        </div>
        <ListGroup
          name="Sexo"
          items={sex}
          // items={[
          //   { id: "Masculino", sex_name: "Masculino" },
          //   { id: "Femenino", sex_name: "Femenino" },
          // ]}
          selectedItem={selectedSex}
          onItemSelect={handleSexSelect}
        />
        <div className="d-flex justify-content-end">
          <Link to="new" className="btn btn-primary mb-2">
            Agregar actor
          </Link>
        </div>
      </div>
      {filteredActors.length === 0 ? (
        <p>
          El actor <b>{searchQuery}</b> no fue encontrado
        </p>
      ) : (
        <div className="row rows-cols-1 row-cols-md-3 g-3">
          {filteredActors.map((actor) => (
            <ActorsCard
              key={actor.id}
              actor={actor}
              sex={sex}
              onActorDelete={deleteActor}
            />
          ))}
        </div>
      )}
    </>
  );
};
