// Custom Router Class
class CustomRouter {
    constructor() {
        this.routes = {};
        this.cache = {};
        this.currentRoute = '';
        this.init();
    }

    addRoute(path, callback) {
        this.routes[path] = callback;
    }

    navigate(path) {
        if (this.cache[path]) {
            this.applyPage(this.cache[path]);
        } else {
            if (this.routes[path]) {
                this.routes[path]();
            }
        }
        this.currentRoute = path;
        window.history.pushState({}, '', path);
    }

    init() {
        window.addEventListener('popstate', () => {
            const path = window.location.pathname;
            if (this.routes[path]) {
                this.routes[path]();
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.getAttribute('href')) {
                e.preventDefault();
                this.navigate(e.target.getAttribute('href'));
            }
        });
    }

    applyPage(pageData) {
        document.getElementById('app').innerHTML = pageData.html;

        // Apply dynamic styles and scripts
        pageData.styles.forEach(style => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = style;
            document.head.appendChild(link);
        });

        pageData.scripts.forEach(script => {
            const scriptTag = document.createElement('script');
            scriptTag.src = script;
            document.body.appendChild(scriptTag);
        });

        // Initialize lazy loading for images
        if (typeof initializeLazyLoading === 'function') {
            initializeLazyLoading();
        }
    }
}

const router = new CustomRouter();

// Load page content dynamically from Laravel
function loadPageContent(url) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.html) {
                router.cache[url] = data; // Cache the entire page data
                router.applyPage(data); // Apply HTML, styles, and scripts
            } else if (data.error) {
                showNotification(data.error, 'error');
            }
        })
        .catch(error => {
            console.error('Failed to load page:', error);
            showNotification('Failed to load page!', 'error');
        });
}

// Handle dynamic routes with parameters
function navigateWithParams(path) {
    const match = path.match(/\/(page|product)\/([\w-]+)/);
    if (match) {
        const type = match[1];
        const id = match[2];

        if (type === 'page') {
            router.navigate(`/page/${id}`, { page: id });
        } else if (type === 'product') {
            loadPageContent(`/product/${id}`);
        }
    } else {
        router.navigate(path);
    }
}

// Replace default navigate with navigateWithParams
router.navigate = navigateWithParams;

// Utility Function: Show Notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Lazy Loading for Images
function initializeLazyLoading() {
    document.querySelectorAll('img[data-src]').forEach(img => {
        const parent = img.parentElement;
        parent.classList.add('image-container-load'); // Add loading animation class

        img.src = img.dataset.src;
        img.removeAttribute('data-src');

        img.onload = () => {
            parent.classList.remove('image-container-load'); // Remove loading animation after image loads
        };
    });
}

// Infinite Scroll
function enableInfiniteScroll(containerSelector, apiEndpoint) {
    let loading = false;
    let page = 1;

    const container = document.querySelector(containerSelector);
    if (!container) return;

    window.addEventListener('scroll', () => {
        if (
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
            !loading
        ) {
            loading = true;
            page++;

            fetch(`${apiEndpoint}?page=${page}`)
                .then(res => res.json())
                .then(data => {
                    if (data.length > 0) {
                        data.forEach(item => {
                            const itemElement = document.createElement('div');
                            itemElement.innerHTML = `<h3>${item.name}</h3><p>${item.description}</p>`;
                            container.appendChild(itemElement);
                        });
                    } else {
                        window.removeEventListener('scroll', arguments.callee);
                    }
                    loading = false;
                });
        }
    });
}

// Dynamic Filtering and Sorting
function enableDynamicFiltering(apiEndpoint, filterFormId, resultsContainerId) {
    const filterForm = document.getElementById(filterFormId);
    const resultsContainer = document.getElementById(resultsContainerId);

    if (!filterForm || !resultsContainer) return;

    filterForm.addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(filterForm);

        fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData)),
        })
            .then(res => res.json())
            .then(data => {
                resultsContainer.innerHTML = '';
                data.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.innerHTML = `<h3>${item.name}</h3><p>${item.price}</p>`;
                    resultsContainer.appendChild(itemElement);
                });
            });
    });
}

// Reader Mode
function enableReaderMode(toggleButtonId, contentSelector) {
    const toggleButton = document.getElementById(toggleButtonId);
    const content = document.querySelector(contentSelector);

    if (!toggleButton || !content) return;

    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('reader-mode');
        content.style.maxWidth = document.body.classList.contains('reader-mode') ? '800px' : 'none';
        content.style.margin = document.body.classList.contains('reader-mode') ? '20px auto' : '0';
    });
}

// Favorite Pages
function enableFavorites(favoriteButtonClass, favoritesStorageKey = 'user_favorites') {
    const favoriteButtons = document.querySelectorAll(favoriteButtonClass);

    favoriteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const url = button.dataset.url;
            let favorites = JSON.parse(localStorage.getItem(favoritesStorageKey)) || [];

            if (favorites.includes(url)) {
                favorites = favorites.filter(fav => fav !== url);
                button.classList.remove('favorited');
            } else {
                favorites.push(url);
                button.classList.add('favorited');
            }

            localStorage.setItem(favoritesStorageKey, JSON.stringify(favorites));
        });
    });
}

// Real-Time Notifications
function enableRealTimeNotifications(apiEndpoint) {
    setInterval(() => {
        fetch(apiEndpoint)
            .then(res => res.json())
            .then(data => {
                data.forEach(notification => {
                    showNotification(notification.message, 'info');
                });
            });
    }, 10000); // Check every 10 seconds
}

// Print Specific Content Based on Class or ID with Custom CSS
function printContent(selector, cssPath = null) {
    const content = document.querySelector(selector);
    if (content) {
        const printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print</title>
                    ${cssPath ? `<link rel="stylesheet" href="${cssPath}">` : ''}
                </head>
                <body>${content.innerHTML}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    } else {
        showNotification('No content found to print!', 'error');
    }
}

// Export Content as PDF
async function exportToPDF(selector, pdfFileName = 'document.pdf') {
    try {
        await importJsPDF(); // Ensure jsPDF is loaded
        const content = document.querySelector(selector);
        if (!content) {
            showNotification('No content found to export!', 'error');
            return;
        }
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        pdf.html(content, {
            callback: function (pdf) {
                pdf.save(pdfFileName);
            },
            x: 10,
            y: 10,
            width: 190,
        });
    } catch (error) {
        console.error('Failed to export to PDF:', error);
        showNotification('Failed to export to PDF!', 'error');
    }
}

// Import jsPDF dynamically
const importJsPDF = () => {
    return new Promise((resolve, reject) => {
        if (typeof window.jspdf !== 'undefined') {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load jsPDF'));
        document.head.appendChild(script);
    });
};

// Multilingual Support with Default Language as English
function enableMultilingualSupport(defaultLang = 'en') {
    const translations = {
        en: { welcome: 'Welcome', logout: 'Logout' },
        ar: { welcome: 'مرحبًا', logout: 'تسجيل خروج' },
    };

    let currentLang = defaultLang;

    function setLanguage(lang) {
        currentLang = lang;
        updateTranslations();
    }

    function updateTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = translations[currentLang][el.dataset.i18n] || el.textContent;
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const langFiles = {
            en: '/resources/lang/en.json',
            ar: '/resources/lang/ar.json',
        };

        fetch(langFiles[currentLang])
            .then(res => res.json())
            .then(data => {
                translations[currentLang] = data;
                updateTranslations();
            })
            .catch(() => console.error('Failed to load language file.'));
    });

    return { setLanguage };
}

// Auto Dark Mode Based on Time
function enableAutoDarkMode() {
    function autoDarkMode() {
        const hour = new Date().getHours();
        if (hour >= 18 || hour < 6) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        autoDarkMode();
    });
}

// Local Notifications
function enableLocalNotifications(interval = 60000) {
    function sendNotification(title, body) {
        if (Notification.permission === 'granted') {
            new Notification(title, { body });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, { body });
                }
            });
        }
    }

    setInterval(() => sendNotification('New Deal!', 'Check out our latest offer!'), interval);
}

// Save Current State of Forms
function enableFormStateSaving() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('input', () => {
            const formData = new FormData(form);
            localStorage.setItem(`formState-${form.id}`, JSON.stringify(Object.fromEntries(formData)));
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('form').forEach(form => {
            const savedState = JSON.parse(localStorage.getItem(`formState-${form.id}`));
            if (savedState) {
                Object.entries(savedState).forEach(([key, value]) => {
                    form.querySelector(`[name="${key}"]`).value = value;
                });
            }
        });
    });
}

// Responsive Design Enhancements
function enableResponsiveDesign() {
    if (window.innerWidth < 768) {
        document.body.classList.add('mobile-layout');
    }
}

// Advanced Search
function enableAdvancedSearch(searchFormId, resultsContainerId) {
    const searchForm = document.getElementById(searchFormId);
    const resultsContainer = document.getElementById(resultsContainerId);

    if (!searchForm || !resultsContainer) return;

    searchForm.addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(searchForm);

        fetch(`/api/search?q=${encodeURIComponent(formData.get('query'))}&category=${encodeURIComponent(formData.get('category'))}`)
            .then(res => res.json())
            .then(data => {
                resultsContainer.innerHTML = '';
                data.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item.name;
                    resultsContainer.appendChild(li);
                });
            });
    });
}

// Export Functions for External Use
export const App = {
    initializeLazyLoading,
    enableInfiniteScroll,
    enableDynamicFiltering,
    enableReaderMode,
    enableFavorites,
    enableRealTimeNotifications,
    printContent,
    exportToPDF,
    enableMultilingualSupport,
    enableAutoDarkMode,
    enableLocalNotifications,
    enableFormStateSaving,
    enableResponsiveDesign,
    enableAdvancedSearch,
};
