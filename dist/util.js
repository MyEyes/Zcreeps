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
    }
}