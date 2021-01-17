room = {
    checkGlobalInit: function()
    {
        if(!Memory.rooms)
        {
            Memory.rooms = {}
        }
    },
    init: function(roomName)
    {
        this.checkGlobalInit()
        if(Memory.rooms[roomName])
        {
            console.log("Roomdata for {"+roomName+"} already exists, manually wipe and retry")
            return
        }
        Memory.rooms[roomName] = {}
        room = Game.rooms[roomName]
        if(!room)
        {
            console.log("No access to room {"+roomName+"}, try again when you have vision")
            return
        }
        this.addSourceEntries(room)
    },
    addSourceEntries: function(room)
    {
        data = Memory.rooms[room.name]
        data.sources = {}
        sources = room.find(FIND_SOURCES)
        const terrain = room.getTerrain()
        for(sourceIdx in sources)
        {
            source = sources[sourceIdx]
            spotData = {
                spots:[],
                miningSpot:{}
            }
            console.log(source)
            for(x=-1; x<=1; x++){
                for(y=-1; y<=1; y++)
                {
                    if(!terrain.get(x+source.pos.x,y+source.pos.y))
                    {
                        spotData.spots.push(
                            {'x':x+source.pos.x,
                            'y':y+source.pos.y,
                            'worker':null}
                            )
                    }
                }
            }
            data.sources[source.id] = spotData
        }

        Memory.rooms[room.name] = data
    }
}

module.exports = room