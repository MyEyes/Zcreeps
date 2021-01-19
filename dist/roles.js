workerRole = require("roleWorker")
builderRole = require("roleBuilder")
extensionSupplierRole = require("roleExtensionSupplier")
module.exports = {
    'worker': workerRole,
    'builder': builderRole,
    'extSupplier': extensionSupplierRole
}