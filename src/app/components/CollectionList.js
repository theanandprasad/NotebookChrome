import { CollectionModal } from './CollectionModal';

export class CollectionList {
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.collections = [];
        this.collectionModal = new CollectionModal();
    }

    setCollections(collections) {
        this.collections = collections;
        this.render();
    }

    render() {
        if (this.collections.length === 0) {
            this.containerElement.innerHTML = `
                <div class="empty-state">
                    <p>No collections yet. Create one to organize your tweets!</p>
                    <button class="btn-create-collection">Create Collection</button>
                </div>
            `;
        } else {
            this.containerElement.innerHTML = `
                <div class="collections-header">
                    <button class="btn-create-collection">New Collection</button>
                </div>
                <div class="collection-grid">
                    ${this.collections.map(collection => this.renderCollection(collection)).join('')}
                </div>
            `;
        }

        // Add event listeners after rendering
        this.addEventListeners();
    }

    renderCollection(collection) {
        return `
            <div class="collection-card" data-collection-id="${collection.id}">
                <div class="collection-header">
                    <h3>${collection.name}</h3>
                    <div class="collection-actions">
                        <button class="btn-edit" title="Edit collection">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" title="Delete collection">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p class="collection-description">${collection.description || 'No description'}</p>
                <div class="collection-footer">
                    <span>${collection.tweetCount} tweets</span>
                    <span>Updated ${new Date(collection.updatedAt).toLocaleDateString()}</span>
                </div>
            </div>
        `;
    }

    addEventListeners() {
        // Create collection button
        this.containerElement.querySelector('.btn-create-collection')?.addEventListener('click', () => {
            this.handleCreateCollection();
        });

        // Edit buttons
        this.containerElement.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', (e) => {
                const collectionCard = e.target.closest('.collection-card');
                const collectionId = collectionCard.dataset.collectionId;
                this.handleEditCollection(collectionId);
            });
        });

        // Delete buttons
        this.containerElement.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const collectionCard = e.target.closest('.collection-card');
                const collectionId = collectionCard.dataset.collectionId;
                this.handleDeleteCollection(collectionId);
            });
        });
    }

    async handleCreateCollection() {
        this.collectionModal.show(null, async (formData) => {
            try {
                await this.onCreateCollection(formData);
                // Refresh collections
                const collections = await this.onGetCollections();
                this.setCollections(collections);
            } catch (error) {
                console.error('Error creating collection:', error);
            }
        });
    }

    async handleEditCollection(collectionId) {
        const collection = this.collections.find(c => c.id === collectionId);
        if (collection) {
            this.collectionModal.show(collection, async (formData) => {
                try {
                    await this.onUpdateCollection(collectionId, formData);
                    // Refresh collections
                    const collections = await this.onGetCollections();
                    this.setCollections(collections);
                } catch (error) {
                    console.error('Error updating collection:', error);
                }
            });
        }
    }

    async handleDeleteCollection(collectionId) {
        if (confirm('Are you sure you want to delete this collection?')) {
            try {
                await this.onDeleteCollection(collectionId);
                this.collections = this.collections.filter(c => c.id !== collectionId);
                this.render();
            } catch (error) {
                console.error('Error deleting collection:', error);
            }
        }
    }

    setOnDeleteCollection(callback) {
        this.onDeleteCollection = callback;
    }

    setOnCreateCollection(callback) {
        this.onCreateCollection = callback;
    }

    setOnUpdateCollection(callback) {
        this.onUpdateCollection = callback;
    }

    setOnGetCollections(callback) {
        this.onGetCollections = callback;
    }
} 