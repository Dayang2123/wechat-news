// Basic JS for potential future use, like active link highlighting in sidebar

document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.sidebar-nav ul li a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // You can add more global JavaScript interactions here
    console.log("Main JavaScript file loaded.");
});
