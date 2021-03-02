module.exports = 
{
    run: function()
    {
        for(roomName in Memory.rooms)
        {
            this.runRoom(roomName)
        }
    },
    runRoom: function(roomName)
    {
        if((Game.time%400)<1)
        {
            this.checkRoomDeposits(roomName)
        }
        this.runRoomDeposits(roomName)
    },
    initRoomNetwork: function(roomName)
    {
        if(!Memory.rooms[roomName].links)
        {
            Memory.rooms[roomName].links = {}
        }
    },
    getTransferPos: function(roomName)
    {
        this.initRoomNetwork(roomName)
        if(Memory.rooms[roomName].links.transferPos)
        {
            pos = Memory.rooms[roomName].links.transferPos
            return new RoomPosition(pos.x, pos.y, pos.roomName)
        }
        else
        {
            room = Game.rooms[roomName]
            pos = new RoomPosition(room.storage.pos.x, room.storage.pos.y-1, room.storage.pos.roomName)
            Memory.rooms[roomName].links.transferPos = pos
            return pos
        }
    },
    findMainLink: function(roomName)
    {
        this.initRoomNetwork(roomName)
        var room = Game.rooms[roomName]
        pos = new RoomPosition(room.storage.pos.x-1, room.storage.pos.y-1, room.storage.pos.roomName)
        var structures = pos.lookFor(LOOK_STRUCTURES)
        for(structureId in structures)
        {
            structure = structures[structureId]
            if(structure.structureType == STRUCTURE_LINK)
            {
                this.setMainLink(roomName, structure.id)
                return true
            }
        }
        return false
    },
    setMainLink: function(roomName, id)
    {
        Memory.rooms[roomName].links.mainLink =
        {
            id: id
        }
    },
    getMainLink: function(roomName)
    {
        this.initRoomNetwork(roomName)
        room = Game.rooms[roomName]
        if(!room || !room.controller.level>=5)
        {
            return null
        }
        if(Memory.rooms[roomName].links.mainLink)
        {
            return Game.getObjectById(Memory.rooms[roomName].links.mainLink.id)
        }
        else
        {
            if(this.findMainLink(roomName))
            {
                return Game.getObjectById(Memory.rooms[roomName].links.mainLink.id)
            }
        }
        return null
    },
    setUpgradeLink: function(roomName, id, constructionId, pos)
    {
        this.initRoomNetwork(roomName)
        if(!pos)
        {
            obj = Game.getObjectById(id)
            if(!obj)
            {
                obj = Game.getObjectById(constructionId)
            }
            pos = obj.pos
        }
        Memory.rooms[roomName].links.upgradeLink =
        {
            id: id,
            constructionId: constructionId,
            pos: pos
        }
    },
    placeUpgradeLink: function(roomName)
    {
        room = Game.rooms[roomName]
        terrain = room.getTerrain()
        controllerPos = room.controller.pos
        bestPos = null
        bestScore = -100
        mainLink = this.getMainLink(roomName)
        if(!mainLink)
        {
            return
        }
        for(xd=-3; xd<=2; xd++)
        {
            for(yd=-3; yd<=2; yd++)
            {
                score = 0;
                for(x=0; x<3; x++)
                {
                    for(y=0; y<3; y++)
                    {
                        if(terrain.get(controllerPos.x+xd+x, controllerPos.y+yd+y)!=1)
                        {
                            score += 2
                        }
                    }
                }
                testPos = new RoomPosition(controllerPos.x+xd+1, controllerPos.y+yd+1, roomName)
                score -= testPos.getRangeTo(mainLink)
                score -= Math.sqrt(Math.pow(xd+1,2)+Math.pow(yd+1,2))
                if(score>bestScore)
                {
                    bestScore = score
                    bestPos = testPos
                }
            }
        }
        bestPos.createConstructionSite(STRUCTURE_LINK)
        this.setUpgradeLink(roomName, null, null, bestPos)
    },
    getUpgradeLink: function(roomName)
    {
        this.initRoomNetwork(roomName)
        room = Game.rooms[roomName]
        if(!room || !room.controller.level>=5)
        {
            return null
        }
        if(Memory.rooms[roomName].links.upgradeLink)
        {
            if(Memory.rooms[roomName].links.upgradeLink.id)
            {
                return Game.getObjectById(Memory.rooms[roomName].links.upgradeLink.id)
            }
            if(Memory.rooms[roomName].links.upgradeLink.constructionId)
            {
                //If the construction is done
                if(!Game.getObjectById(Memory.rooms[roomName].links.upgradeLink.constructionId))
                {
                    pos = new RoomPosition(Memory.rooms[roomName].links.upgradeLink.pos.x, Memory.rooms[roomName].links.upgradeLink.pos.y, roomName)
                    var structures = pos.lookFor(LOOK_STRUCTURES)
                    for(structureId in structures)
                    {
                        structure = structures[structureId]
                        if(structure.structureType == STRUCTURE_LINK)
                        {
                            this.setUpgradeLink(roomName, structure.id, null)
                            return null
                        }
                    }
                }
            }
            else
            {
                pos = new RoomPosition(Memory.rooms[roomName].links.upgradeLink.pos.x, Memory.rooms[roomName].links.upgradeLink.pos.y, roomName)
                var structures = pos.lookFor(LOOK_CONSTRUCTION_SITES)
                for(structureId in structures)
                {
                    structure = structures[structureId]
                    if(structure.structureType == STRUCTURE_LINK)
                    {
                        this.setUpgradeLink(roomName, null, structure.id, null)
                        return structure
                    }
                }
            }
            return null;
        }
        else
        {
            this.placeUpgradeLink(roomName)
        }
        return null
    },
    checkRoomDeposits: function(roomName)
    {
        var room = Game.rooms[roomName]
        if(!room)
        {
            return
        }
        var links = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_LINK}})
        for(var linkId in links)
        {
            link = links[linkId]
            if(!this.isDepositLink(roomName, link.id))
            {
                if(Memory.rooms[roomName].links.upgradeLink.id != link.id && Memory.rooms[roomName].links.mainLink.id != link.id)
                this.addDepositLink(roomName, link.id)
            }
        }
    },
    isDepositLink: function(roomName, id)
    {
        if(!Memory.rooms[roomName].links.deposits)
        {
            return false
        }
        for(linkId in Memory.rooms[roomName].links.deposits)
        {
            if(linkId == id)
            {
                return true
            }
        }
        return false
    },
    addDepositLink: function(roomName, id)
    {
        if(!Memory.rooms[roomName].links.deposits)
        {
            Memory.rooms[roomName].links.deposits = {}
        }
        Memory.rooms[roomName].links.deposits[id] = {}
    },
    getDepositLinks: function(roomName)
    {
        this.initRoomNetwork(roomName)
        var result = []
        for(depositId in Memory.rooms[roomName].links.deposits)
        {
            result.push(Game.getObjectById(depositId))
        }
        return result
    },
    runRoomDeposits: function(roomName)
    {
        if(Memory.rooms[roomName].links.deposits)
        {
            mainLink = this.getMainLink(roomName)
            if(!mainLink)
            {
                return
            }
            for(linkId in Memory.rooms[roomName].links.deposits)
            {
                depositLink = Game.getObjectById(linkId)
                if(depositLink)
                {
                    if(depositLink.store[RESOURCE_ENERGY] > 0 && mainLink.store.getFreeCapacity(RESOURCE_ENERGY)>=depositLink.store[RESOURCE_ENERGY]*0.97)
                    {
                        depositLink.transferEnergy(mainLink)
                    }
                }
            }
        }
    }
}