module.exports = {
    run: function()
    {
        for(structureId in Game.structures)
        {
            structure = Game.structures[structureId]
            if(structure.structureType == STRUCTURE_TOWER)
            {
                this.runTower(structure)
            }
        }
    },
    runTower: function(tower)
    {
        room = tower.room
        target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
        if(target)
        {
            tower.attack(target)
            return
        }
        target = tower.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(structure){return structure.hits<structure.hitsMax/2}})
        if(target)
        {
            tower.repair(target)
        }
    }
}