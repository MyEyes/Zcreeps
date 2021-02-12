workerRole = require("roleWorker")
builderRole = require("roleBuilder")
extensionSupplierRole = require("roleExtensionSupplier")
minerRole = require("roleMiner")
haulerRole = require("roleHauler")
upgraderRole = require("roleUpgrader")
supplierRole = require("roleSupplier")
scoutRole = require("roleScout")
module.exports = {
    'worker': workerRole,
    'builder': builderRole,
    'extSupplier': extensionSupplierRole,
    'miner': minerRole,
    'hauler': haulerRole,
    'upgrader': upgraderRole,
    'supplier': supplierRole,
    'scout': scoutRole
}