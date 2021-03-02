const room = require("room")
const util = require("util")

module.exports = {
    initRoomMinerals: function(hostRoomName)
    {
        if(!Memory.rooms[hostRoomName].mineralSpots)
        {
            Memory.rooms[hostRoomName].mineralSpots = {}
        }
    },

    getActiveMines: function(hostRoomName)
    {
        count = 0
        this.initRoomMinerals(hostRoomName)
        for(spotId in Memory.rooms[hostRoomName].mineralSpots)
        {
            spotInfo = Memory.rooms[hostRoomName].mineralSpots[spotId]
            mineral = Game.getObjectById(spotInfo.mineralID)
            if(mineral && mineral.mineralAmount > 0)
            {
                count += 1
            }
        }
        return count
    },

    createRoomMineralSpots: function(hostRoomName, roomName)
    {
        roomO = Game.rooms[roomName]
        if(!roomO)
        {
            console.log("Couldn't access info for room "+roomName)
            return
        }
        minerals = roomO.find(FIND_MINERALS)
        for(mineralIdx in minerals)
        {
            mineral = minerals[mineralIdx]
            this.createMineralSpot(hostRoomName, mineral.id)
        }
    },

    createMineralSpot: function(hostRoomName, mineralID)
    {
        this.initRoomMinerals(hostRoomName)
        closestSpot = null

        roomO = Game.rooms[hostRoomName]

        mineral = Game.getObjectById(mineralID)

        //Don't register mining spots in rooms owned by somebody else
        if(!roomO.controller || (!roomO.controller.my))
        {
            return
        }

        if(Memory.rooms[hostRoomName].mineralSpots[mineralID])
        {
            return
        }

        freeSpots = util.getFreeSpotsAround(mineral.pos)
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

        mineralSpotInfo = {
            mineralID: mineralID,
            extractorID: null,
            containerID: null,
            containerPos: closest,
            minerCreep: null,
            haulerCreep: null
        }
        Memory.rooms[hostRoomName].mineralSpots[mineralID] = mineralSpotInfo
    },

    setContainer: function(hostRoomName, spotId, containerId)
    {
        this.initRoomMinerals(hostRoomName)
        Memory.rooms[hostRoomName].mineralSpots[spotId].containerID = containerId
    },

    setExtractor: function(hostRoomName, spotId, extractorID)
    {
        this.initRoomMinerals(hostRoomName)
        Memory.rooms[hostRoomName].mineralSpots[spotId].extractorID = extractorID
    },

    getSpotInfo: function(hostRoomName, spotId)
    {
        this.initRoomMinerals(hostRoomName)
        result = Memory.rooms[hostRoomName].mineralSpots[spotId]
        return result
    },

    acquireMineralSpot: function(hostRoomName, spotId, creepID)
    {
        this.initRoomMinerals(hostRoomName)
        var spotInfo = Memory.rooms[hostRoomName].mineralSpots[spotId]
        if(spotInfo.minerCreep == creepID)
        {
            return true
        }
        if(spotInfo.minerCreep == null)
        {
            Memory.rooms[hostRoomName].mineralSpots[spotId].minerCreep = creepID
            return true
        }
        return false
    },

    getFreeMineralSpot: function(hostRoomName)
    {
        this.initRoomMinerals(hostRoomName)
        for(spotId in Memory.rooms[hostRoomName].mineralSpots)
        {
            var spotInfo = Memory.rooms[hostRoomName].mineralSpots[spotId]
            creep = Game.creeps[spotInfo.minerCreep]
            if(!creep)
            {
                Memory.rooms[hostRoomName].mineralSpots[spotId].minerCreep = null
            }
            if(Memory.rooms[hostRoomName].mineralSpots[spotId].minerCreep == null)
            {
                return spotId
            }
        }
        return null
    },

    acquireHaulingSpot: function(hostRoomName, spotId, creepId)
    {
        this.initRoomMinerals(hostRoomName)
        var spotInfo = Memory.rooms[hostRoomName].mineralSpots[spotId]
        if(spotInfo.haulerCreep == creepId)
        {
            return true
        }
        if(spotInfo.haulerCreep == null)
        {
            Memory.rooms[hostRoomName].mineralSpots[spotId].haulerCreep = creepId
            return true
        }
        return false
    },

    getFreeHaulingSpot: function(hostRoomName)
    {
        this.initRoomMinerals(hostRoomName)
        for(spotId in Memory.rooms[hostRoomName].mineralSpots)
        {
            var spotInfo = Memory.rooms[hostRoomName].mineralSpots[spotId]
            creep = Game.creeps[spotInfo.haulerCreep]
            if(!creep)
            {
                Memory.rooms[hostRoomName].mineralSpots[spotId].haulerCreep = null
            }
            if(Memory.rooms[hostRoomName].mineralSpots[spotId].haulerCreep == null)
            {
                return spotId
            }
        }
        return null
    },
}