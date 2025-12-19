const OrderModel = require("../../models/order.model");

/**
 * ROUTE HANDLER: getOrders
 * 
 * This controller fetches all orders from MongoDB and renders the admin orders dashboard.
 * Orders are sorted by creation date (newest first) to show recent orders at the top.
 * 
 * Database Query:
 * - Uses OrderModel.find() to get all orders
 * - Applies sort({ createdAt: -1 }) for descending date order
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getOrders = async (req, res) => {
    try {
        // Fetch all orders sorted by date (newest first)
        const orders = await OrderModel.find().sort({ createdAt: -1 });

        // Calculate statistics for dashboard
        const stats = {
            total: orders.length,
            pending: orders.filter(o => o.status === "Pending").length,
            confirmed: orders.filter(o => o.status === "Confirmed").length,
            cancelled: orders.filter(o => o.status === "Cancelled").length,
            totalRevenue: orders
                .filter(o => o.status !== "Cancelled")
                .reduce((sum, o) => sum + o.totalAmount, 0)
        };

        res.render("admin/orders", {
            title: "Manage Orders",
            orders,
            stats
        });
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).send("Error fetching orders");
    }
};

// Update order status to Confirmed
const confirmOrder = async (req, res) => {
    try {
        const order = await OrderModel.findByIdAndUpdate(
            req.params.id,
            { status: "Confirmed" },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.redirect("/admin/orders?success=Order confirmed");
    } catch (err) {
        console.error("Error confirming order:", err);
        res.redirect("/admin/orders?error=Failed to confirm order");
    }
};

// Cancel order
const cancelOrder = async (req, res) => {
    try {
        const order = await OrderModel.findByIdAndUpdate(
            req.params.id,
            { status: "Cancelled" },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.redirect("/admin/orders?success=Order cancelled");
    } catch (err) {
        console.error("Error cancelling order:", err);
        res.redirect("/admin/orders?error=Failed to cancel order");
    }
};

module.exports = {
    getOrders,
    confirmOrder,
    cancelOrder
};
