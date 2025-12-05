// Navigation functionality
class Navigation {
    constructor() {
        this.currentPage = 'home';
        this.mobileMenuOpen = false;
        this.isDarkMode = this.loadTheme();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.showPage(this.currentPage);
    }

    setupEventListeners() {
        // Desktop navigation
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });

        // Mobile navigation
        const mobileNavBtns = document.querySelectorAll('.nav-mobile-btn');
        mobileNavBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                this.navigateToPage(page);
                this.closeMobileMenu();
            });
        });

        // Service cards navigation
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                if (page) {
                    this.navigateToPage(page);
                }
            });
        });

        // Service card buttons
        const serviceButtons = document.querySelectorAll('.service-card .btn');
        serviceButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = e.target.closest('.service-card');
                const page = card.getAttribute('data-page');
                if (page) {
                    this.navigateToPage(page);
                }
            });
        });

        // Mobile menu toggle
        const navToggle = document.getElementById('navToggle');
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Theme toggles
        const themeToggle = document.getElementById('themeToggle');
        const mobileThemeToggle = document.getElementById('mobileThemeToggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        if (mobileThemeToggle) {
            mobileThemeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                this.closeMobileMenu();
            }
        });

        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            const mobileMenu = document.getElementById('navMobileMenu');
            const navToggle = document.getElementById('navToggle');
            
            if (this.mobileMenuOpen && 
                !mobileMenu.contains(e.target) && 
                !navToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    navigateToPage(page) {
        if (page && page !== this.currentPage) {
            this.currentPage = page;
            this.showPage(page);
            this.updateActiveNavigation();
            
            // Add to browser history
            const title = this.getPageTitle(page);
            window.history.pushState({ page }, title, `#${page}`);
            document.title = title;
        }
    }

    showPage(page) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(p => {
            p.classList.add('hidden');
        });

        // Show current page
        const currentPage = document.getElementById(`${page}-page`);
        if (currentPage) {
            currentPage.classList.remove('hidden');
            currentPage.classList.add('fade-in');
            
            // Scroll to top
            window.scrollTo(0, 0);
        }
    }

    updateActiveNavigation() {
        // Update desktop navigation
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            if (btn.getAttribute('data-page') === this.currentPage) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update mobile navigation
        const mobileNavBtns = document.querySelectorAll('.nav-mobile-btn');
        mobileNavBtns.forEach(btn => {
            if (btn.getAttribute('data-page') === this.currentPage) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('navMobileMenu');
        
        if (this.mobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        const mobileMenu = document.getElementById('navMobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.add('open');
            this.mobileMenuOpen = true;
            document.body.style.overflow = 'hidden';
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('navMobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.remove('open');
            this.mobileMenuOpen = false;
            document.body.style.overflow = '';
        }
    }

    setupTheme() {
        this.applyTheme();
        this.updateThemeIcons();
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
        this.updateThemeIcons();
        this.saveTheme();
    }

    applyTheme() {
        if (this.isDarkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }

    updateThemeIcons() {
        const themeIcons = document.querySelectorAll('.theme-icon');
        themeIcons.forEach(icon => {
            icon.textContent = this.isDarkMode ? '☀️' : '🌙';
        });
    }

    saveTheme() {
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        
        // Default to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    getPageTitle(page) {
        const titles = {
            'home': 'Border & Passport Management System',
            'apply': 'Passport Application - Border & Passport Management',
            'status': 'Application Status - Border & Passport Management',
            'records': 'Border Records - Border & Passport Management',
            'admin': 'Admin Panel - Border & Passport Management'
        };
        
        return titles[page] || 'Border & Passport Management System';
    }

    // Handle browser back/forward buttons
    handlePopState(event) {
        if (event.state && event.state.page) {
            this.currentPage = event.state.page;
            this.showPage(this.currentPage);
            this.updateActiveNavigation();
        }
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const navigation = new Navigation();
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', (event) => {
        navigation.handlePopState(event);
    });
    
    // Handle initial hash in URL
    const hash = window.location.hash.substring(1);
    if (hash && ['home', 'apply', 'status', 'records', 'admin'].includes(hash)) {
        navigation.navigateToPage(hash);
    }
    
    // Make navigation globally available
    window.navigation = navigation;
});