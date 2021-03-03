module.exports =
{
    run: function()
    {
        tally = {}
        totalTerminalRooms = 0
        for(roomName in Memory.rooms)
        {
            var roomO = Game.rooms[roomName]
            if(roomO && roomO.terminal)
            {
                totalTerminalRooms += 1
                for(resource in roomO.storage.store)
                {
                    if(!tally[resource])
                    {
                        tally[resource] = 0
                    }
                    tally[resource] += roomO.storage.store[resource]
                }
                for(resource in roomO.terminal.store)
                {
                    if(!tally[resource])
                    {
                        tally[resource] = 0
                    }
                    tally[resource] += roomO.terminal.store[resource]
                }
            }
        }
        Memory.totalTerminalRooms = totalTerminalRooms
        Memory.totalResources = tally
    },
    getAverage: function(resource)
    {
        if(Memory.totalResources[resource])
        {
            return Memory.totalResources[resource]/Memory.totalTerminalRooms
        }
        return 0
    }
}