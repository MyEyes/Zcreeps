const roles = require("roles")
const accounting = require("accounting")

module.exports=
{
    run: function()
    {
        for(creepName in Memory.creeps)
        {
            creepData = Memory.creeps[creepName]
            creep = Game.creeps[creepName]
            if(!creep && creepData)
            {
                accounting.removeCreepFromRole(creepData.home, creepData.role)
                Memory.creeps[creepName] = undefined
            }
            else if(creep && !creep.spawning)
            {
                try {
                    this.runCreep(creep)   
                } catch (error) {
                    throw(error)
                    console.log(error)
                    creep.say("OH NO")
                }
            }
        }
    },
    runCreep: function(creep)
    {
        if(creep && creep.memory)
            roles[creep.memory.role].run(creep)
    }
}