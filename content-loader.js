// डायनेमिक कंटेंट मैनेजमेंट
const ContentLoader = {
    // कंटेंट टाइप्स
    contentTypes: {
        videos: 'content/videos.json',
        documents: 'content/documents.json',
        links: 'content/links.json',
        updates: 'content/updates.json'
    },
    
    // कंटेंट लोड करें
    loadContent: async function(type) {
        try {
            const response = await fetch(this.contentTypes[type]);
            const data = await response.json();
            this.renderContent(type, data);
            this.updateStats(data.length);
        } catch (error) {
            console.error('कंटेंट लोड करने में त्रुटि:', error);
            this.showError();
        }
    },
    
    // कंटेंट रेंडर करें
    renderContent: function(type, items) {
        const container = document.getElementById('contentContainer');
        const title = document.getElementById('contentTitle');
        
        // टाइटल सेट करें
        const titles = {
            videos: 'वीडियो लाइब्रेरी',
            documents: 'डॉक्यूमेंट्स',
            links: 'उपयोगी लिंक्स',
            updates: 'नए अपडेट्स'
        };
        title.textContent = titles[type] || 'कंटेंट';
        
        // कंटेंट जेनरेट करें
        let html = '';
        
        if (type === 'videos') {
            html = this.generateVideoGrid(items);
        } else if (type === 'documents') {
            html = this.generateDocumentList(items);
        } else if (type === 'links') {
            html = this.generateLinksGrid(items);
        } else if (type === 'updates') {
            html = this.generateUpdatesList(items);
        }
        
        container.innerHTML = html;
        
        // एक्सटर्नल लिंक्स लोड करें (अलग से)
        if (type === 'links') {
            this.loadExternalLinks();
        }
    },
    
    // वीडियो ग्रिड जेनरेट
    generateVideoGrid: function(videos) {
        return `
            <div class="video-grid">
                ${videos.map(video => `
                    <div class="video-card">
                        <div class="video-thumbnail">
                            ${video.embed ? 
                                `<iframe src="${video.embed}" frameborder="0" allowfullscreen></iframe>` : 
                                `<img src="${video.thumbnail || 'default-thumb.jpg'}" alt="${video.title}">`
                            }
                        </div>
                        <div class="video-info">
                            <h4>${video.title}</h4>
                            <p>${video.description}</p>
                            <div class="video-meta">
                                <span><i class="fas fa-calendar"></i> ${video.date}</span>
                                <span><i class="fas fa-clock"></i> ${video.duration}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    // एक्सटर्नल लिंक्स लोड करें
    loadExternalLinks: async function() {
        try {
            const response = await fetch('config/settings.json');
            const settings = await response.json();
            
            const linksContainer = document.getElementById('externalLinks');
            linksContainer.innerHTML = settings.externalLinks.map(link => `
                <div class="link-card">
                    <i class="${link.icon}"></i>
                    <h4>${link.title}</h4>
                    <p>${link.description}</p>
                    <a href="${link.url}" target="_blank" class="link-btn">
                        एक्सेस करें <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            `).join('');
        } catch (error) {
            console.error('लिंक्स लोड करने में त्रुटि:', error);
        }
    },
    
    // स्टेट्स अपडेट करें
    updateStats: function(count) {
        const statsElement = document.getElementById('contentCount');
        if (statsElement) {
            statsElement.textContent = `कुल आइटम्स: ${count}`;
        }
    },
    
    // एरर शो करें
    showError: function() {
        const container = document.getElementById('contentContainer');
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>कंटेंट लोड करने में त्रुटि</h3>
                <p>कृपया बाद में पुनः प्रयास करें</p>
            </div>
        `;
    }
};

// ग्लोबल फंक्शन
window.loadContent = function(type) {
    ContentLoader.loadContent(type);
};

// पेज लोड होने पर डिफॉल्ट कंटेंट लोड करें
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('dashboard')) {
        ContentLoader.loadContent('videos');
        ContentLoader.updateLastUpdate();
    }
});
