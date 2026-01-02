# Requirements Document

## Introduction

This feature replaces the current static Unsplash background image in the homepage hero section with an automatic carousel that cycles through the four church images from the assets folder, without changing any other UI elements or styling.

## Glossary

- **Hero_Section**: The main banner area at the top of the homepage containing the shrine title and call-to-action buttons
- **Background_Carousel**: An automatic image slideshow that replaces the current static background image
- **Church_Images**: The four specific images (church1.jpg, church2.jpg, church3.jpg, church4.jpg) located in the assets/images folder
- **Current_Background**: The existing Unsplash image URL in the hero section's background style
- **UI_Elements**: All existing text, buttons, glass container, animations, and styling that must remain unchanged

## Requirements

### Requirement 1

**User Story:** As a website visitor, I want to see the actual church images cycling in the background, so that I can view the real shrine instead of a generic stock photo.

#### Acceptance Criteria

1. THE Background_Carousel SHALL replace the current Unsplash image URL in the hero section
2. WHEN the homepage loads, THE Background_Carousel SHALL display church1.jpg as the first background image
3. WHEN 4 seconds have elapsed, THE Background_Carousel SHALL automatically transition to church2.jpg
4. WHEN all four Church_Images have been displayed, THE Background_Carousel SHALL loop back to church1.jpg
5. THE Background_Carousel SHALL cycle continuously without user interaction

### Requirement 2

**User Story:** As a website visitor, I want the carousel to work smoothly without affecting the existing design, so that the page maintains its current look and functionality.

#### Acceptance Criteria

1. THE Background_Carousel SHALL maintain the exact same dark overlay (rgba(0, 0, 0, 0.5)) over the images
2. THE Background_Carousel SHALL preserve all existing CSS classes and styling on the hero section
3. THE Background_Carousel SHALL not modify any UI_Elements including text, buttons, glass container, or animations
4. THE Background_Carousel SHALL use smooth transitions between images without jarring effects

### Requirement 3

**User Story:** As a developer, I want to simply replace the background image source with a carousel mechanism, so that the implementation is clean and minimal.

#### Acceptance Criteria

1. THE Background_Carousel SHALL use the existing church image imports (church1, church2, church3, church4)
2. THE Background_Carousel SHALL remove only the Unsplash URL from the backgroundImage style
3. THE Background_Carousel SHALL maintain the same background-cover and background-center CSS properties
4. THE Background_Carousel SHALL use the existing currentImageIndex state and churchImages array logic