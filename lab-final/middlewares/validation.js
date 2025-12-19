// Validation middleware for product data

const validateProduct = (req, res, next) => {
    const { name, price, category, description } = req.body;
    const errors = [];

    // Required fields validation
    if (!name || name.trim() === '') {
        errors.push('Product name is required');
    }

    if (!price) {
        errors.push('Price is required');
    } else if (isNaN(price) || parseFloat(price) <= 0) {
        errors.push('Price must be a positive number');
    }

    if (!category || category.trim() === '') {
        errors.push('Category is required');
    }

    if (!description || description.trim() === '') {
        errors.push('Description is required');
    }

    // If there are errors, send them back
    if (errors.length > 0) {
        req.validationErrors = errors;
    }

    next();
};

module.exports = { validateProduct };
