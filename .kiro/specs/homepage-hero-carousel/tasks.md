# Implementation Plan: Homepage Hero Carousel

## Overview

This implementation plan converts the static background image in the homepage hero section to an automatic carousel of church images. The approach leverages existing state management and requires minimal code changes to achieve the desired functionality.

## Tasks

- [ ] 1. Replace static background with dynamic carousel
  - Modify the hero section's backgroundImage style to use `churchImages[currentImageIndex]` instead of the Unsplash URL
  - Ensure the existing dark overlay and CSS classes remain unchanged
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.2, 3.3_

- [ ]* 1.1 Write unit test for initial background image
  - Test that church1.jpg is displayed when component mounts
  - _Requirements: 1.2_

- [ ]* 1.2 Write unit test for Unsplash URL removal
  - Test that the static Unsplash URL is no longer present in backgroundImage
  - _Requirements: 1.1, 3.2_

- [ ]* 1.3 Write property test for carousel cycling
  - **Property 1: Carousel cycling behavior**
  - **Validates: Requirements 1.4, 1.5**

- [ ]* 1.4 Write property test for church image usage
  - **Property 2: Church image usage**
  - **Validates: Requirements 3.1**

- [ ]* 1.5 Write property test for state consistency
  - **Property 3: State consistency**
  - **Validates: Requirements 3.4**

- [ ] 2. Verify UI preservation
  - Test that all existing UI elements (text, buttons, glass container) remain unchanged
  - Ensure CSS classes and animations are preserved
  - _Requirements: 2.2, 2.3_

- [ ]* 2.1 Write unit test for CSS preservation
  - Test that existing CSS classes and overlay styling remain intact
  - _Requirements: 2.1, 2.2, 3.3_

- [ ]* 2.2 Write unit test for UI element preservation
  - Test that text, buttons, and glass container are unchanged
  - _Requirements: 2.3_

- [ ] 3. Test carousel functionality
  - Verify automatic image transitions occur every 4 seconds
  - Test that carousel loops properly through all four images
  - _Requirements: 1.3, 1.4, 1.5_

- [ ]* 3.1 Write integration test for timer functionality
  - Mock timers and verify image transitions occur at 4-second intervals
  - _Requirements: 1.3_

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The implementation leverages existing state management (currentImageIndex, churchImages array)
- No new dependencies or major architectural changes required
- Focus on minimal code changes to achieve maximum impact