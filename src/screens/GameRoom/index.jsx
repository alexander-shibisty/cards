import Menu from '../../components/Menu/index';
import BottomBar from '../../components/BottomBar/index';
import ChatWindow from '../../components/ChatWindow/index';
import PlayersList from '../../components/PlayersList/index';
import PlayerNamePopup from '../../components/PlayerNamePopup/index';
import GameFinishPopup from '../../components/GameFinishPopup/index';
import { createSocketUrl } from '../../utils/api';
import { useSearchParams } from 'react-router-dom';
import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import {
  createBrowserRouter,
  RouterProvider,
  useParams,
} from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { v4 as uuid4 } from 'uuid';

export const getPlayerId = () => {
    return localStorage.getItem('playerId');
}

export const setPlayerId = (newPlayerId) => {
    localStorage.setItem('playerId', newPlayerId);
}

export const getOrSetPlayerId = () => {
    let playerId = getPlayerId();

    if (!playerId) {
        playerId = String(uuid4()).replace(/-.*/, '');
        setPlayerId(playerId);
    }

    return getPlayerId();
}

export const getPlayerName = () => {
    return localStorage.getItem('playerName');
}

export const setPlayerNameInLocaleStorage = (newPlayerName) => {
    localStorage.setItem('playerName', newPlayerName);
}

export default () => {
    const { id } = useParams();
    const [initialization, setInitialozation] = useState(false);
    const [searcParams, setSearchParams] = useSearchParams();
    const [isFinished, setIsFinished] = useState(false);
    const [roomName, setRoomName] = useState(searcParams.get('name'));
    const playerId = getOrSetPlayerId();
    const [playerName, setPlayerName] = useState(getPlayerName());
    const [socketUrl, setSocketUrl] = useState(null);
    const [messageHistory, setMessageHistory] = useState([]);
    const [table, setTable] = useState({});
    const [viewers, setViewers] = useState({});
    const chatShow = localStorage.getItem('chatShow');
    const [chatIsShow, setChatIsShow] = useState(chatShow !== null && chatShow === 'true' ? true : false);
    const playerListShow = localStorage.getItem('playerListShow');
    const [playersListIsShow, setPlayersListIsShow] = useState(playerListShow !== null && playerListShow === 'true' ? true : false);
    const [playedCard, setPlayedCard] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);

    const [clientsCount, setClientsCount] = useState(0);

    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    useEffect(() => {
        const playerNamer = getPlayerName();
        if (playerNamer !== null) {
            setInitialozation(true);
        }
    }, [playerName, setPlayerName]);

    useEffect(() => {
        if(initialization === true) {
            setSocketUrl(
                createSocketUrl(id, roomName, playerId, playerName));
        }
    }, [initialization, setInitialozation])

    useEffect(() => {
        if (lastMessage !== null) {
            const { data } = lastMessage;
            const eventEntity = JSON.parse(data);

            if (eventEntity.type === 'MESSAGE') {
                setMessageHistory((prev) => prev.concat(eventEntity));
            }
            else if (eventEntity.type === 'INITIALIZATION') {
                const initContent = eventEntity.content;
                setClientsCount(initContent.clientsCount);
                setRoomName(initContent.roomName);
                setTable(eventEntity.table);
                setCurrentPlayer(eventEntity.currentPlayer);
                setViewers(eventEntity.viewers);

                const message = `Player ${eventEntity.player.name} is connected`;
                setMessageHistory((prev) => prev.concat({
                    content: message,
                    player: eventEntity.player,
                    time: eventEntity.time,
                    isLog: true,
                }));
            } else if (eventEntity.type === 'STARTGAME') {
                const message = `${eventEntity.player.name} started the game`;
                const table = eventEntity.table;

                setIsFinished(table.isFinished);
                setTable(table);
                setCurrentPlayer(eventEntity.currentPlayer);
                setMessageHistory((prev) => prev.concat({
                    content: message,
                    player: eventEntity.player,
                    time: eventEntity.time,
                    isLog: true,
                }));
            } else if (eventEntity.type === 'RESTARTGAME') {
                const message = `${eventEntity.player.name} started the game`;
                const table = eventEntity.table;
                setIsFinished(table.isFinished);
                setTable(table);
                console.log(eventEntity.currentPlayer);
                setCurrentPlayer(eventEntity.currentPlayer);
                setMessageHistory((prev) => prev.concat({
                    content: message,
                    player: eventEntity.player,
                    time: eventEntity.time,
                    isLog: true,
                }));
                // document.location.reload();
            } else if (eventEntity.type === 'PLAYCARD') {
                const message = `${eventEntity.player.name} play card "${eventEntity.card.title}": ${eventEntity.card.description}`;
                const table = eventEntity.table;

                setIsFinished(table.isFinished);
                setTable(table);
                setCurrentPlayer(eventEntity.currentPlayer);
                setMessageHistory((prev) => prev.concat({
                    content: message,
                    player: eventEntity.player,
                    time: eventEntity.time,
                    isLog: true,
                }));
            } else if (eventEntity.type === 'WARNING') {
                setMessageHistory((prev) => prev.concat({
                    content: eventEntity.content,
                    player: eventEntity.player,
                    time: eventEntity.time,
                    isLog: true,
                }));
            }
        }
    }, [lastMessage, setMessageHistory]);

    const setPlayerNameTwice = (playerName) => {
        setPlayerNameInLocaleStorage(playerName);
        setPlayerName(playerName);
    }

    const connectionStatus = {
        [ReadyState.CONNECTING]: (<span className="status-connection"></span>),
        [ReadyState.OPEN]: (<span className="status-open"></span>),
        [ReadyState.CLOSING]: (<span className="status-closing"></span>),
        [ReadyState.CLOSED]: (<span className="status-closed"></span>),
        [ReadyState.UNINSTANTIATED]: (<span className="status-uninstantiated"></span>),
    }[readyState];

    const satrtGameHandler = (event) => {
        sendMessage(JSON.stringify({
            type: 'STARTGAME',
            content: true,
            player: {
                id: getPlayerId(),
                name: getPlayerName(),
            },
            time: getTime(),
        }));
    }

    const restartGameHandler = (event) => {
        const time = (new Date())
        .toJSON()
        .slice(0, 19)
        .replace('T', ' ')
        .replace(/.* /, '');

        sendMessage(JSON.stringify({
            type: 'RESTARTGAME',
            content: true,
            player: {
                id: getPlayerId(),
                name: getPlayerName(),
            },
            time: getTime(),
        }));
    }

    const playCardHandler = (event, card) => {
        setPlayedCard(card);
    }

    const openOrCloseChat = () => {
        let newStatus = true;

        if (chatIsShow) {
            newStatus = false;
        }

        setPlayersListIsShow(false);
        localStorage.setItem('playerListShow', false);

        localStorage.setItem('chatShow', newStatus);
        setChatIsShow(newStatus);

    }

    const openOrClosePlayersList = () => {
        let newStatus = true;

        if (playersListIsShow) {
            newStatus = false;
        }

        setChatIsShow(false);
        localStorage.setItem('chatShow', false);


        localStorage.setItem('playerListShow', newStatus);
        setPlayersListIsShow(newStatus);
    }

    const getTime = () => {
        return (new Date())
            .toJSON()
            .slice(0, 19)
            .replace('T', ' ')
            .replace(/.* /, '');
    }

    useEffect(() => {
        const card = playedCard;

        if (card === null) {
            return;
        }

        if (card.cardType === 2) {
            sendMessage(JSON.stringify({
                type: 'PLAYCARD',
                content: true,
                player: {
                    id: getPlayerId(),
                    name: getPlayerName(),
                },
                card,
                time: getTime(),
            }));
        } else {
            sendMessage(JSON.stringify({
                type: 'PLAYCARD',
                content: true,
                player: {
                    id: getPlayerId(),
                    name: getPlayerName(),
                },
                card,
                time: getTime(),
            }));
        }
    }, [playedCard, setPlayedCard]);

    const initialColumns = {
      todo: {
        id: 'todo',
        list: ['item 1', 'item 2', 'item 3']
      },
      doing: {
        id: 'doing',
        list: []
      },
      done: {
        id: 'done',
        list: []
      }
    }
    const [columns, setColumns] = useState(initialColumns);

    const onDragEnd = ({ source, destination }) => {
      // Make sure we have a valid destination
      if (destination === undefined || destination === null) return null
  
      // Make sure we're actually moving the item
      if (
        source.droppableId === destination.droppableId &&
        destination.index === source.index
      )
        return null
  
      // Set start and end variables
      const start = columns[source.droppableId]
      const end = columns[destination.droppableId]
  
      // If start is the same as end, we're in the same column
      if (start === end) {
        // Move the item within the list
        // Start by making a new list without the dragged item
        const newList = start.list.filter(
          (_, idx) => idx !== source.index
        )
  
        // Then insert the item at the right location
        newList.splice(destination.index, 0, start.list[source.index])
  
        // Then create a new copy of the column object
        const newCol = {
          id: start.id,
          list: newList
        }
  
        // Update the state
        setColumns(state => ({ ...state, [newCol.id]: newCol }))
        return null
      } else {
        // If start is different from end, we need to update multiple columns
        // Filter the start list like before
        const newStartList = start.list.filter(
          (_, idx) => idx !== source.index
        )
  
        // Create a new start column
        const newStartCol = {
          id: start.id,
          list: newStartList
        }
  
        // Make a new end list array
        const newEndList = end.list
  
        // Insert the item into the end list
        newEndList.splice(destination.index, 0, start.list[source.index])
  
        // Create a new end column
        const newEndCol = {
          id: end.id,
          list: newEndList
        }
  
        // Update the state
        setColumns(state => ({
          ...state,
          [newStartCol.id]: newStartCol,
          [newEndCol.id]: newEndCol
        }))
        return null
      }
    }

    return (<>
        <DragDropContext onDragEnd={onDragEnd}>
            <Menu connectionStatus={connectionStatus} roomName={roomName} messageHistory={messageHistory} />
            <div id="table">
                <div className="zones">
                    {(table.players || []).map((player, idx) => {
                        if (player.id !== playerId) {
                            let leftOffset = 0;
                            let rotateOffset = 0;
                            return (<div className={`zone exchange`} key={idx}>
                            <h4>{player.name}</h4>
                            <Droppable droppableId={player.id}>
                            {provided => (<ul className="cards" {...provided.droppableProps} ref={provided.innerRef}>
                                {(player.hand || []).map((card, idx) => {
                                    leftOffset += 15;
                                    rotateOffset += 5;
                                    return (
                                        <Draggable draggableId={card.id} index={idx}>
                                        {provided => (<li key={idx} 
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className='card' >
                                            {card.title}<br/>
                                            <small>{card.description}</small>
                                        </li>)}
                                        </Draggable>
                                    );
                                })}
                            </ul>)}
                            </Droppable>
                        </div>);
                        }
                    })}
                </div>
                <div className='deck-zone'>
                    <div className='zone'>
                        <h4>Deck ({(table.deck || []).length})</h4>
                        <ul>
                            {(table.deck || []).map((card, idx) => {
                                return (
                                    <li key={idx}>
                                        {card.title}<br/>
                                        <small>{card.description}</small>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className='zone'>
                        <h4>Basket ({(table.basket || []).length})</h4>
                        <ul>
                            {(table.basket || []).map((card, idx) => {
                                return (
                                    <li key={idx}>
                                        {card.title}<br/>
                                        <small>{card.description}</small>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
                <div className='player-zone'>
                    {(table.players || []).map((player, idx) => {
                        if (player.id === playerId) {
                            return (<div className={`zone`} key={idx}>
                            <h4>{player.name}</h4>
                            <Droppable droppableId={player.id}>
                            {provided => (<ul {...provided.droppableProps} ref={provided.innerRef}>
                                {(player.hand || []).map((card, idx) => {
                                    return (
                                        <Draggable draggableId={card.id} index={idx}>
                                          {provided => (<li key={idx} 
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className={`card card-type-${card.cardType}`} onClick={(event) => { playCardHandler(event, card); }}>
                                              {card.title}<br/>
                                              <small>{card.description}</small>
                                          </li>)}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </ul>)}
                            </Droppable>
                        </div>);
                        }
                        
                    })}
                </div>
            </div>
            <PlayerNamePopup playerName={playerName} setPlayerName={setPlayerNameTwice} show={!playerName} />
            <GameFinishPopup show={isFinished} restartGameHandler={restartGameHandler} />
            <ChatWindow messageHistory={messageHistory} sendMessage={sendMessage} chatIsShow={chatIsShow} />
            <PlayersList table={table} viewers={viewers} playersListIsShow={playersListIsShow} />

            <BottomBar 
                clientsCount={clientsCount}
                openOrCloseChat={openOrCloseChat}
                openOrClosePlayersList={openOrClosePlayersList}
                currentPlayer={currentPlayer}
                satrtGameHandler={satrtGameHandler}
                table={table}
                playerId={playerId}
            />
        </DragDropContext>
    </>);
}
