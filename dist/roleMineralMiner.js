accounting = require("accounting")
const mining = require("mineralMining")
module.exports = {
    body: function(room)
    {
        return [MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK]
    },
    run: function(creep)
    {
        if(!creep.memory.spot)
        {
            spot = mining.getFreeMineralSpot(creep.memory.home)
            if(spot && mining.acquireMineralSpot(creep.memory.home, spot, creep.name))
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
            extractor = Game.getObjectById(spotInfo.extractorID)
            mineral = Game.getObjectById(spotInfo.mineralID)

            if(!extractor)
            {
                structures = mineral.pos.lookFor(LOOK_STRUCTURES)
                extractor = null
                for(structureId in structures)
                {
                    structure = structures[structureId]
                    if(structure.structureType == STRUCTURE_EXTRACTOR)
                    {
                        extractor = structure
                        break
                    }
                }
                if(extractor)
                {
                    mining.setExtractor(creep.memory.home, creep.memory.spot, extractor.id)
                    return
                }
                constructionSites = mineral.pos.lookFor(LOOK_CONSTRUCTION_SITES)
                constructionSite = null
                for(siteId in constructionSites)
                {
                    site = constructionSites[siteId]
                    if(site.structureType == STRUCTURE_EXTRACTOR)
                    {
                        constructionSite = site
                        break
                    }
                }
                if(!constructionSite)
                {
                    creep.room.createConstructionSite(mineral.pos.x,mineral.pos.y,STRUCTURE_EXTRACTOR)
                    return
                }
            }
            else
            {
                creep.harvest(mineral)
            }

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
            }
        }
    }
}