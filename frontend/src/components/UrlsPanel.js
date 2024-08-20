import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchMetadata} from '../store/slices/metadataSlice';
import {Circles} from "react-loader-spinner";

const UrlsPanel = () => {

    const [urls, setUrls] = useState(['', '', '']);
    const dispatch = useDispatch();
    const metadataStatus = useSelector((state) => state.metadata.status);
    const error = useSelector((state) => state.metadata.error);
    const status = useSelector((state) => state.metadata.status)

    const handleUrlChange = (index, value) => {
        const newUrls = [...urls];
        newUrls[index] = value;
        setUrls(newUrls);
    };

    const addUrlInput = () => {
        setUrls([...urls, '']);
    };

    const removeUrlInput = (index) => {
        if (urls.length > 3) {
            const newUrls = urls.filter((_, i) => i !== index);
            setUrls(newUrls);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlArray = urls.filter(url => url.trim() !== '');
        dispatch(fetchMetadata(urlArray));
    };

    let content;
    if (status === 'fetching')
        content = (
            <div className="centered">
                <Circles
                    height="80"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="circles-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                />
            </div>)

    return (
        <>
            <form className="form-style" onSubmit={handleSubmit}>
                {error && <p className="error">{error}</p>}
                {urls.map((url, index) => (
                    <div key={index} className="urls">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => handleUrlChange(index, e.target.value)}
                            placeholder={`URL ${index + 1}`}
                        />
                        {urls.length > 3 && (
                            <button className="minus-button" type="button" onClick={() => removeUrlInput(index)}>
                                -
                            </button>
                        )}
                    </div>
                ))}
                <div className="url-buttons">
                    <button type="submit" disabled={metadataStatus === 'loading'}>
                        {metadataStatus === 'loading' ? 'Loading...' : 'Submit'}
                    </button>
                    {urls.length < 9 && (
                        <button className="plus-button" type="button" onClick={addUrlInput}>
                            +
                        </button>
                    )}
                </div>
                {content}
            </form>
        </>
    );
};

export default UrlsPanel;