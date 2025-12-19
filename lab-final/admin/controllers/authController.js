const UserModel = require("../../models/user.model");

// Show login page
const getLogin = (req, res) => {
    if (req.session && req.session.admin) {
        return res.redirect("/admin");
    }
    res.render("admin/login", { title: "Admin Login", error: null });
};

// Handle login
const postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render("admin/login", {
                title: "Admin Login",
                error: "Please provide email and password"
            });
        }

        // Find user
        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return res.render("admin/login", {
                title: "Admin Login",
                error: "User not found"
            });
        }

        // Check password (simple comparison)
        if (user.password !== password) {
            return res.render("admin/login", {
                title: "Admin Login",
                error: "Wrong password"
            });
        }

        // Create session
        req.session.admin = { id: user._id, name: user.name, email: user.email };
        res.redirect("/admin");
    } catch (err) {
        console.error("Login error:", err);
        res.render("admin/login", { title: "Admin Login", error: "Server error: " + err.message });
    }
};

// Show register page
const getRegister = (req, res) => {
    if (req.session && req.session.admin) {
        return res.redirect("/admin");
    }
    res.render("admin/register", { title: "Admin Registration", error: null });
};

// Handle register
const postRegister = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password) {
            return res.render("admin/register", {
                title: "Admin Registration",
                error: "Please fill all fields"
            });
        }

        if (password !== confirmPassword) {
            return res.render("admin/register", {
                title: "Admin Registration",
                error: "Passwords do not match"
            });
        }

        // Check if user exists
        const existing = await UserModel.findOne({ email: email });
        if (existing) {
            return res.render("admin/register", {
                title: "Admin Registration",
                error: "Email already registered"
            });
        }

        // Create user
        const user = new UserModel({ name, email, password, isAdmin: true });
        await user.save();

        // Login automatically
        req.session.admin = { id: user._id, name: user.name, email: user.email };
        res.redirect("/admin");
    } catch (err) {
        console.error("Register error:", err);
        res.render("admin/register", { title: "Admin Registration", error: "Server error: " + err.message });
    }
};

// Logout
const logout = (req, res) => {
    req.session.destroy();
    res.redirect("/admin/login");
};

module.exports = { getLogin, postLogin, getRegister, postRegister, logout };
