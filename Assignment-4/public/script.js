
$(document).ready(function() {
    // Example API endpoint (replace with yours)
    const apiURL = "https://fakestoreapi.com/products";


    $.ajax({
        url: apiURL,
        method: "GET",
        success: function(response) {
            // assuming response is an array of products
            renderProducts(response);
        },
        error: function(error) {
            console.error("Error fetching products:", error);
        }
    });

    function renderProducts(products) {
        let productHTML = "";

        products.forEach(product => {
            productHTML += `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <span class="price">$${product.price}</span>
                    <button class="add-to-cart">Add to Cart</button>
                </div>
            `;
        });

        $("#product-list").html(productHTML);
    }
});
