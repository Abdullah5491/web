const ProductModel = require("../models/product.model");
const connectDB = require("../config/database");

const seedProducts = async () => {
    await connectDB();

    const count = await ProductModel.countDocuments();
    if (count === 0) {
        const products = [
            { name: "Slogans & Phrases", price: 150, category: "Creative", image: "/images/home_copywriter_pic1.png", description: "Catchy slogans aimed to capture attention." },
            { name: "SEO Article", price: 200, category: "Marketing", image: "/images/home_copywriter_pic1.png", description: "Optimized articles to rank high on search engines." },
            { name: "Short Story", price: 100, category: "Creative", image: "/images/home_copywriter_pic1.png", description: "Engaging short stories for your audience." },
            { name: "Technical Blog", price: 250, category: "Technical", image: "/images/home_copywriter_pic1.png", description: "In-depth technical content for experts." },
            { name: "Social Media Post", price: 50, category: "Marketing", image: "/images/home_copywriter_pic1.png", description: "Viral content for social platforms." },
            { name: "Product Description", price: 80, category: "E-commerce", image: "/images/home_copywriter_pic1.png", description: "Compelling descriptions to boost sales." },
            { name: "Email Newsletter", price: 120, category: "Marketing", image: "/images/home_copywriter_pic1.png", description: "Newsletters that drive conversions." },
            { name: "White Paper", price: 500, category: "Technical", image: "/images/home_copywriter_pic1.png", description: "Authoritative reports on complex issues." }
        ];
        await ProductModel.insertMany(products);
        console.log("Database seeded with sample products.");
    } else {
        console.log("Database already contains products. Skipping seed.");
    }

    process.exit(0);
};

seedProducts();
