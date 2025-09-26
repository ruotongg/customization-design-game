# Route Map Configuration

This file contains centralized configuration for all route maps, making it easy to modify names, questions, and other properties without searching through multiple files.

## Quick Changes

### To change a route map name:
1. Open `src/config/routeMapConfig.js`
2. Modify the `label` and `title` properties in `ROUTE_MAP_CONFIG`
3. Save the file - changes will apply automatically

### To change a route map question:
1. Open `src/config/routeMapConfig.js`
2. Modify the `question` property in `ROUTE_MAP_CONFIG`
3. Save the file - changes will apply automatically

### To change page distribution:
1. Open `src/config/routeMapConfig.js`
2. Modify the `PAGE_ROUTE_MAPS` object
3. Save the file - changes will apply automatically

### To change JSON field names:
1. Open `src/config/routeMapConfig.js`
2. Modify the `JSON_FIELD_MAPPING` object
3. Save the file - changes will apply automatically

## Configuration Structure

### ROUTE_MAP_CONFIG
Contains all route map definitions with:
- `key`: Internal identifier
- `label`: Display name
- `title`: Component title
- `question`: Prompt question
- `promptId`: Unique prompt identifier
- `required`: Whether the field is required
- `type`: Field type (always 'routeMap')

### PAGE_ROUTE_MAPS
Defines which route maps appear on which pages:
- `route`: Array of route map keys for the Learning Routes page
- `reflection`: Array of route map keys for the Reflection page

### JSON_FIELD_MAPPING
Maps route map keys to JSON export field names:
- Used for consistent data export/import
- Maps internal keys to user-friendly JSON field names

## Example Usage

```javascript
// Get configuration for a specific route map
const config = getRouteMapConfig('routeMap2-1');

// Get all route maps for a page
const routeMaps = getRouteMapsForPage('reflection');

// Get JSON field name for export
const jsonField = getJsonFieldName('routeMap3-1');
```

## Benefits

- **Single source of truth**: All route map configuration in one place
- **Easy maintenance**: Change names/questions without touching multiple files
- **Type safety**: Consistent structure across all route maps
- **Flexibility**: Easy to add/remove route maps or change page distribution
