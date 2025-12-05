// Rwanda Border & Passport Management System - Reusable UI Components

export class UIComponents {
    static createCard(title, content, className = '') {
        return `
            <div class="card ${className}">
                ${title ? `
                    <div class="card-header">
                        <h3 class="card-title">${title}</h3>
                    </div>
                ` : ''}
                <div class="card-content">
                    ${content}
                </div>
            </div>
        `;
    }

    static createButton(text, onClick, className = 'btn-primary', icon = '') {
        const iconHtml = icon ? `<span class="mr-2">${icon}</span>` : '';
        return `
            <button onclick="${onClick}" class="btn ${className}">
                ${iconHtml}${text}
            </button>
        `;
    }

    static createBadge(text, variant = 'primary') {
        return `<span class="badge badge-${variant}">${text}</span>`;
    }

    static createAlert(message, type = 'info', dismissible = true) {
        const dismissButton = dismissible ? 
            '<button onclick="this.parentElement.remove()" class="ml-auto text-lg">&times;</button>' : '';
        
        return `
            <div class="alert alert-${type}">
                <div class="flex items-center justify-between">
                    <span>${message}</span>
                    ${dismissButton}
                </div>
            </div>
        `;
    }

    static createProgressBar(value, max = 100, label = '') {
        const percentage = (value / max) * 100;
        return `
            <div class="space-y-2">
                ${label ? `<div class="flex justify-between text-sm">
                    <span>${label}</span>
                    <span>${Math.round(percentage)}%</span>
                </div>` : ''}
                <div class="progress">
                    <div class="progress-bar" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }

    static createTabs(tabs, activeTab = 0) {
        const tabButtons = tabs.map((tab, index) => 
            `<button class="tab-button ${index === activeTab ? 'active' : ''}" data-tab="${tab.id}">${tab.label}</button>`
        ).join('');

        const tabContents = tabs.map((tab, index) => 
            `<div id="${tab.id}" class="tab-content ${index === activeTab ? 'active' : ''}">${tab.content}</div>`
        ).join('');

        return `
            <div class="tabs">
                <div class="tab-list">
                    ${tabButtons}
                </div>
                ${tabContents}
            </div>
        `;
    }

    static createTable(headers, rows, className = '') {
        const headerHtml = headers.map(header => `<th>${header}</th>`).join('');
        const rowsHtml = rows.map(row => 
            `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
        ).join('');

        return `
            <table class="table ${className}">
                <thead>
                    <tr>${headerHtml}</tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        `;
    }

    static createFormGroup(labelText, inputHtml, required = false) {
        const requiredMark = required ? ' *' : '';
        return `
            <div class="form-group">
                <label class="form-label">${labelText}${requiredMark}</label>
                ${inputHtml}
            </div>
        `;
    }

    static createInput(name, type = 'text', placeholder = '', required = false, value = '') {
        const requiredAttr = required ? 'required' : '';
        return `
            <input 
                name="${name}" 
                type="${type}" 
                placeholder="${placeholder}" 
                value="${value}"
                class="form-input"
                ${requiredAttr}
            >
        `;
    }

    static createSelect(name, options, required = false, selected = '') {
        const requiredAttr = required ? 'required' : '';
        const optionsHtml = options.map(option => {
            const value = typeof option === 'string' ? option : option.value;
            const label = typeof option === 'string' ? option : option.label;
            const selectedAttr = value === selected ? 'selected' : '';
            return `<option value="${value}" ${selectedAttr}>${label}</option>`;
        }).join('');

        return `
            <select name="${name}" class="form-select" ${requiredAttr}>
                <option value="">Select...</option>
                ${optionsHtml}
            </select>
        `;
    }

    static createTextarea(name, placeholder = '', required = false, rows = 3) {
        const requiredAttr = required ? 'required' : '';
        return `
            <textarea 
                name="${name}" 
                placeholder="${placeholder}" 
                rows="${rows}"
                class="form-textarea"
                ${requiredAttr}
            ></textarea>
        `;
    }

    static createModal(id, title, content, footer = '') {
        return `
            <div id="${id}" class="modal-overlay" style="display: none;">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button onclick="app.closeModal()" class="modal-close">&times;</button>
                    </div>
                    <div class="modal-content">
                        ${content}
                    </div>
                    ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
                </div>
            </div>
        `;
    }

    static createDropdown(buttonText, items, buttonClass = 'btn-ghost') {
        const itemsHtml = items.map(item => 
            `<a href="#" onclick="${item.onClick}" class="dropdown-item">${item.icon || ''}${item.label}</a>`
        ).join('');

        return `
            <div class="dropdown">
                <button class="btn ${buttonClass}">${buttonText} ▼</button>
                <div class="dropdown-content">
                    ${itemsHtml}
                </div>
            </div>
        `;
    }

    static createStatCard(icon, value, label, sublabel = '', trend = null) {
        const trendHtml = trend ? `
            <div class="flex items-center justify-center space-x-1">
                <span class="${trend.direction === 'up' ? 'text-green-400' : 'text-red-400'} text-xs font-medium">
                    ${trend.direction === 'up' ? '↗' : '↘'} ${trend.value}
                </span>
            </div>
        ` : '';

        return `
            <div class="card text-center">
                <div class="card-content p-6">
                    <div class="text-4xl mb-3">${icon}</div>
                    <div class="text-2xl font-bold mb-1 text-navy-dark">${value}</div>
                    <div class="text-sm text-navy-medium mb-2">${label}</div>
                    ${trendHtml}
                    ${sublabel ? `<div class="text-xs text-navy-medium mt-1">${sublabel}</div>` : ''}
                </div>
            </div>
        `;
    }

    static createActivityItem(time, action, details, type = 'info', user = 'System') {
        const getIcon = (type) => {
            switch (type) {
                case 'critical': return '🚨';
                case 'success': return '✅';
                case 'warning': return '⚠️';
                case 'info': 
                default: return 'ℹ️';
            }
        };

        return `
            <div class="flex items-start space-x-3">
                <div class="mt-1">${getIcon(type)}</div>
                <div class="flex-1">
                    <div class="flex items-center justify-between">
                        <p class="text-sm font-medium">${action}</p>
                        <span class="text-xs text-blue-light">${time}</span>
                    </div>
                    <p class="text-xs text-blue-light mt-1">${details}</p>
                    <p class="text-xs text-blue-light opacity-70 mt-1">by ${user}</p>
                </div>
            </div>
        `;
    }

    static createStepIndicator(steps, currentStep = 0) {
        return steps.map((step, index) => {
            const isActive = index <= currentStep;
            const isLast = index === steps.length - 1;
            
            return `
                <div class="flex items-center">
                    <div class="flex flex-col items-center">
                        <div class="w-8 h-8 ${isActive ? 'bg-navy-medium text-white' : 'bg-blue-light text-navy-medium'} 
                                    rounded-full flex items-center justify-center font-medium">
                            ${index + 1}
                        </div>
                        <span class="text-xs mt-1 text-navy-medium">${step}</span>
                    </div>
                    ${!isLast ? '<div class="flex-1 h-1 bg-blue-light mx-2"></div>' : ''}
                </div>
            `;
        }).join('');
    }
}

// Export for global use
window.UIComponents = UIComponents;