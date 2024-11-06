export class Modal {
    constructor() {
        this.modalElement = null;
        this.onClose = null;
    }

    show(content, onClose) {
        this.onClose = onClose;
        
        // Create modal container if it doesn't exist
        if (!this.modalElement) {
            this.modalElement = document.createElement('div');
            this.modalElement.className = 'modal-container';
            document.body.appendChild(this.modalElement);
        }

        // Set modal content
        this.modalElement.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                ${content}
            </div>
        `;

        // Add event listeners
        this.modalElement.querySelector('.modal-overlay').addEventListener('click', () => this.hide());
        this.modalElement.querySelector('.modal-close').addEventListener('click', () => this.hide());

        // Show modal
        this.modalElement.classList.add('active');
    }

    hide() {
        if (this.modalElement) {
            this.modalElement.classList.remove('active');
            if (this.onClose) {
                this.onClose();
            }
        }
    }
} 