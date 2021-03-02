accounting = require("accounting")
mining = require("mineralMining")
module.exports = {
    body: function(room)
    {
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
            if(creep.pos.getRangeTo(creep.room.controller)>5)
            {
                creep.moveTo(creep.room.controller)
            }
            return
        }
        if(!creep.memory.delivering)
        {
            targetPos = new RoomPosition(spotInfo.containerPos.x,spotInfo.containerPos.y,spotInfo.containerPos.roomName)
            
            container = Game.getObjectById(spotInfo.containerID)
            if(!container)
            {
                if(creep.pos.getRangeTo(creep.room.controller)>5)
                {
                    creep.moveTo(creep.room.controller)
                }
                return
            }
            var result = ERR_NOT_ENOUGH_RESOURCES
            for(const resourceType in container.store) {
                result = creep.withdraw(container, resourceType);
                if(result == OK)
                {
                    break;
                }
            }
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
            for(const resourceType in creep.store) {
                creep.transfer(Game.rooms[creep.memory.home].storage, resourceType);
            }
            creep.transfer(Game.rooms[creep.memory.home].storage, RESOURCE_ENERGY)

            if(creep.store.getUsedCapacity() == 0)
            {
                creep.memory.delivering = undefined
            }
        }
    }
}