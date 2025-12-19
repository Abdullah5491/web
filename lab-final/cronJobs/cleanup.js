// Example cron job for cleanup tasks
// You can use node-cron or similar libraries to schedule this

const ProductModel = require("../models/product.model");

const cleanupOldData = async () => {
    try {
        // Example: Remove products with price 0 or products marked as deleted
        const result = await ProductModel.deleteMany({ price: 0 });
        console.log(`Cleanup completed: ${result.deletedCount} products removed`);
    } catch (err) {
        console.error("Cleanup error:", err);
    }
};

module.exports = { cleanupOldData };
