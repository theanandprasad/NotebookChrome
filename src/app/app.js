document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    console.log('App initialized');

    // Handle navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            navItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
            // TODO: Handle navigation/routing
        });
    });
}); 