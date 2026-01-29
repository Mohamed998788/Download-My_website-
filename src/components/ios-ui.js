// iOS UI Components - Reusable UI Elements

export class IOSComponents {
    // Create iOS Card
    static createCard(options = {}) {
        const {
            title,
            subtitle,
            icon,
            content,
            actions = [],
            className = ''
        } = options;

        const card = document.createElement('div');
        card.className = `ios-card ${className}`;

        if (title || icon) {
            const header = document.createElement('div');
            header.className = 'ios-card-header';
            
            if (icon) {
                const iconEl = document.createElement('div');
                iconEl.className = 'ios-list-item-icon';
                iconEl.style.background = icon.background || 'var(--ios-blue)';
                iconEl.innerHTML = `<i class="${icon.class}"></i>`;
                header.appendChild(iconEl);
            }

            const titleContainer = document.createElement('div');
            titleContainer.className = 'ios-list-item-content';
            
            if (title) {
                const titleEl = document.createElement('div');
                titleEl.className = 'ios-card-title';
                titleEl.textContent = title;
                titleContainer.appendChild(titleEl);
            }
            
            if (subtitle) {
                const subtitleEl = document.createElement('div');
                subtitleEl.className = 'ios-list-item-subtitle';
                subtitleEl.textContent = subtitle;
                titleContainer.appendChild(subtitleEl);
            }
            
            header.appendChild(titleContainer);
            card.appendChild(header);
        }

        if (content) {
            const contentEl = document.createElement('div');
            contentEl.className = 'ios-card-content';
            if (typeof content === 'string') {
                contentEl.innerHTML = content;
            } else {
                contentEl.appendChild(content);
            }
            card.appendChild(contentEl);
        }

        if (actions.length > 0) {
            const actionsEl = document.createElement('div');
            actionsEl.className = 'ios-card-actions';
            actions.forEach(action => {
                const btn = this.createButton(action);
                actionsEl.appendChild(btn);
            });
            card.appendChild(actionsEl);
        }

        return card;
    }

    // Create iOS Button
    static createButton(options = {}) {
        const {
            text,
            icon,
            variant = 'primary',
            size = 'normal',
            onClick,
            className = ''
        } = options;

        const button = document.createElement('button');
        button.className = `ios-button ios-button-${variant} ${size === 'large' ? 'ios-button-large' : ''} ${className}`;
        
        if (icon) {
            const iconEl = document.createElement('i');
            iconEl.className = icon;
            button.appendChild(iconEl);
        }
        
        if (text) {
            const textEl = document.createElement('span');
            textEl.textContent = text;
            button.appendChild(textEl);
        }

        if (onClick) {
            button.addEventListener('click', onClick);
        }

        return button;
    }

    // Create iOS Segmented Control
    static createSegmentedControl(options = {}) {
        const {
            name,
            segments = [],
            selectedValue,
            onChange
        } = options;

        const container = document.createElement('div');
        container.className = 'ios-segmented-control';

        segments.forEach((segment, index) => {
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = name;
            input.id = `${name}-${index}`;
            input.value = segment.value;
            if (segment.value === selectedValue) {
                input.checked = true;
            }

            const label = document.createElement('label');
            label.htmlFor = `${name}-${index}`;
            label.innerHTML = segment.icon ? `<i class="${segment.icon}"></i> ${segment.label}` : segment.label;

            if (onChange) {
                input.addEventListener('change', () => onChange(segment.value));
            }

            container.appendChild(input);
            container.appendChild(label);
        });

        return container;
    }

    // Create iOS List
    static createList(items = []) {
        const list = document.createElement('div');
        list.className = 'ios-list';

        items.forEach(item => {
            const listItem = this.createListItem(item);
            list.appendChild(listItem);
        });

        return list;
    }

    // Create iOS List Item
    static createListItem(options = {}) {
        const {
            icon,
            iconBackground,
            title,
            subtitle,
            value,
            chevron = false,
            onClick,
            className = ''
        } = options;

        const item = document.createElement('div');
        item.className = `ios-list-item ${className}`;

        if (icon) {
            const iconEl = document.createElement('div');
            iconEl.className = 'ios-list-item-icon';
            iconEl.style.background = iconBackground || 'var(--ios-blue)';
            iconEl.innerHTML = `<i class="${icon}"></i>`;
            item.appendChild(iconEl);
        }

        const content = document.createElement('div');
        content.className = 'ios-list-item-content';

        if (title) {
            const titleEl = document.createElement('div');
            titleEl.className = 'ios-list-item-title';
            titleEl.textContent = title;
            content.appendChild(titleEl);
        }

        if (subtitle) {
            const subtitleEl = document.createElement('div');
            subtitleEl.className = 'ios-list-item-subtitle';
            subtitleEl.textContent = subtitle;
            content.appendChild(subtitleEl);
        }

        item.appendChild(content);

        if (value) {
            const valueEl = document.createElement('div');
            valueEl.style.color = 'var(--ios-label-dark-secondary)';
            valueEl.style.marginRight = '8px';
            valueEl.textContent = value;
            item.appendChild(valueEl);
        }

        if (chevron) {
            const chevronEl = document.createElement('i');
            chevronEl.className = 'fas fa-chevron-right ios-list-item-chevron';
            item.appendChild(chevronEl);
        }

        if (onClick) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', onClick);
        }

        return item;
    }

    // Create iOS Input
    static createInput(options = {}) {
        const {
            type = 'text',
            placeholder,
            value,
            onChange,
            onInput,
            className = ''
        } = options;

        const input = document.createElement('input');
        input.type = type;
        input.className = `ios-input ${className}`;
        
        if (placeholder) input.placeholder = placeholder;
        if (value) input.value = value;
        
        if (onChange) input.addEventListener('change', onChange);
        if (onInput) input.addEventListener('input', onInput);

        return input;
    }

    // Create iOS Slider
    static createSlider(options = {}) {
        const {
            min = 0,
            max = 100,
            value = 50,
            onChange,
            className = ''
        } = options;

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = `ios-slider ${className}`;
        slider.min = min;
        slider.max = max;
        slider.value = value;

        if (onChange) {
            slider.addEventListener('input', (e) => onChange(e.target.value));
        }

        return slider;
    }

    // Create iOS Switch
    static createSwitch(options = {}) {
        const {
            checked = false,
            onChange,
            className = ''
        } = options;

        const label = document.createElement('label');
        label.className = `ios-switch ${className}`;

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = checked;

        const slider = document.createElement('span');
        slider.className = 'ios-switch-slider';

        if (onChange) {
            input.addEventListener('change', (e) => onChange(e.target.checked));
        }

        label.appendChild(input);
        label.appendChild(slider);

        return label;
    }

    // Create iOS Badge
    static createBadge(options = {}) {
        const {
            text,
            variant = 'primary',
            className = ''
        } = options;

        const badge = document.createElement('span');
        badge.className = `ios-badge ios-badge-${variant} ${className}`;
        badge.textContent = text;

        return badge;
    }

    // Create iOS Toast
    static showToast(message, duration = 3000) {
        // Remove existing toast
        const existingToast = document.querySelector('.ios-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'ios-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // Create iOS Loading Skeleton
    static createSkeleton(options = {}) {
        const {
            width = '100%',
            height = '20px',
            className = ''
        } = options;

        const skeleton = document.createElement('div');
        skeleton.className = `ios-skeleton ${className}`;
        skeleton.style.width = width;
        skeleton.style.height = height;

        return skeleton;
    }

    // Create iOS Modal
    static createModal(options = {}) {
        const {
            title,
            content,
            actions = [],
            onClose
        } = options;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: rgba(44, 44, 46, 0.95);
            border-radius: 20px;
            width: 90%;
            max-width: 340px;
            overflow: hidden;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        `;

        if (title) {
            const titleEl = document.createElement('div');
            titleEl.style.cssText = `
                padding: 20px 20px 0;
                text-align: center;
                font-size: 18px;
                font-weight: 600;
            `;
            titleEl.textContent = title;
            modal.appendChild(titleEl);
        }

        if (content) {
            const contentEl = document.createElement('div');
            contentEl.style.cssText = `
                padding: 20px;
                text-align: center;
                color: var(--ios-label-dark-secondary);
            `;
            if (typeof content === 'string') {
                contentEl.textContent = content;
            } else {
                contentEl.appendChild(content);
            }
            modal.appendChild(contentEl);
        }

        if (actions.length > 0) {
            const actionsEl = document.createElement('div');
            actionsEl.style.cssText = `
                display: flex;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            `;

            actions.forEach((action, index) => {
                const btn = document.createElement('button');
                btn.style.cssText = `
                    flex: 1;
                    padding: 16px;
                    background: none;
                    border: none;
                    color: ${action.destructive ? 'var(--ios-red)' : 'var(--ios-blue)'};
                    font-size: 17px;
                    font-weight: 500;
                    cursor: pointer;
                    ${index > 0 ? 'border-left: 1px solid rgba(255, 255, 255, 0.1);' : ''}
                `;
                btn.textContent = action.text;
                btn.addEventListener('click', () => {
                    if (action.onClick) action.onClick();
                    this.closeModal(overlay);
                });
                actionsEl.appendChild(btn);
            });

            modal.appendChild(actionsEl);
        }

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Animate in
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        });

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeModal(overlay);
                if (onClose) onClose();
            }
        });

        return overlay;
    }

    // Close modal
    static closeModal(overlay) {
        overlay.style.opacity = '0';
        overlay.firstElementChild.style.transform = 'scale(0.9)';
        setTimeout(() => overlay.remove(), 300);
    }

    // Create iOS Picker
    static createPicker(options = {}) {
        const {
            items = [],
            selectedValue,
            onChange
        } = options;

        const container = document.createElement('div');
        container.className = 'ios-list';

        items.forEach(item => {
            const listItem = this.createListItem({
                title: item.label,
                icon: item.value === selectedValue ? 'fas fa-check' : null,
                iconBackground: 'var(--ios-blue)',
                onClick: () => {
                    if (onChange) onChange(item.value);
                    // Update checkmarks
                    container.querySelectorAll('.ios-list-item').forEach((el, idx) => {
                        const iconEl = el.querySelector('.ios-list-item-icon');
                        if (idx === items.indexOf(item)) {
                            if (!iconEl) {
                                const newIcon = document.createElement('div');
                                newIcon.className = 'ios-list-item-icon';
                                newIcon.style.background = 'var(--ios-blue)';
                                newIcon.innerHTML = '<i class="fas fa-check"></i>';
                                el.insertBefore(newIcon, el.firstChild);
                            }
                        } else {
                            if (iconEl) iconEl.remove();
                        }
                    });
                }
            });
            container.appendChild(listItem);
        });

        return container;
    }

    // Create sensitivity display card
    static createSensitivityCard(sensitivities, options = {}) {
        const { onShare, onSave } = options;

        const items = [
            { label: 'حساسية عامة', value: sensitivities.general, icon: 'fas fa-crosshairs', color: '#007AFF' },
            { label: 'النقطة الحمراء', value: sensitivities.redDot, icon: 'fas fa-dot-circle', color: '#FF3B30' },
            { label: 'سكوب 2x', value: sensitivities.scope2x, icon: 'fas fa-search-plus', color: '#34C759' },
            { label: 'سكوب 4x', value: sensitivities.scope4x, icon: 'fas fa-search', color: '#FF9500' },
            { label: 'القناصة', value: sensitivities.sniper, icon: 'fas fa-bullseye', color: '#AF52DE' },
            { label: 'النظر الحر', value: sensitivities.freeLook, icon: 'fas fa-eye', color: '#5AC8FA' },
            { label: 'حجم زر الضرب', value: sensitivities.fireButtonSize, icon: 'fas fa-hand-pointer', color: '#FF2D55' }
        ];

        const card = document.createElement('div');
        card.className = 'ios-card';
        card.style.animation = 'slideUp 0.5s ease';

        const list = document.createElement('div');
        list.className = 'ios-list';
        list.style.background = 'transparent';

        items.forEach(item => {
            const row = document.createElement('div');
            row.className = 'ios-list-item';
            row.style.padding = '12px 0';

            const iconEl = document.createElement('div');
            iconEl.className = 'ios-list-item-icon';
            iconEl.style.background = item.color;
            iconEl.style.width = '28px';
            iconEl.style.height = '28px';
            iconEl.style.fontSize = '12px';
            iconEl.innerHTML = `<i class="${item.icon}"></i>`;

            const content = document.createElement('div');
            content.className = 'ios-list-item-content';

            const title = document.createElement('div');
            title.className = 'ios-list-item-title';
            title.textContent = item.label;

            content.appendChild(title);

            const value = document.createElement('div');
            value.style.cssText = `
                background: ${item.color}20;
                color: ${item.color};
                padding: 4px 12px;
                border-radius: 12px;
                font-weight: 600;
                font-size: 14px;
            `;
            value.textContent = item.value;

            row.appendChild(iconEl);
            row.appendChild(content);
            row.appendChild(value);
            list.appendChild(row);
        });

        card.appendChild(list);

        // Action buttons
        if (onShare || onSave) {
            const actions = document.createElement('div');
            actions.style.cssText = `
                display: flex;
                gap: 12px;
                margin-top: 16px;
                padding-top: 16px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            `;

            if (onShare) {
                const shareBtn = this.createButton({
                    text: 'مشاركة',
                    icon: 'fas fa-share',
                    variant: 'secondary',
                    onClick: onShare
                });
                shareBtn.style.flex = '1';
                actions.appendChild(shareBtn);
            }

            if (onSave) {
                const saveBtn = this.createButton({
                    text: 'حفظ',
                    icon: 'fas fa-save',
                    variant: 'success',
                    onClick: onSave
                });
                saveBtn.style.flex = '1';
                actions.appendChild(saveBtn);
            }

            card.appendChild(actions);
        }

        return card;
    }
}

export default IOSComponents;
