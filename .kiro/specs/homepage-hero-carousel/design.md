# Design Document

## Overview

This design implements a background image carousel for the homepage hero section by replacing the static Unsplash background with a cycling display of church images. The solution leverages the existing React state management and image imports while maintaining all current UI elements and styling.

## Architecture

The carousel implementation follows a minimal modification approach:

1. **State Management**: Utilizes existing `currentImageIndex` state and `churchImages` array
2. **Timer Logic**: Uses existing `useEffect` interval for automatic cycling
3. **Background Replacement**: Replaces the static Unsplash URL with dynamic church image URLs
4. **Styling Preservation**: Maintains all existing CSS classes and overlay effects

## Components and Interfaces

### Existing Components (No Changes Required)
- **HomePage Component**: Main component containing the hero section
- **State Variables**: `currentImageIndex`, `churchImages` array
- **Timer Effect**: Existing `useEffect` with `setInterval` for image cycling

### Modified Elements
- **Hero Section Background**: The `backgroundImage` style property in the hero div

## Data Models

### Church Images Array
```typescript
const churchImages = [church1, church2, church3, church4];
```

### Current Implementation
```typescript
const [currentImageIndex, setCurrentImageIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % churchImages.length
    );
  }, 4000);
  return () => clearInterval(interval);
}, [churchImages.length]);
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Carousel cycling behavior
*For any* number of timer intervals, the background image should cycle through all church images in order and loop back to the first image
**Validates: Requirements 1.4, 1.5**

### Property 2: Church image usage
*For any* point in the carousel cycle, the background image should always be one of the four imported church images (church1, church2, church3, church4)
**Validates: Requirements 3.1**

### Property 3: State consistency
*For any* currentImageIndex value, the displayed background image should correspond to the church image at that index in the churchImages array
**Validates: Requirements 3.4**

## Error Handling

The carousel implementation handles the following error scenarios:

1. **Image Load Failures**: If a church image fails to load, the browser will handle it gracefully by showing a broken image or blank background
2. **Timer Cleanup**: The existing useEffect cleanup function prevents memory leaks by clearing the interval
3. **Index Bounds**: The modulo operation ensures the index never exceeds the array bounds

## Testing Strategy

### Unit Tests
- Test initial state: Verify church1.jpg is displayed on component mount
- Test Unsplash URL removal: Verify the static Unsplash URL is no longer in backgroundImage
- Test CSS preservation: Verify existing CSS classes and overlay styling remain intact
- Test UI element preservation: Verify text, buttons, and glass container are unchanged

### Property-Based Tests
- **Property 1**: Test carousel cycling across multiple intervals to ensure proper looping
- **Property 2**: Test that background image is always one of the four church images
- **Property 3**: Test state-to-display consistency across all possible index values

### Integration Tests
- Test timer functionality: Mock timers and verify image transitions occur at 4-second intervals
- Test responsive behavior: Verify carousel works across different screen sizes
- Test performance: Ensure carousel doesn't cause performance degradation

## Implementation Notes

### Key Changes Required
1. **Background Style Modification**: Replace the static Unsplash URL in the hero section's `backgroundImage` style with `churchImages[currentImageIndex]`
2. **No Additional State**: Leverage existing `currentImageIndex` and `churchImages` array
3. **No CSS Changes**: Maintain all existing CSS classes and styling

### Code Location
- **File**: `frontend/src/app/pages/HomePage.tsx`
- **Target Element**: Hero section div with background image styling
- **Line**: Approximately line 200-205 where the backgroundImage style is defined
