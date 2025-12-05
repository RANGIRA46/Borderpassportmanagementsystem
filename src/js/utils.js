// Rwanda Border & Passport Management System - Utility Functions

export class Utils {
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static formatDate(date, options = {}) {
        const defaultOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(date);
    }

    static formatTime(date) {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        }).format(date);
    }

    static formatCurrency(amount, currency = 'RWF') {
        if (currency === 'RWF') {
            return `${parseInt(amount).toLocaleString()} RWF`;
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    static generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    static getUserInitials(firstName, lastName) {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }

    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validatePhone(phone) {
        const re = /^\+?[1-9]\d{1,14}$/;
        return re.test(phone.replace(/\s/g, ''));
    }

    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} fixed top-4 right-4 z-50 max-w-md fade-in`;
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <span>${this.getNotificationIcon(type)}</span>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-auto text-lg">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    static getNotificationIcon(type) {
        switch (type) {
            case 'success': return '✅';
            case 'warning': return '⚠️';
            case 'danger': return '❌';
            case 'info': 
            default: return 'ℹ️';
        }
    }

    static showLoading(element, loadingText = 'Loading...') {
        if (element) {
            element.dataset.originalText = element.innerHTML;
            element.innerHTML = `<span class="loading"></span> ${loadingText}`;
            element.disabled = true;
        }
    }

    static hideLoading(element) {
        if (element && element.dataset.originalText) {
            element.innerHTML = element.dataset.originalText;
            element.disabled = false;
            delete element.dataset.originalText;
        }
    }

    static debounce(func, wait) {
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

    static throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function(...args) {
            if (!lastRan) {
                func.apply(this, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(this, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        }
    }

    static escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    static parseUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    }

    static updateUrlParams(params) {
        const url = new URL(window.location);
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.set(key, params[key]);
            } else {
                url.searchParams.delete(key);
            }
        });
        history.pushState(null, '', url);
    }

    static copyToClipboard(text) {
        if (navigator.clipboard) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return Promise.resolve();
            } catch (err) {
                document.body.removeChild(textArea);
                return Promise.reject(err);
            }
        }
    }

    static downloadFile(data, filename, type = 'text/plain') {
        const file = new Blob([data], { type });
        const a = document.createElement('a');
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    static getStatusColor(status) {
        const statusColors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'processing': 'bg-blue-100 text-blue-800',
            'approved': 'bg-green-100 text-green-800',
            'completed': 'bg-green-100 text-green-800',
            'rejected': 'bg-red-100 text-red-800',
            'cancelled': 'bg-gray-100 text-gray-800',
            'expired': 'bg-red-100 text-red-800',
            'active': 'bg-green-100 text-green-800',
            'inactive': 'bg-gray-100 text-gray-800',
            'flagged': 'bg-yellow-100 text-yellow-800',
            'wanted': 'bg-red-100 text-red-800',
            'clear': 'bg-green-100 text-green-800'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    }

    static getPriorityColor(priority) {
        const priorityColors = {
            'low': 'text-green-600',
            'medium': 'text-yellow-600',
            'high': 'text-red-600',
            'critical': 'text-red-700'
        };
        return priorityColors[priority] || 'text-gray-600';
    }
}

// Export for use in other modules
window.Utils = Utils;