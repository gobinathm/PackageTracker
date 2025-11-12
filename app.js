// Package Tracker Application

// Provider detection patterns
const PROVIDERS = {
    USPS: {
        name: 'USPS',
        patterns: [
            /^(94|93|92|94|95)[0-9]{20}$/,  // 22 digits starting with 94, 93, 92, 95
            /^(70|14|23|03)[0-9]{14}$/,      // 16 digits
            /^(M0|82)[0-9]{8}$/,             // 10 digits
            /^[A-Z]{2}[0-9]{9}[A-Z]{2}$/     // 2 letters + 9 digits + 2 letters
        ],
        trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction?tLabels='
    },
    UPS: {
        name: 'UPS',
        patterns: [
            /^1Z[A-Z0-9]{16}$/,              // 1Z followed by 16 alphanumeric
            /^[T|H|K|J|D][0-9]{10}$/,        // T, H, K, J, or D followed by 10 digits
            /^[0-9]{26}$/                    // 26 digits
        ],
        trackingUrl: 'https://www.ups.com/track?tracknum='
    },
    FEDEX: {
        name: 'FedEx',
        patterns: [
            /^[0-9]{12}$/,                   // 12 digits
            /^[0-9]{15}$/,                   // 15 digits
            /^[0-9]{20}$/,                   // 20 digits
            /^[0-9]{22}$/                    // 22 digits
        ],
        trackingUrl: 'https://www.fedex.com/fedextrack/?trknbr='
    },
    DHL: {
        name: 'DHL',
        patterns: [
            /^[0-9]{10,11}$/,                // 10-11 digits
            /^[0-9]{20}$/,                   // 20 digits
            /^[A-Z]{3}[0-9]{7}$/             // 3 letters + 7 digits
        ],
        trackingUrl: 'https://www.dhl.com/en/express/tracking.html?AWB='
    },
    AMAZON: {
        name: 'Amazon Logistics',
        patterns: [
            /^TBA[0-9]{12}$/,                // TBA followed by 12 digits
            /^TBM[0-9]{12}$/                 // TBM followed by 12 digits
        ],
        trackingUrl: 'https://track.amazon.com/tracking/'
    },
    ONTRAC: {
        name: 'OnTrac',
        patterns: [
            /^C[0-9]{14}$/                   // C followed by 14 digits
        ],
        trackingUrl: 'https://www.ontrac.com/tracking/?number='
    },
    LASERSHIP: {
        name: 'LaserShip',
        patterns: [
            /^L[A-Z][0-9]{8}$/,              // L + letter + 8 digits
            /^1LS[0-9]{12}$/                 // 1LS + 12 digits
        ],
        trackingUrl: 'https://www.lasership.com/track/'
    }
};

// Local Storage Manager
class PackageStorage {
    constructor() {
        this.storageKey = 'packageTracker_packages';
    }

    getPackages() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    savePackages(packages) {
        localStorage.setItem(this.storageKey, JSON.stringify(packages));
    }

    addPackage(packageData) {
        const packages = this.getPackages();
        packages.unshift(packageData); // Add to beginning
        this.savePackages(packages);
    }

    deletePackage(id) {
        const packages = this.getPackages();
        const filtered = packages.filter(pkg => pkg.id !== id);
        this.savePackages(filtered);
    }

    clearAll() {
        localStorage.removeItem(this.storageKey);
    }

    updatePackage(id, updates) {
        const packages = this.getPackages();
        const index = packages.findIndex(pkg => pkg.id === id);
        if (index !== -1) {
            packages[index] = { ...packages[index], ...updates };
            this.savePackages(packages);
        }
    }
}

// Provider Detector
class ProviderDetector {
    static detect(trackingNumber) {
        const cleanNumber = trackingNumber.trim().toUpperCase();

        for (const [key, provider] of Object.entries(PROVIDERS)) {
            for (const pattern of provider.patterns) {
                if (pattern.test(cleanNumber)) {
                    return {
                        provider: provider.name,
                        trackingUrl: provider.trackingUrl + cleanNumber,
                        providerKey: key.toLowerCase()
                    };
                }
            }
        }

        return {
            provider: 'Unknown',
            trackingUrl: null,
            providerKey: 'unknown'
        };
    }
}

// Package Manager
class PackageManager {
    constructor() {
        this.storage = new PackageStorage();
        this.packagesContainer = document.getElementById('packagesContainer');
        this.form = document.getElementById('addPackageForm');
        this.clearAllBtn = document.getElementById('clearAllBtn');

        this.init();
    }

    init() {
        this.bindEvents();
        this.renderPackages();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleAddPackage(e));
        this.clearAllBtn.addEventListener('click', () => this.handleClearAll());
    }

    handleAddPackage(e) {
        e.preventDefault();

        const trackingNumber = document.getElementById('trackingNumber').value.trim();
        const packageName = document.getElementById('packageName').value.trim();

        if (!trackingNumber) {
            alert('Please enter a tracking number');
            return;
        }

        // Check for duplicates
        const existingPackages = this.storage.getPackages();
        if (existingPackages.some(pkg => pkg.trackingNumber.toUpperCase() === trackingNumber.toUpperCase())) {
            alert('This tracking number is already being tracked');
            return;
        }

        const detection = ProviderDetector.detect(trackingNumber);

        const packageData = {
            id: Date.now().toString(),
            trackingNumber: trackingNumber.toUpperCase(),
            name: packageName || 'Package',
            provider: detection.provider,
            providerKey: detection.providerKey,
            trackingUrl: detection.trackingUrl,
            status: 'Tracking information will be available soon',
            addedDate: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };

        this.storage.addPackage(packageData);
        this.renderPackages();
        this.form.reset();

        // Scroll to packages section
        this.packagesContainer.scrollIntoView({ behavior: 'smooth' });
    }

    handleDeletePackage(id) {
        if (confirm('Are you sure you want to remove this package?')) {
            this.storage.deletePackage(id);
            this.renderPackages();
        }
    }

    handleClearAll() {
        const packages = this.storage.getPackages();
        if (packages.length === 0) {
            return;
        }

        if (confirm(`Are you sure you want to remove all ${packages.length} package(s)?`)) {
            this.storage.clearAll();
            this.renderPackages();
        }
    }

    handleTrackPackage(trackingUrl) {
        if (trackingUrl) {
            window.open(trackingUrl, '_blank');
        }
    }

    renderPackages() {
        const packages = this.storage.getPackages();

        if (packages.length === 0) {
            this.packagesContainer.innerHTML = `
                <div class="empty-state">
                    <p>No packages tracked yet. Add a tracking number above to get started!</p>
                </div>
            `;
            return;
        }

        this.packagesContainer.innerHTML = packages.map(pkg => this.createPackageCard(pkg)).join('');

        // Bind delete buttons
        packages.forEach(pkg => {
            const deleteBtn = document.getElementById(`delete-${pkg.id}`);
            const trackBtn = document.getElementById(`track-${pkg.id}`);

            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.handleDeletePackage(pkg.id));
            }

            if (trackBtn && pkg.trackingUrl) {
                trackBtn.addEventListener('click', () => this.handleTrackPackage(pkg.trackingUrl));
            }
        });
    }

    createPackageCard(pkg) {
        const addedDate = new Date(pkg.addedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const trackButton = pkg.trackingUrl
            ? `<button id="track-${pkg.id}" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.9rem;">Track Online</button>`
            : '';

        return `
            <div class="package-card">
                <div class="package-header">
                    <div class="package-info">
                        <h3>${this.escapeHtml(pkg.name)}</h3>
                        <p class="tracking-number">${this.escapeHtml(pkg.trackingNumber)}</p>
                        <span class="provider-badge provider-${pkg.providerKey}">${this.escapeHtml(pkg.provider)}</span>
                    </div>
                    <div class="package-actions">
                        ${trackButton}
                        <button id="delete-${pkg.id}" class="btn btn-danger">Delete</button>
                    </div>
                </div>
                <div class="status-info">
                    <p><strong>Status:</strong> ${this.escapeHtml(pkg.status)}</p>
                    ${pkg.location ? `<p><strong>Location:</strong> ${this.escapeHtml(pkg.location)}</p>` : ''}
                    ${pkg.estimatedDelivery ? `<p><strong>Est. Delivery:</strong> ${this.escapeHtml(pkg.estimatedDelivery)}</p>` : ''}
                </div>
                <p class="date-added">Added: ${addedDate}</p>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PackageManager();
});
