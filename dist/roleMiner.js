accounting = require("accounting")
const mining = require("mining")
module.exports = {
    body: function(room)
    {
        var recentEnergy = accounting.getRecentMaxEnergy(roomO.name)
        if(recentEnergy >= 800)
        {
            return [MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,WORK,WORK,WORK,WORK,WORK]
        }
        return [MOVE,CARRY,WORK,WORK,WORK,WORK,WORK]
    },
    run: function(creep)
    {
        if(!creep.memory.spot)
        {
            spot = mining.getFreeMiningSpot(creep.memory.home)
            if(spot && mining.acquireMiningSpot(creep.memory.home, spot, creep.name))
            {
                creep.memory.spot = spot
            }
            return
        }
        else
        {
            var spotInfo = mining.getSpotInfo(creep.memory.home, creep.memory.spot)
            if(!spotInfo)
            {
                return
            }
            containerPos = new RoomPosition(spotInfo.containerPos.x, spotInfo.containerPos.y, spotInfo.containerPos.roomName)
            if(creep.pos.x != containerPos.x || creep.pos.y != containerPos.y || creep.pos.roomName != containerPos.roomName)
            {
                creep.moveTo(containerPos)
                return
            }
            container = Game.getObjectById(spotInfo.containerID)
            creep.harvest(Game.getObjectById(spotInfo.sourceID))

            if(!container)
            {
                structures = creep.pos.lookFor(LOOK_STRUCTURES)
                container = null
                for(structureId in structures)
                {
                    structure = structures[structureId]
                    if(structure.structureType == STRUCTURE_CONTAINER)
                    {
                        container = structure
                        break
                    }
                }
                if(container)
                {
                    mining.setContainer(creep.memory.home, creep.memory.spot, container.id)
                    return
                }
                constructionSites = creep.pos.lookFor(LOOK_CONSTRUCTION_SITES)
                constructionSite = null
                for(siteId in constructionSites)
                {
                    site = constructionSites[siteId]
                    if(site.structureType == STRUCTURE_CONTAINER)
                    {
                        constructionSite = site
                        break
                    }
                }
                if(!constructionSite)
                {
                    creep.room.createConstructionSite(creep.pos.x,creep.pos.y,STRUCTURE_CONTAINER)
                    return
                }
                else
                {
                    if(creep.store[RESOURCE_ENERGY]>=25)
                    {
                        creep.build(constructionSite)
                    }
                }
            }
            else
            {
                if(container.hits < container.hitsMax-500)
                {
                    creep.repair(container)
                }
            }
        }
    }
}