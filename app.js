// Package Tracker Application

// Provider detection patterns
const PROVIDERS = {
    // Specific patterns first to avoid conflicts with generic patterns

    // USA Carriers - Specific patterns
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
    },

    // Canadian Carriers - Place BEFORE generic patterns
    PUROLATOR: {
        name: 'Purolator',
        patterns: [
            /^[A-Z]{3}[0-9]{9}$/,            // 3 letters + 9 digits (e.g., XCC023368173)
            /^[0-9]{12}$/                    // 12 digits
        ],
        trackingUrl: 'https://www.purolator.com/en/shipping/tracker?pin='
    },
    CANADAPOST: {
        name: 'Canada Post',
        patterns: [
            /^[A-Z]{2}[0-9]{9}[A-Z]{2}$/,   // 2 letters + 9 digits + 2 letters (international)
            /^[0-9]{16}$/,                   // 16 digits
            /^[0-9]{13}$/                    // 13 digits
        ],
        trackingUrl: 'https://www.canadapost-postescanada.ca/track-reperage/en#/search?searchFor='
    },
    CANPAR: {
        name: 'Canpar',
        patterns: [
            /^[A-Z][0-9]{10}$/               // 1 letter + 10 digits
        ],
        trackingUrl: 'https://www.canpar.com/en/track/TrackingAction.do?reference='
    },
    DAYROSS: {
        name: 'Day & Ross',
        patterns: [
            /^DR[0-9]{8}$/                   // DR + 8 digits
        ],
        trackingUrl: 'https://www.dayross.com/tracking?pro='
    },
    DICOM: {
        name: 'Dicom Express',
        patterns: [
            /^DC[0-9]{10}$/                  // DC + 10 digits
        ],
        trackingUrl: 'https://www.dicom.com/track-trace/?tracking='
    },
    ICS: {
        name: 'ICS Courier',
        patterns: [
            /^[0-9]{10}$/                    // 10 digits
        ],
        trackingUrl: 'https://www.icscourier.com/track?trackingNumber='
    },
    LOOMIS: {
        name: 'Loomis Express',
        patterns: [
            /^[0-9]{11}$/                    // 11 digits
        ],
        trackingUrl: 'https://www.loomis-express.com/track/?trackingNumber='
    },

    // Generic USA patterns - Place AFTER specific patterns to avoid conflicts
    GLS_US: {
        name: 'GLS US',
        patterns: [
            /^[0-9]{18}$/                    // 18 digits
        ],
        trackingUrl: 'https://www.gls-us.com/tracking?match='
    },
    PITNEYBOWES: {
        name: 'Pitney Bowes',
        patterns: [
            /^82[0-9]{20}$/,                 // 82 + 20 digits (specific)
            /^420[0-9]{27}$/,                // 420 + 27 digits (USPS format)
            /^[0-9]{22}$/                    // 22 digits (generic - last)
        ],
        trackingUrl: 'https://www.pitneybowes.com/us/shipping-tracking.html?trackingNumber='
    },
    NEWGISTICS: {
        name: 'Newgistics',
        patterns: [
            /^42[0-9]{20}$/                  // 42 + 20 digits
        ],
        trackingUrl: 'https://www.newgistics.com/track/?number='
    },
    APC: {
        name: 'APC Postal Logistics',
        patterns: [
            /^[A-Z]{2}[0-9]{9}US$/           // 2 letters + 9 digits + US
        ],
        trackingUrl: 'https://www.apc-pli.com/tracking?p='
    },
    ESTES: {
        name: 'Estes Express',
        patterns: [
            /^[0-9]{3}-[0-9]{7}$/            // XXX-XXXXXXX format
        ],
        trackingUrl: 'https://www.estes-express.com/shipment-tracking/?pro='
    },
    RRDONNELLEY: {
        name: 'RR Donnelley',
        patterns: [
            /^92748[0-9]{17}$/,              // 92748 + 17 digits (specific)
            /^[0-9]{22}$/                    // 22 digits (generic - conflicts with Pitney Bowes)
        ],
        trackingUrl: 'https://track.rrd.com/'
    },
    GLOBALPOST: {
        name: 'GlobalPost',
        patterns: [
            /^420[0-9]{27}$/,                // 420 + 27 digits
            /^92055[0-9]{17}$/               // 92055 + 17 digits
        ],
        trackingUrl: 'https://www.globalpost.com/track'
    },
    DHL: {
        name: 'DHL',
        patterns: [
            /^[A-Z]{3}[0-9]{7}$/,            // 3 letters + 7 digits
            /^[0-9]{10,11}$/                 // 10-11 digits
        ],
        trackingUrl: 'https://www.dhl.com/en/express/tracking.html?AWB='
    },
    FEDEX: {
        name: 'FedEx',
        patterns: [
            /^[0-9]{15}$/,                   // 15 digits
            /^[0-9]{20}$/,                   // 20 digits
            /^[0-9]{22}$/,                   // 22 digits
            /^[0-9]{12}$/                    // 12 digits (most generic - last)
        ],
        trackingUrl: 'https://www.fedex.com/fedextrack/?trknbr='
    }
};

// Local Storage Manager
class PackageStorage {
    constructor() {
        this.storageKey = 'packageTracker_packages';
        this.archiveKey = 'packageTracker_archived';
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

    // Archive functionality
    getArchivedPackages() {
        const data = localStorage.getItem(this.archiveKey);
        return data ? JSON.parse(data) : [];
    }

    saveArchivedPackages(packages) {
        localStorage.setItem(this.archiveKey, JSON.stringify(packages));
    }

    archivePackage(id) {
        const packages = this.getPackages();
        const packageIndex = packages.findIndex(pkg => pkg.id === id);

        if (packageIndex !== -1) {
            const packageToArchive = packages[packageIndex];
            packageToArchive.archivedDate = new Date().toISOString();

            // Add to archived
            const archived = this.getArchivedPackages();
            archived.unshift(packageToArchive);
            this.saveArchivedPackages(archived);

            // Remove from active packages
            packages.splice(packageIndex, 1);
            this.savePackages(packages);
        }
    }

    unarchivePackage(id) {
        const archived = this.getArchivedPackages();
        const packageIndex = archived.findIndex(pkg => pkg.id === id);

        if (packageIndex !== -1) {
            const packageToRestore = archived[packageIndex];
            delete packageToRestore.archivedDate;

            // Add back to active packages
            const packages = this.getPackages();
            packages.unshift(packageToRestore);
            this.savePackages(packages);

            // Remove from archived
            archived.splice(packageIndex, 1);
            this.saveArchivedPackages(archived);
        }
    }

    deleteArchivedPackage(id) {
        const archived = this.getArchivedPackages();
        const filtered = archived.filter(pkg => pkg.id !== id);
        this.saveArchivedPackages(filtered);
    }

    clearAllArchived() {
        localStorage.removeItem(this.archiveKey);
    }

    // Backup/Restore for localStorage protection
    exportBackup() {
        return {
            packages: this.getPackages(),
            archived: this.getArchivedPackages(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }

    importBackup(data) {
        if (data.packages) {
            this.savePackages(data.packages);
        }
        if (data.archived) {
            this.saveArchivedPackages(data.archived);
        }
    }
}

// Provider Detector
class ProviderDetector {
    static detect(trackingNumber) {
        const cleanNumber = trackingNumber.trim().toUpperCase().replace(/[\s-]/g, '');

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
        this.viewArchiveBtn = document.getElementById('viewArchiveBtn');
        this.backupBtn = document.getElementById('backupBtn');
        this.restoreBtn = document.getElementById('restoreBtn');
        this.restoreFileInput = document.getElementById('restoreFileInput');
        this.showingArchive = false;

        this.init();
    }

    init() {
        this.bindEvents();
        this.renderPackages();
        this.updateArchiveButtonText();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleAddPackage(e));
        this.clearAllBtn.addEventListener('click', () => this.handleClearAll());
        this.viewArchiveBtn.addEventListener('click', () => this.toggleArchiveView());
        this.backupBtn.addEventListener('click', () => this.handleBackup());
        this.restoreBtn.addEventListener('click', () => this.handleRestoreClick());
        this.restoreFileInput.addEventListener('change', (e) => this.handleRestoreFile(e));
    }

    toggleArchiveView() {
        this.showingArchive = !this.showingArchive;
        if (this.showingArchive) {
            this.renderArchivedPackages();
        } else {
            this.renderPackages();
        }
        this.updateArchiveButtonText();
    }

    updateArchiveButtonText() {
        const archivedCount = this.storage.getArchivedPackages().length;
        if (this.showingArchive) {
            this.viewArchiveBtn.textContent = 'View Active Packages';
            this.clearAllBtn.textContent = 'Clear All Archived';
        } else {
            this.viewArchiveBtn.textContent = `View Archive (${archivedCount})`;
            this.clearAllBtn.textContent = 'Clear All';
        }
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
            status: detection.trackingUrl
                ? 'Click "Track Online" to view current status on carrier website'
                : 'Provider not recognized - please verify tracking number',
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
        if (this.showingArchive) {
            const archived = this.storage.getArchivedPackages();
            if (archived.length === 0) {
                return;
            }
            if (confirm(`Are you sure you want to remove all ${archived.length} archived package(s)?`)) {
                this.storage.clearAllArchived();
                this.renderArchivedPackages();
                this.updateArchiveButtonText();
            }
        } else {
            const packages = this.storage.getPackages();
            if (packages.length === 0) {
                return;
            }
            if (confirm(`Are you sure you want to remove all ${packages.length} package(s)?`)) {
                this.storage.clearAll();
                this.renderPackages();
            }
        }
    }

    handleArchivePackage(id) {
        if (confirm('Archive this package? You can restore it from the archive later.')) {
            this.storage.archivePackage(id);
            this.renderPackages();
            this.updateArchiveButtonText();
        }
    }

    handleUnarchivePackage(id) {
        this.storage.unarchivePackage(id);
        this.renderArchivedPackages();
        this.updateArchiveButtonText();
    }

    handleDeleteArchivedPackage(id) {
        if (confirm('Permanently delete this archived package?')) {
            this.storage.deleteArchivedPackage(id);
            this.renderArchivedPackages();
            this.updateArchiveButtonText();
        }
    }

    handleTrackPackage(trackingUrl) {
        if (trackingUrl) {
            window.open(trackingUrl, '_blank');
        }
    }

    handleBackup() {
        const data = this.storage.exportBackup();
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const date = new Date().toISOString().split('T')[0];
        link.href = url;
        link.download = `package-tracker-backup-${date}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        alert(`Backup saved! Keep this file safe.\nIt contains ${data.packages.length} active and ${data.archived.length} archived packages.`);
    }

    handleRestoreClick() {
        this.restoreFileInput.click();
    }

    handleRestoreFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                const pkgCount = data.packages?.length || 0;
                const archCount = data.archived?.length || 0;

                if (confirm(`Restore ${pkgCount} active and ${archCount} archived packages?\n\nThis will REPLACE all current data!`)) {
                    this.storage.importBackup(data);
                    if (this.showingArchive) {
                        this.renderArchivedPackages();
                    } else {
                        this.renderPackages();
                    }
                    this.updateArchiveButtonText();
                    alert('Data restored successfully!');
                }
            } catch (error) {
                alert('Error: Invalid backup file format');
                console.error(error);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
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

        this.packagesContainer.innerHTML = packages.map(pkg => this.createPackageCard(pkg, false)).join('');

        // Bind buttons
        packages.forEach(pkg => {
            const deleteBtn = document.getElementById(`delete-${pkg.id}`);
            const trackBtn = document.getElementById(`track-${pkg.id}`);
            const archiveBtn = document.getElementById(`archive-${pkg.id}`);

            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.handleDeletePackage(pkg.id));
            }

            if (trackBtn && pkg.trackingUrl) {
                trackBtn.addEventListener('click', () => this.handleTrackPackage(pkg.trackingUrl));
            }

            if (archiveBtn) {
                archiveBtn.addEventListener('click', () => this.handleArchivePackage(pkg.id));
            }
        });
    }

    renderArchivedPackages() {
        const archived = this.storage.getArchivedPackages();

        if (archived.length === 0) {
            this.packagesContainer.innerHTML = `
                <div class="empty-state">
                    <p>No archived packages. Packages you archive will appear here.</p>
                </div>
            `;
            return;
        }

        this.packagesContainer.innerHTML = archived.map(pkg => this.createPackageCard(pkg, true)).join('');

        // Bind buttons
        archived.forEach(pkg => {
            const deleteBtn = document.getElementById(`delete-${pkg.id}`);
            const trackBtn = document.getElementById(`track-${pkg.id}`);
            const unarchiveBtn = document.getElementById(`unarchive-${pkg.id}`);

            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.handleDeleteArchivedPackage(pkg.id));
            }

            if (trackBtn && pkg.trackingUrl) {
                trackBtn.addEventListener('click', () => this.handleTrackPackage(pkg.trackingUrl));
            }

            if (unarchiveBtn) {
                unarchiveBtn.addEventListener('click', () => this.handleUnarchivePackage(pkg.id));
            }
        });
    }

    createPackageCard(pkg, isArchived) {
        const addedDate = new Date(pkg.addedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const archivedDate = pkg.archivedDate ? new Date(pkg.archivedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : '';

        const trackButton = pkg.trackingUrl
            ? `<button id="track-${pkg.id}" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.9rem;">Track Online</button>`
            : '';

        const actionButtons = isArchived
            ? `
                ${trackButton}
                <button id="unarchive-${pkg.id}" class="btn btn-warning">Restore</button>
                <button id="delete-${pkg.id}" class="btn btn-danger">Delete</button>
              `
            : `
                ${trackButton}
                <button id="archive-${pkg.id}" class="btn btn-secondary">Archive</button>
                <button id="delete-${pkg.id}" class="btn btn-danger">Delete</button>
              `;

        return `
            <div class="package-card ${isArchived ? 'archived-card' : ''}">
                <div class="package-header">
                    <div class="package-info">
                        <h3>${this.escapeHtml(pkg.name)}</h3>
                        <p class="tracking-number">${this.escapeHtml(pkg.trackingNumber)}</p>
                        <span class="provider-badge provider-${pkg.providerKey}">${this.escapeHtml(pkg.provider)}</span>
                    </div>
                    <div class="package-actions">
                        ${actionButtons}
                    </div>
                </div>
                <div class="status-info">
                    <p><strong>Status:</strong> ${this.escapeHtml(pkg.status)}</p>
                    ${pkg.location ? `<p><strong>Location:</strong> ${this.escapeHtml(pkg.location)}</p>` : ''}
                    ${pkg.estimatedDelivery ? `<p><strong>Est. Delivery:</strong> ${this.escapeHtml(pkg.estimatedDelivery)}</p>` : ''}
                </div>
                <p class="date-added">Added: ${addedDate}</p>
                ${isArchived ? `<p class="date-archived">Archived: ${archivedDate}</p>` : ''}
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
