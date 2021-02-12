spawning = require("spawner")
controller = require("creepController")
extShape = require("extensionShape")
accounting = require("accounting")
extensionShape = require("extensionShape")
turrets = require("turrets")
manager = require("creepManager")
scouting = require("scouting")
expansion = require("expansion")

module.exports.loop = function()
{
    accounting.run()
    turrets.run()
    manager.run()
    scouting.run()
    expansion.run()
    //extensionShape.drawShape(Game.rooms["W2S1"],9,11)
    //expand to W4N1

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