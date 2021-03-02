const accounting = require("accounting")
const regenerate = require("regenerate")
module.exports = {
    body: function(room)
    {
        recMaxEnergy = accounting.getRecentMaxEnergy(room.name)
        if(recMaxEnergy > 1500)
        {
            return [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE, CARRY,CARRY,CARRY,CARRY,MOVE,MOVE, CARRY,CARRY,CARRY,CARRY,MOVE,MOVE, CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,]
        }
        else if(recMaxEnergy > 1200)
        {
            return [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE, CARRY,CARRY,CARRY,CARRY,MOVE,MOVE, CARRY,CARRY,CARRY,CARRY,MOVE,MOVE, CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,]
        }
        return [CARRY, CARRY, CARRY,CARRY,MOVE,MOVE]
    },
    run: function()
    {
        if(regenerate.run(creep, true))
        {
            return;
        }
        if(creep.ticksToLive<10)
        {
            creep.moveTo(creep.room.storage)
            creep.transfer(creep.room.storage, RESOURCE_ENERGY)
            return
        }
        
        if(creep.store[RESOURCE_ENERGY] > 0)
        {
            const target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: function(structure) {
                    return (structure.structureType == STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
                        }
            });
            if(target)
            {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
                return
            }
        }
        const target = creep.room.storage
        if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(target);
        }
    }
}