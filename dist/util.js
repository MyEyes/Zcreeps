module.exports = {
    getFreeSpotsAround: function(pos)
    {
        spots = []
        const terrain = new Room.Terrain(pos.roomName)
        for(x=-1; x<=1; x++){
            for(y=-1; y<=1; y++)
            {
                if(terrain.get(x+pos.x,y+pos.y)!=1)
                {
                    spots.push(new RoomPosition(x+pos.x, y+pos.y, pos.roomName))
                }
            }
        }
        return spots
    },
    getStructureIdAt: function(room, x, y, structureType)
    {
        var structures=room.lookForAt(LOOK_STRUCTURES, x, y)
        for(var structureIdx in structures)
        {
            var structure = structures[structureIdx]
            if(structure.structureType == structureType)
            {
                return structure.id
            }
        }
        return null
    }
}