import { socketUrl } from '../config/api.config';

export const createSocketUrl = (roomId, roomName, playerId, playerName) => {
    return `${socketUrl}/room/${roomId}?room_name=${roomName}&player_id=${playerId}&player_name=${playerName}`;
};
