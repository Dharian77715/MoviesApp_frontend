import { createSlice } from '@reduxjs/toolkit'


export const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
  },
  reducers: {
    setMovies: (state, {payload}) => {
      state.movies = payload.movies
    },

    
  },
})


export const { setMovies } = moviesSlice.actions