const labs = require("labs")

module.exports = 
{
    boostParts: function(creep,partType, buffType)
    {
        if(!creep.memory.boosted)
        {
            creep.memory.boosted = {}
        }
        if(creep.memory.boosted[partType])
        {
            return true
        }
        var roomName = creep.room.name
        boost1Ressource = labs.getBoost1Resource(roomName)
        if(BOOSTS[partType] && BOOSTS[partType][boost1Ressource] && BOOSTS[partType][boost1Ressource][buffType])
        {
            if(this.boostAt(creep, labs.getBoost1(roomName)))
            {
                creep.memory.boosted[partType] = true
            }
            return false
        }
        else
        {
            creep.memory.boosted[partType] = true
        }
        boost2Ressource = labs.getBoost2Resource(roomName)
        if(BOOSTS[partType] && BOOSTS[partType][boost2Ressource] && BOOSTS[partType][boost2Ressource][buffType])
        {
            if(this.boostAt(creep, labs.getBoost2(roomName)))
            {
                creep.memory.boosted[partType] = true
            }
            return false
        }
        else
        {
            creep.memory.boosted[partType] = true
        }
    },
    boostAt(creep, lab)
    {
        if(!lab)
        {
            return true
        }
        creep.moveTo(lab)
        var result = lab.boostCreep(creep)
        if(result == OK || result == ERR_NOT_ENOUGH_RESOURCES)
        {
            return true
        }
        return false
    }
}