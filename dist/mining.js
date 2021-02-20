const room = require("room")
const util = require("util")

module.exports = {
    initRoomMining: function(hostRoomName)
    {
        if(!Memory.rooms[hostRoomName].miningSpots)
        {
            Memory.rooms[hostRoomName].miningSpots = {}
        }
    },

    createRoomMiningSpots: function(hostRoomName, roomName)
    {
        roomO = Game.rooms[roomName]
        if(!roomO)
        {
            console.log("Couldn't access info for room "+roomName)
            return
        }
        sources = roomO.find(FIND_SOURCES)
        for(sourceIdx in sources)
        {
            source = sources[sourceIdx]
            this.createMiningSpot(hostRoomName, source.id)
        }
    },

    createMiningSpot: function(hostRoomName, sourceID)
    {
        this.initRoomMining(hostRoomName)
        closestSpot = null

        roomO = Game.rooms[hostRoomName]

        source = Game.getObjectById(sourceID)

        //Don't register mining spots in rooms owned by somebody else
        if(!roomO.controller || (!roomO.controller.my && roomO.controller.owner))
        {
            return
        }

        if(Memory.rooms[hostRoomName].miningSpots[sourceID])
        {
            return
        }

        freeSpots = util.getFreeSpotsAround(source.pos)
        if(!roomO.storage)
        {
            console.log("Can't set up mining spots until storage exists in host room")
            return
        }
        closest = roomO.storage.pos.findClosestByRange(freeSpots)
        if(!closest)
        {
            console.log("Couldn't determine closest position, using random")
            closest = freeSpots[0]
        }

        miningSpotInfo = {
            sourceID: sourceID,
            containerID: null,
            containerPos: closest,
            minerCreep: null,
            haulerCreep: null
        }
        Memory.rooms[hostRoomName].miningSpots[sourceID] = miningSpotInfo
    },

    setContainer: function(hostRoomName, spotId, containerId)
    {
        this.initRoomMining(hostRoomName)
        Memory.rooms[hostRoomName].miningSpots[spotId].containerID = containerId
    },

    getSpotInfo: function(hostRoomName, spotId)
    {
        this.initRoomMining(hostRoomName)
        result = Memory.rooms[hostRoomName].miningSpots[spotId]
        return result
    },

    acquireMiningSpot: function(hostRoomName, spotId, creepID)
    {
        this.initRoomMining(hostRoomName)
        var spotInfo = Memory.rooms[hostRoomName].miningSpots[spotId]
        if(spotInfo.minerCreep == creepID)
        {
            return true
        }
        if(spotInfo.minerCreep == null)
        {
            Memory.rooms[hostRoomName].miningSpots[spotId].minerCreep = creepID
            return true
        }
        return false
    },

    getFreeMiningSpot: function(hostRoomName)
    {
        this.initRoomMining(hostRoomName)
        for(spotId in Memory.rooms[hostRoomName].miningSpots)
        {
            var spotInfo = Memory.rooms[hostRoomName].miningSpots[spotId]
            creep = Game.creeps[spotInfo.minerCreep]
            if(!creep)
            {
                Memory.rooms[hostRoomName].miningSpots[spotId].minerCreep = null
            }
            if(Memory.rooms[hostRoomName].miningSpots[spotId].minerCreep == null)
            {
                return spotId
            }
        }
        return null
    },

    acquireHaulingSpot: function(hostRoomName, spotId, creepId)
    {
        this.initRoomMining(hostRoomName)
        var spotInfo = Memory.rooms[hostRoomName].miningSpots[spotId]
        if(spotInfo.haulerCreep == creepId)
        {
            return true
        }
        if(spotInfo.haulerCreep == null)
        {
            Memory.rooms[hostRoomName].miningSpots[spotId].haulerCreep = creepId
            return true
        }
        return false
    },

    getFreeHaulingSpot: function(hostRoomName)
    {
        this.initRoomMining(hostRoomName)
        for(spotId in Memory.rooms[hostRoomName].miningSpots)
        {
            var spotInfo = Memory.rooms[hostRoomName].miningSpots[spotId]
            creep = Game.creeps[spotInfo.haulerCreep]
            if(!creep)
            {
                Memory.rooms[hostRoomName].miningSpots[spotId].haulerCreep = null
            }
            if(Memory.rooms[hostRoomName].miningSpots[spotId].haulerCreep == null)
            {
                return spotId
            }
        }
        return null
    },
}