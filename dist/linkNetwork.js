module.exports = 
{
    initRoomNetwork: function(roomName)
    {
        if(!Memory.rooms[roomName].links)
        {
            Memory.rooms[roomName].links = {}
        }
    },
    getTransferPos: function(roomName)
    {
        this.initRoomNetwork(roomName)
        if(Memory.rooms[roomName].links.transferPos)
        {
            pos = Memory.rooms[roomName].links.transferPos
            return new RoomPosition(pos.x, pos.y, pos.roomName)
        }
        else
        {
            room = Game.rooms[roomName]
            pos = new RoomPosition(room.storage.pos.x, room.storage.pos.y-1, room.storage.pos.roomName)
            Memory.rooms[roomName].links.transferPos = pos
            return pos
        }
    }
}