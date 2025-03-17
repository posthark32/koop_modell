/* ADAC Fahrschule+ erweiterte JavaScript-Funktionen */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.mobile-menu-btn') && !event.target.closest('.nav-menu')) {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            }
        }
    });
    
    // Smooth scrolling für Anker-Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Mobile Menu schließen, falls geöffnet
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        if (mobileMenuBtn) {
                            mobileMenuBtn.setAttribute('aria-expanded', 'false');
                        }
                    }
                    
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Animierte Zahlen in Statistik-Bereichen
    const animateNumbers = function() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const targetValue = parseInt(stat.getAttribute('data-count'));
            const duration = 2000; // Animationsdauer in Millisekunden
            const startTime = performance.now();
            let currentValue = 0;
            
            const updateNumber = function(timestamp) {
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutQuad(progress);
                
                currentValue = Math.floor(targetValue * easedProgress);
                stat.textContent = currentValue;
                
                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = targetValue;
                }
            };
            
            requestAnimationFrame(updateNumber);
        });
    };
    
    // Easing-Funktion für sanftere Animation
    function easeOutQuad(t) {
        return t * (2 - t);
    }
    
    // Observer für Statistik-Bereich
    const statsSection = document.querySelector('.success-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(statsSection);
    }
    
    // Interaktive Feature-Karten umdrehen
    const featureCards = document.querySelectorAll('.feature-card.interactive');
    featureCards.forEach(card => {
        const frontCta = card.querySelector('.feature-cta');
        const backButton = card.querySelector('.feature-back .btn');
        
        if (frontCta) {
            frontCta.addEventListener('click', function(e) {
                e.stopPropagation();
                card.classList.add('flipped');
            });
        }
        
        if (backButton) {
            backButton.addEventListener('click', function(e) {
                e.stopPropagation(); // Verhindern, dass Card-Klick ausgelöst wird
            });
        }
        
        // Zurück zur Vorderseite bei Klick außerhalb des Buttons
        card.addEventListener('click', function() {
            if (card.classList.contains('flipped')) {
                card.classList.remove('flipped');
            } else {
                card.classList.add('flipped');
            }
        });
    });
    
    // Tab-Navigation für Testimonials und FAQ
    const initTabs = function(tabContainer) {
        if (!tabContainer) return;
        
        const tabButtons = tabContainer.querySelectorAll('.tab-btn');
        const tabContents = tabContainer.querySelectorAll('.tab-pane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Aktive Klasse von allen Buttons entfernen
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                
                // Aktive Klasse auf den geklickten Button setzen
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                
                // Tab-Inhalt anzeigen
                const tabId = this.getAttribute('data-tab') + '-tab';
                
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    content.setAttribute('aria-hidden', 'true');
                });
                
                const activeContent = document.getElementById(tabId);
                if (activeContent) {
                    activeContent.classList.add('active');
                    activeContent.setAttribute('aria-hidden', 'false');
                }
            });
        });
    };
    
    initTabs(document.querySelector('.testimonial-tabs'));
    initTabs(document.querySelector('.faq-tabs'));
    
    // FAQ Accordion-Funktion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('.faq-toggle i');
        
        // Erstes FAQ-Element standardmäßig öffnen
        if (item === faqItems[0]) {
            item.classList.add('active');
            answer.classList.add('active');
            icon.classList.remove('fa-plus');
            icon.classList.add('fa-minus');
        }
        
        question.addEventListener('click', function() {
            const isOpen = item.classList.contains('active');
            
            // Alle anderen schließen (optional)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').classList.remove('active');
                    const otherIcon = otherItem.querySelector('.faq-toggle i');
                    otherIcon.classList.remove('fa-minus');
                    otherIcon.classList.add('fa-plus');
                }
            });
            
            // Aktuelles Element umschalten
            item.classList.toggle('active');
            answer.classList.toggle('active');
            
            if (isOpen) {
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            } else {
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            }
        });
    });
    
    // Simulator-Hotspots Interaktivität
    const hotspots = document.querySelectorAll('.hotspot');
    
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', function() {
            // Andere Hotspots deaktivieren
            hotspots.forEach(spot => {
                if (spot !== hotspot) {
                    spot.classList.remove('active');
                }
            });
            
            // Aktuellen Hotspot umschalten
            this.classList.toggle('active');
        });
    });
    
    // Video-Modal
    const videoTrigger = document.querySelector('.simulator-video-trigger a');
    const videoModal = document.getElementById('video-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (videoTrigger && videoModal) {
        videoTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeModal.addEventListener('click', function() {
            videoModal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Schließen durch Klick außerhalb des Inhalts
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                videoModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Schließen mit ESC-Taste
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                videoModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // News-Slider Navigation
    const newsGrid = document.querySelector('.news-grid');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    if (newsGrid && prevBtn && nextBtn) {
        const cardWidth = newsGrid.querySelector('.news-card').offsetWidth + 30; // Karte + Abstand
        const visibleCards = Math.floor(newsGrid.offsetWidth / cardWidth);
        
        prevBtn.addEventListener('click', function() {
            newsGrid.scrollBy({
                left: -cardWidth * visibleCards,
                behavior: 'smooth'
            });
        });
        
        nextBtn.addEventListener('click', function() {
            newsGrid.scrollBy({
                left: cardWidth * visibleCards,
                behavior: 'smooth'
            });
        });
        
        // Buttons je nach Scroll-Position ein-/ausblenden
        newsGrid.addEventListener('scroll', function() {
            prevBtn.style.opacity = newsGrid.scrollLeft > 0 ? '1' : '0.5';
            nextBtn.style.opacity = newsGrid.scrollLeft < (newsGrid.scrollWidth - newsGrid.offsetWidth - 5) ? '1' : '0.5';
        });
        
        // Initial Button-Status setzen
        prevBtn.style.opacity = '0.5';
    }
    
    // Cookie-Banner
    const cookieBanner = document.querySelector('.cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieCustomize = document.getElementById('cookie-customize');
    
    if (cookieBanner && cookieAccept) {
        // Cookie-Banner anzeigen, wenn noch nicht akzeptiert
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('active');
            }, 1500);
        }
        
        cookieAccept.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('active');
        });
        
        if (cookieCustomize) {
            cookieCustomize.addEventListener('click', function() {
                // In der realen Implementierung würde hier ein Cookie-Einstellungsdialog geöffnet
                console.log('Cookie-Einstellungen werden geöffnet...');
            });
        }
    }
    
    // "Zurück nach oben"-Button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Form-Validierung mit visuellen Rückmeldungen
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        // Validierungsstil beim Verlassen des Feldes
        inputs.forEach(input => {
                            input.addEventListener('blur', function() {
                if (input.required && !input.value.trim()) {
                    input.classList.add('error');
                    input.classList.remove('valid');
                } else {
                    input.classList.remove('error');
                    input.classList.add('valid');
                }
                
                // Spezielle Validierung für E-Mail
                if (input.type === 'email' && input.value.trim()) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(input.value.trim())) {
                        input.classList.add('error');
                        input.classList.remove('valid');
                    } else {
                        input.classList.remove('error');
                        input.classList.add('valid');
                    }
                }
            });
            
            // Validierungsstil bei Änderung des Feldes zurücksetzen
            input.addEventListener('input', function() {
                input.classList.remove('error');
            });
        });
        
        // Formular-Absendung validieren
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let valid = true;
            
            // Alle Pflichtfelder prüfen
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('error');
                }
            });
            
            // E-Mail-Validierung
            const emailField = form.querySelector('input[type="email"]');
            if (emailField && emailField.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value.trim())) {
                    valid = false;
                    emailField.classList.add('error');
                }
            }
            
            if (valid) {
                // Formulartyp bestimmen
                const formType = form.closest('.contact-form') ? 'contact' : 
                                form.closest('.subscription-form') ? 'newsletter' : 
                                form.closest('.registration-form') ? 'registration' : 'general';
                
                // Erfolgsmeldung entsprechend dem Formulartyp
                let successMessage = 'Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.';
                
                if (formType === 'newsletter') {
                    successMessage = 'Vielen Dank für Ihr Interesse! Sie erhalten in Kürze eine Bestätigungsmail.';
                } else if (formType === 'registration') {
                    successMessage = 'Vielen Dank für Ihre Anmeldung! Wir werden uns in Kürze bei Ihnen melden, um die nächsten Schritte zu besprechen.';
                }
                
                // Erfolgsmeldung anzeigen
                showNotification(successMessage, 'success');
                
                // Formular zurücksetzen
                form.reset();
                
                // Validierungsstile entfernen
                form.querySelectorAll('.valid, .error').forEach(field => {
                    field.classList.remove('valid', 'error');
                });
                
                // In der realen Implementierung würden hier die Daten an den Server gesendet
                console.log('Formular erfolgreich validiert und abgesendet');
            } else {
                showNotification('Bitte füllen Sie alle Pflichtfelder korrekt aus.', 'error');
            }
        });
    });
    
    // Benachrichtigungssystem für Feedback an den Benutzer
    function showNotification(message, type = 'info') {
        // Existierende Benachrichtigungen entfernen
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });
        
        // Neue Benachrichtigung erstellen
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = document.createElement('i');
        
        switch(type) {
            case 'success':
                icon.className = 'fas fa-check-circle';
                break;
            case 'error':
                icon.className = 'fas fa-exclamation-circle';
                break;
            default:
                icon.className = 'fas fa-info-circle';
        }
        
        notification.appendChild(icon);
        
        const text = document.createElement('span');
        text.textContent = message;
        notification.appendChild(text);
        
        document.body.appendChild(notification);
        
        // Animation für Einblenden
        setTimeout(() => {
            notification.classList.add('active');
        }, 10);
        
        // Automatisches Ausblenden nach 5 Sekunden
        setTimeout(() => {
            notification.classList.remove('active');
            
            // Entfernen nach Ausblenden
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
    }
    
    // Standortsuche-Funktion
    const locationSearch = document.querySelector('.location-search');
    
    if (locationSearch) {
        const searchInput = locationSearch.querySelector('input');
        const searchButton = locationSearch.querySelector('button');
        
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                // In der realen Implementierung würde hier eine API-Anfrage erfolgen
                showNotification(`Suche nach ADAC Fahrschule+ Standorten in der Nähe von: ${searchTerm}`, 'info');
                
                // Beispiel für eine Map-Aktualisierung
                const mapIframe = document.querySelector('.map iframe');
                if (mapIframe) {
                    // Hier würde die tatsächliche Standortsuche und Kartenaktualisierung erfolgen
                    console.log(`Standortsuche nach: ${searchTerm}`);
                }
            } else {
                showNotification('Bitte geben Sie eine PLZ oder einen Ort ein.', 'error');
            }
        });
        
        // Suche auch bei Enter-Taste auslösen
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchButton.click();
            }
        });
    }
    
    // Animationen beim Scrollen für Sektionen
    const animateOnScroll = function() {
        const animatedElements = document.querySelectorAll('.fade-in-element, .slide-in-left, .slide-in-right, .zoom-in');
        
        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };
    
    // Observer für Animation von Elementen
    const initScrollAnimations = function() {
        const elements = [
            ...document.querySelectorAll('.feature-card'),
            ...document.querySelectorAll('.pillar'),
            ...document.querySelectorAll('.benefit'),
            ...document.querySelectorAll('.testimonial-card'),
            ...document.querySelectorAll('.news-card')
        ];
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    };
    
    // Animationen initialisieren
    window.addEventListener('load', function() {
        initScrollAnimations();
        animateOnScroll(); // Für initial sichtbare Elemente
    });
    
    window.addEventListener('scroll', animateOnScroll);
    
    // Parallax-Effekt für Hero-Sektion
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            hero.style.backgroundPosition = `center ${scrollPosition * 0.4}px`;
        });
    }
    
    // Simulator 3D-Effekt bei Mausbewegung (subtiler 3D-Eindruck)
    const simulatorImage = document.querySelector('.simulator-image.interactive-3d');
    
    if (simulatorImage) {
        simulatorImage.addEventListener('mousemove', function(e) {
            const { left, top, width, height } = this.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            
            // Begrenzten Rotationseffekt anwenden
            this.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
        });
        
        simulatorImage.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
        });
    }
    
    // Lazy-Loading für Bilder
    if ('IntersectionObserver' in window) {
        const imgOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px 100px 0px"
        };
        
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, imgOptions);
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imgObserver.observe(img);
        });
    }
    
    // Anpassungen für Barrierefreiheit
    function improveAccessibility() {
        // ARIA-Rollen für Navigation hinzufügen
        const mainNav = document.querySelector('.nav-menu');
        if (mainNav) {
            mainNav.setAttribute('role', 'navigation');
            mainNav.setAttribute('aria-label', 'Hauptnavigation');
        }
        
        // Fokussierbare Elemente mit Tastaturbedienung verbessern
        const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        
        focusableElements.forEach(element => {
            element.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
        
        // Tabs mit Tastatur bedienbar machen
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        tabButtons.forEach((button, index) => {
            button.setAttribute('role', 'tab');
            button.setAttribute('tabindex', '0');
            
            if (button.classList.contains('active')) {
                button.setAttribute('aria-selected', 'true');
            } else {
                button.setAttribute('aria-selected', 'false');
            }
            
            const tabPane = document.getElementById(button.getAttribute('data-tab') + '-tab');
            if (tabPane) {
                tabPane.setAttribute('role', 'tabpanel');
                tabPane.setAttribute('aria-labelledby', button.id || `tab-${index}`);
                
                if (!button.classList.contains('active')) {
                    tabPane.setAttribute('aria-hidden', 'true');
                }
            }
        });
    }
    
    // Barrierefreiheitsverbesserungen anwenden
    improveAccessibility();
    
    console.log('ADAC Fahrschule+ Website erfolgreich initialisiert');
});