roomData = require("room")
module.exports = {
    checkRoomAccountingInit: function(roomName)
    {
        roomInfo = Memory.rooms[roomName]
        if(!roomInfo)
        {
            return false;
        }
        if(roomInfo.accounting)
        {
            return true;
        }
        accounting = {
            roles: {
                needed: {},
                alive: {}
            },
            energy:{
                maxLast1000: 0,
                maxCounter: 0
            }
        }
        Memory.rooms[roomName].accounting = accounting
        return true;
    },

    initRoleAccounting: function(roomName, roleName)
    {
        roomData.checkGlobalInit()
        if (!this.checkRoomAccountingInit(roomName))
        {
            console.log("Couldn't init accounting for "+roomName)
            return false;
        }
        if(Memory.rooms[roomName].accounting.roles.needed[roleName] !== undefined)
        {
            return true
        }
        Memory.rooms[roomName].accounting.roles.needed[roleName] = 0
        Memory.rooms[roomName].accounting.roles.alive[roleName] = 0
        return true;
    },

    getRoleInfo: function(roomName, roleName)
    {
        roomData.checkGlobalInit()
        if (!this.initRoleAccounting(roomName, roleName))
        {
            console.log("Couldn't init accounting for "+roomName)
            return false;
        }
        return {
            needed: Memory.rooms[roomName].accounting.roles.needed[roleName],
            alive: Memory.rooms[roomName].accounting.roles.alive[roleName]
        }
    },

    addCreepToRole: function(roomName, roleName)
    {
        roomData.checkGlobalInit()
        if (!this.initRoleAccounting(roomName, roleName))
        {
            console.log("Couldn't init accounting for "+roomName)
            return false;
        }
        Memory.rooms[roomName].accounting.roles.alive[roleName] += 1
    },

    removeCreepFromRole: function(roomName, roleName)
    {
        roomData.checkGlobalInit()
        if (!this.initRoleAccounting(roomName, roleName))
        {
            console.log("Couldn't init accounting for "+roomName)
            return false;
        }
        Memory.rooms[roomName].accounting.roles.alive[roleName] -= 1
        if(Memory.rooms[roomName].accounting.roles.alive[roleName]<0)
        {
            Memory.rooms[roomName].accounting.roles.alive[roleName] = 0
        }
    },

    updateEnergy: function(roomName)
    {
        roomData.checkGlobalInit()
        if (!this.checkRoomAccountingInit(roomName))
        {
            console.log("Couldn't init accounting for "+roomName)
            return false;
        }
        room = Game.rooms[roomName]
        currMax = Memory.rooms[roomName].accounting.energy.maxCounter
        if(room.energyAvailable > currMax)
        {
            Memory.rooms[roomName].accounting.energy.maxCounter = room.energyAvailable
        }
        if((Game.time % 1000) == 0)
        {
            Memory.rooms[roomName].accounting.energy.maxLast1000 = Memory.rooms[roomName].accounting.energy.maxCounter
            Memory.rooms[roomName].accounting.energy.maxCounter = 0
        }
    },
    getRecentMaxEnergy: function(roomName)
    {
        roomData.checkGlobalInit()
        if (!this.checkRoomAccountingInit(roomName))
        {
            console.log("Couldn't init accounting for "+roomName)
            return false;
        }
        room = Game.rooms[roomName]
        return Memory.rooms[roomName].accounting.energy.maxLast1000
    },

    run: function()
    {
        for(roomName in Memory.rooms)
        {
            this.updateEnergy(roomName)
        }
    }
}