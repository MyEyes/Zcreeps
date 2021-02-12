accounting = require("accounting")
module.exports = {
    body: function(room)
    {
        if(accounting.getRecentMaxEnergy(room.name) > 600)
        {
            return [WORK,CARRY,CARRY,MOVE,MOVE, WORK,CARRY,CARRY,MOVE,MOVE]
        }
        return [WORK,CARRY,CARRY,MOVE,MOVE]
    },
    run: function(creep)
    {
        if(!creep.memory.delivering)
        {
            const target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if(target)
            {
                if(creep.harvest(target) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
            }
            
            if(creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity())
            {
                creep.memory.delivering = true
            }
        }
        else
        {
            const target = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
            if(target && target.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
            {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
            }
            else
            {
                const target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: function(structure) {
                        return ((structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 100)
                            || (structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < 50000)
                            || (structure.structureType != STRUCTURE_TOWER && structure.structureType != STRUCTURE_STORAGE && structure.store && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0))
                         }
                });
                if(target)
                {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target);
                    }
                }
            
                else
                {
                    const target = creep.room.controller
                    if(creep.upgradeController(target) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target);
                    }
                }
            }

            if(creep.store[RESOURCE_ENERGY] == 0)
            {
                creep.memory.delivering = undefined
            }
        }
    }
}