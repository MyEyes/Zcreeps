const spawning = require("spawner")
const controller = require("creepController")
const accounting = require("accounting")
const extensionShape = require("extensionShape")
const turrets = require("turrets")
const manager = require("creepManager")
const scouting = require("scouting")
const expansion = require("expansion")
const architect = require("architect")
const transfers = require("transfers")

module.exports.loop = function()
{
    accounting.run()
    turrets.run()
    manager.run()
    scouting.run()
    expansion.run()
    architect.run()
    transfers.run()

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