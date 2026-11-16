# Telegram Profile Animation

A recreation of Telegram's profile header in React Native: as you scroll, the avatar merges into the Dynamic Island on iOS and slides out through the top of the screen on Android.

<div align="center">
  <video src="https://github.com/user-attachments/assets/dfab8b70-f579-46e3-8aca-81d6754b3223" width="420" controls></video>
</div>

## Project structure

```
assets/lottie/  avatar masks
src/
  app/          Expo Router screens
  components/   avatar (Skia + Lottie mask), star pattern, profile header, settings list
  constants/    colors, header metrics, iPhone models with a Dynamic Island
  hooks/        avatar motion, header layout, scroll tracking
```

## Running

Runs in Expo Go: start the dev server and scan the QR code with the Expo Go app.

```bash
yarn install
yarn start
```

## Stack

Expo SDK 58 · Expo Router · React Native Skia · Reanimated · expo-symbols

## Credits

The avatar mask and the animation curves come from [Telegram iOS](https://github.com/TelegramMessenger/Telegram-iOS), which is licensed under GPL v2:

- `assets/lottie/avatar-mask-island.json` is `UserAvatarMask.tgs` from the Telegram iOS repository, unzipped (`.tgs` is gzipped Lottie JSON), with its layers renamed.
- `assets/lottie/avatar-mask-top-edge.json` is the same file with the `Line` layer's in-point moved from frame 0 to 75, so the line only appears once it's lifted off screen.

## License

Copyright (C) 2026 Bohdan Shemyhon

Licensed under the [GNU General Public License v2.0](LICENSE). Since the avatar masks come from Telegram iOS (GPL v2), the project is distributed under the same license.

---

Not affiliated with Telegram.
