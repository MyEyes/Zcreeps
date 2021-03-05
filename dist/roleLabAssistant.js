const linkNetwork = require("linkNetwork")
const accounting = require("accounting")
const regenerate = require("regenerate")
const transfers = require("transfers")
const labs = require("labs")
const boosting = require("boosting")
module.exports = {
    body: function(room)
    {
        recMaxEnergy = accounting.getRecentMaxEnergy(room.name)
        if(recMaxEnergy > 1200)
        {
            return [MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]
        }
        return [MOVE,CARRY,CARRY,CARRY,CARRY,CARRY]
    },
    emptyExcept: function(creep, exceptType)
    {
        for(resourceType in creep.store)
        {
            if(resourceType != exceptType)
            {
                creep.transfer(creep.room.storage, resourceType)
                return true
            }
        }
        return false
    },
    run: function(creep)
    {
        if(!boosting.boostParts(creep, CARRY, "capacity"))
        {
            return
        }
        if(regenerate.run(creep))
        {
            return;
        }
        var container = labs.getContainer(creep.memory.home)
        //Make sure we've moved to the lab before running the main loop
        if(!creep.memory.inLab)
        {
            labPos = container.pos
            if(creep.pos.x != labPos.x || creep.pos.y!=labPos.y)
            {
                creep.moveTo(labPos)
            }
            else
            {
                creep.memory.inLab = true
            }
            return
        }
        var reaction = labs.getReaction(creep.memory.home)
        //If we're not running a reaction don't do stuff
        if(!reaction)
        {
            return
        }
        var labInfo = labs.getLabInfo(creep.memory.home)
        var source1 = Game.getObjectById(labInfo.source1)
        var source2 = Game.getObjectById(labInfo.source2)
        //Todo, add code to empty incorrect resources out of sourceLabs
        if(source1.store[reaction.chem1]<2500&& (container.store[reaction.chem1]>0 || creep.store[reaction.chem1]>0))
        {
            if(!creep.pos.isNearTo(container))
            {
                creep.moveTo(container)
                return
            }
            creep.moveTo(source1)
            creep.withdraw(container, reaction.chem1)
            creep.transfer(source1, reaction.chem1)
            return
        }
        if(source2.store[reaction.chem2]<2500 && (container.store[reaction.chem2]>0 || creep.store[reaction.chem2]>0))
        {
            if(!creep.pos.isNearTo(container))
            {
                creep.moveTo(container)
                return
            }
            creep.moveTo(source2)
            creep.withdraw(container, reaction.chem2)
            creep.transfer(source2, reaction.chem2)
            return
        }
        if(creep.store.getUsedCapacity()>0)
        {
            for(resource in creep.store)
            {
                creep.transfer(container, resource)
                return
            }
        }
        if(container.store.getFreeCapacity()-500-500+container.store[reaction.chem1]+container.store[reaction.chem2]<=0)
        {
            return
        }
        for(producerIdx in labInfo.producers)
        {
            producerId = labInfo.producers[producerIdx]
            var producer = Game.getObjectById(producerId)
            if(!producer)
            {
                continue
            }
            for(resource in producer.store)
            {
                if(resource!=RESOURCE_ENERGY && producer.store.getFreeCapacity(resource)<2800)
                {
                    creep.moveTo(producer)
                    creep.withdraw(producer, resource)
                    creep.transfer(container, resource)
                    return
                }
            }
        }
    }
}