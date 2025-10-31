// Year Sidebar Navigation
document.addEventListener('DOMContentLoaded', function() {
    const yearLinks = document.querySelectorAll('.year-link');
    const yearSections = document.querySelectorAll('h2[id^="year-"]');
    
    if (yearLinks.length === 0 || yearSections.length === 0) {
        return; // Exit if no year sidebar on this page
    }
    
    // Smooth scrolling for year links
    yearLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const offset = 20; // Additional spacing
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state
                updateActiveYear(this);
            }
        });
    });
    
    // Update active year based on scroll position
    function updateActiveYear(clickedLink = null) {
        if (clickedLink) {
            yearLinks.forEach(link => link.classList.remove('active'));
            clickedLink.classList.add('active');
            return;
        }
        
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const scrollPosition = window.scrollY + navbarHeight + 100;
        
        let currentYear = null;
        yearSections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollPosition >= sectionTop) {
                currentYear = section.getAttribute('id');
            }
        });
        
        yearLinks.forEach(link => {
            const linkTarget = link.getAttribute('href').substring(1);
            if (linkTarget === currentYear) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Throttle scroll events for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(function() {
            updateActiveYear();
        });
    });
    
    // Initialize active state on page load
    updateActiveYear();
});
