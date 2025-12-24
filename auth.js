// पासवर्ड और यूजर मैनेजमेंट
const AuthSystem = {
    // मास्टर पासवर्ड (आप बदल सकते हैं)
    masterPassword: "MySecure@123",
    
    // सेशन मैनेजमेंट
    init: function() {
        this.checkSession();
    },
    
    // पासवर्ड चेक
    checkPassword: function(password) {
        if (password === this.masterPassword) {
            this.createSession();
            this.redirectToDashboard();
            return true;
        }
        return false;
    },
    
    // सेशन बनाएं (24 घंटे के लिए)
    createSession: function() {
        const sessionData = {
            authenticated: true,
            timestamp: new Date().getTime(),
            expires: new Date().getTime() + (24 * 60 * 60 * 1000)
        };
        localStorage.setItem('privatePortalSession', JSON.stringify(sessionData));
    },
    
    // सेशन चेक करें
    checkSession: function() {
        const session = localStorage.getItem('privatePortalSession');
        if (session) {
            const sessionData = JSON.parse(session);
            if (sessionData.authenticated && new Date().getTime() < sessionData.expires) {
                this.redirectToDashboard();
            }
        }
    },
    
    // डैशबोर्ड पर रीडायरेक्ट
    redirectToDashboard: function() {
        window.location.href = "dashboard.html";
    },
    
    // लॉगआउट
    logout: function() {
        localStorage.removeItem('privatePortalSession');
        window.location.href = "index.html";
    }
};

// ग्लोबल एक्सेस
window.checkPassword = function() {
    const password = document.getElementById('passwordInput').value;
    if (AuthSystem.checkPassword(password)) {
        document.getElementById('errorMessage').textContent = "लॉगिन सफल! रीडायरेक्ट हो रहे हैं...";
    } else {
        document.getElementById('errorMessage').textContent = "गलत पासवर्ड! पुनः प्रयास करें।";
    }
};

// पेज लोड होने पर इनिशियलाइज़
document.addEventListener('DOMContentLoaded', function() {
    AuthSystem.init();
});
