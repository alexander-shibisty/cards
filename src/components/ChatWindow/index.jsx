import React, { useEffect } from 'react';
import { getPlayerName, getPlayerId } from '../../screens/GameRoom/index';

export default ({ messageHistory, sendMessage, chatIsShow }) => {
    useEffect(() => {
        const chatMessagesWrapper = document.querySelector('.chat-messages');
        chatMessagesWrapper.scrollTop = chatMessagesWrapper.scrollHeight;
    });

    const chatFormHandler = (event) => {
        event.preventDefault();
        const element = event.currentTarget;
        const messageField = element['message'];
        const time = (new Date())
            .toJSON()
            .slice(0, 19)
            .replace('T', ' ')
            .replace(/.* /, '');

        sendMessage(JSON.stringify({
            type: 'MESSAGE',
            content: messageField.value,
            player: {
                id: getPlayerId(),
                name: getPlayerName(),
            },
            time,
            isLog: false,
        }));
        messageField.value = '';
    }

    return (
        <section id="chat" className={chatIsShow === true ? 'show' : 'hide'}>
            <div className="chat-messages">
                <ul>
                    {(messageHistory || []).map((message, idx) => {
                        if (message.isLog) {
                            return (
                                <li key={idx} className={message.isLog ? 'log-message' : ''}>
                                    <strong>[The Game] </strong>
                                    <small>{message.time}</small>
                                    <div>{message ? message.content : null}</div>
                                </li>
                            );
                        }

                        return (
                            <li key={idx}>
                                <strong>{message.player.id === getPlayerId() ? 'You' : message.player.name} </strong>
                                <small>{message.time}</small>
                                <div>{message ? message.content : null}</div>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <form action="#" method="GET" onSubmit={(event) => { chatFormHandler(event); }}>
                <div className="form-field">
                    <input type="text" id="message" name="message" placeholder="..." required autoComplete='off' />
                </div>
                <div className="form-field">
                    <button>Send</button>
                </div>
            </form>
        </section>
    );
}
