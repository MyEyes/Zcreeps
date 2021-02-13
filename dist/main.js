const spawning = require("spawner")
const controller = require("creepController")
const accounting = require("accounting")
const extensionShape = require("extensionShape")
const turrets = require("turrets")
const manager = require("creepManager")
const scouting = require("scouting")
const expansion = require("expansion")

module.exports.loop = function()
{
    accounting.run()
    turrets.run()
    manager.run()
    scouting.run()
    expansion.run()
    //extensionShape.drawShape(Game.rooms["W4N1"],35,7)
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