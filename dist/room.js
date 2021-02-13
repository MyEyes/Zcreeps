const util = require("util")
room = {
    checkGlobalInit: function()
    {
        if(!Memory.rooms)
        {
            Memory.rooms = {}
        }
    },
    init: function(roomName)
    {
        this.checkGlobalInit()
        if(Memory.rooms[roomName])
        {
            console.log("Roomdata for {"+roomName+"} already exists, manually wipe and retry")
            return
        }
        Memory.rooms[roomName] = {}
        room = Game.rooms[roomName]
        if(!room)
        {
            console.log("No access to room {"+roomName+"}, try again when you have vision")
            return
        }
        this.addSourceEntries(room)
    },
    addSourceEntries: function(room)
    {
        data = Memory.rooms[room.name]
        data.sources = {}
        sources = room.find(FIND_SOURCES)
        const terrain = room.getTerrain()
        for(sourceIdx in sources)
        {
            source = sources[sourceIdx]
            spotData = {
                spots:[],
                miningSpot:{}
            }
            spots = util.getFreeSpotsAround(source.pos)
            for(spot in spots)
            {
                spotData.spots.push(
                    {'x':spots[spot].x,
                    'y':spots[spot].y,
                    'worker':null}
                    )
            }
            data.sources[source.id] = spotData
        }

        Memory.rooms[room.name] = data
    },
    getFreeSource: function(roomName)
    {
        for(sourceIdx in Memory.rooms[roomName].sources)
        {
            source = Game.getObjectById(sourceIdx)
            if(!source || source.energy == 0)
            {
                continue;
            }
            sourceData = Memory.rooms[roomName].sources[sourceIdx]
            for(spotId in sourceData.spots)
            {
                if(!Game.creeps[sourceData.spots[spotId].worker])
                {
                    Memory.rooms[roomName].sources[sourceIdx].spots[spotId].worker = null
                }
                spotData = Memory.rooms[roomName].sources[sourceIdx].spots[spotId]
                if(spotData.worker == null)
                    return {sourceId: sourceIdx, spotId: spotId}
            }
        }
        return null
    },
    getSpotData: function(roomName, sourceId, spotId)
    {
        return Memory.rooms[roomName].sources[sourceId].spots[spotId]
    },
    acquireSourceSpot: function(roomName, sourceId, spotId, creepName)
    {
        if(Memory.rooms[roomName].sources[sourceId].spots[spotId].worker == creepName)
        {
            return true
        }
        if(Memory.rooms[roomName].sources[sourceId].spots[spotId].worker == null)
        {
            Memory.rooms[roomName].sources[sourceId].spots[spotId].worker = creepName
            return true
        }
        return false
    },
    freeSourceSpot: function(roomName, sourceId, spotId, creepName)
    {
        if(Memory.rooms[roomName].sources[sourceId].spots[spotId].worker == creepName)
        {
            Memory.rooms[roomName].sources[sourceId].spots[spotId].worker = null
            return true
        }
    }
}

module.exports = room