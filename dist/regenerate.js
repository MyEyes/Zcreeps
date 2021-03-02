module.exports =
{
    run: function(creep, lowEnergyAbort = false)
    {
        //Not sure if trying to regenerate creeps and sacrificing their utility for a bit is worth it
        return false
        if(creep.ticksToLive<100 && (!lowEnergyAbort || creep.room.energyAvailable>=500))
        {
            creep.memory.regenerate = true
        }
        if(creep.memory.regenerate)
        {
            spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS, {filter: function(spawn){return !spawn.spawning}})
            if(!spawn)
            {
                if(creep.ticksToLive>1000)
                {
                    creep.memory.regenerate = undefined
                    return false
                }
                return false
            }
            else
            {
                if(lowEnergyAbort && creep.room.energyAvailable<500)
                {
                    creep.memory.regenerate = undefined
                    return false
                }
                result = spawn.renewCreep(creep)
                if(result == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(spawn)
                }
                else if(result == ERR_FULL)
                {
                    creep.memory.regenerate = undefined
                    return false
                }
            }
            return true
        }
        return false
    }
}