spawning = require("spawner")
controller = require("creepController")
extShape = require("extensionShape")
accounting = require("accounting")
extensionShape = require("extensionShape")
turrets = require("turrets")

module.exports.loop = function()
{
    accounting.run()
    turrets.run()
    //extensionShape.drawShape(Game.rooms["E2N1"],9,11)

    for(spawnName in Game.spawns)
    {
        spawner = Game.spawns[spawnName]
        spawning.spawn(spawner)
    }

    for(creepName in Game.creeps)
    {
        creep = Game.creeps[creepName]
        controller.run(creep)
    }
}