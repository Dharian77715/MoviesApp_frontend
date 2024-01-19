import axios from 'axios';
import { getEnvVariables } from '../movies/helpers/getEnvVariables';

const { VITE_MOVIEAPP_URL } = getEnvVariables()

export const moviesApi = axios.create({
    baseURL: VITE_MOVIEAPP_URL
});
