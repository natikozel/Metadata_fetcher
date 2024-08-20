import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const SERVER_ENDPOINT_URL = 'http://localhost:8080/csrf-token';

export const fetchCsrfToken = createAsyncThunk('csrf/fetchCsrfToken', async () => {
    const response = await axios.get(SERVER_ENDPOINT_URL, { withCredentials: true });
    return response.data.csrfToken;
});

const csrfSlice = createSlice({
    name: 'csrf',
    initialState: {
        token: null,
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCsrfToken.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCsrfToken.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload;
            })
            .addCase(fetchCsrfToken.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default csrfSlice.reducer;