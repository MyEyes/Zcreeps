const accounting = require("accounting")
const mining = require("mining")
const linkNetwork = require("linkNetwork")
module.exports = {
    body: function(room)
    {
        var recentEnergy = accounting.getRecentMaxEnergy(room.name)
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
            target = Game.getObjectById(creep.memory.targetId)
            if(!target)
            {
                target = Game.rooms[creep.memory.home].storage
                //Don't use link network in your home room if source is there
                if(creep.room.name == creep.memory.home && spotInfo.containerPos.roomName != creep.memory.home)
                {
                    deposits = linkNetwork.getDepositLinks(creep.memory.home)
                    deposits.push(target)
                    target = creep.pos.findClosestByRange(deposits)
                    creep.memory.targetId = target.id
                }
            }
            creep.moveTo(target)
            creep.transfer(target, RESOURCE_ENERGY)

            if(creep.store[RESOURCE_ENERGY] == 0)
            {
                creep.memory.delivering = undefined
            }
        }
    }
}