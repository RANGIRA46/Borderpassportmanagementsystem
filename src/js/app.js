// Rwanda Border & Passport Management System - Main Application JavaScript

class BorderApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'home';
        this.theme = 'customer';
        this.isAuthenticated = false;
        
        this.init();
    }

    init() {
        this.loadStoredUser();
        this.setupEventListeners();
        this.setupNavigation();
        this.applyTheme();
        this.loadPage(this.currentPage);
    }

    // Authentication System
    loadStoredUser() {
        const storedUser = localStorage.getItem('border_system_user');
        if (storedUser) {
            try {
                this.currentUser = JSON.parse(storedUser);
                this.isAuthenticated = true;
                this.setTheme();
            } catch (error) {
                localStorage.removeItem('border_system_user');
            }
        }
    }

    setTheme() {
        if (this.currentUser && (this.currentUser.role === 'officer' || this.currentUser.role === 'admin' || this.currentUser.role === 'super-admin')) {
            this.theme = 'admin';
        } else {
            this.theme = 'customer';
        }
    }

    applyTheme() {
        document.body.className = '';
        if (this.theme === 'admin') {
            document.body.classList.add('admin-theme');
        } else {
            document.body.classList.add('customer-theme');
        }
    }

    // Mock Users Database
    getMockUsers() {
        return [
            {
                id: 'usr_001',
                email: 'john.doe@example.com',
                firstName: 'John',
                lastName: 'Doe',
                role: 'customer',
                permissions: ['apply_passport', 'apply_visa', 'view_status', 'book_appointment'],
                createdAt: new Date('2024-01-15'),
                lastLogin: new Date('2024-01-21'),
                status: 'active'
            },
            {
                id: 'usr_002',
                email: 'mary.smith@immigration.gov.rw',
                firstName: 'Mary',
                lastName: 'Smith',
                role: 'officer',
                department: 'Immigration Services',
                permissions: ['process_applications', 'verify_identity', 'access_biometrics', 'view_records'],
                createdAt: new Date('2024-01-10'),
                lastLogin: new Date('2024-01-21'),
                status: 'active'
            },
            {
                id: 'usr_003',
                email: 'admin@immigration.gov.rw',
                firstName: 'David',
                lastName: 'Wilson',
                role: 'admin',
                department: 'System Administration',
                permissions: ['full_access', 'user_management', 'system_config', 'analytics', 'watchlist'],
                createdAt: new Date('2024-01-01'),
                lastLogin: new Date('2024-01-21'),
                status: 'active'
            },
            {
                id: 'usr_004',
                email: 'superadmin@immigration.gov.rw',
                firstName: 'Sarah',
                lastName: 'Johnson',
                role: 'super-admin',
                department: 'National Security',
                permissions: ['system_admin', 'security_oversight', 'interpol_access', 'multi_agency'],
                createdAt: new Date('2024-01-01'),
                lastLogin: new Date('2024-01-21'),
                status: 'active'
            }
        ];
    }

    // Authentication Methods
    async login(email, password, userType) {
        // Simulate API call
        await this.delay(1500);
        
        const users = this.getMockUsers();
        const user = users.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            (userType === 'user' ? u.role === 'customer' : ['officer', 'admin', 'super-admin'].includes(u.role))
        );
        
        if (user && password === 'password123') {
            this.currentUser = { ...user, lastLogin: new Date() };
            this.isAuthenticated = true;
            localStorage.setItem('border_system_user', JSON.stringify(this.currentUser));
            this.setTheme();
            this.applyTheme();
            this.updateNavigation();
            return true;
        }
        
        return false;
    }

    async register(userData) {
        // Simulate API call
        await this.delay(2000);
        
        const users = this.getMockUsers();
        const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
        
        if (existingUser) {
            return false;
        }
        
        const newUser = {
            id: `usr_${Date.now()}`,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.userType === 'user' ? 'customer' : 'officer',
            department: userData.userType === 'admin' ? 'Immigration Services' : undefined,
            permissions: userData.userType === 'user' 
                ? ['apply_passport', 'apply_visa', 'view_status', 'book_appointment']
                : ['process_applications', 'verify_identity', 'access_biometrics'],
            createdAt: new Date(),
            status: 'active'
        };
        
        this.currentUser = newUser;
        this.isAuthenticated = true;
        localStorage.setItem('border_system_user', JSON.stringify(this.currentUser));
        this.setTheme();
        this.applyTheme();
        this.updateNavigation();
        return true;
    }

    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.theme = 'customer';
        localStorage.removeItem('border_system_user');
        this.applyTheme();
        this.updateNavigation();
        this.loadPage('home');
    }

    // Navigation System
    setupNavigation() {
        this.updateNavigation();
    }

    updateNavigation() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (this.theme === 'admin') {
                navbar.classList.add('navbar-admin');
                this.renderAdminNavigation();
            } else {
                navbar.classList.remove('navbar-admin');
                this.renderCustomerNavigation();
            }
        }
    }

    renderCustomerNavigation() {
        const navbarContent = document.querySelector('.navbar-content');
        if (!navbarContent) return;

        navbarContent.innerHTML = `
            <div class="navbar-brand">
                <div class="navbar-logo">
                    🛡️
                </div>
                <div class="hidden sm:block">
                    <div class="navbar-title">Rwanda Immigration</div>
                    <div class="navbar-subtitle">Digital Services Portal</div>
                </div>
                <div class="sm:hidden">
                    <div class="navbar-title">Immigration Portal</div>
                </div>
            </div>
            
            <div class="navbar-nav">
                <a href="#" onclick="app.loadPage('home')" class="btn btn-ghost ${this.currentPage === 'home' ? 'active' : ''}">🏠 Home</a>
                <a href="#" onclick="app.loadPage('overview')" class="btn btn-ghost ${this.currentPage === 'overview' ? 'active' : ''}">📋 About</a>
                <div class="dropdown">
                    <button class="btn btn-ghost">🎯 Services ▼</button>
                    <div class="dropdown-content">
                        <a href="#" onclick="app.loadPage('apply-passport')" class="dropdown-item">📘 Apply for Passport</a>
                        <a href="#" onclick="app.loadPage('apply-visa')" class="dropdown-item">📄 Apply for Visa</a>
                        <a href="#" onclick="app.loadPage('appointments')" class="dropdown-item">📅 Book Appointment</a>
                        <a href="#" onclick="app.loadPage('status')" class="dropdown-item">🔍 Check Status</a>
                    </div>
                </div>
                <div class="dropdown">
                    <button class="btn btn-ghost">💬 Support ▼</button>
                    <div class="dropdown-content">
                        <a href="#" onclick="app.loadPage('documents')" class="dropdown-item">📎 Upload Documents</a>
                        <a href="#" onclick="app.loadPage('payments')" class="dropdown-item">💳 Payment Center</a>
                        <a href="#" onclick="app.loadPage('border-pass')" class="dropdown-item">🎫 Digital Pass</a>
                    </div>
                </div>
            </div>
            
            <div class="navbar-actions">
                <button class="btn btn-ghost">❓ Help</button>
                <div class="dropdown">
                    <button class="btn btn-ghost">🌐 EN ▼</button>
                    <div class="dropdown-content">
                        <a href="#" class="dropdown-item">🇺🇸 English</a>
                        <a href="#" class="dropdown-item">🇫🇷 Français</a>
                        <a href="#" class="dropdown-item">🇷🇼 Kinyarwanda</a>
                    </div>
                </div>
                ${this.isAuthenticated ? this.renderUserMenu() : '<button onclick="app.loadPage(\'login\')" class="btn btn-primary">🔐 Sign In</button>'}
                <button class="btn btn-ghost md:hidden" onclick="app.toggleMobileNav()">☰</button>
            </div>
        `;
    }

    renderAdminNavigation() {
        const navbarContent = document.querySelector('.navbar-content');
        if (!navbarContent) return;

        navbarContent.innerHTML = `
            <div class="navbar-brand">
                <div class="navbar-logo">
                    🛡️
                </div>
                <div class="hidden sm:block">
                    <div class="navbar-title">Border Control Center</div>
                    <div class="navbar-subtitle">Administrative Dashboard • Republic of Rwanda</div>
                </div>
                <div class="sm:hidden">
                    <div class="navbar-title">Control Center</div>
                </div>
            </div>
            
            <div class="navbar-nav">
                <a href="#" onclick="app.loadPage('home')" class="btn btn-ghost ${this.currentPage === 'home' ? 'active' : ''}">📊 Dashboard</a>
                <div class="dropdown">
                    <button class="btn btn-ghost">⚙️ Processing ▼</button>
                    <div class="dropdown-content">
                        <a href="#" onclick="app.loadPage('apply-passport')" class="dropdown-item">📘 Passport Applications</a>
                        <a href="#" onclick="app.loadPage('apply-visa')" class="dropdown-item">📄 Visa Applications</a>
                        <a href="#" onclick="app.loadPage('appointments')" class="dropdown-item">📅 Appointments</a>
                        <a href="#" onclick="app.loadPage('payments')" class="dropdown-item">💳 Payment Processing</a>
                    </div>
                </div>
                <div class="dropdown">
                    <button class="btn btn-ghost">🛂 Border Control ▼</button>
                    <div class="dropdown-content">
                        <a href="#" onclick="app.loadPage('entry-exit')" class="dropdown-item">🚪 Entry/Exit Logging</a>
                        <a href="#" onclick="app.loadPage('records')" class="dropdown-item">📊 Travel Records</a>
                        <a href="#" onclick="app.loadPage('status')" class="dropdown-item">🔍 Status Verification</a>
                    </div>
                </div>
                <div class="dropdown">
                    <button class="btn btn-ghost">👆 Biometrics ▼</button>
                    <div class="dropdown-content">
                        <a href="#" onclick="app.loadPage('enroll-biometrics')" class="dropdown-item">👆 Enrollment</a>
                        <a href="#" onclick="app.loadPage('verify-identity')" class="dropdown-item">🔐 Verification</a>
                        <a href="#" onclick="app.loadPage('biometric-centers')" class="dropdown-item">👥 Centers</a>
                    </div>
                </div>
                <div class="dropdown">
                    <button class="btn btn-ghost">🌐 Security ▼</button>
                    <div class="dropdown-content">
                        <a href="#" onclick="app.loadPage('interpol')" class="dropdown-item">🌐 INTERPOL</a>
                        <a href="#" onclick="app.loadPage('alerts')" class="dropdown-item">⚠️ Watchlist</a>
                        <a href="#" onclick="app.loadPage('agencies')" class="dropdown-item">👥 Multi-Agency</a>
                    </div>
                </div>
                <a href="#" onclick="app.loadPage('analytics')" class="btn btn-ghost ${this.currentPage === 'analytics' ? 'active' : ''}">📈 Analytics</a>
                <a href="#" onclick="app.loadPage('admin-dashboard')" class="btn btn-ghost ${this.currentPage === 'admin-dashboard' ? 'active' : ''}">⚙️ Administration</a>
            </div>
            
            <div class="navbar-actions">
                <div class="relative">
                    <button class="btn btn-ghost">🔔</button>
                    <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">5</span>
                </div>
                <div class="dropdown">
                    <button class="btn btn-ghost">🌐 EN ▼</button>
                    <div class="dropdown-content">
                        <a href="#" class="dropdown-item">🇺🇸 English</a>
                        <a href="#" class="dropdown-item">🇫🇷 Français</a>
                        <a href="#" class="dropdown-item">🇷🇼 Kinyarwanda</a>
                    </div>
                </div>
                ${this.renderUserMenu()}
                <button class="btn btn-ghost md:hidden" onclick="app.toggleMobileNav()">☰</button>
            </div>
        `;
    }

    renderUserMenu() {
        if (!this.currentUser) return '';
        
        const initials = `${this.currentUser.firstName.charAt(0)}${this.currentUser.lastName.charAt(0)}`.toUpperCase();
        const roleDisplay = this.currentUser.role === 'customer' ? 'Customer' : 
                           this.currentUser.role === 'officer' ? 'Officer' :
                           this.currentUser.role === 'admin' ? 'Administrator' : 'Super Admin';
        
        return `
            <div class="dropdown">
                <button class="btn btn-ghost flex items-center gap-2">
                    <div class="w-8 h-8 bg-navy-medium text-white rounded-full flex items-center justify-center text-sm font-medium">
                        ${initials}
                    </div>
                    <div class="hidden sm:block text-left">
                        <div class="text-sm font-medium">${this.currentUser.firstName} ${this.currentUser.lastName}</div>
                        <div class="text-xs badge badge-secondary">${roleDisplay}</div>
                    </div>
                </button>
                <div class="dropdown-content">
                    <div class="px-4 py-2 border-b border-blue-light">
                        <div class="font-medium">${this.currentUser.firstName} ${this.currentUser.lastName}</div>
                        <div class="text-sm text-navy-medium">${this.currentUser.email}</div>
                        <div class="badge badge-secondary text-xs mt-1">${roleDisplay}</div>
                    </div>
                    <a href="#" class="dropdown-item">👤 Profile</a>
                    <a href="#" class="dropdown-item">⚙️ Settings</a>
                    <a href="#" class="dropdown-item">❤️ My Applications</a>
                    <div class="dropdown-divider"></div>
                    <a href="#" onclick="app.logout()" class="dropdown-item text-red-600">🚪 Sign Out</a>
                </div>
            </div>
        `;
    }

    // Page Navigation
    loadPage(pageName) {
        if (!this.hasPageAccess(pageName)) {
            this.showAccessDenied();
            return;
        }

        this.currentPage = pageName;
        this.updateNavigation();

        // Load the appropriate HTML file
        const pageUrls = {
            'home': this.theme === 'admin' ? 'admin-home.html' : 'home.html',
            'login': 'login.html',
            'overview': 'overview.html',
            'apply-passport': 'apply-passport.html',
            'apply-visa': 'apply-visa.html',
            'appointments': 'appointments.html',
            'documents': 'documents.html',
            'payments': 'payments.html',
            'status': 'status.html',
            'border-pass': 'border-pass.html',
            'records': 'records.html',
            'entry-exit': 'entry-exit.html',
            'interpol': 'interpol.html',
            'enroll-biometrics': 'enroll-biometrics.html',
            'verify-identity': 'verify-identity.html',
            'biometric-centers': 'biometric-centers.html',
            'admin-dashboard': 'admin-dashboard.html',
            'analytics': 'analytics.html',
            'alerts': 'alerts.html',
            'agencies': 'agencies.html'
        };

        const url = pageUrls[pageName] || 'home.html';
        
        // Update URL without page reload
        history.pushState({ page: pageName }, '', `?page=${pageName}`);
        
        // Load page content
        this.loadPageContent(url);
    }

    async loadPageContent(url) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const mainContent = doc.querySelector('main') || doc.body;
                
                const appMain = document.querySelector('#app-main');
                if (appMain && mainContent) {
                    appMain.innerHTML = mainContent.innerHTML;
                    appMain.className = `fade-in ${this.theme === 'admin' ? 'admin-theme' : 'customer-theme'}`;
                    
                    // Execute any page-specific JavaScript
                    this.executePageScripts();
                }
            } else {
                this.showPageNotFound();
            }
        } catch (error) {
            console.error('Error loading page:', error);
            this.showPageNotFound();
        }
    }

    executePageScripts() {
        // Initialize page-specific functionality
        this.initializeForms();
        this.initializeDropdowns();
        this.initializeTabs();
        this.initializeModals();
    }

    // Access Control
    hasPageAccess(page) {
        const publicPages = [
            'home', 'overview', 'apply-passport', 'apply-visa', 
            'appointments', 'documents', 'payments', 'status', 'login'
        ];
        
        const customerPages = [...publicPages, 'border-pass'];
        
        const officerPages = [
            ...customerPages, 'records', 'entry-exit', 'enroll-biometrics', 
            'verify-identity', 'biometric-centers'
        ];
        
        const adminPages = [
            ...officerPages, 'admin-dashboard', 'analytics', 'alerts', 
            'agencies', 'interpol'
        ];

        if (!this.isAuthenticated) return publicPages.includes(page);
        if (this.currentUser?.role === 'super-admin') return adminPages.includes(page);
        if (this.currentUser?.role === 'admin') return adminPages.includes(page);
        if (this.currentUser?.role === 'officer') return officerPages.includes(page);
        if (this.currentUser?.role === 'customer') return customerPages.includes(page);
        
        return publicPages.includes(page);
    }

    showAccessDenied() {
        const appMain = document.querySelector('#app-main');
        if (appMain) {
            appMain.innerHTML = `
                <div class="container max-w-4xl mx-auto p-6 mt-8">
                    <div class="alert alert-danger">
                        <div class="flex items-center justify-between">
                            <span>🔒 Access denied. You don't have permission to view this page.</span>
                            <button onclick="app.loadPage('login')" class="btn btn-primary btn-sm">
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    showPageNotFound() {
        const appMain = document.querySelector('#app-main');
        if (appMain) {
            appMain.innerHTML = `
                <div class="container max-w-4xl mx-auto p-6 mt-8 text-center">
                    <h1>404 - Page Not Found</h1>
                    <p>The requested page could not be found.</p>
                    <button onclick="app.loadPage('home')" class="btn btn-primary mt-4">
                        Return Home
                    </button>
                </div>
            `;
        }
    }

    // UI Components
    initializeForms() {
        // Add form validation and enhancement
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        });
    }

    initializeDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const button = dropdown.querySelector('button');
            if (button) {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdown.classList.toggle('active');
                });
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        });
    }

    initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                this.switchTab(button.closest('.tabs'), tabId);
            });
        });
    }

    switchTab(tabsContainer, activeTabId) {
        const buttons = tabsContainer.querySelectorAll('.tab-button');
        const contents = tabsContainer.querySelectorAll('.tab-content');

        buttons.forEach(btn => btn.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));

        const activeButton = tabsContainer.querySelector(`[data-tab="${activeTabId}"]`);
        const activeContent = tabsContainer.querySelector(`#${activeTabId}`);

        if (activeButton) activeButton.classList.add('active');
        if (activeContent) activeContent.classList.add('active');
    }

    initializeModals() {
        const modalTriggers = document.querySelectorAll('[data-modal]');
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const modalId = trigger.dataset.modal;
                this.openModal(modalId);
            });
        });

        const modalCloses = document.querySelectorAll('.modal-close');
        modalCloses.forEach(close => {
            close.addEventListener('click', () => {
                this.closeModal();
            });
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }

    // Mobile Navigation
    toggleMobileNav() {
        const mobileNav = document.querySelector('.mobile-nav');
        const overlay = document.querySelector('.mobile-nav-overlay');
        
        if (mobileNav && overlay) {
            mobileNav.classList.toggle('active');
            overlay.classList.toggle('active');
        }
    }

    // Utility Methods
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    formatTime(date) {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        }).format(date);
    }

    showLoading(element) {
        if (element) {
            element.innerHTML = '<div class="loading"></div> Loading...';
            element.disabled = true;
        }
    }

    hideLoading(element, originalText) {
        if (element) {
            element.innerHTML = originalText;
            element.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} fixed top-4 right-4 z-50 max-w-md`;
        notification.innerHTML = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Event Listeners
    setupEventListeners() {
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.currentPage = e.state.page;
                this.loadPageContent(this.getPageUrl(e.state.page));
            }
        });

        // Handle form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                e.preventDefault();
                this.handleFormSubmit(e.target);
            }
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                const dropdowns = document.querySelectorAll('.dropdown.active');
                dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            }
        });
    }

    getPageUrl(pageName) {
        const pageUrls = {
            'home': this.theme === 'admin' ? 'admin-home.html' : 'home.html',
            'login': 'login.html',
            'overview': 'overview.html',
            'apply-passport': 'apply-passport.html',
            'apply-visa': 'apply-visa.html',
            'appointments': 'appointments.html',
            'documents': 'documents.html',
            'payments': 'payments.html',
            'status': 'status.html',
            'border-pass': 'border-pass.html',
            'records': 'records.html',
            'entry-exit': 'entry-exit.html',
            'interpol': 'interpol.html',
            'enroll-biometrics': 'enroll-biometrics.html',
            'verify-identity': 'verify-identity.html',
            'biometric-centers': 'biometric-centers.html',
            'admin-dashboard': 'admin-dashboard.html',
            'analytics': 'analytics.html',
            'alerts': 'alerts.html',
            'agencies': 'agencies.html'
        };
        
        return pageUrls[pageName] || 'home.html';
    }

    async handleFormSubmit(form) {
        const formData = new FormData(form);
        const formType = form.dataset.form;
        
        switch (formType) {
            case 'login':
                await this.handleLoginForm(formData);
                break;
            case 'register':
                await this.handleRegisterForm(formData);
                break;
            case 'passport-application':
                await this.handlePassportApplication(formData);
                break;
            case 'visa-application':
                await this.handleVisaApplication(formData);
                break;
            default:
                this.showNotification('Form submitted successfully!', 'success');
        }
    }

    async handleLoginForm(formData) {
        const email = formData.get('email');
        const password = formData.get('password');
        const userType = formData.get('userType') || 'user';
        
        const loginButton = document.querySelector('button[type="submit"]');
        this.showLoading(loginButton);
        
        try {
            const success = await this.login(email, password, userType);
            if (success) {
                this.showNotification('Login successful!', 'success');
                this.loadPage('home');
            } else {
                this.showNotification('Invalid credentials. Use password123 for demo accounts.', 'danger');
            }
        } catch (error) {
            this.showNotification('Login failed. Please try again.', 'danger');
        } finally {
            this.hideLoading(loginButton, 'Sign In');
        }
    }

    async handleRegisterForm(formData) {
        const userData = {
            email: formData.get('email'),
            password: formData.get('password'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            phone: formData.get('phone'),
            nationality: formData.get('nationality'),
            userType: formData.get('userType') || 'user'
        };
        
        const registerButton = document.querySelector('button[type="submit"]');
        this.showLoading(registerButton);
        
        try {
            const success = await this.register(userData);
            if (success) {
                this.showNotification('Registration successful! You can now access the system.', 'success');
                setTimeout(() => this.loadPage('home'), 2000);
            } else {
                this.showNotification('Registration failed. Email may already be in use.', 'danger');
            }
        } catch (error) {
            this.showNotification('Registration failed. Please try again.', 'danger');
        } finally {
            this.hideLoading(registerButton, 'Create Account');
        }
    }

    async handlePassportApplication(formData) {
        // Simulate passport application processing
        this.showNotification('Passport application submitted successfully!', 'success');
    }

    async handleVisaApplication(formData) {
        // Simulate visa application processing
        this.showNotification('Visa application submitted successfully!', 'success');
    }
}

// Initialize the application
const app = new BorderApp();

// Make app globally available
window.app = app;

// Handle page load
document.addEventListener('DOMContentLoaded', () => {
    // Get page from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || 'home';
    app.loadPage(page);
});