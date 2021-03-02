const accounting = require("accounting")
const room = require("room")
module.exports = {
    run: function()
    {
        for(hostRoom in Memory.rooms)
        {
            count = 0
            this.checkInit(hostRoom)
            for(roomName in Memory.rooms[hostRoom].expansion.expand)
            {
                expandInfo = Memory.rooms[hostRoom].expansion.expand[roomName]
                if(!expandInfo.expanded)
                {
                    count++
                }
                accounting.setRoleNeeded(hostRoom, "expander", count)
                accounting.setRoleNeeded(roomName, "builder", 5)
            }
            if(accounting.getRecentMaxEnergy(hostRoom)>1500)
            {
                accounting.setRoleNeeded(hostRoom, "reserver", Object.keys(Memory.rooms[hostRoom].expansion.reserve).length)
            }
            else
            {
                accounting.setRoleNeeded(hostRoom, "reserver", 0)
            }
        }
    },
    checkInit: function(hostRoom)
    {
        if(!Memory.rooms[hostRoom].expansion)
        {
            Memory.rooms[hostRoom].expansion = {
                reserve: {},
                expand: {}
            }
        }
    },
    markRoomForReserve: function(hostRoom, reserveRoom)
    {
        this.checkInit(hostRoom)
        if(!Memory.rooms[hostRoom].expansion.reserve[reserveRoom])
        {
            Memory.rooms[hostRoom].expansion.reserve[reserveRoom] = 
            {
                reserver: null
            }
        }
    },
    findReserverTarget: function(hostRoom)
    {
        this.checkInit(hostRoom)
        for(roomName in Memory.rooms[hostRoom].expansion.reserve)
        {
            creep = Game.creeps[Memory.rooms[hostRoom].expansion.reserve[roomName].reserver]
            if(!creep)
            {
                Memory.rooms[hostRoom].expansion.reserve[roomName].reserver = null
            }
            reserveInfo = Memory.rooms[hostRoom].expansion.reserve[roomName]
            if(reserveInfo.reserver == null)
            {
                return roomName
            }
        }
        return null
    },
    acquireReserve: function(hostRoom, reserveRoom, creepName)
    {
        this.checkInit(hostRoom)
        if(Memory.rooms[hostRoom].expansion.reserve[reserveRoom].reserver == creepName)
        {
            return true
        }
        if(Memory.rooms[hostRoom].expansion.reserve[reserveRoom].reserver == null)
        {
            Memory.rooms[hostRoom].expansion.reserve[reserveRoom].reserver = creepName
            return true
        }
        return false
    },
    
    markRoomForExpansion: function(hostRoom, expandRoom)
    {
        this.checkInit(hostRoom)
        if(!Memory.rooms[hostRoom].expansion.expand[expandRoom])
        {
            Memory.rooms[hostRoom].expansion.expand[expandRoom] = 
            {
                expander: null,
                expanded: false
            }
        }
    },

    findExpansionTarget: function(hostRoom)
    {
        this.checkInit(hostRoom)
        for(roomName in Memory.rooms[hostRoom].expansion.expand)
        {
            creep = Game.creeps[Memory.rooms[hostRoom].expansion.expand[roomName].expander]
            if(!creep)
            {
                Memory.rooms[hostRoom].expansion.expand[roomName].expander = null
            }
            expansionInfo = Memory.rooms[hostRoom].expansion.expand[roomName]
            if(expansionInfo.expander == null && expansionInfo.expanded == false)
            {
                return roomName
            }
        }
        return null
    },
    getSurrogateRoom: function(hostRoom)
    {
        this.checkInit(hostRoom)
        for(roomName in Memory.rooms[hostRoom].expansion.expand)
        {
            expansionInfo = Memory.rooms[hostRoom].expansion.expand[roomName]
            if(expansionInfo.expanded == true)
            {
                if(!Memory.rooms[roomName])
                {
                    room.init(roomName)
                }
                roomO = Game.rooms[roomName]
                if(roomO.find(FIND_MY_SPAWNS).length > 0)
                {
                    Memory.rooms[hostRoom].expansion.expand[roomName] = undefined
                }
                return roomName
            }
        }
        return null
    },
    acquireExpansion: function(hostRoom, expandRoom, creepName)
    {
        this.checkInit(hostRoom)
        if(Memory.rooms[hostRoom].expansion.expand[expandRoom].expander == creepName)
        {
            return true
        }
        if(Memory.rooms[hostRoom].expansion.expand[expandRoom].expander == null)
        {
            Memory.rooms[hostRoom].expansion.expand[expandRoom].expander = creepName
            return true
        }
        return false
    },

    markExpanded: function(hostRoom, expandRoom)
    {
        this.checkInit(hostRoom)
        Memory.rooms[hostRoom].expansion.expand[expandRoom].expanded = true
    }
}