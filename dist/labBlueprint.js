const data = 
{
    dimX: 4,
    dimY: 4,
    mainX: 0,
    mainY: 1,
    structure_ids:{
        0: "empty",
        1: STRUCTURE_LAB,
        2: STRUCTURE_ROAD,
        3: STRUCTURE_CONTAINER,
        4: STRUCTURE_LINK,
    },
    shape: [
    [2,1,1,1],
    [2,4,2,1],
    [1,3,2,1],
    [1,1,1,1]],

    drawShape: function(room,x,y)
    {
        room.visual.rect(x-0.5,y-0.5,this.dimX,this.dimY, {fill: 'transparent', stroke: '#fff'})
        for(i=0; i<this.dimX;i++)
        {
            for(j=0; j<this.dimY; j++)
            {
                if(data.shape[j][i] === 1)
                {
                    room.visual.circle(x+i,y+j)
                }
            }
        }
    }
}
module.exports = data