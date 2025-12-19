/**
 * MIDDLEWARE: checkCartNotEmpty
 * 
 * This middleware validates that the cart is not empty before allowing checkout.
 * It reads the cart items from the request body and ensures there's at least one item.
 * 
 * @param {Object} req - Express request object containing cart items in body
 * @param {Object} res - Express response object for sending error responses
 * @param {Function} next - Express next function to pass control to next middleware
 * 
 * Usage: Apply to checkout/order routes to prevent empty cart submissions
 * Example: app.post('/api/orders', checkCartNotEmpty, createOrder);
 */
const checkCartNotEmpty = (req, res, next) => {
    const { items } = req.body;

    // Validate items array exists and has at least one item
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            error: "Cart is empty",
            message: "Please add items to your cart before checkout"
        });
    }

    next();
};

/**
 * MIDDLEWARE: adminOnly
 * 
 * This middleware restricts access to admin-only routes by checking the user's email.
 * Only users with email 'admin@shop.com' are allowed access to protected routes.
 * 
 * @param {Object} req - Express request object containing user email in body or session
 * @param {Object} res - Express response object for sending unauthorized responses
 * @param {Function} next - Express next function to pass control if authorized
 * 
 * Security Note: In production, this should use proper session-based authentication
 * with encrypted passwords, not just email matching.
 * 
 * Usage: Apply to admin routes to restrict access
 * Example: app.get('/admin/orders', adminOnly, getOrders);
 */
const adminOnly = (req, res, next) => {
    // Check email from session or request body
    const userEmail = req.session?.userEmail || req.body?.email || req.query?.email;

    if (userEmail === "admin@shop.com") {
        return next();
    }

    // For API routes, send JSON error
    if (req.path.startsWith('/api/')) {
        return res.status(403).json({
            error: "Access denied",
            message: "Admin privileges required"
        });
    }

    // For view routes, redirect to login or show error
    return res.status(403).send("Access denied. Admin privileges required.");
};

/**
 * MIDDLEWARE: validateCheckoutInputs
 * 
 * Server-side validation for checkout form inputs to ensure data integrity.
 * Validates required fields and proper formats before order creation.
 */
const validateCheckoutInputs = (req, res, next) => {
    const { customerName, email, items, totalAmount } = req.body;
    const errors = [];

    // Validate customer name
    if (!customerName || customerName.trim().length < 2) {
        errors.push("Customer name must be at least 2 characters");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push("Please provide a valid email address");
    }

    // Validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
        errors.push("Cart is empty");
    } else {
        // Validate each item has required fields
        items.forEach((item, index) => {
            if (!item.name) errors.push(`Item ${index + 1}: Name is required`);
            if (!item.price || item.price <= 0) errors.push(`Item ${index + 1}: Invalid price`);
            if (!item.quantity || item.quantity < 1) errors.push(`Item ${index + 1}: Invalid quantity`);
        });
    }

    // Validate total amount
    if (!totalAmount || totalAmount <= 0) {
        errors.push("Invalid total amount");
    }

    // Server-side recalculation of cart total (Data Integrity - Task 4)
    if (items && Array.isArray(items) && items.length > 0) {
        const calculatedTotal = items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // Add shipping if applicable
        const shipping = 15.00;
        const expectedTotal = calculatedTotal + shipping;

        // Allow small floating point differences
        if (Math.abs(expectedTotal - totalAmount) > 0.01) {
            // Recalculate and use server value instead of rejecting
            req.body.totalAmount = expectedTotal;
            req.body.recalculated = true;
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

module.exports = {
    checkCartNotEmpty,
    adminOnly,
    validateCheckoutInputs
};
