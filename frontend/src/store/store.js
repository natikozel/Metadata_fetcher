import { configureStore } from '@reduxjs/toolkit';
import metadataReducer from './slices/metadataSlice';
import csrfSlice from "./slices/csrfSlice";

const store = configureStore({
    reducer: {
        metadata: metadataReducer,
        csrf: csrfSlice
    }
});

export default store;