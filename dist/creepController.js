roles = require("roles")
accounting = require("accounting")

module.exports=
{
    run: function()
    {
        for(creepName in Memory.creeps)
        {
            creepData = Memory.creeps[creepName]
            creep = Game.creeps[creepName]
            if(!creep)
            {
                accounting.removeCreepFromRole(creepData.home, creepData.role)
            }
            else
            {
                this.runCreep(creep)
            }
        }
    },
    runCreep: function(creep)
    {
        roles[creep.memory.role].run(creep)
    }
}