# Component Organization Guide

This document outlines the organized component structure for the Lynk React Native application.

## 📁 Folder Structure

### `/auth/` - Authentication Components
- `AuthButton.js` - Styled authentication action button
- `FormField.js` - Form input field with validation
- `UserTypeSelector.js` - Toggle between personal/business account types

### `/cards/` - Card Components
- `EventCard.js` - Individual event display card
- `MovCard.js` - Movement/transaction card
- `PieChartCard.js` - Pie chart display card
- `TicketCard.js` - Ticket information card

### `/charts/` - Chart & Graph Components
- `GradientBarChart.js` - Animated gradient bar chart
- `MonthlyTicketsChart.js` - Monthly ticket usage chart

### `/common/` - Common/Shared Components
- `Button.js` - Generic styled button
- `GradientBackground.js` - Reusable gradient background
- `ImageUploader.js` - Image upload component
- `LoadingSpinner.js` - Loading indicator
- `index.js` - Common components exports

### `/coupons/` - Coupon System Components
- `CouponActionButtons.js` - Action buttons for coupons
- `CouponCard.js` - Individual coupon display
- `CouponDetailCard.js` - Detailed coupon view
- `CouponDetailsSection.js` - Coupon details grid
- `CouponTermsSection.js` - Terms and conditions display
- `TermsModal.js` - Full-screen terms modal

### `/events/` - Event Management Components
- `EventActionButton.js` - Event action buttons
- `EventCards.js` - Event host/invite cards
- `EventDetailRow.js` - Event detail row display
- `EventDetails.js` - Complete event details
- `EventGrid.js` - Event grid layout
- `EventHeader.js` - Event page header

### `/features/` - Feature-Specific Components
- `agenda.js` - Calendar/agenda functionality
- `eventCreate.js` - Event creation modal
- `premiumBanner.js` - Premium subscription banner
- `RecentEvents.js` - Recent events display

### `/forms/` - Form Components
- `FormFields.js` - Various form field types (FormField, DatePickerField, FormRow)
- `FormModal.js` - Modal wrapper for forms

### `/home/` - Home Screen Components
- `AgendaSection.js` - Home agenda section
- `SectionHeader.js` - Section header component

### `/layout/` - Layout & Navigation Components
- `container.js` - Main content container
- `header.js` - App header component
- `overlayMenu.js` - Sliding side menu

### `/transfers/` - Transfer System Components
- `TransferList.js` - List of transfers/transactions

### `/ui/` - UI/Interface Components
- `CategoryFilter.js` - Category filter chips
- `ScreenHeader.js` - Screen header with back button
- `SearchBar.js` - Search input component
- `TicketDisplay.js` - Ticket amount display

## 🚀 Usage

### Importing Components

All components are exported from the main `index.js` file for easy importing:

```javascript
// Import multiple components
import { 
  ScreenHeader, 
  SearchBar, 
  EventCard, 
  TicketDisplay 
} from '../components';

// Import specific components directly
import Header from '../components/layout/header.js';
import EventGrid from '../components/events/EventGrid';
```

### Adding New Components

1. **Choose the appropriate folder** based on component purpose
2. **Create the component file** following naming conventions
3. **Export from the main index.js** file
4. **Document the component** in this guide

### Naming Conventions

- **PascalCase** for component files (e.g., `EventCard.js`)
- **camelCase** for utility files (e.g., `container.js`)
- **Descriptive names** that indicate component purpose

## 📋 Benefits

- **Easy Navigation**: Components grouped by purpose
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new components in appropriate folders
- **Developer Experience**: Quick component discovery and understanding
- **Consistent Imports**: Centralized exports through index.js

## 🔄 Migration Complete

✅ All components moved to appropriate folders
✅ Import statements updated across all files
✅ Main index.js updated with new exports
✅ No duplicate components remaining
✅ All functionality preserved

Total Components Organized: **25+ components** across **13 folders**