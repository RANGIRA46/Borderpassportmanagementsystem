// Main application functionality
class BorderPassportApp {
    constructor() {
        this.version = '1.0.0';
        this.apiEndpoint = '/api'; // For future API integration
        this.isOnline = navigator.onLine;
        
        this.init();
    }

    init() {
        this.setupGlobalEventListeners();
        this.setupAccessibility();
        this.setupPerformanceOptimizations();
        this.setupOfflineSupport();
        this.logApplicationStart();
    }

    setupGlobalEventListeners() {
        // Handle online/offline status
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showConnectionStatus('online');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showConnectionStatus('offline');
        });

        // Handle form submissions globally
        document.addEventListener('submit', (e) => {
            this.handleFormSubmission(e);
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Handle print functionality
        window.addEventListener('beforeprint', () => {
            this.preparePrintView();
        });

        window.addEventListener('afterprint', () => {
            this.restoreNormalView();
        });

        // Handle window resize for responsive adjustments
        window.addEventListener('resize', this.debounce(() => {
            this.handleWindowResize();
        }, 250));

        // Handle visibility change for performance
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    setupAccessibility() {
        // Add focus indicators for keyboard navigation
        this.addFocusIndicators();
        
        // Setup screen reader announcements
        this.setupScreenReaderAnnouncements();
        
        // Handle skip links
        this.setupSkipLinks();
        
        // Ensure proper heading hierarchy
        this.validateHeadingHierarchy();
    }

    addFocusIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            .focus-visible {
                outline: 2px solid var(--ring);
                outline-offset: 2px;
            }
            
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
        `;
        document.head.appendChild(style);
    }

    setupScreenReaderAnnouncements() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    }

    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Clear after a delay to allow for re-announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    setupSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary);
            color: var(--primary-foreground);
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add id to main content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.id = 'main-content';
            mainContent.setAttribute('tabindex', '-1');
        }
    }

    validateHeadingHierarchy() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let previousLevel = 0;
        
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.substring(1));
            
            if (level > previousLevel + 1) {
                console.warn(`Heading hierarchy issue: ${heading.tagName} follows h${previousLevel}`);
            }
            
            previousLevel = level;
        });
    }

    setupPerformanceOptimizations() {
        // Lazy load images when they come into view
        this.setupLazyLoading();
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Setup intersection observer for animations
        this.setupIntersectionObserver();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    preloadCriticalResources() {
        // Preload critical CSS
        const preloadCSS = document.createElement('link');
        preloadCSS.rel = 'preload';
        preloadCSS.as = 'style';
        preloadCSS.href = 'styles/components.css';
        document.head.appendChild(preloadCSS);
    }

    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            });
            
            // Observe cards and other elements that should animate in
            const animatableElements = document.querySelectorAll('.card, .service-card, .stat-card');
            animatableElements.forEach(el => animationObserver.observe(el));
        }
    }

    setupOfflineSupport() {
        // Register service worker if supported
        if ('serviceWorker' in navigator) {
            this.registerServiceWorker();
        }
        
        // Cache form data locally
        this.setupLocalStorage();
    }

    registerServiceWorker() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    }

    setupLocalStorage() {
        // Save form data as user types
        document.addEventListener('input', this.debounce((e) => {
            if (e.target.form && e.target.form.id === 'passportForm') {
                this.saveFormDataLocally(e.target.form);
            }
        }, 500));
        
        // Restore form data on page load
        this.restoreFormDataFromLocal();
    }

    saveFormDataLocally(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        try {
            localStorage.setItem('passportFormDraft', JSON.stringify(data));
        } catch (error) {
            console.warn('Could not save form data locally:', error);
        }
    }

    restoreFormDataFromLocal() {
        try {
            const savedData = localStorage.getItem('passportFormDraft');
            if (savedData) {
                const data = JSON.parse(savedData);
                const form = document.getElementById('passportForm');
                
                if (form) {
                    Object.keys(data).forEach(key => {
                        const field = form.querySelector(`[name="${key}"]`);
                        if (field) {
                            field.value = data[key];
                        }
                    });
                }
            }
        } catch (error) {
            console.warn('Could not restore form data:', error);
        }
    }

    clearLocalFormData() {
        try {
            localStorage.removeItem('passportFormDraft');
        } catch (error) {
            console.warn('Could not clear local form data:', error);
        }
    }

    handleFormSubmission(e) {
        // Prevent default form submission for SPA behavior
        if (e.target.id === 'passportForm') {
            e.preventDefault();
            return false;
        }
    }

    handleKeyboardNavigation(e) {
        // Handle keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'h':
                    e.preventDefault();
                    if (window.navigation) {
                        window.navigation.navigateToPage('home');
                    }
                    break;
                case 'p':
                    e.preventDefault();
                    window.print();
                    break;
            }
        }
        
        // Handle escape key globally
        if (e.key === 'Escape') {
            this.handleEscapeKey();
        }
    }

    handleEscapeKey() {
        // Close modals, overlays, etc.
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay && !loadingOverlay.classList.contains('hidden')) {
            loadingOverlay.classList.add('hidden');
        }
    }

    preparePrintView() {
        // Add print-specific styles
        document.body.classList.add('printing');
        
        // Hide non-essential elements
        const hideElements = document.querySelectorAll('.navigation, .theme-toggle, .btn');
        hideElements.forEach(el => {
            el.style.display = 'none';
        });
    }

    restoreNormalView() {
        document.body.classList.remove('printing');
        
        // Restore hidden elements
        const hideElements = document.querySelectorAll('.navigation, .theme-toggle, .btn');
        hideElements.forEach(el => {
            el.style.display = '';
        });
    }

    handleWindowResize() {
        // Update responsive elements
        this.updateResponsiveElements();
        
        // Close mobile menu if window becomes large
        if (window.innerWidth >= 768 && window.navigation) {
            window.navigation.closeMobileMenu();
        }
    }

    updateResponsiveElements() {
        // Update table responsiveness
        const tables = document.querySelectorAll('.admin-table');
        tables.forEach(table => {
            if (window.innerWidth < 1024) {
                table.style.display = 'none';
                const mobileCards = table.parentElement.querySelector('.mobile-cards');
                if (mobileCards) {
                    mobileCards.style.display = 'block';
                }
            } else {
                table.style.display = 'table';
                const mobileCards = table.parentElement.querySelector('.mobile-cards');
                if (mobileCards) {
                    mobileCards.style.display = 'none';
                }
            }
        });
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden, reduce activity
            this.pauseNonEssentialActivities();
        } else {
            // Page is visible, resume activity
            this.resumeActivities();
        }
    }

    pauseNonEssentialActivities() {
        // Pause animations, timers, etc.
        console.log('Pausing non-essential activities');
    }

    resumeActivities() {
        // Resume animations, timers, etc.
        console.log('Resuming activities');
    }

    showConnectionStatus(status) {
        const notification = status === 'online' 
            ? 'Connection restored' 
            : 'You are currently offline. Some features may be limited.';
            
        const type = status === 'online' ? 'success' : 'warning';
        
        if (window.components) {
            window.components.showNotification(notification, type);
        }
    }

    logApplicationStart() {
        console.log(`Border & Passport Management System v${this.version} initialized`);
        console.log('Online status:', this.isOnline);
        console.log('User agent:', navigator.userAgent);
        
        // Log performance metrics
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
                }, 0);
            });
        }
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // API simulation functions (for future backend integration)
    async simulateAPICall(endpoint, data = null, delay = 1000) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90% success rate
                    resolve({
                        success: true,
                        data: data,
                        timestamp: new Date().toISOString()
                    });
                } else {
                    reject(new Error('Simulated API error'));
                }
            }, delay);
        });
    }

    // Error handling
    setupGlobalErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.logError(e.error);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.logError(e.reason);
        });
    }

    logError(error) {
        // In a real application, this would send errors to a logging service
        console.error('Error logged:', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new BorderPassportApp();
    window.borderPassportApp = app;
    
    // Make sure other modules are loaded
    if (typeof Navigation === 'undefined' || typeof Components === 'undefined') {
        console.warn('Some modules may not be loaded properly');
    }
    
    // Add CSS custom properties support check
    if (!window.CSS || !window.CSS.supports || !window.CSS.supports('color', 'var(--test)')) {
        console.warn('CSS custom properties not supported');
    }
    
    // Initialize error handling
    app.setupGlobalErrorHandling();
    
    console.log('Border & Passport Management System ready');
});

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BorderPassportApp;
}