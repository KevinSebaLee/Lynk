# Event Management Frontend Implementation

This React Native application provides a complete frontend for the Event Management API specified in the requirements.

## Features Implemented

### Authentication
- **Login**: `POST /api/user/login` with username/password
- **Register**: `POST /api/user/register` with user details
- JWT token management with automatic authentication headers

### Event Management
- **List Events**: `GET /api/event/` with pagination and search support
  - Search by name: `?name=taylor`
  - Search by date: `?startdate=2025-03-03`
  - Search by tag: `?tag=rock` (use #rock in search input)
  - Pagination with infinite scroll
- **Event Details**: `GET /api/event/{id}` showing complete event information
- **Create Event**: `POST /api/event/` with authentication required
- **Update Event**: `PUT /api/event/` (framework ready)
- **Delete Event**: `DELETE /api/event/{id}` (framework ready)

### Event Enrollment
- **Enroll**: `POST /api/event/{id}/enrollment`
- **Unenroll**: `DELETE /api/event/{id}/enrollment`
- Proper validation for enrollment status, capacity, and dates

### Event Location Management
- **List Locations**: `GET /api/event-location`
- **Get Location**: `GET /api/event-location/{id}`
- **Create Location**: `POST /api/event-location`

## API Response Handling

The app handles the complete event response format as specified:

```json
{
  "id": 8,
  "name": "Toto",
  "description": "La legendaria banda estadounidense se presentará en Buenos Aires.",
  "start_date": "2024-11-22T03:00:00.000Z",
  "duration_in_minutes": 120,
  "price": "150000",
  "enabled_for_enrollment": "1",
  "max_assistance": 12000,
  "creator_user": {
    "id": 1,
    "first_name": "Pablo",
    "last_name": "Ulman",
    "username": "pablo.ulman@ort.edu.ar"
  },
  "event_location": {
    "name": "Movistar Arena",
    "full_address": "Humboldt 450, C1414 Cdad. Autónoma de Buenos Aires",
    "location": {
      "name": "Villa Crespo",
      "province": {
        "name": "Ciudad Autónoma de Buenos Aires"
      }
    }
  },
  "tags": [
    { "id": 1, "name": "rock" },
    { "id": 2, "name": "pop" }
  ]
}
```

## Screen Structure

### Main Screens
- **eventos.js**: Event listing with search and pagination
- **eventoElegido.js**: Event details with enrollment functionality
- **eventLocations.js**: Event location management
- **createEventLocation.js**: Create new event locations
- **logInScreen.js**: User authentication
- **signUpScreen.js**: User registration

### Components
- **eventCreate.js**: Modal for creating events
- **header.js**: Reusable header component

## Key Features

### Search Functionality
- **Name search**: Type event name directly
- **Date search**: Use YYYY-MM-DD format (e.g., "2025-03-03")
- **Tag search**: Use # prefix (e.g., "#rock")

### Event Display
- Pinterest-style grid layout
- Event details with complete information
- Price, capacity, duration display
- Creator and location information
- Tags display
- Dynamic enrollment button states

### Error Handling
- Network error handling
- Authentication error handling with automatic logout
- Form validation
- User-friendly error messages

### Authentication
- JWT token storage and management
- Automatic token refresh on API calls
- Protected routes requiring authentication

## Configuration

The app is configured to work with the backend API endpoints:

```javascript
export const ENDPOINTS = {
  LOGIN: '/api/user/login',
  REGISTER: '/api/user/register',
  EVENTS: '/api/event',
  EVENT_LOCATIONS: '/api/event-location',
  // ... other endpoints
};
```

## Usage Examples

### Search Events
- Search by name: Type "taylor" in search box
- Search by date: Type "2025-03-03" in search box  
- Search by tag: Type "#rock" in search box
- Combined search: Use URL parameters directly in API calls

### Event Enrollment
- Tap "UNIRME" button on event details
- Button shows enrollment status and handles capacity limits
- Automatic validation for enrollment eligibility

### Create Event Location
1. Navigate to Event Locations screen
2. Tap "+" button
3. Fill required fields (name, address, capacity, location ID)
4. Optional: Add coordinates for map display

## Implementation Notes

- Backwards compatible with existing data structures
- Responsive design with proper loading states
- Infinite scroll pagination for large event lists
- Comprehensive error handling and user feedback
- Clean separation of concerns with API service layer