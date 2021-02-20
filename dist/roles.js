const workerRole = require("roleWorker")
const builderRole = require("roleBuilder")
const extensionSupplierRole = require("roleExtensionSupplier")
const minerRole = require("roleMiner")
const haulerRole = require("roleHauler")
const upgraderRole = require("roleUpgrader")
const supplierRole = require("roleSupplier")
const scoutRole = require("roleScout")
const reserverRole = require("roleReserver")
const expanderRole = require("roleExpander")
module.exports = {
    'worker': workerRole,
    'extSupplier': extensionSupplierRole,
    'supplier': supplierRole,
    'miner': minerRole,
    'hauler': haulerRole,
    'builder': builderRole,
    'upgrader': upgraderRole,
    "expander": expanderRole,
    'scout': scoutRole,
    'reserver': reserverRole,
}