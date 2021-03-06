expansion = require("expansion")
accounting = require("accounting")
room = require("room")
module.exports = {
    body: function(room)
    {
        return [MOVE,CLAIM,]
    },
    run: function(creep)
    {
        if(!creep.memory.targetRoom)
        {
            target = expansion.findExpansionTarget(creep.memory.home)
            if(target)
            {
                if(expansion.acquireExpansion(creep.memory.home, target, creep.name))
                {
                    creep.memory.targetRoom = target
                }
            }
        }
        else
        {
            room = Game.rooms[creep.memory.targetRoom]
            targetPos = new RoomPosition(25,25,creep.memory.targetRoom)
            if(!room || creep.pos.x<2 || creep.pos.y <2 || creep.pos.x>47 || creep.pos.y>47)
            {
                creep.moveTo(targetPos)
            }
            else
            {
                creep.moveTo(room.controller)
                if(creep.claimController(room.controller) == OK)
                {
                    expansion.markExpanded(creep.memory.home, creep.memory.targetRoom)
                    room.init(creep.memory.targetRoom)
                }
            }
        }
    }
}