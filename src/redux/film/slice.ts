import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Film, FilmSliceState, Status } from './types';
import { SearchFilmParams } from './types';

export const fetchFilm = createAsyncThunk<Film[], SearchFilmParams>(
    'film/fetchFilmStatus',
    async (params) => {
        const {
            sortBy,
            order,
            category,
            search,
            currentPage,
        } = params;
        const { data } = await axios.get<Film[]>(
            `https://63bb1a1e32d17a50908714d3.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
        );
        return data;
    });

const initialState: FilmSliceState = {
    items: [],
    status: Status.LOADING, // loading | success | error
};

const filmSlice = createSlice({
    name: 'film',
    initialState,
    reducers: {
        setItems(state, action: PayloadAction<Film[]>) {
            state.items = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFilm.pending, (state, action) => {
            state.status = Status.LOADING;
            state.items = [];
        });

        builder.addCase(fetchFilm.fulfilled, (state, action) => {
            state.items = action.payload;
            state.status = Status.SUCCESS;
        });

        builder.addCase(fetchFilm.rejected, (state, action) => {
            state.status = Status.ERROR;
            state.items = [];
        });
    },
});

export const { setItems } = filmSlice.actions;

export default filmSlice.reducer;