spawning = require("spawner")
extShape = require("extensionShape")

module.exports.loop = function()
{
    for(spawnName in Game.spawns)
    {
        spawner = Game.spawns[spawnName]
        spawning.spawn(spawner)
    }
}