import React from 'react';
import {useSelector} from 'react-redux';

const Metadata = () => {
    const metadata = useSelector((state) => state.metadata.data);
    return (
        <div className="metadata-container">
            {metadata.map((item, index) =>
                <div key={index} className="metadata-card">
                    <h3>{item.title || 'No title available'}</h3>
                    <p>{item.description || 'No description available'}</p>
                    {item.image ? <img src={item.image} alt="Metadata"/> : <p>{"No image available"}</p>}
                </div>)}
        </div>
    )
};

export default Metadata;