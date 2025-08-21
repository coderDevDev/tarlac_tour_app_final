# AR World - True Augmented Reality Experience

This project now includes **AR World**, a true augmented reality feature that places 3D objects on top of the real world through your phone's camera.

## What is AR World?

AR World uses **WebXR** technology to overlay 3D models directly on real-world surfaces. Unlike the regular AR Camera (which shows models in a virtual 3D space), AR World shows models as if they're actually present in your physical environment.

## Features

- **Real-time Camera Feed**: See the real world through your phone's camera
- **Surface Detection**: Automatically detects flat surfaces for model placement
- **Tap to Place**: Tap anywhere on detected surfaces to place 3D models
- **Multiple Models**: Place multiple models in different locations
- **Interactive Management**: Remove or reset placed models
- **Responsive Design**: Works on both mobile and desktop devices

## How to Use

### 1. Access AR World

- Navigate to `/ar-demo` to see the demo page
- Or go directly to `/ar-world?siteId=1` (replace `1` with any valid site ID)
- Or use the "AR World" button in the AR Camera page

### 2. Start AR Experience

- Click "Start AR Experience" button
- Grant camera permissions when prompted
- Your camera will activate and show the real world

### 3. Place 3D Models

- Point your camera at a flat surface (table, floor, wall, etc.)
- The app will detect the surface
- Tap on the surface to place a 3D model
- The model will appear anchored to that location

### 4. Manage Models

- Use the reset button (🔄) to remove all placed models
- Use the info button (ℹ️) to see instructions
- Models list shows all placed models with remove options

## Technical Requirements

### Browser Support

- **Chrome/Edge**: Full WebXR support (recommended)
- **Safari**: Limited WebXR support
- **Firefox**: Basic WebXR support

### Device Requirements

- **Smartphone**: Modern Android or iOS device with AR capabilities
- **Camera**: Back-facing camera access
- **Motion Sensors**: Gyroscope and accelerometer for tracking
- **WebGL**: Hardware-accelerated 3D graphics

### Performance

- **RAM**: Minimum 4GB recommended
- **GPU**: Adreno 530+ (Android) or A11+ (iOS) recommended
- **Network**: Stable internet connection for model loading

## Troubleshooting

### AR Not Supported

If you see "AR Not Supported":

- Try a different browser (Chrome recommended)
- Ensure you're on a mobile device
- Check if your device has AR capabilities
- Try updating your browser

### Camera Issues

- Grant camera permissions when prompted
- Ensure no other apps are using the camera
- Try refreshing the page
- Check browser settings for camera access

### Performance Issues

- Close other apps to free up memory
- Ensure good lighting conditions
- Try on a different device
- Check internet connection for model loading

## Development

### Components

- `ARWorldViewer`: Main AR component with WebXR integration
- `ARModel`: Individual 3D model component
- `ARHitTest`: Surface detection and hit testing

### Dependencies

- `@react-three/fiber`: React renderer for Three.js
- `@react-three/drei`: Three.js helpers and utilities
- `three`: 3D graphics library
- `framer-motion`: Animation library

### File Structure

```
client_app/
├── components/
│   ├── ar-world-viewer.tsx    # Main AR component
│   └── ar-viewer.tsx          # Original 3D viewer
├── app/
│   ├── ar-world/
│   │   └── page.tsx           # AR World page
│   ├── ar-demo/
│   │   └── page.tsx           # AR Demo page
│   └── ar-camera/
│       └── page.tsx           # AR Camera page
└── AR_WORLD_README.md         # This file
```

## Future Enhancements

- **Model Scaling**: Adjust model size in real-time
- **Model Rotation**: Rotate placed models
- **Persistence**: Save model placements between sessions
- **Sharing**: Share AR scenes with other users
- **Offline Support**: Cache models for offline use
- **Multi-user**: Collaborative AR experiences

## Support

For issues or questions:

1. Check browser compatibility
2. Ensure device meets requirements
3. Try different browsers/devices
4. Check console for error messages
5. Verify camera permissions

---

**Note**: AR World requires modern hardware and browser support. For the best experience, use Chrome on a recent Android device or Safari on iOS 13+.

