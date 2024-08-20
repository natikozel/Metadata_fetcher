import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {fetchCsrfToken} from './csrfSlice';

// const SERVER_ENDPOINT_URL = 'http://localhost:8080/fetch-metadata';
const SERVER_ENDPOINT_URL = 'https://metadata-fetcher-one.vercel.app/fetch-metadata';
const ERROR_DETAILS_MAX_LENGTH = 50

export const fetchMetadata = createAsyncThunk(
    'fetchMetadata',
    async (urls, {getState, dispatch, rejectWithValue}) => {
        const state = getState();
        let csrfToken = state.csrf.token;

        if (!csrfToken) {
            await dispatch(fetchCsrfToken());
            csrfToken = getState().csrf.token;
        }

        try {
            const response = await axios.post(SERVER_ENDPOINT_URL, {urls}, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                withCredentials: true
            });

            const metadata = response.data;
            const incompleteMetadata = metadata.filter(item => !item.title || !item.description || !item.image);

            if (incompleteMetadata.length > 0) {
                return rejectWithValue('Some URLs did not return complete metadata.');
            }

            return metadata;
        } catch (error) {
            console.log(error)
            const errorData = error.response?.data
            if (errorData) {
                let details = errorData.details;
                if (Array.isArray(details)) {
                    details = details.join(', ');
                }
                if (details && details.length > ERROR_DETAILS_MAX_LENGTH) {
                    details = `${details.substring(0, ERROR_DETAILS_MAX_LENGTH)}...`;
                }
                return rejectWithValue(`${errorData.message}${details ? ': ' + details : ''}`);
            } else if (error.response?.status === 404) {
                return rejectWithValue('DNS resolution failed.');
            } else if (error.response?.status === 408) {
                return rejectWithValue('Connection timed out.');
            } else if (error.response?.status === 310) {
                return rejectWithValue('Too many redirects.');
            } else if (error.response?.status === 429) {
                return rejectWithValue('Too many requests. Please try again later.');
            } else if (error.response) {
                return rejectWithValue(`HTTP error ${error.response.status}: ${error.response.statusText.toString()}`);
            } else {
                return rejectWithValue('Failed to fetch metadata. Please check the URLs and try again.');
            }
        }
    }
);

const metadataSlice = createSlice({
    name: 'metadata',
    initialState: {
        data: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMetadata.pending, (state) => {
                state.status = 'fetching';
                state.error = null;
            })
            .addCase(fetchMetadata.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.data = action.payload;
            })
            .addCase(fetchMetadata.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export default metadataSlice.reducer;