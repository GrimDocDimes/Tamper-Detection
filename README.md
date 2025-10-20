# Regulator Dashboard

A comprehensive admin dashboard for device monitoring and tamper detection using React, Tailwind CSS, and interactive charts.

## Features

### 1. Overview / Home Screen
- Interactive map view with device status indicators (green = healthy, red = tamper alert, grey = offline)
- KPI cards showing total devices, active alerts, offline devices, and compliance percentage
- Quick filters by region, device type, owner, and manufacturer
- Real-time activity feed

### 2. Alerts & Incidents
- Real-time alerts feed with chronological tamper events
- Severity tags (Critical, Medium, Low)
- Detailed incident pages with device info, sensor data, and signature verification
- Inspector actions: acknowledge, assign, add notes
- Evidence download (CSV format)

### 3. Device Management
- Complete device inventory with health status
- Device profiles with firmware version, calibration info, battery health
- GPS location tracking and tamper history logs
- Device configuration and sync capabilities

### 4. Tamper Log & Reporting
- Cryptographically signed tamper events
- Blockchain anchor verification
- Export options (CSV/PDF) for legal proceedings
- Chain-of-custody reports with evidence packets

### 5. Data Analytics & Insights
- Interactive charts using Recharts
- Tamper trend analysis and regional breakdowns
- Heatmap of tamper hotspots by district/state
- Predictive insights using AI for suspicious device detection
- Compliance rate trends and recommendations

### 6. Audit & Compliance
- User activity logs with detailed tracking
- Regulatory compliance reports for legal metrology
- Firmware integrity monitoring
- Automated report generation

### 7. Admin & Access Control
- Role-based access control (Admin, Regulator, Inspector, Technician)
- User management with region assignments
- Multi-language support for state-level regulators
- System settings and security configuration

## Technology Stack

- **Frontend**: React 18 with functional components and hooks
- **Styling**: Tailwind CSS for responsive design
- **Charts**: Recharts for interactive data visualization
- **Maps**: React Leaflet for device location mapping
- **Icons**: Lucide React for consistent iconography
- **Routing**: React Router DOM for navigation

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view the dashboard

## Project Structure

```
src/
├── components/
│   ├── Layout.js          # Main layout with sidebar navigation
│   ├── KPICard.js         # Reusable KPI card component
│   └── MapView.js         # Interactive map component
├── pages/
│   ├── Overview.js        # Home dashboard with KPIs and map
│   ├── Alerts.js          # Alerts and incidents management
│   ├── Devices.js         # Device inventory and profiles
│   ├── TamperLog.js       # Signed tamper logs with blockchain
│   ├── Analytics.js       # Data analytics and insights
│   ├── Audit.js           # Audit logs and compliance
│   └── Admin.js           # User and system administration
├── App.js                 # Main app component with routing
└── index.js               # Application entry point
```

## Key Features Implementation

### Interactive Dashboard
- Real-time KPI monitoring
- Responsive grid layouts
- Mobile-optimized design

### Security & Compliance
- Cryptographic signature verification
- Blockchain anchoring for tamper logs
- Role-based access control
- Audit trail logging

### Data Visualization
- Line charts for trend analysis
- Bar charts for regional comparisons
- Pie charts for tamper type distribution
- Heatmaps for geographic insights

### Multi-language Support
- English and regional Indian languages
- State-level regulator customization
- Localized date/time formatting

## Future Enhancements

- Mobile app/PWA for field inspectors
- Offline mode with sync capabilities
- Integration with e-Governance systems
- Blockchain explorer integration
- Advanced AI/ML predictive analytics

## License

Government of India - Legal Metrology Department
