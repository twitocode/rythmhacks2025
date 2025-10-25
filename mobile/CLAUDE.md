# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Study Flow is a React Native mobile application built with Expo and TypeScript. The app uses Expo Router for file-based navigation and supports iOS, Android, and web platforms.

## Development Commands

### Starting the Development Server
```bash
npx expo start
# or
npm start
```

### Platform-Specific Commands
```bash
npm run android  # Run on Android emulator
npm run ios      # Run on iOS simulator
npm run web      # Run in web browser
```

### Code Quality
```bash
npm run lint     # Run ESLint
```

## Architecture

### Routing Structure
The app uses Expo Router with file-based routing in the `app/` directory:
- `app/_layout.tsx` - Root layout with theme provider and navigation stack
- `app/(tabs)/` - Tab-based navigation group
  - `app/(tabs)/_layout.tsx` - Tab navigator configuration
  - `app/(tabs)/home.tsx` - Home screen (currently the only tab)
- `app/modal.tsx` - Modal screen example

The `unstable_settings.anchor` in `app/_layout.tsx` sets `(tabs)` as the default route.

### Component Organization
- `components/` - Reusable React components
  - `components/ui/` - UI primitives (icon-symbol, collapsible)
  - Themed components (`themed-text.tsx`, `themed-view.tsx`) for automatic dark/light mode support
  - Platform-specific files use `.ios.tsx` or `.web.ts` extensions
- `constants/theme.ts` - Color scheme and font definitions for light/dark modes
- `hooks/` - Custom React hooks
  - `use-color-scheme.ts` - Hook for accessing current color scheme
  - Platform-specific implementations (`.web.ts`)

### Path Aliases
TypeScript paths are configured with `@/*` aliasing to the root directory. Import from components using:
```typescript
import { ThemedText } from '@/components/themed-text';
```

### Theming
The app supports automatic light/dark mode:
- Theme colors defined in `constants/theme.ts` with `Colors.light` and `Colors.dark`
- `ThemeProvider` from `@react-navigation/native` wraps the app in `app/_layout.tsx`
- `useColorScheme()` hook determines current theme
- Themed components (`ThemedText`, `ThemedView`) automatically adapt to color scheme

### Key Technologies
- **Expo SDK 54** with new architecture enabled (`newArchEnabled: true`)
- **React 19.1** and React Native 0.81.5
- **Expo Router 6** with typed routes experiment enabled
- **React Compiler** experiment enabled
- **Reanimated 4.1** for animations
- **Expo Haptics** for haptic feedback (used in `HapticTab` component)

### Platform Configuration
- iOS: Supports tablets, uses SF Symbols via `IconSymbol` component
- Android: Edge-to-edge display, adaptive icons configured
- Web: Static output, typed routes enabled
- URL scheme: `studyflow://`

### Important Notes
- The project uses React 19.1 which may have breaking changes from React 18
- New architecture is enabled - be aware of compatibility with native modules
- Typed routes are experimental but enabled
- When adding screens, follow the file-based routing convention in `app/` directory
- For platform-specific code, use `.ios.tsx`, `.android.tsx`, or `.web.ts` extensions
