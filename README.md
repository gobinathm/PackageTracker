# Package Tracker

A simple, client-side web application for tracking packages from multiple shipping carriers. All data is stored locally in your browser.

## Features

- **Multi-Carrier Support**: Automatically detects and tracks packages from:
  - USPS (United States Postal Service)
  - UPS (United Parcel Service)
  - FedEx
  - DHL
  - Canada Post
  - Amazon Logistics
  - OnTrac
  - LaserShip

- **Automatic Provider Detection**: Simply paste your tracking number and the app automatically identifies the carrier

- **Local Storage**: All package data is stored locally in your browser - no server required

- **Direct Tracking Links**: Click "Track Online" to view detailed tracking information on the carrier's website

- **Package Management**:
  - Add custom names to packages for easy identification
  - Delete individual packages
  - Clear all packages at once

- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

### Option 1: Open Locally

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start adding tracking numbers!

### Option 2: Host on GitHub Pages

1. Fork this repository to your GitHub account
2. Go to repository Settings → Pages
3. Under "Source", select the main branch
4. Click Save
5. Your app will be available at `https://yourusername.github.io/PackageTracker`

### Option 3: Use GitHub Codespaces

1. Open this repository in GitHub
2. Click the "Code" button and select "Codespaces"
3. Create a new codespace
4. Once loaded, right-click on `index.html` and select "Open with Live Server" (if available) or use the built-in preview

## Usage

### Adding a Package

1. Enter the tracking number in the "Tracking Number" field
2. Optionally, add a custom name (e.g., "New Laptop", "Birthday Gift")
3. Click "Add Package"
4. The app will automatically detect the carrier and add the package to your list

### Tracking a Package

- Click the "Track Online" button on any package card to view detailed tracking information on the carrier's official website

### Removing Packages

- Click "Delete" on individual package cards to remove them
- Click "Clear All" to remove all packages at once

## Supported Tracking Number Formats

### USPS
- 22 digits starting with 94, 93, 92, or 95
- 16 digits starting with 70, 14, 23, or 03
- 10 digits starting with M0 or 82
- 2 letters + 9 digits + 2 letters (e.g., EA123456789US)

### UPS
- 1Z followed by 16 alphanumeric characters (e.g., 1Z999AA10123456784)
- T, H, K, J, or D followed by 10 digits
- 26 digits

### FedEx
- 12, 15, 20, or 22 digits

### DHL
- 10-11 digits
- 20 digits
- 3 letters + 7 digits

### Canada Post
- 13 digits
- 16 digits
- 2 letters + 9 digits + 2 letters (e.g., CA123456789CA)

### Amazon Logistics
- TBA followed by 12 digits
- TBM followed by 12 digits

### OnTrac
- C followed by 14 digits

### LaserShip
- L + letter + 8 digits
- 1LS + 12 digits

## Technical Details

- **Pure HTML/CSS/JavaScript**: No frameworks or dependencies required
- **Local Storage API**: All data persists in browser's localStorage
- **No Backend Required**: Completely client-side application
- **No External API Calls**: Provider detection is done via regex patterns

## Browser Compatibility

This app works in all modern browsers that support:
- ES6 JavaScript
- Local Storage API
- CSS Grid and Flexbox

Tested on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Privacy

All package tracking data is stored locally in your browser. No data is sent to any server. If you clear your browser's data or use a different browser/device, you will need to re-add your packages.

## Limitations

- This app does not fetch real-time tracking updates from carriers
- You must manually click "Track Online" to see current status on carrier websites
- Package data is device/browser specific
- Some carriers may have additional tracking number formats not covered

## Contributing

Feel free to submit issues or pull requests to improve the app!

## License

MIT License - Feel free to use and modify as needed.
