
$(document).ready(function() {
    const apiURL = "https://fakestoreapi.com/products";


    $.ajax({
        url: apiURL,
        method: "GET",
        success: function(response) {
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
