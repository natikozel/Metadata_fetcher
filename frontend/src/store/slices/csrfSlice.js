import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchCsrfToken = createAsyncThunk('csrf/fetchCsrfToken', async () => {
    const response = await axios.get(process.env.REACT_APP_SERVER_ENDPOINT_URL + '/csrf-token', {withCredentials: true});
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