accounting = require("accounting")
mining = require("mining")
module.exports = {
    body: function(room)
    {
        return [CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,
                CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE]
    },
    run: function(creep)
    {
        if(!creep.memory.spot)
        {
            spot = mining.getFreeHaulingSpot(creep.memory.home)
            if(mining.acquireHaulingSpot(creep.memory.home, spot, creep.name))
            {
                creep.memory.spot = spot
                return
            }
        }
        spotInfo = mining.getSpotInfo(creep.memory.home, creep.memory.spot)

        if(!creep.memory.delivering)
        {
            targetPos = new RoomPosition(spotInfo.containerPos.x,spotInfo.containerPos.y,spotInfo.containerPos.roomName)
            
            container = Game.getObjectById(spotInfo.containerID)
            if(!container)
            {
                creep.moveTo(targetPos)
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