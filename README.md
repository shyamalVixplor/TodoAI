# Todo Mobile App

A native React Native CLI todo app for iOS and Android. It includes task creation, completion toggles, filters, progress tracking, individual deletion, and a clear-completed action.

## Run it

Install dependencies:

```bash
npm install
```

For iOS, install native pods once:

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

Start Metro:

```bash
npm start
```

In a second terminal, launch the desired platform:

```bash
npm run ios
npm run android
```

## Project structure

- `App.tsx` — todo UI and its local state.
- `android/` — Android native project.
- `ios/` — iOS native project.
