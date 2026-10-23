document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle & Dropdowns ---
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.main-nav .nav-list');
    // Selecting dropdown toggles using the .dropdown class for consistency with CSS
    const dropdownToggles = document.querySelectorAll('.dropdown > a');

    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);

            // When main nav is toggled, close all active dropdowns
            dropdownToggles.forEach(link => {
                const parentLi = link.parentElement;
                parentLi.classList.remove('dropdown-active');
                link.setAttribute('aria-expanded', 'false');
                const icon = link.querySelector('i');
                if (icon && icon.classList.contains('fa-caret-up')) {
                    icon.classList.replace('fa-caret-up', 'fa-caret-down');
                }
                // Also collapse the dropdown menu via maxHeight
                const dropdownMenu = parentLi.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.style.maxHeight = "0";
                }
            });
        });

        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                const isMobileView = window.innerWidth <= 992;
                const parentLi = link.parentElement;

                // Check if the clicked link is a dropdown parent and we are in mobile view
                if (parentLi.classList.contains('dropdown') && isMobileView) {
                    // Prevent default behavior to allow the dropdown toggle logic (below) to handle the click
                    // This ensures the main nav doesn't close immediately when just opening a sub-menu
                    return;
                }

                // If it's any other link (a regular top-level link, or a sub-link within an open dropdown)
                // and the mobile navigation is active, close the mobile navigation.
                if (navList.classList.contains('active') && isMobileView) {
                    navList.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');

                    // Close all dropdowns
                    dropdownToggles.forEach(dl => {
                        const dlParent = dl.parentElement;
                        dlParent.classList.remove('dropdown-active');
                        dl.setAttribute('aria-expanded', 'false');
                        const icon = dl.querySelector('i');
                        if (icon) {
                            if (icon.classList.contains('fa-caret-up')) {
                                icon.classList.replace('fa-caret-up', 'fa-caret-down');
                            }
                        }
                        const dropdownMenu = dlParent.querySelector('.dropdown-menu');
                        if (dropdownMenu) {
                            dropdownMenu.style.maxHeight = "0"; // Collapse the sub-menu
                        }
                    });
                }
            });
        });
    }

    // Specific logic for dropdown toggles (parent links of dropdowns)
    dropdownToggles.forEach(link => {
        link.setAttribute('aria-expanded', 'false'); // Initial ARIA state

        link.addEventListener('click', (e) => {
            const isMobileView = window.innerWidth <= 992;
            if (isMobileView) {
                const parentLi = link.parentElement; // The <li> element with class 'dropdown'
                const dropdownMenu = parentLi.querySelector('.dropdown-menu');
                const icon = link.querySelector('i');

                if (dropdownMenu) {
                    e.preventDefault(); // Prevent default navigation on mobile dropdown click

                    const isCurrentlyActive = parentLi.classList.contains('dropdown-active');

                    // Close any other open dropdowns before opening a new one
                    dropdownToggles.forEach(otherLink => {
                        const otherParentLi = otherLink.parentElement;
                        if (otherParentLi !== parentLi && otherParentLi.classList.contains('dropdown-active')) {
                            otherParentLi.classList.remove('dropdown-active');
                            otherLink.setAttribute('aria-expanded', 'false');
                            const otherIcon = otherLink.querySelector('i');
                            if (otherIcon && otherIcon.classList.contains('fa-caret-up')) {
                                otherIcon.classList.replace('fa-caret-up', 'fa-caret-down');
                            }
                            const otherDropdownMenu = otherParentLi.querySelector('.dropdown-menu');
                            if (otherDropdownMenu) {
                                otherDropdownMenu.style.maxHeight = "0"; // Explicitly collapse
                            }
                        }
                    });

                    // Toggle the clicked dropdown
                    if (!isCurrentlyActive) {
                        parentLi.classList.add('dropdown-active');
                        link.setAttribute('aria-expanded', 'true');
                        if (icon) {
                            icon.classList.replace('fa-caret-down', 'fa-caret-up');
                        }
                        // Animate opening the dropdown menu
                        dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + "px";
                    } else {
                        parentLi.classList.remove('dropdown-active');
                        link.setAttribute('aria-expanded', 'false');
                        if (icon) {
                            icon.classList.replace('fa-caret-up', 'fa-caret-down');
                        }
                        // Animate closing the dropdown menu
                        dropdownMenu.style.maxHeight = "0";
                    }
                }
            }
        });
    });

    // Close dropdowns and main nav if screen resizes to desktop and they are open
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) { // Desktop view
            document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
                dropdown.classList.remove('show-dropdown');
                dropdown.parentElement.classList.remove('dropdown-active');
                dropdown.style.maxHeight = ""; // Reset inline style to allow CSS to take over
            });
            dropdownToggles.forEach(link => {
                link.setAttribute('aria-expanded', 'false');
                const icon = link.querySelector('i');
                if (icon && icon.classList.contains('fa-caret-up')) {
                    icon.classList.replace('fa-caret-up', 'fa-caret-down');
                }
            });
        }
        // Also ensure main nav closes if resizing from a smaller to larger view
        const isMobileView = window.innerWidth <= 992;
        if (!isMobileView && navList.classList.contains('active')) {
            navList.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });


    // --- Hero Section Animation on Scroll/Load (e.g., for About Us page) ---
    const pageHeroAbout = document.querySelector('.page-hero.about-hero');

    if (pageHeroAbout) {
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        function animateHeroOnScroll() {
            if (isInViewport(pageHeroAbout)) {
                pageHeroAbout.classList.add('in-viewport');
                window.removeEventListener('scroll', animateHeroOnScroll);
            }
        }

        animateHeroOnScroll(); // Check on load
        window.addEventListener('scroll', animateHeroOnScroll); // Check on scroll
    }


    // --- Hero Slider Functionality ---
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    let slideInterval;

    function initializeHeroSlider() {
        if (slides.length === 0) return;

        // Set the initial active slide and dot based on the 'active' class (or default to 0)
        let initialActiveSlideElement = document.querySelector('.hero-slider .slide.active');
        if (initialActiveSlideElement) {
            currentSlideIndex = Array.from(slides).indexOf(initialActiveSlideElement);
            if (currentSlideIndex === -1) currentSlideIndex = 0; // Fallback if somehow not found
        } else {
            currentSlideIndex = 0; // Default to the first slide if none has 'active' initially
        }
        showSlide(currentSlideIndex); // Show the initial slide

        startSlideShow(); // Start automatic sliding

        // Pause on hover
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', stopSlideShow);
            heroSection.addEventListener('mouseleave', startSlideShow);
        }

        // Event listeners for prev/next buttons
        const prevBtn = document.querySelector('.slider-nav.prev');
        const nextBtn = document.querySelector('.slider-nav.next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopSlideShow();
                prevSlide();
                startSlideShow();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopSlideShow();
                nextSlide();
                startSlideShow();
            });
        }

        // Event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopSlideShow();
                const slideIndex = parseInt(dot.dataset.slideIndex || index); // Use data-slide-index if available
                showSlide(slideIndex);
                startSlideShow();
            });
        });
    }

    function showSlide(index) {
        // Hide all slides and remove active class from dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Ensure proper looping for prevSlide (index might be negative)
        const actualIndex = (index + slides.length) % slides.length;

        // Show current slide and activate corresponding dot
        if (slides[actualIndex]) {
            slides[actualIndex].classList.add('active');
        }
        if (dots[actualIndex]) {
            dots[actualIndex].classList.add('active');
        }

        currentSlideIndex = actualIndex;
    }

    function nextSlide() {
        const nextIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }

    function startSlideShow() {
        stopSlideShow(); // Clear any existing interval to prevent multiple intervals running
        slideInterval = setInterval(nextSlide, 5000); // Changes every 5 seconds
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    // Keyboard navigation for slider
    document.addEventListener('keydown', function(e) {
        if (slides.length > 0) { // Only enable if slider exists
            if (e.key === 'ArrowLeft') {
                stopSlideShow();
                prevSlide();
                startSlideShow();
            } else if (e.key === 'ArrowRight') {
                stopSlideShow();
                nextSlide();
                startSlideShow();
            }
        }
    });

    // Call the initialization function for the hero slider on DOM load
    initializeHeroSlider();


    // --- Number Counter Animation ---
    const statsSection = document.querySelector('.school-stats-section');
    if (statsSection) {
        const statValues = statsSection.querySelectorAll('.stat-value');
        let animationTriggered = false;

        const animateCounter = (entry) => {
            if (entry.isIntersecting && !animationTriggered) {
                animationTriggered = true;
                statValues.forEach(statValue => {
                    const target = parseInt(statValue.dataset.target);
                    let current = 0;
                    const duration = 2000;
                    const increment = target / (duration / 16.66); // 16.66ms per frame at 60fps

                    const updateCount = () => {
                        if (current < target) {
                            current += increment;
                            statValue.textContent = Math.ceil(current);
                            requestAnimationFrame(updateCount);
                        } else {
                            statValue.textContent = target;
                        }
                    };
                    requestAnimationFrame(updateCount);
                });
                observer.disconnect(); // Stop observing once animation triggered
            }
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(animateCounter);
        }, {
            threshold: 0.5 // Trigger when 50% of the element is visible
        });

        observer.observe(statsSection);
    }

    // --- Gallery Filtering and Lightbox ---
    const galleryGrid = document.getElementById('galleryGrid');
    const categoryBtns = document.querySelectorAll('.gallery-category-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (galleryGrid && categoryBtns.length > 0 && lightbox && lightboxImg && lightboxCaption && lightboxClose) {
        categoryBtns.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;

                // Remove active class from all buttons and add to the clicked one
                categoryBtns.forEach(btn => btn.classList.remove('active-category'));
                button.classList.add('active-category');

                // Filter gallery items based on category
                Array.from(galleryGrid.children).forEach(item => {
                    if (category === 'all' || item.dataset.category === category) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // Open lightbox when a gallery item is clicked
        galleryGrid.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                const imgSrc = galleryItem.querySelector('img').src;
                const imgAlt = galleryItem.querySelector('img').alt;
                const captionElement = galleryItem.querySelector('.gallery-item-info h4');
                const captionText = captionElement ? captionElement.textContent : imgAlt;

                lightbox.style.display = 'flex'; // Show lightbox
                lightboxImg.src = imgSrc;
                lightboxImg.alt = imgAlt;
                lightboxCaption.textContent = captionText;
                document.body.style.overflow = 'hidden'; // Prevent body scrolling
            }
        });

        // Close lightbox function
        const closeLightbox = () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = ''; // Restore body scrolling
        };

        // Event listeners for closing lightbox
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) { // Close only if clicking on the overlay, not the image
                closeLightbox();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'flex') {
                closeLightbox();
            }
        });
    }

    // --- Leadership Hierarchy Connector Drawing ---
    const leadershipContainer = document.querySelector('.leadership-hierarchy-container');
    const leadershipGrid = document.querySelector('.leadership-grid-hierarchy');
    const svgConnectors = document.querySelector('.leadership-connectors');

    function getElementCenter(element) {
        if (!element || !leadershipContainer) return { x: 0, y: 0 };
        const rect = element.getBoundingClientRect();
        const containerRect = leadershipContainer.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2 - containerRect.left,
            y: rect.top + rect.height / 2 - containerRect.top
        };
    }

    function getElementBottomCenter(element) {
        if (!element || !leadershipContainer) return { x: 0, y: 0 };
        const rect = element.getBoundingClientRect();
        const containerRect = leadershipContainer.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2 - containerRect.left,
            y: rect.bottom - containerRect.top
        };
    }

    function getElementTopCenter(element) {
        if (!element || !leadershipContainer) return { x: 0, y: 0 };
        const rect = element.getBoundingClientRect();
        const containerRect = leadershipContainer.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2 - containerRect.left,
            y: rect.top - containerRect.top
        };
    }

    function drawLeadershipConnectors() {
        // Hide SVG connectors on mobile or if elements are missing
        if (window.innerWidth <= 992 || !svgConnectors || !leadershipGrid || !leadershipContainer) {
            if (svgConnectors) svgConnectors.style.display = 'none';
            return;
        } else {
            if (svgConnectors) svgConnectors.style.display = 'block'; // Show on desktop
        }

        // Get leadership elements
        const headteacher = leadershipGrid.querySelector('[data-role="headteacher"]');
        const deputyAcademics = leadershipGrid.querySelector('[data-role="deputy-academics"]');
        const deputyOther = leadershipGrid.querySelector('[data-role="deputy-other"]');
        const schoolChaplain = leadershipGrid.querySelector('[data-role="school-chaplain"]');
        const schoolStaff = leadershipGrid.querySelector('[data-role="school-staff"]');
        const prefects = leadershipGrid.querySelector('[data-role="prefects"]');

        if (!headteacher || !deputyAcademics || !deputyOther || !schoolChaplain || !schoolStaff || !prefects) {
            console.warn("One or more leadership elements not found for drawing connectors. Connectors will not be drawn.");
            return;
        }

        // Calculate positions
        const htBottom = getElementBottomCenter(headteacher);
        const depAcademicsTop = getElementTopCenter(deputyAcademics);
        const depOtherTop = getElementTopCenter(deputyOther);
        const chaplainTop = getElementTopCenter(schoolChaplain);
        const chaplainBottom = getElementBottomCenter(schoolChaplain);
        const staffTop = getElementTopCenter(schoolStaff);
        const staffBottom = getElementBottomCenter(schoolStaff);
        const prefectsTop = getElementTopCenter(prefects);

        const commonDeputiesY = Math.min(depAcademicsTop.y, depOtherTop.y) - 30; // Horizontal line for deputies
        const htConnectY = htBottom.y + 30; // Vertical line from headteacher

        // Update SVG paths
        const path1 = document.getElementById('path-ht-deputy-academics');
        if (path1) {
            path1.setAttribute('d', `M ${htBottom.x} ${htBottom.y} V ${htConnectY} H ${depAcademicsTop.x} V ${depAcademicsTop.y}`);
        }

        const path2 = document.getElementById('path-ht-deputy-other');
        if (path2) {
            path2.setAttribute('d', `M ${htBottom.x} ${htBottom.y} V ${htConnectY} H ${depOtherTop.x} V ${depOtherTop.y}`);
        }

        const centralLineFromHT = document.getElementById('path-ht-center-deputies');
        if (centralLineFromHT) {
            centralLineFromHT.setAttribute('d', `M ${htBottom.x} ${htConnectY} V ${commonDeputiesY}`);
        }

        const horizontalLineDeputies = document.getElementById('path-deputies-horizontal');
        if (horizontalLineDeputies) {
            horizontalLineDeputies.setAttribute('d', `M ${depAcademicsTop.x} ${commonDeputiesY} H ${depOtherTop.x}`);
        }

        const path3 = document.getElementById('path-deputies-chaplain');
        if (path3) {
            path3.setAttribute('d', `M ${htBottom.x} ${commonDeputiesY} V ${chaplainTop.y}`);
        }

        const path4 = document.getElementById('path-chaplain-staff');
        if (path4) {
            path4.setAttribute('d', `M ${chaplainBottom.x} ${chaplainBottom.y} V ${staffTop.y}`);
        }

        const path5 = document.getElementById('path-staff-prefects');
        if (path5) {
            path5.setAttribute('d', `M ${staffBottom.x} ${staffBottom.y} V ${prefectsTop.y}`);
        }

        // Resize SVG viewport
        const containerRect = leadershipContainer.getBoundingClientRect();
        svgConnectors.setAttribute('width', containerRect.width);
        svgConnectors.setAttribute('height', containerRect.height);
        svgConnectors.setAttribute('viewBox', `0 0 ${containerRect.width} ${containerRect.height}`);
    }

    if (leadershipContainer && leadershipGrid && svgConnectors) {
        drawLeadershipConnectors(); // Draw on load
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(drawLeadershipConnectors, 250); // Redraw after resize
        });
    }

    // --- Floating Chat Window ---
    const chatToggle = document.querySelector('.chat-toggle');
    const chatWindow = document.querySelector('.chat-window');
    const chatClose = document.querySelector('.chat-close');

    if (chatToggle && chatWindow && chatClose) {
        chatToggle.addEventListener('click', function() {
            chatWindow.classList.toggle('open');
        });

        chatClose.addEventListener('click', function() {
            chatWindow.classList.remove('open');
        });

        // Close chat window if clicking outside of it
        document.addEventListener('click', function(event) {
            if (!chatWindow.contains(event.target) && !chatToggle.contains(event.target) && chatWindow.classList.contains('open')) {
                chatWindow.classList.remove('open');
            }
        });
    }

    // --- Highlight Active Navigation Link ---
    // Get the current page path (e.g., "index.html", "about.html")
    const currentPagePath = window.location.pathname.split('/').pop() || 'index.html'; // Default to index.html if root

    // Select all main navigation links
    const navLinks = document.querySelectorAll('.main-nav .nav-list a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();

        // Check if the link's path matches the current page's path
        if (currentPagePath === linkPath || (currentPagePath === '' && linkPath === 'index.html')) { // Handles root/index.html
            link.classList.add('active'); // Add 'active' class to the link

            // If this active link is inside a dropdown, also highlight its parent dropdown link
            let parentDropdownLi = link.closest('li.dropdown'); // Using .dropdown class here
            if (parentDropdownLi) {
                const parentDropdownLink = parentDropdownLi.querySelector('a');
                if (parentDropdownLink) {
                    parentDropdownLink.classList.add('active');
                }
            }
        } else {
            link.classList.remove('active'); // Ensure other links are not active
        }
    });

    // --- Testimonial Pop-in Animation on Scroll ---
    const testimonialItems = document.querySelectorAll('.testimonials-section .testimonial-item');

    // Check if there are testimonial items to observe
    if (testimonialItems.length > 0) {
        const observerOptions = {
            root: null, // relative to the viewport
            rootMargin: '0px',
            threshold: 0.1 // trigger when 10% of the item is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add 'animate' class when element enters viewport
                    // Apply a staggered delay based on the index
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                    entry.target.classList.add('animate');
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        testimonialItems.forEach(item => {
            observer.observe(item);
        });
    }

});

// --- Header scroll effect (add 'scrolled' class) ---
window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    if (header) {
        if (window.scrollY > 50) { // Adjust scroll threshold as needed
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});
