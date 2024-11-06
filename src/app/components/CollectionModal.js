import { Modal } from './Modal';

export class CollectionModal {
    constructor() {
        this.modal = new Modal();
        this.collection = null;
        this.onSave = null;
    }

    show(collection = null, onSave) {
        this.collection = collection;
        this.onSave = onSave;

        const content = `
            <div class="collection-form">
                <h2>${collection ? 'Edit Collection' : 'Create Collection'}</h2>
                <form id="collection-form">
                    <div class="form-group">
                        <label for="collection-name">Name</label>
                        <input type="text" id="collection-name" required 
                            value="${collection ? collection.name : ''}"
                            placeholder="Enter collection name">
                    </div>
                    <div class="form-group">
                        <label for="collection-description">Description</label>
                        <textarea id="collection-description" rows="3" 
                            placeholder="Enter collection description">${collection ? collection.description : ''}</textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" id="btn-cancel">Cancel</button>
                        <button type="submit" class="btn-primary">Save</button>
                    </div>
                </form>
            </div>
        `;

        this.modal.show(content, () => {
            // Cleanup when modal is closed
            this.collection = null;
            this.onSave = null;
        });

        // Add event listeners
        const form = document.getElementById('collection-form');
        const cancelButton = document.getElementById('btn-cancel');

        form.addEventListener('submit', (e) => this.handleSubmit(e));
        cancelButton.addEventListener('click', () => this.modal.hide());
    }

    async handleSubmit(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('collection-name').value,
            description: document.getElementById('collection-description').value
        };

        if (this.onSave) {
            await this.onSave(formData, this.collection);
        }

        this.modal.hide();
    }
} 