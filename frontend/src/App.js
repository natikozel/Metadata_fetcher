import React from 'react';
import {Provider} from 'react-redux';
import store from './store/store';
import UrlsPanel from './components/UrlsPanel';
import './App.css';
import Metadata from "./components/Metadata";

const App = () => {
    return (
        <Provider store={store}>
            <div className="index">
                <div className="left-panel">
                    <UrlsPanel/>
                </div>
                <div className="right-panel">
                    <Metadata/>
                </div>
            </div>
        </Provider>
    );
};

export default App;