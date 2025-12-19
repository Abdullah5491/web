try {
    require('./admin/routes');
    console.log('Admin routes loaded successfully');
} catch (err) {
    console.error('Error loading admin routes:', err.message);
    console.error(err.stack);
}
