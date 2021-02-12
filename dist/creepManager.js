accounting = require("accounting")
module.exports = {
    run: function()
    {
        if(((Game.time-200) % 1000) < 1)
        {
            for(roomName in Memory.rooms)
            {
                this.manageRoomCreeps(roomName)
            }
        }
    },
    manageRoomCreeps: function(roomName)
    {
        room = Game.rooms[roomName]
        if(room.storage)
        {
            if(Memory.rooms[roomName].miningSpots)
            {
                accounting.setRoleNeeded(roomName, "worker", 0)
                accounting.setRoleNeeded(roomName, "extSupplier", 1)
                accounting.setRoleNeeded(roomName, "supplier", 1)
                numSpots = Object.keys(Memory.rooms[roomName].miningSpots).length
                accounting.setRoleNeeded(roomName, "miner", numSpots)
                accounting.setRoleNeeded(roomName, "hauler", numSpots)
                accounting.setRoleNeeded(roomName, "upgrader", Math.floor(room.storage.store[RESOURCE_ENERGY]/100000)+1)
            }
        }
        else
        {
                numSpots = 0
                for(source in Memory.rooms[roomName].sources)
                {
                    numSpots += Memory.rooms[roomName].sources[source].spots.length
                }
                accounting.setRoleNeeded(roomName, "worker", numSpots*2)
                accounting.setRoleNeeded(roomName, "extSupplier", 0)
                accounting.setRoleNeeded(roomName, "supplier", 0)
                accounting.setRoleNeeded(roomName, "miner", 0)
                accounting.setRoleNeeded(roomName, "hauler", 0)
                accounting.setRoleNeeded(roomName, "upgrader", 0)
        }
    }
}