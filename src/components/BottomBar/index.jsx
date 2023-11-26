import React, { useState, useEffect } from 'react';

export default ({ clientsCount, openOrCloseChat, openOrClosePlayersList, currentPlayer, satrtGameHandler, table, playerId }) => {
    const [showStartGame, setShowStartGame] = useState(false);
    const chatIcon = '/svg/chat-dots-svgrepo-com.svg';
    const playersIcon = '/svg/users-svgrepo-com.svg';
    const settingsIcon = '/svg/settings-svgrepo-com.svg';

    useEffect(() => {
        if (table && table.players) {
            let firstPlayer = table.players[Object.keys(table.players)[0]];

            if (firstPlayer.id === playerId) {
                setShowStartGame(true);
            } else {
                setShowStartGame(false);
            }
        }
    }, [table]);

    const openChatWindow = (event) => {
        event.preventDefault();

        openOrCloseChat();
    }

    const openPlayersList = (event) => {
        event.preventDefault();

        openOrClosePlayersList();
    }

    const openSettings = (event) => {
        event.preventDefault();

        console.log(event);
    }

    return (
        <footer>
            <ul className='right-side'>
                <li><a href={`#`} onClick={(event) => { openSettings(event); }}><img src={settingsIcon} /></a></li>
                <li><a href={`#`} onClick={(event) => { openPlayersList(event); }}><img src={playersIcon} /><span className="players-count">{clientsCount > 9 ? '9+' : clientsCount}</span></a></li>
                <li><a href={`#`} onClick={(event) => { openChatWindow(event); }}><img src={chatIcon} /></a></li>
            </ul>
            <ul className='left-side'>
                {showStartGame ? <li><button onClick={satrtGameHandler}>Start Game</button></li>: ''}
                {currentPlayer ? <li>Queue: {currentPlayer.name}</li> : ''}
            </ul>
        </footer>
    );
}
