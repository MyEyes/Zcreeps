module.exports = {
    run: function()
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
            if(target && target.store[RESOURCE_ENERGY] < 300)
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

            if(creep.store[RESOURCE_ENERGY] == 0)
            {
                creep.memory.delivering = undefined
            }
        }
    }
}