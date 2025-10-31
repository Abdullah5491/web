# Assignment 2 — Single Page CRUD Application

## 📋 Project Overview

A fully-functional single-page CRUD (Create, Read, Update, Delete) application built with **jQuery**, **Bootstrap 5**, and **JSONPlaceholder REST API**. This application manages blog posts with complete CRUD operations without any page reloads.

## 🎯 Features

### ✅ Complete CRUD Operations
- **CREATE**: Add new posts with title, content, and user ID
- **READ**: Display all posts in a beautiful card layout
- **UPDATE**: Edit existing posts with form prefill
- **DELETE**: Remove posts with confirmation dialog

### ✅ Technical Implementation
- **jQuery AJAX**: All API calls use `$.ajax()` with proper headers
- **Bootstrap 5**: Modern, responsive UI with gradient design
- **No Page Reloads**: Everything updates dynamically
- **Loading States**: Full-screen overlay with spinner
- **Toast Notifications**: Success, error, warning, and info messages
- **Error Handling**: Graceful handling of API failures
- **Input Validation**: Client-side form validation
- **XSS Protection**: HTML escaping for security

## 🚀 How to Run

1. **Open the Application**
   ```
   Simply open `crud-app.html` in any modern web browser
   ```

2. **No Server Required**
   - Self-contained HTML file
   - Uses CDN for libraries (jQuery, Bootstrap)
   - Works offline after first load

## 🧪 Testing Guide

### 1️⃣ READ - View Posts

**Steps:**
1. Open `crud-app.html` in your browser
2. Wait for posts to load automatically
3. See 20 posts displayed in card format

**Expected Result:**
- ✅ Loading spinner appears
- ✅ Posts load successfully
- ✅ Blue info toast shows "Loaded 20 posts successfully!"
- ✅ Total Posts counter updates
- ✅ API Status shows green checkmark

**What to Check:**
- Each post card shows:
  - Post ID (badge in top-right corner)
  - Title
  - Content/Body
  - User ID badge
  - Edit and Delete buttons
- Posts are scrollable

---

### 2️⃣ CREATE - Add New Post

**Steps:**
1. Click "Create New Post" button (top-right)
2. Fill in the form:
   - **Title**: "My Test Post"
   - **Content**: "This is a test post created via jQuery AJAX"
   - **User ID**: 5
3. Click "Create Post" button

**Expected Result:**
- ✅ Loading spinner appears briefly
- ✅ Green success toast: "Post created successfully!"
- ✅ New post appears at the TOP of the list
- ✅ Post has ID #101
- ✅ Form resets automatically
- ✅ Total Posts counter increases
- ✅ Last Action shows "Created"

**What to Check:**
- New post displays with correct title, content, and user ID
- Post appears at the top (most recent first)
- Form is cleared after submission
- No page reload occurred

---

### 3️⃣ UPDATE - Edit Existing Post

**Steps:**
1. Scroll through posts and find any post (e.g., Post #1)
2. Click the "Edit" button on that post
3. Observe the form:
   - Title pre-fills with post title
   - Content pre-fills with post body
   - User ID pre-fills with post's userId
   - Button changes to "Update Post" (yellow)
   - "Cancel Edit" button appears
   - Form title shows "Edit Post #1"
4. Modify the content:
   - Change title to: "Updated Post Title"
   - Change content to: "This post has been updated via jQuery AJAX"
5. Click "Update Post"

**Expected Result:**
- ✅ Blue info toast: "Edit Mode - Modify the post..."
- ✅ Page scrolls to form automatically
- ✅ Form pre-fills with existing data
- ✅ Loading spinner appears during update
- ✅ Green success toast: "Post updated successfully!"
- ✅ Post updates in the list with new content
- ✅ Form resets to "Create" mode
- ✅ Last Action shows "Updated"

**What to Check:**
- Updated post shows new title and content
- Post stays in same position (doesn't move)
- Form returns to create mode
- No page reload occurred

**Test Cancel:**
- Click "Edit" on a post
- Click "Cancel Edit" button
- Form should reset without saving changes

---

### 4️⃣ DELETE - Remove Post

**Steps:**
1. Find any post in the list
2. Click the red "Delete" button
3. A confirmation dialog appears
4. Click "OK" to confirm

**Expected Result:**
- ✅ Confirmation dialog: "Are you sure you want to delete this post?"
- ✅ Loading spinner appears
- ✅ Green success toast: "Post deleted successfully!"
- ✅ Post disappears from the list immediately
- ✅ Total Posts counter decreases
- ✅ Last Action shows "Deleted"

**What to Check:**
- Post is removed from display
- Remaining posts shift up
- No page reload occurred

**Test Cancel:**
- Click "Delete" on a post
- Click "Cancel" in confirmation dialog
- Post should remain in the list

---

### 5️⃣ Refresh Posts

**Steps:**
1. Click the "Refresh" button (top-right of posts section)

**Expected Result:**
- ✅ Loading spinner appears
- ✅ Posts reload from API
- ✅ Blue info toast: "Loaded 20 posts successfully!"
- ✅ Any locally created/edited posts are replaced with API data

---

### 6️⃣ Form Validation

**Test Empty Fields:**
1. Click "Create New Post"
2. Leave all fields empty
3. Click "Create Post"

**Expected Result:**
- ✅ Yellow warning toast: "Please fill in all required fields"
- ✅ No API call made

**Test Invalid User ID:**
1. Enter title and content
2. Enter User ID: 15 (out of range)
3. Click "Create Post"

**Expected Result:**
- ✅ Yellow warning toast: "User ID must be between 1 and 10"

---

### 7️⃣ Error Handling

**Test Network Error:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Set throttling to "Offline"
4. Click "Refresh" button

**Expected Result:**
- ✅ Loading spinner appears
- ✅ Red error toast: "Failed to load posts: [error]"
- ✅ API Status shows red X

---

### 8️⃣ Loading States

**What to Check:**
- Every API call shows the loading overlay
- Spinner is centered on screen
- "Loading..." text is visible
- Background is semi-transparent dark
- Spinner disappears after API response

---

### 9️⃣ Toast Notifications

**Types to Test:**
- 🟢 **Success** (Green): Post created, updated, deleted
- 🔵 **Info** (Blue): Posts loaded, edit mode activated
- 🟡 **Warning** (Yellow): Validation errors
- 🔴 **Error** (Red): API failures

**What to Check:**
- Toasts appear in top-right corner
- Auto-dismiss after 4 seconds
- Can manually close with X button
- Multiple toasts stack vertically
- Icons match message type

---

### 🔟 Responsive Design

**Desktop View:**
- Form on left (5 columns)
- Posts on right (7 columns)

**Mobile View:**
- Form stacks above posts
- Full-width layout
- Touch-friendly buttons

**Test:**
1. Resize browser window
2. Check on mobile device
3. All features should work

---

## 📊 Statistics Dashboard

The app displays real-time statistics:
- **Total Posts**: Count of loaded posts
- **API Status**: Green ✓ or Red ✗
- **Last Action**: Created, Updated, Deleted, Loaded

---

## 🛠️ Technical Details

### API Endpoints

```javascript
Base URL: https://jsonplaceholder.typicode.com/posts

GET    /posts          // Read all posts
POST   /posts          // Create new post
PUT    /posts/:id      // Update post
DELETE /posts/:id      // Delete post
```

### jQuery AJAX Example

```javascript
// CREATE
$.ajax({
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'POST',
    data: JSON.stringify({ title, body, userId }),
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    success: function(response) { /* handle success */ },
    error: function(xhr, status, error) { /* handle error */ }
});
```

### Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with gradients and animations
- **Bootstrap 5.3.0** - UI framework
- **jQuery 3.7.1** - DOM manipulation and AJAX
- **Bootstrap Icons** - Icon library
- **JSONPlaceholder** - Fake REST API for testing

### Key Features

✅ **Single Page Application** - No page reloads  
✅ **RESTful API** - Proper HTTP methods (GET, POST, PUT, DELETE)  
✅ **Error Handling** - Try-catch and AJAX error callbacks  
✅ **Loading States** - Visual feedback during operations  
✅ **Toast Notifications** - Non-intrusive alerts  
✅ **Form Validation** - Client-side input checking  
✅ **Responsive Design** - Mobile-friendly layout  
✅ **XSS Protection** - HTML escaping  
✅ **Modern UI** - Gradient design with animations  
✅ **Smooth Scrolling** - Auto-scroll to form on edit  

---

## 📁 File Structure

```
crud-app.html (Single file containing everything)
├── HTML Structure
│   ├── Loading Overlay
│   ├── Toast Container
│   ├── Header Section
│   ├── Statistics Cards
│   ├── Form Section (Create/Update)
│   └── Posts List Section
│
├── CSS Styles (Embedded)
│   ├── Gradient backgrounds
│   ├── Card designs
│   ├── Animations
│   └── Responsive layout
│
└── JavaScript (jQuery)
    ├── CRUD Functions
    │   ├── createPost()
    │   ├── loadPosts()
    │   ├── updatePost()
    │   └── deletePost()
    ├── UI Functions
    │   ├── renderPosts()
    │   ├── editPost()
    │   ├── resetForm()
    │   ├── showLoading()
    │   └── showToast()
    └── Utilities
        ├── escapeHtml()
        └── updateStats()
```

---

## 🎨 UI Highlights

- **Purple Gradient Theme** (#667eea → #764ba2)
- **Card-Based Layout** - Modern, clean design
- **Hover Effects** - Interactive feedback
- **Smooth Animations** - Polished transitions
- **Custom Scrollbars** - Styled overflow areas
- **Glass-Morphism** - Loading overlay effect

---

## 📝 Assignment Requirements Checklist

### 1. Free REST API ✅
- [x] Using JSONPlaceholder
- [x] All endpoints working (GET, POST, PUT, DELETE)

### 2. CRUD Features ✅
- [x] **Read**: Display posts in Bootstrap cards
- [x] **Create**: Form to add new post, appends to list
- [x] **Update**: Edit button, prefills form, updates list
- [x] **Delete**: Delete button, confirmation, removes from list

### 3. Technical Requirements ✅
- [x] Bootstrap 5 for layout and styling
- [x] jQuery AJAX for all API calls
- [x] Success & error handling with toasts
- [x] Loading state with spinner
- [x] No page reloads - fully dynamic

---

## 🐛 Known Behaviors (JSONPlaceholder Limitations)

**Important:** JSONPlaceholder is a fake API for testing:

1. **New Posts**: Get ID #101 (fake ID)
2. **Updates**: Succeed but don't persist on server
3. **Deletes**: Succeed but don't actually remove from database
4. **Refresh**: Reloads original data from API

This is normal behavior for testing. In a real application, changes would persist.

---

## 🚀 Next Steps / Enhancements

Possible improvements:
- [ ] Search/filter functionality
- [ ] Pagination for large datasets
- [ ] Sort by date, title, or user
- [ ] User authentication
- [ ] Rich text editor
- [ ] Image upload
- [ ] Comments system
- [ ] Like/favorite posts
- [ ] Export data (CSV, JSON)
- [ ] Dark mode toggle

---

## 📞 Support

If you encounter any issues:
1. Check browser console (F12) for errors
2. Verify internet connection
3. Try refreshing the page
4. Clear browser cache

---

## 📄 License

This is an educational project for Web Development Lab Assignment 2.

---

## ✨ Credits

- **API**: [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
- **UI Framework**: [Bootstrap 5](https://getbootstrap.com/)
- **JavaScript Library**: [jQuery](https://jquery.com/)
- **Icons**: [Bootstrap Icons](https://icons.getbootstrap.com/)
- **Fonts**: [Google Fonts - Raleway](https://fonts.google.com/)

---

**Made with ❤️ using jQuery + Bootstrap + REST API**

**Happy Testing! 🎉**

