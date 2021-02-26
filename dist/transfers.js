const roles = require("./roles");

module.exports = 
{
    globalInit: function()
    {
        Memory.transfers = {}
    },
    run: function()
    {
        for(roomName in Memory.rooms)
        {
            this.runRoom(roomName)
        }
    },
    runRoom: function(roomName)
    {
        var room = Game.rooms[roomName]
        if(!room || !room.terminal)
        {
            return
        }
        if(room.storage.store[RESOURCE_ENERGY]<100000)
        {
            requestId = this.getRequestForResource(roomName, RESOURCE_ENERGY)
            if(!requestId)
            {

            }
            else
            {
                this.updateRequest(requestId, 100000-room.storage.store[RESOURCE_ENERGY])
            }
        }
        else
        {
            for(requestId in Memory.transfers)
            {
                requestInfo = Memory.transfers[requestId]
                if(room.terminal.store[requestInfo.resourceType]>0)
                {
                    if(this.sendToRequest(room.terminal, requestId, room.terminal.store[requestInfo.resourceType]))
                    {
                        break;
                    }
                }
            }
        }
    },
    getRequestForResource: function(roomName, resourceType)
    {
        for(transferId in Memory.transfers)
        {
            transferInfo = Memory.transfers[transferId]
            if(transferInfo.roomName == roomName && transferInfo.resourceType == resourceType)
            {
                return transferId
            }
        }
    },
    createRequest: function(roomName, resourceType, amount)
    {
        Memory.transfers[roomName+Game.time]={
            resourceType: resourceType,
            amount: amount,
            roomName: roomName
        }
    },
    updateRequest: function(requestId, amount)
    {
        Memory.transfers[requestId].amount = amount
    },
    sendToRequest: function(terminal, requestId, amount)
    {
        requestInfo = Memory.transfers[requestId]
        amount = Math.min(amount, requestInfo.amount)
        if(terminal.send(requestInfo.resourceType,amount, requestInfo.roomName) == OK)
        {
            requestInfo.amount -= amount
            if(requestInfo.amount == 0)
            {
                Memory.transfers[requestId] = undefined
            }
            else
            {
                Memory.transfers[requestId] = requestInfo
            }
            return true
        }
        return false
    },
}