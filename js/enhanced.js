/* Enhanced JavaScript for ADAC Fahrschule+ Website */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.mobile-menu-btn') && !event.target.closest('.nav-menu')) {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                    }
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const answer = this.nextElementSibling;
                const isOpen = answer.style.maxHeight;
                
                // Close all other answers
                document.querySelectorAll('.faq-answer').forEach(item => {
                    item.style.maxHeight = null;
                });
                
                // Toggle current answer
                if (!isOpen) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
        
        // Open first FAQ by default
        if (faqQuestions[0]) {
            const firstAnswer = faqQuestions[0].nextElementSibling;
            firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
        }
    }
    
    // Form validation
    const forms = document.querySelectorAll('form');
    
    if (forms.length > 0) {
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Simple validation
                let valid = true;
                const requiredFields = form.querySelectorAll('[required]');
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        valid = false;
                        field.classList.add('error');
                    } else {
                        field.classList.remove('error');
                    }
                });
                
                // Email validation
                const emailField = form.querySelector('input[type="email"]');
                if (emailField && emailField.value.trim()) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(emailField.value.trim())) {
                        valid = false;
                        emailField.classList.add('error');
                    }
                }
                
                if (valid) {
                    // In a real implementation, this would send the form data to a server
                    const formType = form.closest('.contact-form') ? 'contact' : 
                                    form.closest('.registration-form') ? 'registration' : 
                                    form.closest('.application-form') ? 'application' : 'general';
                    
                    let successMessage = 'Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.';
                    
                    if (formType === 'registration') {
                        successMessage = 'Vielen Dank für Ihre Anmeldung! Wir werden uns in Kürze bei Ihnen melden, um die nächsten Schritte zu besprechen.';
                    } else if (formType === 'application') {
                        successMessage = 'Vielen Dank für Ihr Interesse an unserem Franchisemodell! Unser Team wird sich in Kürze mit Ihnen in Verbindung setzen.';
                    }
                    
                    alert(successMessage);
                    form.reset();
                } else {
                    alert('Bitte füllen Sie alle erforderlichen Felder korrekt aus.');
                }
            });
        });
    }
    
    // Location finder functionality
    const locationSearch = document.getElementById('location-search');
    const locationSearchBtn = locationSearch ? locationSearch.nextElementSibling : null;
    
    if (locationSearchBtn) {
        locationSearchBtn.addEventListener('click', function() {
            const searchValue = locationSearch.value.trim();
            if (searchValue) {
                // In a real implementation, this would search for locations
                alert('Suche nach Standorten in der Nähe von: ' + searchValue);
                // For demo purposes, we could update the map iframe with a new location
                const mapIframe = document.querySelector('.location-map iframe');
                if (mapIframe) {
                    // This would be replaced with actual location data in a real implementation
                    mapIframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.654394318325!2d13.383906376929055!3d52.531268072089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851e1f06a8701%3A0x2df7a4d1f4d40de!2sInvalidenstra%C3%9Fe%2057%2C%2010115%20Berlin!5e0!3m2!1sde!2sde!4v1616682567619!5m2!1sde!2sde';
                }
            } else {
                alert('Bitte geben Sie eine PLZ oder einen Ort ein.');
            }
        });
    }
    
    // Scroll animations
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.section-title, .feature-card, .simulator-content, .testimonial-card, .news-card, .model-card, .benefit-card, .quality-card, .step, .value-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };
    
    // Add visible class for initial elements in viewport
    animateOnScroll();
    
    // Listen for scroll events
    window.addEventListener('scroll', animateOnScroll);
    
    // Testimonial carousel (if multiple testimonials)
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    if (testimonialCarousel) {
        const testimonials = testimonialCarousel.querySelectorAll('.testimonial-card');
        const totalTestimonials = testimonials.length;
        let currentTestimonial = 0;
        
        // Create navigation dots
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';
        
        for (let i = 0; i < totalTestimonials; i++) {
            const dot = document.createElement('span');
            dot.className = i === 0 ? 'dot active' : 'dot';
            dot.dataset.index = i;
            dotsContainer.appendChild(dot);
        }
        
        testimonialCarousel.appendChild(dotsContainer);
        
        // Add click event to dots
        dotsContainer.querySelectorAll('.dot').forEach(dot => {
            dot.addEventListener('click', function() {
                currentTestimonial = parseInt(this.dataset.index);
                updateCarousel();
            });
        });
        
        // Function to update carousel
        const updateCarousel = function() {
            testimonials.forEach((testimonial, index) => {
                testimonial.style.display = index === currentTestimonial ? 'block' : 'none';
            });
            
            dotsContainer.querySelectorAll('.dot').forEach((dot, index) => {
                dot.className = index === currentTestimonial ? 'dot active' : 'dot';
            });
        };
        
        // Auto-rotate testimonials
        setInterval(function() {
            currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
            updateCarousel();
        }, 5000);
        
        // Initialize carousel
        updateCarousel();
    }
    
    // Add CSS class to body based on current page
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage) {
        document.body.classList.add('page-' + currentPage.replace('.html', ''));
    } else {
        document.body.classList.add('page-home');
    }
    
    // Initialize any third-party libraries or widgets
    // This would be where you'd initialize things like Google Maps, charts, etc.
    
    console.log('ADAC Fahrschule+ website initialized successfully');
});
