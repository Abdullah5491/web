const ProductModel = require("../../models/product.model");

// Dashboard - Show statistics and overview
const getDashboard = async (req, res) => {
    try {
        const totalProducts = await ProductModel.countDocuments();
        const categories = await ProductModel.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const recentProducts = await ProductModel.find()
            .sort({ _id: -1 })
            .limit(5);

        res.render("admin/dashboard", {
            title: "Admin Dashboard",
            totalProducts,
            categories,
            recentProducts
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading dashboard");
    }
};

// List all products with pagination
const getProducts = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        let filter = {};
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        const total = await ProductModel.countDocuments(filter);
        const products = await ProductModel.find(filter)
            .sort({ _id: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.render("admin/products", {
            title: "Manage Products",
            products,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            search
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching products");
    }
};

// Show add product form
const getAddProduct = (req, res) => {
    res.render("admin/add-product", {
        title: "Add New Product",
        errors: []
    });
};

// Create new product
const createProduct = async (req, res) => {
    try {
        // Check for validation errors
        if (req.validationErrors && req.validationErrors.length > 0) {
            return res.render("admin/add-product", {
                title: "Add New Product",
                errors: req.validationErrors,
                formData: req.body
            });
        }

        const { name, price, category, description } = req.body;

        // Get image path from uploaded file or use default
        let imagePath = "/images/home_copywriter_pic1.png";
        if (req.file) {
            imagePath = "/images/products/" + req.file.filename;
        }

        const product = new ProductModel({
            name,
            price: parseFloat(price),
            category,
            image: imagePath,
            description
        });

        await product.save();
        res.redirect("/admin/products?success=Product created successfully");
    } catch (err) {
        console.error(err);
        res.render("admin/add-product", {
            title: "Add New Product",
            errors: ["Error creating product: " + err.message],
            formData: req.body
        });
    }
};

// Show edit product form
const getEditProduct = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Product not found");
        }

        res.render("admin/edit-product", {
            title: "Edit Product",
            product,
            errors: []
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching product");
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        // Check for validation errors
        if (req.validationErrors && req.validationErrors.length > 0) {
            const product = await ProductModel.findById(req.params.id);
            return res.render("admin/edit-product", {
                title: "Edit Product",
                product: { ...product.toObject(), ...req.body },
                errors: req.validationErrors
            });
        }

        const { name, price, category, description } = req.body;

        // Get existing product to keep old image if no new file uploaded
        const existingProduct = await ProductModel.findById(req.params.id);

        // Get image path from uploaded file or keep existing
        let imagePath = existingProduct.image;
        if (req.file) {
            imagePath = "/images/products/" + req.file.filename;
        }

        const product = await ProductModel.findByIdAndUpdate(
            req.params.id,
            {
                name,
                price: parseFloat(price),
                category,
                image: imagePath,
                description
            },
            { new: true }
        );

        if (!product) {
            return res.status(404).send("Product not found");
        }

        res.redirect("/admin/products?success=Product updated successfully");
    } catch (err) {
        console.error(err);
        const product = await ProductModel.findById(req.params.id);
        res.render("admin/edit-product", {
            title: "Edit Product",
            product,
            errors: ["Error updating product: " + err.message]
        });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await ProductModel.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).send("Product not found");
        }

        res.redirect("/admin/products?success=Product deleted successfully");
    } catch (err) {
        console.error(err);
        res.redirect("/admin/products?error=Error deleting product");
    }
};

module.exports = {
    getDashboard,
    getProducts,
    getAddProduct,
    createProduct,
    getEditProduct,
    updateProduct,
    deleteProduct
};
