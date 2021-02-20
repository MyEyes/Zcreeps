accounting = require("accounting")
mining = require("mining")
module.exports = {
    run: function()
    {
        if(((Game.time-50) % 1000) < 1)
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
        numConstructionSites = room.find(FIND_CONSTRUCTION_SITES).length
        if(room.storage)
        {
            accounting.setRoleNeeded(roomName, "builder", Math.floor(Math.min((numConstructionSites+4)/5, 3)))
            if(Memory.rooms[roomName].miningSpots)
            {
                
                if(accounting.getRecentMaxEnergy(roomName)<1000)
                {
                    accounting.setRoleNeeded(roomName, "worker", 1)
                }
                else
                {
                    accounting.setRoleNeeded(roomName, "worker", 0)
                }
                accounting.setRoleNeeded(roomName, "extSupplier", 1)
                accounting.setRoleNeeded(roomName, "supplier", 1)
                accounting.setRoleNeeded(roomName, "scout", 1)
                numSpots = Object.keys(Memory.rooms[roomName].miningSpots).length
                accounting.setRoleNeeded(roomName, "miner", numSpots)
                accounting.setRoleNeeded(roomName, "hauler", numSpots)
                accounting.setRoleNeeded(roomName, "upgrader", Math.floor(room.storage.store[RESOURCE_ENERGY]/100000)+1)
            }
            else
            {
                if(room.storage.store[RESOURCE_ENERGY] > 20000)
                {
                    mining.createRoomMiningSpots(roomName, roomName)
                }
            }
        }
        else
        {
            if(room.find(FIND_MY_SPAWNS).length > 0)
            {
                numSpots = 0
                for(source in Memory.rooms[roomName].sources)
                {
                    numSpots += Memory.rooms[roomName].sources[source].spots.length
                }
                accounting.setRoleNeeded(roomName, "worker", numSpots*2)
                accounting.setRoleNeeded(roomName, "builder", Math.floor(Math.min((numConstructionSites+4)/5, 3)))
                accounting.setRoleNeeded(roomName, "extSupplier", 0)
                accounting.setRoleNeeded(roomName, "supplier", 0)
                accounting.setRoleNeeded(roomName, "miner", 0)
                accounting.setRoleNeeded(roomName, "hauler", 0)
                accounting.setRoleNeeded(roomName, "upgrader", 0)
                accounting.setRoleNeeded(roomName, "scout", 0)
            }
            else
            {
                numSpots = 0
                for(source in Memory.rooms[roomName].sources)
                {
                    numSpots += Memory.rooms[roomName].sources[source].spots.length
                }
                accounting.setRoleNeeded(roomName, "builder", numSpots*2)
                accounting.setRoleNeeded(roomName, "worker", 0)
                accounting.setRoleNeeded(roomName, "extSupplier", 0)
                accounting.setRoleNeeded(roomName, "supplier", 0)
                accounting.setRoleNeeded(roomName, "miner", 0)
                accounting.setRoleNeeded(roomName, "hauler", 0)
                accounting.setRoleNeeded(roomName, "upgrader", 0)
                accounting.setRoleNeeded(roomName, "scout", 0)
            }
        }
    }
}