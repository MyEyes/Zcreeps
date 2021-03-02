scouting = require("scouting")
accounting = require("accounting")
module.exports = {
    body: function(room)
    {
        return [MOVE,MOVE,MOVE,MOVE,MOVE]
    },
    run: function(creep)
    {
        if(!creep.memory.targetRoom)
        {
            creep.memory.targetRoom = scouting.findScoutingTarget(creep.memory.home)
        }
        else
        {
            targetPos = new RoomPosition(25,25,creep.memory.targetRoom)
            creep.moveTo(targetPos)
            if(creep.room.find(FIND_HOSTILE_STRUCTURES).length > 0)
            {
                scouting.tagRoom(creep.memory.home, creep.memory.targetRoom, 1500)
            }
            if(creep.pos.getRangeTo(targetPos)<23)
            {
                scouting.tagRoom(creep.memory.home, creep.memory.targetRoom)
                creep.memory.targetRoom = undefined
            }
        }
    }
}