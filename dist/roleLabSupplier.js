const linkNetwork = require("linkNetwork")
const accounting = require("accounting")
const regenerate = require("regenerate")
const transfers = require("transfers")
const labs = require("labs")
const boosting = require("boosting")
module.exports = {
    body: function(room)
    {
        var recentEnergy = accounting.getRecentMaxEnergy(room.name)
        /*
        if(recentEnergy >= 2000)
        {
            return [CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,
                    CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE]
        }
        */
        if(recentEnergy >= 1000)
        {
            return [CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE]
        }
        return [CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE]
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
        var labInfo = labs.getLabInfo(creep.memory.home)
        if(labInfo.reset)
        {
            this.runReset(creep)
            return
        }
        var container = labs.getContainer(creep.memory.home)
        var reaction = labs.getReaction(creep.memory.home)
        var boost1 = labs.getBoost1(creep.memory.home)
        var boost2 = labs.getBoost2(creep.memory.home)
        if(!container || !reaction)
        {
            labPos = labs.getLabPosition(creep.memory.home)
            if(creep.pos.x != labPos.x || creep.pos.y!=labPos.y)
            {
                creep.moveTo(labPos)
            }
            return
        }
        if(!creep.memory.state)
        {
            creep.memory.state = "fetching"
        }
        if(creep.ticksToLive<100)
        {
            creep.memory.state = "delivering"
            creep.memory.delivered = false
        }
        if(creep.memory.state == "fetchingBoost")
        {
            if(!boost1 || !boost2)
            {
                creep.memory.state = "delivering"
            }
            //Should already have dumped any extra resources in creeps inventory off
            var amount1 = 2000-boost1.store[labs.getBoost1Resource(creep.memory.home)]-creep.store[labs.getBoost1Resource(creep.memory.home)]
            var amount2 = 2000-boost2.store[labs.getBoost2Resource(creep.memory.home)]-creep.store[labs.getBoost2Resource(creep.memory.home)]
            if((amount1<100 && amount2<100) || creep.store.getFreeCapacity()==0)
            {
                creep.memory.state = "deliveringBoost"
                return
            }
            if(amount1>=100)
            {
                if(creep.withdraw(creep.room.storage, labs.getBoost1Resource(creep.memory.home), Math.min(amount1, creep.store.getFreeCapacity(labs.getBoost1Resource(creep.memory.home)))) == OK)
                {
                    return
                }
            }
            if(amount2>=100)
            {
                if(creep.withdraw(creep.room.storage, labs.getBoost1Resource(creep.memory.home), Math.min(amount2, creep.store.getFreeCapacity(labs.getBoost2Resource(creep.memory.home))))==OK)
                {
                    return
                }
            }
            //If there's nothing else that can be done here, we also go to deliver
            creep.memory.state = "deliveringBoost"
        }
        else if(creep.memory.state == "deliveringBoost")
        {
            if(creep.store[labs.getBoost1Resource(creep.memory.home)]>0 && boost1.store.getFreeCapacity(labs.getBoost1Resource(creep.memory.home)>0))
            {
                creep.moveTo(boost1)
                creep.transfer(boost1, labs.getBoost1Resource(creep.memory.home))
                return
            }
            if(creep.store[labs.getBoost2Resource(creep.memory.home)]>0 && boost2.store.getFreeCapacity(labs.getBoost2Resource(creep.memory.home)>0))
            {
                creep.moveTo(boost2)
                creep.transfer(boost2, labs.getBoost2Resource(creep.memory.home))
                return
            }
            creep.memory.state = "delivering"
            creep.memory.delivered = false
        }
        else if(creep.memory.state == "fetching")
        {
            var amount1 = 500-container.store[reaction.chem1]-creep.store[reaction.chem1]
            var amount2 = 500-container.store[reaction.chem2]-creep.store[reaction.chem2]
            creep.moveTo(creep.room.storage)
            for(resource in creep.store)
            {
                if(resource != reaction.chem1 && resource!=reaction.chem2)
                {
                    creep.transfer(creep.room.storage, resource)
                    return
                }
            }
            if(!creep.room.storage.store[reaction.chem2] || creep.room.storage.store[reaction.chem1]<500)
            {
                amount1 = 0
            }
            if(!creep.room.storage.store[reaction.chem2] || creep.room.storage.store[reaction.chem2]<500)
            {
                amount2 = 0
            }
            if((amount1<10 && amount2<10) || creep.store.getFreeCapacity()==0)
            {
                //If we can't carry more deliver
                if(creep.store.getFreeCapacity()==0)
                {
                    creep.memory.state = "delivering"
                    creep.memory.delivered = false
                }
                //If we can carry more, check if we need to supply a booster
                else
                {
                    creep.memory.state = "fetchingBoost"
                }
                return
            }
            if(amount1>=10)
            {
                creep.withdraw(creep.room.storage, reaction.chem1, Math.min(amount1, creep.store.getFreeCapacity(reaction.chem1)))
                return
            }
            if(amount2>=10)
            {
                creep.withdraw(creep.room.storage, reaction.chem2, Math.min(amount2, creep.store.getFreeCapacity(reaction.chem1)))
                return
            }
        }
        else if(creep.memory.state == "delivering")
        {
            if(!creep.pos.isNearTo(container))
            {
                creep.moveTo(container)
                return 
            }
            var amount1 = 200-container.store[reaction.chem1]
            var amount2 = 200-container.store[reaction.chem2]
            if(container.store.getFreeCapacity()>0 && !creep.memory.delivered)
            {
                for(resource in creep.store)
                {
                    creep.transfer(container, resource)
                    return
                }
            }
            creep.memory.delivered=true
            if(creep.ticksToLive>100)
            {
                for(resource in container.store)
                {
                    if(resource != reaction.chem1 && resource!=reaction.chem2)
                    {
                        creep.withdraw(container, resource)
                    }
                }
                creep.moveTo(labs.getLabPosition(creep.memory.home))
                if(creep.store.getFreeCapacity()==0 || amount1>0 || amount2>0 ||
                    (boost1 &&boost1.store[labs.getBoost1Resource(creep.memory.home)]<1000) ||
                    (boost2 &&boost2.store[labs.getBoost2Resource(creep.memory.home)]<1000))
                {
                    creep.memory.state = "fetching"
                }
            }
            else
            {
                creep.suicide()
            }
        }
    },
    runReset: function(creep)
    {
        if(creep.store.getUsedCapacity()>0)
        {
            creep.moveTo(creep.room.storage)
            for(resource in creep.store)
            {
                creep.transfer(creep.room.storage, resource)
            }
            return
        }
        var container = labs.getContainer(creep.memory.home)
        creep.moveTo(container)
        for(resource in container.store)
        {
            creep.withdraw(container, resource)
        }
    }
}