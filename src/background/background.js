// Listen for extension icon click
chrome.action.onClicked.addListener((tab) => {
    // Check if the app is already open
    chrome.tabs.query({ url: chrome.runtime.getURL('src/app/index.html') }, (tabs) => {
        if (tabs.length > 0) {
            // If app is already open, focus on it
            chrome.tabs.update(tabs[0].id, { active: true });
        } else {
            // Open the app in a new tab
            chrome.tabs.create({ url: chrome.runtime.getURL('src/app/index.html') });
        }
    });
});

// Initialize background service worker
console.log('Background service worker initialized'); 