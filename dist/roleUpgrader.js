module.exports = {
    body: function(room)
    {
        if(room.energyCapacityAvailable >= 1200)
        {
            return [WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE]
        }
        return [WORK,CARRY,CARRY,MOVE,MOVE]
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