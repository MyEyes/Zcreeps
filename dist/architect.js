const extShape = require("extensionShape")
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
                extShape.drawShape(Game.rooms[roomName], pos.x, pos.y)
            }
            roomO = Game.rooms[roomName]
            if(roomO)
            {
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
        shape = extShape.shape
        structures = extShape.structure_ids
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
        for(i=0; i<11; i++)
        {
            for(j=0; j<11; j++)
            {
                if(shape[j][i] == 0)
                {
                    continue;
                }
                result = roomO.createConstructionSite(pos.x+i, pos.y+j, structures[shape[j][i]])
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
    findIdealCrystalPosition: function(roomName)
    {
        roomO = Game.rooms[roomName]
        if(!roomO)
        {
            console.log("No access to room "+roomName)
            return
        }
        const terrain = roomO.getTerrain()
        checkShape = extShape.shape
        minScore = 1000
        minX = minY = -1
        for(x=2; x<48-11; x++)
        {
            for(y=2; y<48-11; y++)
            {
                fine = true
                for(i=0; i<11; i++)
                {
                    for(j=0; j<11; j++)
                    {
                        if(terrain.get(x+i,y+j) == 1)
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
                    centerX = x+5
                    centerY = y+5

                    score = new RoomPosition(centerX,centerY, roomName).findPathTo(roomO.controller).length
                    for(i=-2; i<13; i++)
                    {
                        for(j=-2; j<13; j++)
                        {
                            if(terrain.get(x+i,y+j) == 1)
                            {
                                score += 1
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
        this.setCrystalPos(roomName, new RoomPosition(minX,minY,roomName))
    },
    setCrystalPos: function(roomName, pos)
    {
        this.checkInitRoom(roomName)
        Memory.rooms[roomName].architect.crystalPos = pos
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
        checkShape = extShape.shape
        xDiff = maxX-minX+1
        yDiff = maxY-minY+1
        yWindow = 11-yDiff
        xWindow = 11-xDiff
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