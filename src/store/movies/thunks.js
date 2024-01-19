import { moviesApi } from "../../api/moviesApi"
import { setMovies } from "./moviesSlice";


export const getMovies = () => {
    return async ( dispatch, getState) => {

        const { data } = await moviesApi.get('/movies');
        dispatch( setMovies({movies: data}) )
    }
}


