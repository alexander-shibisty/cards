import React, { useEffect } from 'react';

export default ({ table, viewers, playersListIsShow }) => {
    useEffect(() => {
        
    });

    return (
        <section id="players" className={playersListIsShow === true ? 'show' : 'hide'}>
            <div className="players-list">
                <ul>
                    {(Object.keys(viewers) || []).map((viewerKey, idx) => {
                        let isPlayer = false;
                        let isFirst = false;

                        if (typeof table.players !== 'undefined') {
                            const players = table.players;
                            let firstPlayer = players[Object.keys(players)[0]];

                            for (const playerIndex in players) {
                                if (players[playerIndex].id === viewerKey) {
                                    if (players[playerIndex].id === firstPlayer.id) {
                                        isFirst = true;
                                    } else {
                                        isFirst = false;
                                    }
                                    isPlayer = true;
                                }
                            }
                        }

                        return (
                            <li key={idx} className={`viewer ${isPlayer ? 'player' : ''}`}>
                                <strong>
                                    {isFirst ? <img src='/svg/crown-user-svgrepo-com.svg' alt='Moderator of room'/> : ''} {viewers[viewerKey].name}
                                </strong><br />
                                <small>{isFirst ? 'moderator' : (isPlayer ? 'player' : 'viewer')}</small>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
