const util = require("util")
const accounting = require("accounting")
module.exports = 
{
    run: function()
    {
        for(var roomName in Memory.rooms)
        {
            this.runRoom(roomName)
        }
    },
    runRoom: function(roomName)
    {
        var roomO = Game.rooms[roomName]
        if(!roomO)
        {
            return
        }
        if(roomO.controller.level<8)
        {
            return
        }
        this.initRoom(roomName)
        labInfo = Memory.rooms[roomName].lab
        if(!labInfo.all_set && (Game.time%67) < 1)
        {
            this.findLabParts(roomName)
        }
        //We can run the lab if we have both sources and at least one producer
        if(labInfo.source1 && labInfo.source2 && labInfo.producers.length>0)
        {
            accounting.setRoleNeeded(roomName, "labAssistant", 1)
            accounting.setRoleNeeded(roomName, "labSupplier", 1)
            this.runLab(roomName)
        }
        else
        {
            accounting.setRoleNeeded(roomName, "labAssistant", 0)
            accounting.setRoleNeeded(roomName, "labSupplier", 0)
        }
        if(labInfo.buff1 || labInfo.buff2)
        {
            accounting.setRoleNeeded(roomName, "labSupplier", 1)
        }
    },
    runLab: function(roomName)
    {
        if(!Memory.rooms[roomName].lab.reaction)
        {
            this.decideReaction(roomName)
        }
        else
        {
            if(Memory.rooms[roomName].lab.reset)
            {
                this.runReset(roomName)
                return
            }
            sourceLab1 = Game.getObjectById(Memory.rooms[roomName].lab.source1)
            sourceLab2 = Game.getObjectById(Memory.rooms[roomName].lab.source2)
            for(labIdx in Memory.rooms[roomName].lab.producers)
            {
                labId = Memory.rooms[roomName].lab.producers[labIdx]
                lab = Game.getObjectById(labId)
                lab.runReaction(sourceLab1, sourceLab2)
            }
        }
    },
    decideReaction(roomName)
    {
        this.setReaction(roomName, RESOURCE_HYDROGEN, RESOURCE_KEANIUM)
    },
    setReaction(roomName, chem1, chem2)
    {   
        if(!Memory.rooms[roomName].lab.reaction)
        {
            Memory.rooms[roomName].lab.reaction = {}
        }
        if(chem1 === Memory.rooms[roomName].lab.reaction.chem1)
        {
            //If both chemicals are already set we do nothing
            if(chem2 === Memory.rooms[roomName].lab.reaction.chem2)
            {
                return;
            }
            Memory.rooms[roomName].lab.reaction.chem2 = chem2
            this.startReset(roomName,[Memory.rooms[roomName].lab.sourceLab1,Memory.rooms[roomName].lab.buff1,Memory.rooms[roomName].lab.buff2])
            return
        }
        if(chem1 === Memory.rooms[roomName].lab.reaction.chem2)
        {
            if(chem2 === Memory.rooms[roomName].lab.reaction.chem1)
            {
                return;
            }
            Memory.rooms[roomName].lab.reaction.chem1 = chem2
            this.startReset(roomName, [Memory.rooms[roomName].lab.sourceLab2, Memory.rooms[roomName].lab.buff1,Memory.rooms[roomName].lab.buff2])
            return
        }
        //At this point chem1 matches neither, so we only need to check chem2
        if(chem2 === Memory.rooms[roomName].lab.reaction.chem1)
        {
            Memory.rooms[roomName].lab.reaction.chem2 = chem1
            this.startReset(roomName, [Memory.rooms[roomName].lab.sourceLab1, Memory.rooms[roomName].lab.buff1,Memory.rooms[roomName].lab.buff2])
            return
        }
        if(chem2 === Memory.rooms[roomName].lab.reaction.chem2)
        {
            Memory.rooms[roomName].lab.reaction.chem1 = chem1
            this.startReset(roomName, [Memory.rooms[roomName].lab.sourceLab2, Memory.rooms[roomName].lab.buff1,Memory.rooms[roomName].lab.buff2])
            return
        }
        Memory.rooms[roomName].lab.reaction.chem1 = chem1
        Memory.rooms[roomName].lab.reaction.chem2 = chem2
        this.startReset(roomName, [Memory.rooms[roomName].lab.buff1,Memory.rooms[roomName].lab.buff2])
    },
    runReset: function(roomName)
    {
        if(!Memory.rooms[roomName].lab.reset)
        {
            return
        }
        
        resetIdxs = Memory.rooms[roomName].lab.reset
        done = true
        for(resetIdx in resetIdxs)
        {
            var lab = Game.getObjectById(resetIdxs[resetIdx])
            for(resource in lab.store)
            {
                if(resource != RESOURCE_ENERGY)
                {
                    lab.room.visual.circle(lab.pos.x, lab.pos.y,{fill:'red'})
                    done = false
                    break
                }
            }
        }
        if(done)
        {
            Memory.rooms[roomName].lab.reset = undefined
        }
    },
    startReset: function(roomName, exceptions)
    {
        Memory.rooms[roomName].lab.reset = []
        labInfo = Memory.rooms[roomName].lab
        this.addToReset(roomName, exceptions, labInfo.source1)
        this.addToReset(roomName, exceptions, labInfo.source2)
        this.addToReset(roomName, exceptions, labInfo.buff1)
        this.addToReset(roomName, exceptions, labInfo.buff2)
        for(producerIdx in labInfo.producers)
        {
            producer = Game.getObjectById(labInfo.producers[producerIdx])
            if(producer)
            {
                this.addToReset(roomName, exceptions, producer.id)
            }
        }
    },
    addToReset: function(roomName, exceptions, id)
    {
        if(!id)
        {
            return
        }
        for(var exceptionIdx in exceptions)
        {
            if(id == exceptions[exceptionIdx])
            {
                return
            }
        }
        Memory.rooms[roomName].lab.reset.push(id)
    },
    getContainer: function(roomName)
    {
        return Game.getObjectById(Memory.rooms[roomName].lab.container)
    },
    getReaction: function(roomName)
    {
        return Memory.rooms[roomName].lab.reaction
    },
    initRoom: function(roomName)
    {
        if(!Memory.rooms[roomName].lab)
        {
            Memory.rooms[roomName].lab = {
                source1: null,
                source2: null,
                buff1: null,
                buff2: null,
                container: null,
                link: null,
                producers: [],
                all_set: false
            }
        }
    },
    getLabInfo: function(roomName)
    {
        return Memory.rooms[roomName].lab
    },
    findLabParts: function(roomName)
    {
        var basePos = Memory.rooms[roomName].architect.labPos
        var roomO = Game.rooms[roomName]
        if(!basePos)
        {
            return
        }
        var labInfo = Memory.rooms[roomName].lab
        labInfo.source1 = util.getStructureIdAt(roomO,basePos.x+3,basePos.y+1, STRUCTURE_LAB)
        labInfo.source2 = util.getStructureIdAt(roomO,basePos.x+3,basePos.y+2, STRUCTURE_LAB)
        labInfo.buff1 = util.getStructureIdAt(roomO,basePos.x,basePos.y+2, STRUCTURE_LAB)
        labInfo.buff2 = util.getStructureIdAt(roomO,basePos.x,basePos.y+3, STRUCTURE_LAB)
        labInfo.container = util.getStructureIdAt(roomO,basePos.x+1,basePos.y+2, STRUCTURE_CONTAINER)
        labInfo.link = util.getStructureIdAt(roomO,basePos.x+1,basePos.y+1, STRUCTURE_LINK)
        labInfo.producers = []
        for(var x=1; x<=3; x++)
        {
            var labId = util.getStructureIdAt(roomO,basePos.x+x,basePos.y, STRUCTURE_LAB)
            if(labId)
            {
                labInfo.producers.push(labId)
            }
            labId = util.getStructureIdAt(roomO,basePos.x+x,basePos.y+3, STRUCTURE_LAB)
            if(labId)
            {
                labInfo.producers.push(labId)
            }
        }
        if(labInfo.producers.length == 6 && labInfo.source1 && labInfo.source2 && labInfo.buff1 && labInfo.buff2 && labInfo.container && labInfo.link)
        {
            labInfo.all_set = true
        }
        Memory.rooms[roomName].lab = labInfo
    },
    getLabAt: function(room, x, y)
    {
        var structures=room.lookAt(LOOK_STRUCTURE, x, y)
        for(var structureIdx in structures)
        {
            var structure = structures[structureIdx]
            if(structure.structureType == STRUCTURE_LAB)
            {
                return structure.id
            }
        }
        return null
    },
    getLabPosition: function(roomName)
    {
        pos = Memory.rooms[roomName].architect.labPos

        return new RoomPosition(pos.x,pos.y,pos.roomName)
    },
    getBoost1: function(roomName)
    {
        return Game.getObjectById(Memory.rooms[roomName].lab.buff1)
    },
    getBoost2: function(roomName)
    {
        return Game.getObjectById(Memory.rooms[roomName].lab.buff1)
    },
    getBoost1Resource: function(roomName)
    {
        if(Memory.rooms[roomName].lab)
        {
            return Memory.rooms[roomName].lab.boost1Resource
        }
    },
    getBoost2Resource: function(roomName)
    {
        if(Memory.rooms[roomName].lab)
        {
            return Memory.rooms[roomName].lab.boost2Resource
        }
    },
    setBoost1Resource: function(roomName, res)
    {
        if(Memory.rooms[roomName].lab.boost1Resource != res)
        {
            Memory.rooms[roomName].lab.boost1Resource = res
            var labInfo = Memory.rooms[roomName].lab
            exceptions = [labInfo.source1, labInfo.source2, labInfo.buff2]
            for(producerIdx in labInfo.producers)
            {
                exceptions.push(labInfo.producers[producerIdx])
            }
            this.startReset(roomName,exceptions)
        }
    },
    setBoost2Resource: function(roomName, res)
    {
        Memory.rooms[roomName].lab.boost2Resource = res
        if(Memory.rooms[roomName].lab.boost2Resource != res)
        {
            Memory.rooms[roomName].lab.boost2Resource = res
            var labInfo = Memory.rooms[roomName].lab
            exceptions = [labInfo.source1, labInfo.source2, labInfo.buff1]
            for(producerIdx in labInfo.producers)
            {
                exceptions.push(labInfo.producers[producerIdx])
            }
            this.startReset(roomName,exceptions)
        }
    }
}