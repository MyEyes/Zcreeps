const linkNetwork = require('linkNetwork')
module.exports = {
    body: function(room)
    {
        if(linkNetwork.getUpgradeLink(room.name))
        {
            return [WORK,CARRY,CARRY,MOVE,WORK,CARRY,CARRY,WORK,CARRY,CARRY,MOVE,WORK,CARRY,CARRY]
        }
        if(room.energyCapacityAvailable >= 1200)
        {
            return [WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE]
        }
        return [WORK,CARRY,CARRY,MOVE,MOVE]
    },
    run: function(creep)
    {
        if(!creep.memory.delivering)
        {
            upgradeLink = linkNetwork.getUpgradeLink(creep.memory.home)
            if(upgradeLink)
            {
                result = creep.withdraw(upgradeLink, RESOURCE_ENERGY)
                if(result == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(upgradeLink)
                }
                else if(result == OK)
                {
                    creep.memory.delivering = true
                }
            }
            else if(creep.room.storage)
            {
                result = creep.withdraw(creep.room.storage, RESOURCE_ENERGY)
                if(result == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(creep.room.storage)
                }
                else if(result == OK)
                {
                    creep.memory.delivering = true
                }
            }
            else
            {
                if(creep.pos.getRangeTo(creep.room.controller)>5)
                {
                    creep.moveTo(creep.room.controller)
                }
            }
            
            if(creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
            {
                creep.memory.delivering = true
            }
        }
        else
        {
            const target = creep.room.controller
            if(creep.upgradeController(target) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(target);
            }

            if(creep.store[RESOURCE_ENERGY] == 0)
            {
                creep.memory.delivering = undefined
            }
        }
    }
}