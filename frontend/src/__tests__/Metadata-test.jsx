import React from 'react'
import {render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import Metadata from "../components/Metadata";
import configureMockStore from 'redux-mock-store';

const middleware = []
const mockStore = configureMockStore(middleware)

describe('Metadata Component', () => {
    let store

    test('displays metadata correctly', () => {
        store = mockStore({
            metadata: {
                status: 'succeeded',
                data: [
                    {
                        url: 'https://example.com',
                        title: 'Example',
                        description: 'Example description',
                        image: 'https://example.com/image.jpg'
                    }
                ],
                error: null
            }
        });
        render(
            <Provider store={store}>
                <Metadata/>
            </Provider>
        );
        const title = screen.getByText('Example');
        const description = screen.getByText('Example description');
        const image = screen.getByAltText('Metadata');
        expect(title).toBeInTheDocument();
        expect(description).toBeInTheDocument();
        expect(image).toBeInTheDocument();
    });

    test('displays partial metadata correctly', () => {
        store = mockStore({
            metadata: {
                status: 'succeeded',
                data: [
                    {url: 'https://example.com', title: 'Example', description: '', image: ''}
                ],
                error: null
            }
        });
        render(
            <Provider store={store}>
                <Metadata/>
            </Provider>
        );
        const title = screen.getByText('Example');
        const noDescription = screen.getByText('No description available');
        const noImage = screen.getByText('No image available');
        expect(title).toBeInTheDocument();
        expect(noDescription).toBeInTheDocument();
        expect(noImage).toBeInTheDocument();
    });

    test('displays multiple metadata entries correctly', () => {
        store = mockStore({
            metadata: {
                status: 'succeeded',
                data: [
                    {
                        url: 'https://example.com',
                        title: 'Title',
                        description: 'Example description',
                        image: 'https://example.com/image.jpg'
                    },
                    {
                        url: 'https://example.org',
                        title: 'Another Title',
                        description: 'Example org description',
                        image: 'https://example.org/image.jpg'
                    }
                ],
                error: null
            }
        });
        render(
            <Provider store={store}>
                <Metadata/>
            </Provider>
        );
        const titles = screen.getAllByText(/Example/);
        expect(titles.length).toBe(2);
    });
});