const API_URL = "https://jsonplaceholder.typicode.com/posts";

$(function () {
    loadPosts();

    // Event Listeners
    $("#savePostBtn").click(createPost);
    $("#updatePostBtn").click(updatePost);
    $("#postsList").on("click", ".btn-delete", deletePost);
    $("#postsList").on("click", ".btn-edit", openEditModal);
});

// Helper to show bootstrap alerts
function showAlert(message, type = "success") {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    $("#alertContainer").html(alertHtml);
    // Auto dismiss after 3 seconds
    setTimeout(() => {
        $(".alert").alert("close");
    }, 3000);
}

// 1. READ
function loadPosts() {
    $("#loading").show();
    $("#postsList").empty();

    $.ajax({
        url: API_URL,
        method: "GET",
        success: function (posts) {
            $("#loading").hide();
            // Limit to 12 posts for cleaner UI
            const displayPosts = posts.slice(0, 12);

            displayPosts.forEach(post => {
                appendPostToDOM(post);
            });
        },
        error: function () {
            $("#loading").hide();
            showAlert("Failed to fetch posts", "danger");
        },
    });
}

function appendPostToDOM(post) {
    const postHtml = `
    <div class="col-md-4 mb-4 post-item" data-id="${post.id}">
        <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${post.body}</p>
            </div>
            <div class="card-footer bg-transparent border-top-0 d-flex justify-content-end">
                <button class="btn btn-sm btn-outline-warning btn-edit me-2">Edit</button>
                <button class="btn btn-sm btn-outline-danger btn-delete">Delete</button>
            </div>
        </div>
    </div>
  `;
    $("#postsList").append(postHtml);
}

// 2. CREATE
function createPost() {
    const title = $("#addTitle").val().trim();
    const body = $("#addBody").val().trim();

    if (!title || !body) {
        showAlert("Please fill in all fields", "warning");
        return;
    }

    // Show loading state on button
    const startBtnText = $("#savePostBtn").text();
    $("#savePostBtn").text("Saving...").prop("disabled", true);

    $.ajax({
        url: API_URL,
        method: "POST",
        data: JSON.stringify({
            title: title,
            body: body,
            userId: 1, // Fake userId
        }),
        contentType: "application/json; charset=UTF-8",
        success: function (response) {
            const newPost = {
                id: response.id || 101, // Fallback
                title: response.title,
                body: response.body
            };

            const postHtml = `
      <div class="col-md-4 mb-4 post-item" data-id="${newPost.id}">
          <div class="card h-100 border-success">
              <div class="card-body">
                  <h5 class="card-title">${newPost.title} <span class="badge bg-success">New</span></h5>
                  <p class="card-text">${newPost.body}</p>
              </div>
              <div class="card-footer bg-transparent border-top-0 d-flex justify-content-end">
                  <button class="btn btn-sm btn-outline-warning btn-edit me-2">Edit</button>
                  <button class="btn btn-sm btn-outline-danger btn-delete">Delete</button>
              </div>
          </div>
      </div>
      `;
            $("#postsList").prepend(postHtml);

            $("#addTitle").val("");
            $("#addBody").val("");
            $("#addModal").modal("hide");
            showAlert("Post created successfully!");
        },
        error: function () {
            showAlert("Error creating post", "danger");
        },
        complete: function () {
            $("#savePostBtn").text(startBtnText).prop("disabled", false);
        }
    });
}

// 3. EDIT (Prepare Modal)
function openEditModal() {
    const btn = $(this);
    const card = btn.closest(".post-item");
    const id = card.data("id");
    const title = card.find(".card-title").text().replace("New", "").trim();
    const body = card.find(".card-text").text();

    $("#editId").val(id);
    $("#editTitle").val(title);
    $("#editBody").val(body);

    $("#editModal").modal("show");
}

// 4. UPDATE
function updatePost() {
    const id = $("#editId").val();
    const title = $("#editTitle").val();
    const body = $("#editBody").val();

    const startBtnText = $("#updatePostBtn").text();
    $("#updatePostBtn").text("Updating...").prop("disabled", true);

    $.ajax({
        url: `${API_URL}/${id}`,
        method: "PUT",
        data: JSON.stringify({
            id: id,
            title: title,
            body: body,
            userId: 1,
        }),
        contentType: "application/json; charset=UTF-8",
        success: function (response) {
            const card = $(`.post-item[data-id="${id}"]`);
            card.find(".card-title").text(title);
            card.find(".card-text").text(body);

            $("#editModal").modal("hide");
            showAlert("Post updated successfully!");
        },
        error: function () {
            showAlert("Error updating post", "warning");
        },
        complete: function () {
            $("#updatePostBtn").text(startBtnText).prop("disabled", false);
        }
    });
}

// 5. DELETE
function deletePost() {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const btn = $(this);
    const card = btn.closest(".post-item");
    const id = card.data("id");

    $.ajax({
        url: `${API_URL}/${id}`,
        method: "DELETE",
        success: function () {
            card.fadeOut(300, function () {
                $(this).remove();
            });
            showAlert("Post deleted successfully!");
        },
        error: function () {
            showAlert("Error deleting post", "danger");
        }
    });
}
