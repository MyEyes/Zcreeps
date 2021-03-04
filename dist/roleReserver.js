expansion = require("expansion")
accounting = require("accounting")
module.exports = {
    body: function(room)
    {
        return [MOVE,MOVE,CLAIM, CLAIM]
    },
    run: function(creep)
    {
        if(!creep.memory.targetRoom)
        {
            target = expansion.findReserverTarget(creep.memory.home)
            if(target)
            {
                if(expansion.acquireReserve(creep.memory.home, target, creep.name))
                {
                    creep.memory.targetRoom = target
                }
            }
        }
        else
        {
            room = Game.rooms[creep.memory.targetRoom]
            if(!room)
            {
                targetPos = new RoomPosition(25,25,creep.memory.targetRoom)
                creep.moveTo(targetPos)
            }
            else
            {
                creep.moveTo(room.controller)
                if(room.controller.reservation)
                {
                    if(room.controller.reservation.username != "Firzen")
                    {
                        creep.attackController(room.controller)
                    }
                }
                creep.reserveController(room.controller)
            }
        }
    }
}