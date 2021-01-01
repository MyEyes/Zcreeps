spawning = require("spawner")

module.exports.loop = function()
{
    foreach(spawn in Game.spawns)
    {
        print(spawn)
    }
}