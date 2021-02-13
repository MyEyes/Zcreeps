module.exports = {
    body: function(room)
    {
        return [CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE]
    },
    run: function()
    {
        if(!creep.memory.delivering)
        {
            if(creep.room.storage)
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
            
            if(creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity())
            {
                creep.memory.delivering = true
            }
        }
        else
        {
            const target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: function(structure) {
                    return ((structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 100)
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

            if(creep.store[RESOURCE_ENERGY] == 0)
            {
                creep.memory.delivering = undefined
            }
        }
    }
}