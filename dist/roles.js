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
const mineralMinerRole = require("roleMineralMiner")
const mineralHaulerRole = require("roleMineralHauler")
const transfererRole = require("roleTransferer")
const attackerRole = require("roleAttacker")
const labAssistantRole = require("roleLabAssistant")
const labSupplierRole = require("roleLabSupplier")
module.exports = {
    'worker': workerRole,
    'transferer': transfererRole,
    'extSupplier': extensionSupplierRole,
    'supplier': supplierRole,
    'attacker': attackerRole,
    'miner': minerRole,
    'hauler': haulerRole,
    'mineralMiner': mineralMinerRole,
    'mineralHauler': mineralHaulerRole,
    'builder': builderRole,
    'upgrader': upgraderRole,
    "expander": expanderRole,
    'reserver': reserverRole,
    "labAssistant": labAssistantRole,
    "labSupplier": labSupplierRole,
    'scout': scoutRole,
}