class ColorPaletteGenerator {
    constructor() {
        this.colors = Array(5).fill(null).map(() => this.generateRandomColor());
        this.lockedColors = Array(5).fill(false);
        this.history = JSON.parse(localStorage.getItem('colorHistory')) || [];
        
        this.init();
    }
    
    init() {
        this.renderPalette();
        this.renderHistory();
        this.setupEventListeners();
    }
    
    generateRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    generatePalette() {
        this.colors = this.colors.map((color, index) => {
            return this.lockedColors[index] ? color : this.generateRandomColor();
        });
        this.renderPalette();
        this.addToHistory();
    }
    
    renderPalette() {
        const container = document.querySelector('.palette-container');
        container.innerHTML = '';
        
        this.colors.forEach((color, index) => {
            const colorElement = document.createElement('div');
            colorElement.className = 'color-item';
            colorElement.style.backgroundColor = color;
            
            colorElement.innerHTML = `
                <div class="color-value">${color}</div>
                <button class="lock-btn ${this.lockedColors[index] ? 'locked' : ''}" 
                        data-index="${index}">
                    ${this.lockedColors[index] ? '🔒' : '🔓'}
                </button>
            `;
            
            container.appendChild(colorElement);
        });
        
        this.setupColorEvents();
    }
    
    setupEventListeners() {
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generatePalette();
        });
        
        document.getElementById('lockAllBtn').addEventListener('click', () => {
            this.lockedColors.fill(false);
            this.generatePalette();
        });
        
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('lock-btn')) {
                const index = parseInt(e.target.dataset.index);
                this.toggleLock(index);
            }
        });
    }
    
    setupColorEvents() {
        document.querySelectorAll('.color-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('lock-btn')) {
                    const colorValue = item.querySelector('.color-value').textContent;
                    this.copyToClipboard(colorValue);
                    this.showCopyFeedback(item);
                }
            });
        });
    }
    
    toggleLock(index) {
        this.lockedColors[index] = !this.lockedColors[index];
        this.renderPalette();
    }
    
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Цвет скопирован: ' + text);
        });
    }
    
    showCopyFeedback(element) {
        const originalText = element.querySelector('.color-value').textContent;
        element.querySelector('.color-value').textContent = 'Скопировано!';
        element.style.transform = 'scale(1.02)';
        
        setTimeout(() => {
            element.querySelector('.color-value').textContent = originalText;
            element.style.transform = '';
        }, 1000);
    }
    
    addToHistory() {
        const palette = [...this.colors];
        this.history.unshift(palette);
        
        if (this.history.length > 12) {
            this.history = this.history.slice(0, 12);
        }
        
        localStorage.setItem('colorHistory', JSON.stringify(this.history));
        this.renderHistory();
    }
    
    renderHistory() {
        const container = document.getElementById('history-container');
        
        if (this.history.length === 0) {
            container.innerHTML = '<div class="empty-history">Здесь появятся ваши предыдущие палитры</div>';
            return;
        }
        
        container.innerHTML = '';
        
        this.history.forEach((palette, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.style.background = `linear-gradient(135deg, ${palette.join(', ')})`;
            historyItem.title = 'Кликните чтобы использовать эту палитру';
            
            historyItem.addEventListener('click', () => {
                this.colors = [...palette];
                this.lockedColors.fill(false);
                this.renderPalette();
            });
            
            container.appendChild(historyItem);
        });
    }
}

// Запуск приложения когда страница загрузится
document.addEventListener('DOMContentLoaded', () => {
    new ColorPaletteGenerator();
});