accounting = require("accounting")
const room = require("room")
module.exports = {
    body: function(roomO)
    {
        if(accounting.getRecentMaxEnergy(roomO.name) > 600)
        {
            return [WORK,CARRY,CARRY,MOVE,MOVE, WORK,CARRY,CARRY,MOVE,MOVE]
        }
        return [WORK,CARRY,CARRY,MOVE,MOVE]
    },
    run: function(creep)
    {
        if(creep.pos.roomName != creep.memory.home)
        {
            creep.moveTo(new RoomPosition(25,25, creep.memory.home))
            return
        }
        if(!creep.memory.delivering)
        {
            if(!creep.memory.targetSourceId)
            {
                spotData = room.getFreeSource(creep.memory.home)
                if(room.acquireSourceSpot(creep.memory.home, spotData.sourceId, spotData.spotId, creep.name))
                {
                    creep.memory.targetSourceId = spotData.sourceId
                    creep.memory.targetSpotId = spotData.spotId
                }
            }
            else
            {
                spot = room.getSpotData(creep.memory.home, creep.memory.targetSourceId, creep.memory.targetSpotId)
                const target = Game.getObjectById(creep.memory.targetSourceId)
                if(target)
                {
                    if(creep.harvest(target) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(new RoomPosition(spot.x, spot.y, creep.memory.home));
                    }
                }
                
                if(creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity())
                {
                    creep.memory.delivering = true
                    creep.memory.targetSourceId = undefined
                    creep.memory.targetSpotId = undefined
                }
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