const extBlueprint = require("extensionBlueprint")
const labBlueprint = require("labBlueprint")
module.exports = 
{
    run: function()
    {
        for(roomName in Memory.rooms)
        {
            this.checkInitRoom(roomName)
            if(!Memory.rooms[roomName].architect || !Memory.rooms[roomName].architect.crystalPos)
            {
                this.determineRoomLayout(roomName)
            }
            else
            {
                pos = Memory.rooms[roomName].architect.crystalPos
                extBlueprint.drawShape(Game.rooms[roomName], pos.x, pos.y)
            }
            roomO = Game.rooms[roomName]
            if(roomO)
            {
                
                if(roomO.controller.level>=7 && !Memory.rooms[roomName].architect.labPos)
                {
                    this.findIdealLabPosition(roomName)
                    Memory.rooms[roomName].architect.lastRclCheck = 0
                }
                else if(Memory.rooms[roomName].architect.labPos)
                {
                    pos = Memory.rooms[roomName].architect.labPos
                    labBlueprint.drawShape(Game.rooms[roomName], pos.x, pos.y)
                }
                lastRclCheck = Memory.rooms[roomName].architect.lastRclCheck
                //Adding 16 to check to building in case we couldn't place all available structures in order to retry every 2000 ticks
                if(roomO.controller.level > lastRclCheck || ((Game.time % 2000)<1 && lastRclCheck >= 16))
                {
                    if(this.buildNewStructures(roomName))
                    {
                        Memory.rooms[roomName].architect.lastRclCheck = roomO.controller.level
                    }
                    else
                    {
                        Memory.rooms[roomName].architect.lastRclCheck = roomO.controller.level+16
                    }
                }
            }
        }

    },
    checkInitRoom: function(roomName)
    {
        if(!Memory.rooms[roomName].architect)
        {
            Memory.rooms[roomName].architect = {
                crystalPos: null,
                lastRclCheck: 0
            }
        }
    },
    buildNewStructures: function(roomName)
    {
        shape = extBlueprint.shape
        structures = extBlueprint.structure_ids
        roomO = Game.rooms[roomName]
        if(!roomO)
        {
            console.log("No access to room "+roomName)
            return false
        }
        pos = Memory.rooms[roomName].architect.crystalPos
        if(!pos)
        {
            return false
        }
        if(!this.buildBlueprintStructures(roomName, pos, extBlueprint))
        {
            return false
        }

        pos = Memory.rooms[roomName].architect.labPos
        if(!pos)
        {
            return true
        }
        if(!this.buildBlueprintStructures(roomName, pos, labBlueprint))
        {
            return false
        }

        return true
    },
    buildBlueprintStructures: function(roomName, pos, blueprint)
    {
        roomO = Game.rooms[roomName]
        for(i=0; i<blueprint.dimX; i++)
        {
            for(j=0; j<blueprint.dimY; j++)
            {
                if(blueprint.shape[j][i] == 0)
                {
                    continue;
                }
                result = roomO.createConstructionSite(pos.x+i, pos.y+j, blueprint.structure_ids[blueprint.shape[j][i]])
                if(result == ERR_FULL)
                {
                    return false
                }
            }
        }
        return true
    },
    determineRoomLayout: function(roomName)
    {
        this.checkInitRoom(roomName)
        roomO = Game.rooms[roomName]
        if(!roomO)
        {
            console.log("No access to room "+roomName)
            return
        }
        if(Memory.rooms[roomName].architect.crystalPos)
        {
            //Already know where crystal should go
            return
        }
        if(!this.findExistingRoomLayout(roomName))
        {
            this.findIdealCrystalPosition(roomName)
        }
    },
    findIdealPosition: function(roomName, blueprint, closeTo)
    {
        var roomO = Game.rooms[roomName]
        if(!roomO)
        {
            console.log("No access to room "+roomName)
            return
        }
        const crystalPos = Memory.rooms[roomName].architect.crystalPos
        const terrain = roomO.getTerrain()
        checkShape = blueprint.shape
        var minScore = 1000
        var minX = minY = -1
        const allstructures = roomO.lookForAtArea(LOOK_STRUCTURES,0,0,49,49)
        for(var x=2; x<48-blueprint.dimX; x++)
        {
            for(var y=2; y<48-blueprint.dimY; y++)
            {
                fine = true
                for(var i=0; i<blueprint.dimX; i++)
                {
                    for(var j=0; j<blueprint.dimY; j++)
                    {
                        if(terrain.get(x+i,y+j) == 1 || (allstructures[y+j]&&allstructures[y+j][x+i]))
                        {
                            if(checkShape[j,i] != 0)
                            {
                                fine = false;
                                break;
                            }
                        }
                    }
                    if(!fine)
                    {
                        break
                    }
                }
                //Valid candidate for positioning
                if(fine)
                {
                    if(crystalPos)
                    {
                        if(x<=crystalPos.x+extBlueprint.dimX+2 && y<=crystalPos.y+extBlueprint.dimY+2 && x+blueprint.mainX>=crystalPos.x-2 && y+blueprint.mainY>=crystalPos.y-2)
                        {
                            continue;
                        }
                    }
                    var centerX = x+blueprint.mainX
                    var centerY = y+blueprint.mainY
                    var score = new RoomPosition(centerX,centerY, roomName).findPathTo(closeTo,{ignoreCreeps: true}).length
                    for(var i=-2; i<blueprint.dimX+2; i++)
                    {
                        for(var j=-2; j<blueprint.dimY+2; j++)
                        {
                            if(terrain.get(x+i,y+j) == 1)
                            {
                                score += 1
                            }
                            if(allstructures[y+j])
                            {
                                var structuresAtPos = allstructures[y+j][x+i]
                                for(var localId in structuresAtPos)
                                {
                                    var structure = structuresAtPos[localId]
                                    if(structure.structureType!=STRUCTURE_ROAD && structure.structureType!=STRUCTURE_CONTAINER)
                                    {
                                        //console.log(structure)
                                        score += 1
                                    }
                                }
                            }
                        }
                    }
                    if(score< minScore)
                    {
                        minX = x
                        minY = y
                        minScore = score
                    }
                }
            }
        }
        return new RoomPosition(minX,minY,roomName)
    },
    findIdealCrystalPosition: function(roomName)
    {
        roomO = Game.rooms[roomName]
        if(!roomO)
        {
            console.log("No access to room "+roomName)
            return
        }
        this.setCrystalPos(roomName, this.findIdealPosition(roomName, extBlueprint, roomO.controller))
    },
    setCrystalPos: function(roomName, pos)
    {
        this.checkInitRoom(roomName)
        Memory.rooms[roomName].architect.crystalPos = pos
    },
    findIdealLabPosition: function(roomName)
    {
        var roomO = Game.rooms[roomName]
        if(!roomO)
        {
            console.log("No access to room "+roomName)
            return
        }
        var crystalPos = Memory.rooms[roomName].architect.crystalPos
        if(!crystalPos)
        {
            return;
        }
        this.setLabPos(roomName, this.findIdealPosition(roomName, labBlueprint, new RoomPosition(crystalPos.x+5, crystalPos.y+5, crystalPos.roomName)))
    },
    setLabPos: function(roomName, pos)
    {
        this.checkInitRoom(roomName)
        Memory.rooms[roomName].architect.labPos = pos
    },
    //Determine if there's already a crystal structure in the room and where
    findExistingRoomLayout: function(roomName)
    {
        roomO = Game.rooms[roomName]
        if(!roomO)
        {
            console.log("No access to room "+roomName)
            return
        }
        const extensions = roomO.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTENSION }
        });
        extPositions = Array.from(Array(50), () => new Array(50));
        minY = minX = 50
        maxX = maxY = 0
        if(extensions.length == 0)
        {
            return false
        }
        for(extId in extensions)
        {
            extension = extensions[extId]
            if(extension.pos.x < minX){
                minX = extension.pos.x
            }
            if(extension.pos.x > maxX){
                maxX = extension.pos.x
            }
            if(extension.pos.y < minY){
                minY = extension.pos.y
            }
            if(extension.pos.y > maxY){
                maxY = extension.pos.y
            }
            extPositions[extension.pos.x][extension.pos.y] = true
        }
        console.log(minX+"-"+maxX+", "+minY+"-"+maxY)
        checkShape = extBlueprint.shape
        xDiff = maxX-minX+1
        yDiff = maxY-minY+1
        yWindow = extBlueprint.dimY-yDiff
        xWindow = extBlueprint.dimX-xDiff
        for(x=Math.max(minX-xWindow,0); x<=minX; x++)
        {
            for(y=Math.max(minY-yWindow,0); y<=minY; y++)
            {
                fine = true
                for(i=0; i<11; i++)
                {
                    for(j=0; j<11; j++)
                    {
                        if(checkShape[j][i]!=1 && extPositions[x+i][y+j])
                        {
                            fine = false;
                            break
                        }
                    }
                    if(!fine)
                    {
                        break
                    }
                }
                if(fine)
                {
                    console.log("Crystal is at "+x+","+y)
                    this.setCrystalPos(roomName, new RoomPosition(x,y,roomName))
                    return true
                }
            }
        }
        return false
    }
}