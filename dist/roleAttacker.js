const scouting = require("scouting")
const accounting = require("accounting")
const enemyScouting = require("enemyScouting")
module.exports = {
    body: function(room)
    {
        recMaxEnergy = accounting.getRecentMaxEnergy(room.name)
        //80+300+320
        if(recMaxEnergy>=700)
        {
            return [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,TOUGH,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE]
        }
        return [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,TOUGH,MOVE,ATTACK,MOVE]
    },
    run: function(creep)
    {
        if(!creep.memory.targetRoom)
        {
            creep.memory.targetRoom = enemyScouting.getTargetRoom(creep.memory.home)
            creep.moveTo(25,25,creep.memory.home)
        }
        else
        {
            if(creep.pos.roomName != creep.memory.targetRoom)
            {
                creep.moveTo(new RoomPosition(25,25,creep.memory.targetRoom))
                return
            }
            hostileCreeps = creep.room.find(FIND_HOSTILE_CREEPS)
            if(hostileCreeps.length > 0)
            {
                target = creep.pos.findClosestByRange(hostileCreeps)
                creep.moveTo(target)
                creep.attack(target)
                return
            }
            hostileStructures = creep.room.find(FIND_HOSTILE_STRUCTURES)
            if(hostileStructures.length > 0)
            {
                target = creep.pos.findClosestByRange(hostileStructures)
                creep.moveTo(target)
                creep.attack(target)
                return
            }
            creep.memory.targetRoom = undefined
        }
    }
}