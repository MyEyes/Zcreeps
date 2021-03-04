const accounting = require("accounting")
module.exports={
    initGlobal: function()
    {
        if(!Memory.enemies)
        {
            Memory.enemies = {roomsWithEnemies: {}}
        }
    },
    run: function()
    {
        this.initGlobal()
        if(Game.time % 20 < 1)
        {
            this.detectEnemyRooms()
            this.buildClosestList()
            this.updateNeeds()
        }
    },
    getTargetRoom: function(home)
    {
        if(Memory.enemies.combatRooms[home])
        {
            return Memory.enemies.combatRooms[home][0]
        }
        return undefined
    },
    updateNeeds: function()
    {
        for(roomName in Memory.rooms)
        {
            accounting.setRoleNeeded(roomName, "attacker", 0)
        }
        for(roomName in Memory.enemies.combatRooms)
        {
            accounting.setRoleNeeded(roomName, "attacker", 1)
        }
    },
    detectEnemyRooms: function()
    {
        for(roomName in Game.rooms)
        {
            roomO = Game.rooms[roomName]
            if(roomO.find(FIND_SOURCES).length < 3 && (roomO.find(FIND_HOSTILE_CREEPS).length>0 || roomO.find(FIND_HOSTILE_STRUCTURES).length>0))
            {
                Memory.enemies.roomsWithEnemies[roomName] = {closestRoom: this.findClosestOwnedRoom(roomName)}
            }
            else
            {
                Memory.enemies.roomsWithEnemies[roomName] = undefined
            }
        }
    },
    buildClosestList: function()
    {
        var combatRooms = {}
        for(var roomName in Memory.enemies.roomsWithEnemies)
        {
            enemyRoomInfo = Memory.enemies.roomsWithEnemies[roomName]
            if(!enemyRoomInfo)
            {
                continue;
            }
            if(!combatRooms[enemyRoomInfo.closestRoom])
            {
                combatRooms[enemyRoomInfo.closestRoom] = []
            }
            combatRooms[enemyRoomInfo.closestRoom].push(roomName)
        }
        Memory.enemies.combatRooms = combatRooms
    },
    findClosestOwnedRoom: function(roomName)
    {
        minDistance = 50
        closest = null
        for(myRoom in Memory.rooms)
        {
            var distance = Game.map.findRoute(myRoom, roomName).length
            if(distance == 1)
            {
                return myRoom
            }
            if(distance < minDistance)
            {
                minDistance = distance
                closest = myRoom
            }
        }
        return closest
    }
}