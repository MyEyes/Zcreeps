const globalResources = require("globalResources")
module.exports = 
{
    globalInit: function()
    {
        if(!Memory.transfers)
        {
            Memory.transfers = {}
        }
    },
    run: function()
    {
        this.globalInit()
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
        currentTransfer = this.getCurrentTransfer(roomName)
        for(resource in Memory.totalResources)
        {
            diff = room.storage.store[resource]+room.terminal.store[resource]-globalResources.getAverage(resource)
            percentage = diff/globalResources.getAverage(resource)
            if(percentage && percentage<-0.1)
            {
                requestId = this.getRequestForResource(roomName, resource)
                if(!requestId)
                {
                    this.createRequest(roomName, resource, -diff)
                }
                else
                {
                    this.updateRequest(requestId, -diff)
                }
            }
            if(diff>0 && !currentTransfer)
            {
                for(requestId in Memory.transfers)
                {
                    requestInfo = Memory.transfers[requestId]
                    if(requestInfo && requestInfo.resourceType == resource)
                    {
                        this.setCurrentTransfer(roomName, requestId)
                    }
                }
            }
        }
        if(currentTransfer)
        {
            
            amount = room.terminal.store[currentTransfer.resourceType]
            if(currentTransfer.resourceType == RESOURCE_ENERGY)
            {
                amount -= 100000
            }
            if(amount>50000 || amount>currentTransfer.amount)
            {
                this.sendToRequest(room.terminal, Memory.rooms[roomName].currentTransfer, amount)
            }
        }
    },
    setCurrentTransfer(roomName, transferId)
    {
        Memory.rooms[roomName].currentTransfer = transferId
    },
    getCurrentTransfer(roomName)
    {
        if(!Memory.rooms[roomName].currentTransfer)
        {
            return undefined
        }
        return Memory.transfers[Memory.rooms[roomName].currentTransfer]
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
    getRequestAmount: function(requestId)
    {
        transferInfo = Memory.transfers[transferId]
        if(transferInfo)
        {  
            return transferInfo.amount
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