const data = 
{
    dimX: 11,
    dimY: 11,
    mainX: 5,
    mainY: 5,
    structure_ids:{
        0: "empty",
        1: STRUCTURE_EXTENSION,
        2: STRUCTURE_SPAWN,
        3: STRUCTURE_ROAD,
        4: STRUCTURE_STORAGE,
        5: STRUCTURE_TOWER,
        6: STRUCTURE_LINK,
        7: STRUCTURE_TERMINAL
    },
    shape: [
    [0,0,0,1,1,3,1,1,0,0,0],
    [0,5,1,1,3,3,3,1,1,5,0],
    [0,1,1,3,1,1,1,3,1,1,0],
    [1,1,3,1,1,1,1,1,3,1,1],
    [1,3,1,1,6,3,7,1,1,3,1],
    [3,3,3,3,3,4,3,3,3,3,3],
    [1,3,1,1,2,3,2,1,1,3,1],
    [1,1,3,1,1,1,1,1,3,1,1],
    [0,1,1,3,1,1,1,3,1,1,0],
    [0,5,1,1,3,3,3,1,1,5,0],
    [0,0,0,1,1,3,1,1,0,0,0]],

    drawShape: function(room,x,y)
    {
        room.visual.rect(x-0.5,y-0.5,11,11, {fill: 'transparent', stroke: '#fff'})
        for(i=0; i<11;i++)
        {
            for(j=0; j<11; j++)
            {
                if(this.shape[j][i] === 1)
                {
                    room.visual.circle(x+i,y+j)
                }
            }
        }
    }
}

module.exports = data