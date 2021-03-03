const linkNetwork = require("linkNetwork")
const accounting = require("accounting")
const regenerate = require("regenerate")
const transfers = require("transfers")
module.exports = {
    body: function(room)
    {
        recMaxEnergy = accounting.getRecentMaxEnergy(room.name)
        if(recMaxEnergy > 1200)
        {
            return [MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]
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
        if(regenerate.run(creep))
        {
            return;
        }
        transferPos = linkNetwork.getTransferPos(creep.memory.home)
        if(creep.pos.x != transferPos.x || creep.pos.y!=transferPos.y)
        {
            creep.moveTo(transferPos)
        }
        else
        {
            mainLink = linkNetwork.getMainLink(creep.memory.home)
            //If the link network is active
            if(mainLink)
            {
                upgradeLink = linkNetwork.getUpgradeLink(creep.memory.home)
                //Only care about this if the mainlink can transfer energy
                if(upgradeLink && mainLink.cooldown <= 1)
                {
                    //If the upgradeLink is empty
                    if(upgradeLink.store[RESOURCE_ENERGY]==0)
                    {
                        if(mainLink.store.getFreeCapacity(RESOURCE_ENERGY)>0)
                        {
                            if(this.emptyExcept(creep, RESOURCE_ENERGY))
                            {
                                return
                            }
                            creep.withdraw(creep.room.storage, RESOURCE_ENERGY)
                            creep.transfer(mainLink, RESOURCE_ENERGY)
                            return
                        }
                        else
                        {
                            mainLink.transferEnergy(upgradeLink)
                            return
                        }
                    }
                    else if(mainLink.store[RESOURCE_ENERGY]>0)
                    {
                        if(this.emptyExcept(creep, RESOURCE_ENERGY))
                        {
                            return
                        }
                        creep.withdraw(mainLink, RESOURCE_ENERGY)
                        creep.transfer(creep.room.storage, RESOURCE_ENERGY)
                        return
                    }
                }
                else
                {
                    if(mainLink.store[RESOURCE_ENERGY]>0)
                    {
                        if(this.emptyExcept(creep, RESOURCE_ENERGY))
                        {
                            return
                        }
                        creep.withdraw(mainLink, RESOURCE_ENERGY)
                        creep.transfer(creep.room.storage, RESOURCE_ENERGY)
                        return 
                    }
                }
            }
            possibleExtensions = creep.room.lookForAt(LOOK_STRUCTURES, creep.pos.x, creep.pos.y-1)
            {
                for(id in possibleExtensions)
                {
                    extension = possibleExtensions[id]
                    if(extension.structureType == STRUCTURE_EXTENSION)
                    {
                        if(extension.store.getFreeCapacity(RESOURCE_ENERGY)>0)
                        {
                            if(this.emptyExcept(creep, RESOURCE_ENERGY))
                            {
                                return
                            }
                            creep.withdraw(creep.room.storage, RESOURCE_ENERGY)
                            creep.transfer(extension, RESOURCE_ENERGY)
                            return
                        }
                    }
                }
            }
            if(creep.room.terminal)
            {
                currentTransfer = transfers.getCurrentTransfer(creep.memory.home)
                
                for(resourceType in creep.room.terminal.store)
                {
                    if(resourceType!=RESOURCE_ENERGY && currentTransfer && resourceType != currentTransfer.resourceType)
                    {
                        if(this.emptyExcept(creep, resourceType))
                        {
                            return
                        }
                        creep.withdraw(creep.room.terminal, resourceType)
                        creep.transfer(creep.room.storage, resourceType)    
                        return
                    }
                }
                if(!currentTransfer || currentTransfer.resourceType!=RESOURCE_ENERGY)
                {
                    if(creep.room.terminal.store[RESOURCE_ENERGY]>100000)
                    {
                        if(this.emptyExcept(creep, RESOURCE_ENERGY))
                        {
                            return
                        }
                        creep.withdraw(creep.room.terminal, RESOURCE_ENERGY)
                        creep.transfer(creep.room.storage, RESOURCE_ENERGY)
                        return
                    }
                    else if (creep.room.terminal.store.getFreeCapacity(RESOURCE_ENERGY)>800 && creep.room.terminal.store[RESOURCE_ENERGY]<95000 && creep.room.storage.store[RESOURCE_ENERGY]>100000)
                    {
                        if(this.emptyExcept(creep, RESOURCE_ENERGY))
                        {
                            return
                        }
                        creep.withdraw(creep.room.storage, RESOURCE_ENERGY)
                        creep.transfer(creep.room.terminal, RESOURCE_ENERGY)
                        return
                    }
                }
                if(currentTransfer)
                {
                    var targetAmount = 50000
                    if(currentTransfer.resourceType == RESOURCE_ENERGY)
                    {
                        targetAmount = 150000
                    }
                    if(creep.room.terminal.store[currentTransfer.resourceType]<targetAmount)
                    {
                        if(this.emptyExcept(creep, currentTransfer.resourceType))
                        {
                            return
                        }
                        creep.withdraw(creep.room.storage, currentTransfer.resourceType)
                        creep.transfer(creep.room.terminal, currentTransfer.resourceType)
                        return
                    }
                }
            }
        }
    }
}