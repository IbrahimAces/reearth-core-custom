# Marker Upgrade: Labels and Images Support

This document describes the upgrade to the sketch layer marker functionality, which now supports adding labels and/or images to markers.

## Overview

The marker object in the sketch layer has been enhanced to support:
- **Labels**: Text labels that can be positioned around the marker
- **Images**: Custom images that can replace or supplement the default marker appearance
- **Flexible positioning**: Labels can be positioned in 8 different positions around the marker
- **Configurable sizing**: Images can be resized from 16px to 128px

## New Properties

### SketchFeature Properties
The `SketchFeature` type now includes these additional properties for markers:

```typescript
{
  // ... existing properties
  label?: string;           // Label identifier
  image?: string;           // Image URL or identifier
  imageSize?: number;       // Image size in pixels
  labelText?: string;       // Text content for the label
  labelPosition?: "left" | "right" | "top" | "bottom" | 
                  "lefttop" | "leftbottom" | "righttop" | "rightbottom";
}
```

### SketchOptions Properties
The `SketchOptions` type now includes marker-specific configuration:

```typescript
{
  // ... existing options
  markerLabel?: string;     // Default label for new markers
  markerImage?: string;     // Default image for new markers
  markerImageSize?: number; // Default image size
  markerLabelText?: string; // Default label text
  markerLabelPosition?: "left" | "right" | "top" | "bottom" | 
                       "lefttop" | "leftbottom" | "righttop" | "rightbottom";
}
```

## Usage Examples

### 1. Setting Marker Options via SketchRef

```typescript
// Configure marker options before creating markers
mapRef.current?.sketch.overrideOptions({
  markerLabel: "custom-label",
  markerImage: "https://example.com/marker-icon.png",
  markerImageSize: 48,
  markerLabelText: "My Marker",
  markerLabelPosition: "right"
});

// Set the marker tool
mapRef.current?.sketch.setType("marker");
```

### 2. Creating Markers with Labels and Images

```typescript
// When a marker is created, it will automatically include the configured options
// The marker will have:
// - A custom image from the provided URL
// - A label with the text "My Marker" positioned to the right
// - An image size of 48px
```

### 3. Updating Existing Markers

```typescript
// When editing existing markers, the label and image properties are preserved
// You can update the sketch options to change the appearance of new markers
mapRef.current?.sketch.overrideOptions({
  markerLabelText: "Updated Label",
  markerImageSize: 64
});
```

## Default Appearance

The marker appearance preset has been updated with sensible defaults:

```typescript
{
  style: "point",
  pointSize: 10,
  pointColor: "#00bebe",
  pointOutlineColor: "#ffffff",
  pointOutlineWidth: 2,
  // Label options
  label: false,
  labelText: "",
  labelPosition: "right",
  labelBackground: true,
  labelBackgroundColor: "#ffffff",
  labelBackgroundPaddingHorizontal: 4,
  labelBackgroundPaddingVertical: 2,
  // Image options
  image: undefined,
  imageSize: 32,
  imageSizeInMeters: false,
  imageHorizontalOrigin: "center",
  imageVerticalOrigin: "center",
}
```

## Example Implementation

See the updated example in `example/components/OptionsPanel/index.tsx` for a complete implementation showing:

1. Marker configuration UI with input fields for label text and image URL
2. Slider for adjusting image size
3. Dropdown for selecting label position
4. Button to apply marker settings
5. Integration with the sketch system

## Backward Compatibility

This upgrade is fully backward compatible:
- Existing markers without label/image properties will continue to work
- Default appearance is preserved for markers without custom configuration
- All existing sketch functionality remains unchanged

## Technical Details

The upgrade involved:
1. **Type Extensions**: Extended `SketchFeature` and `SketchOptions` types
2. **Feature Creation**: Modified `createFeature` and `updateFeature` functions to include marker properties
3. **Appearance Presets**: Updated default marker appearance with label and image options
4. **Example Integration**: Added UI controls for testing the new functionality

The marker rendering engine already supported labels and images through the `MarkerAppearance` type, so no changes were needed to the rendering layer.
