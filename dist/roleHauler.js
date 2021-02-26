const accounting = require("accounting")
const mining = require("mining")
module.exports = {
    body: function(room)
    {
        var recentEnergy = accounting.getRecentMaxEnergy(roomO.name)
        if(recentEnergy <= 600)
        {
            return [CARRY,CARRY,MOVE,MOVE,CARRY,CARRY]
        }
        if(recentEnergy >= 2000)
        {
            return [CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,
                    CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE]
        }
        if(recentEnergy >= 1000)
        {
            return [CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE]
        }
        return [CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE]
    },
    run: function(creep)
    {
        if(!creep.memory.spot)
        {
            spot = mining.getFreeHaulingSpot(creep.memory.home)
            if(spot && mining.acquireHaulingSpot(creep.memory.home, spot, creep.name))
            {
                creep.memory.spot = spot
            }
            return
        }
        var spotInfo = mining.getSpotInfo(creep.memory.home, creep.memory.spot)
        if(!spotInfo)
        {
            creep.moveTo(creep.room.controller)
            return
        }
        if(!creep.memory.delivering)
        {
            targetPos = new RoomPosition(spotInfo.containerPos.x,spotInfo.containerPos.y,spotInfo.containerPos.roomName)
            
            container = Game.getObjectById(spotInfo.containerID)
            if(!container)
            {
                creep.moveTo(creep.room.controller)
                return
            }
            result = creep.withdraw(container, RESOURCE_ENERGY)
            if(result == OK || creep.store.getFreeCapacity() == 0 || result == ERR_NOT_ENOUGH_RESOURCES)
            {
                creep.memory.delivering = true
            }
            else
            {
                creep.moveTo(targetPos)
            }
        }
        else
        {
            creep.moveTo(Game.rooms[creep.memory.home].storage)
            creep.transfer(Game.rooms[creep.memory.home].storage, RESOURCE_ENERGY)

            if(creep.store[RESOURCE_ENERGY] == 0)
            {
                creep.memory.delivering = undefined
            }
        }
    }
}