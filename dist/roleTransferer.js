const linkNetwork = require("linkNetwork")
const accounting = require("accounting")
module.exports = {
    body: function(room)
    {
        recMaxEnergy = accounting.getRecentMaxEnergy(room.name)
        if(recMaxEnergy > 1500)
        {
            return [MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]
        }
        else if(recMaxEnergy > 1200)
        {
            return [MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]
        }
        return [MOVE,CARRY,CARRY,CARRY,CARRY,CARRY]
    },
    run: function(creep)
    {
        transferPos = linkNetwork.getTransferPos(creep.memory.home)
        if(creep.pos.x != transferPos.x || creep.pos.y!=transferPos.y)
        {
            creep.moveTo(transferPos)
        }
        else
        {
            possibleExtensions = creep.room.lookForAt(LOOK_STRUCTURES, creep.pos.x, creep.pos.y-1)
            {
                for(id in possibleExtensions)
                {
                    extension = possibleExtensions[id]
                    if(extension.structureType == STRUCTURE_EXTENSION)
                    {
                        if(extension.store.getFreeCapacity(RESOURCE_ENERGY)>0)
                        {
                            creep.withdraw(creep.room.storage, RESOURCE_ENERGY)
                            creep.transfer(extension, RESOURCE_ENERGY)
                            return
                        }
                    }
                }
            }
            if(creep.room.terminal.store[RESOURCE_ENERGY]>100000)
            {
                creep.withdraw(creep.room.terminal, RESOURCE_ENERGY)
                creep.transfer(creep.room.storage, RESOURCE_ENERGY)
            }
            else if (creep.room.terminal.store[RESOURCE_ENERGY]<95000 && creep.room.storage.store[RESOURCE_ENERGY]>100000)
            {
                creep.withdraw(creep.room.storage, RESOURCE_ENERGY)
                creep.transfer(creep.room.terminal, RESOURCE_ENERGY)
            }
        }
    }
}