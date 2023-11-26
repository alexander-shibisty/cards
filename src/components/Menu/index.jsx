import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default ({connectionStatus, roomName, currentPlayer, messageHistory}) => {
    let lastMessage = null;

    if (typeof messageHistory !== 'undefined'
    && typeof messageHistory.length !== 'undefined'
    && messageHistory.length > 0) {
        lastMessage = messageHistory[messageHistory.length - 1];
    }

    return (
        <header>
            <ul className='left-side'>
                <li>{connectionStatus} {roomName}</li>
                <li><a href={`/`}>Home</a></li>
            </ul>
            <ul className='right-side'>
                <li>{lastMessage !== null ? lastMessage.content : ''}</li>
            </ul>
        </header>
    );
}
