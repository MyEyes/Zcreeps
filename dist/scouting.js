const mining = require("mining")
const expansion = require("expansion")
module.exports = {
    run: function()
    {
        if(((Game.time-200) % 500) < 1)
        {
            for(roomName in Memory.rooms)
            {
                this.generateScoutingEntries(roomName)
            }
        }
    },
    checkInit: function(hostRoom)
    {
        if(!Memory.rooms[hostRoom].scouting)
        {
            Memory.rooms[hostRoom].scouting = {}
        }
    },
    generateScoutingEntries: function(hostRoom)
    {
        this.checkInit(hostRoom)
        exits = Game.map.describeExits(hostRoom)
        for(exitId in exits)
        {
            this.generateScoutingEntry(hostRoom, exits[exitId])
        }
    },
    generateScoutingEntry: function(hostRoom, scoutRoom)
    {
        if(!Memory.rooms[hostRoom].scouting[scoutRoom])
        {
            Memory.rooms[hostRoom].scouting[scoutRoom] = {
                lastVisit: 0,
                checkedMines: false
            }
        }
    },
    tagRoom: function(hostRoom, scoutRoom)
    {
        if(!Memory.rooms[hostRoom].scouting[scoutRoom])
        {
            return
        }
        Memory.rooms[hostRoom].scouting[scoutRoom].lastVisit = Game.time
        if(!Memory.rooms[hostRoom].scouting[scoutRoom].checkedMines)
        {
            Memory.rooms[hostRoom].scouting[scoutRoom].checkedMines = true
            mining.createRoomMiningSpots(hostRoom, scoutRoom)
        }
        room = Game.rooms[scoutRoom]
        if(room && room.controller && (room.controller.my || !room.controller.owner))
        {
            expansion.markRoomForReserve(hostRoom, scoutRoom)
        }
    },
    findScoutingTarget: function(hostRoom)
    {
        oldestTime = 1000000000000000000
        oldestRoom = ""
        for(roomId in Memory.rooms[hostRoom].scouting)
        {
            if(Memory.rooms[hostRoom].scouting[roomId].lastVisit < oldestTime)
            {
                oldestTime = Memory.rooms[hostRoom].scouting[roomId].lastVisit
                oldestRoom = roomId
            }
        }
        return oldestRoom
    },
    numReserveTargets: function(hostRoom)
    {

    }
}