export class TwitterConnect {
    constructor(containerElement, onConnect, onDisconnect) {
        this.containerElement = containerElement;
        this.onConnect = onConnect;
        this.onDisconnect = onDisconnect;
    }

    render(isConnected) {
        this.containerElement.innerHTML = `
            <div class="twitter-connect">
                <h3>Twitter Connection</h3>
                ${isConnected ? `
                    <div class="connection-status connected">
                        <span class="status-text">✓ Connected to Twitter</span>
                        <button class="btn-disconnect">Disconnect</button>
                    </div>
                ` : `
                    <div class="connection-status">
                        <span class="status-text">Not connected to Twitter</span>
                        <button class="btn-connect">Connect Twitter</button>
                    </div>
                `}
            </div>
        `;

        this.addEventListeners(isConnected);
    }

    addEventListeners(isConnected) {
        if (isConnected) {
            this.containerElement.querySelector('.btn-disconnect')?.addEventListener('click', () => {
                if (confirm('Are you sure you want to disconnect your Twitter account?')) {
                    this.onDisconnect();
                }
            });
        } else {
            this.containerElement.querySelector('.btn-connect')?.addEventListener('click', () => {
                this.onConnect();
            });
        }
    }
} 