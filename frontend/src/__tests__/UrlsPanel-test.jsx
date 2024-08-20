import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react';
import {configureStore} from '@reduxjs/toolkit';
import UrlsPanel from '../components/UrlsPanel';
import {Provider} from 'react-redux';
import metadataReducer from "../store/slices/metadataSlice";
import csrfSlice from "../store/slices/csrfSlice";


describe('UrlsPanel Component', () => {
    let store

    beforeEach(() => {
        store = configureStore({
            reducer: {
                metadata: metadataReducer,
                csrf: csrfSlice
            }
        });
    });

    test('renders initial URL inputs', () => {
        render(
            <Provider store={store}>
                <UrlsPanel/>
            </Provider>)
        expect(screen.getAllByPlaceholderText(/URL \d+/).length).toBe(3);
    })


    test('adds a new URL input when + button is clicked', () => {
        render(
            <Provider store={store}>
                <UrlsPanel/>
            </Provider>
        );
        const addButton = screen.getAllByText('+')[0];
        fireEvent.click(addButton);
        const inputs = screen.getAllByPlaceholderText(/URL \d+/);
        expect(inputs.length).toBe(4);
    })
    test('removes a URL input when - button is clicked', () => {
        render(
            <Provider store={store}>
                <UrlsPanel/>
            </Provider>
        );
        const addButton = screen.getAllByText('+')[0];
        fireEvent.click(addButton);
        const removeButton = screen.getAllByText('-')[0];
        fireEvent.click(removeButton);
        const inputs = screen.getAllByPlaceholderText(/URL \d+/);
        expect(inputs.length).toBe(3);
    });

    test('does not remove URL input if only 3 inputs are present', () => {
        render(
            <Provider store={store}>
                <UrlsPanel/>
            </Provider>
        );
        const removeButtons = screen.queryAllByText('-');
        expect(removeButtons.length).toBe(0);
    });

    test('submits form with valid URLs', () => {
        render(
            <Provider store={store}>
                <UrlsPanel/>
            </Provider>
        );

        const inputs = screen.getAllByPlaceholderText(/URL \d+/);
        fireEvent.change(inputs[0], {target: {value: 'https://www.linkedin.com/'}});
        fireEvent.change(inputs[1], {target: {value: 'https://www.youtube.com/'}});
        fireEvent.change(inputs[2], {target: {value: 'https://www.github.com/'}});

        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);

        expect(store.getState().metadata.status).toEqual('fetching');
    });

});