module.exports =
{
    run: function()
    {
        tally = {}
        for(roomName in Memory.rooms)
        {
            var roomO = Game.rooms[roomName]
            if(roomO && roomO.terminal)
            {
                for(resource in roomO.storage.store)
                {
                    if(!tally[resource])
                    {
                        tally[resource] = 0
                    }
                    tally[resource] += roomO.storage.store[resource]
                }
            }
        }
        Memory.totalResources = tally
    }
}