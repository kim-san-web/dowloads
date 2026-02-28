/**
 * StreamSave Pro - Content Script
 * Handles injection of the download button into native video players.
 */

const CONFIG = {
    YOUTUBE: {
        domain: 'youtube.com',
        target: '#top-level-buttons-computed, #segmented-like-button',
        classes: 'yt-spec-button-shape-next yt-spec-button-shape-next--filled yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m',
        style: 'background: #2563eb; color: white; border-radius: 18px; padding: 0 16px; height: 36px; margin-left: 8px; font-size: 14px; font-weight: 500; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px;'
    },
    FACEBOOK: {
        domain: 'facebook.com',
        target: 'div[role="toolbar"]',
        style: 'background-color: #2563eb; color: #fff; border: none; border-radius: 6px; padding: 6px 12px; margin: 4px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px;'
    }
};

function injectButton() {
    if (document.getElementById('ss-pro-btn')) return;

    const isYT = window.location.host.includes(CONFIG.YOUTUBE.domain);
    const isFB = window.location.host.includes(CONFIG.FACEBOOK.domain);
    const activeConfig = isYT ? CONFIG.YOUTUBE : (isFB ? CONFIG.FACEBOOK : null);

    if (!activeConfig) return;

    const container = document.querySelector(activeConfig.target);
    if (!container) return;

    const btn = document.createElement('button');
    btn.id = 'ss-pro-btn';
    btn.setAttribute('style', activeConfig.style);
    btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span>Save HD</span>
    `;

    btn.onclick = (e) => {
        e.preventDefault();
        // Open the web app with the current URL as a parameter
        const downloadUrl = `https://streamsave.app/?url=${encodeURIComponent(window.location.href)}`;
        window.open(downloadUrl, '_blank');
    };

    // Injection logic
    if (isYT) {
        container.parentNode.insertBefore(btn, container);
    } else {
        container.appendChild(btn);
    }
}

// Watch for DOM changes (important for SPAs like YouTube)
const observer = new MutationObserver(() => injectButton());
observer.observe(document.body, { childList: true, subtree: true });

// Initial injection
injectButton();