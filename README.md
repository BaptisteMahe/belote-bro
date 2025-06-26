# Welcome to Belote Bro !

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app). It's using `Bun` as bundler and local dev runtime.
Using `react-native-zeroconf` for local networking with peers.

## Basic usage:

### Install deps

```bash
bun install
```

### Start expo developpement server

```bash
bun run start:web
``` 

### Run lint (`eslint` & `prettier`)

```bash
bun run lint
``` 

### Run test (`jest`)

```bash
bun run test
``` 

## Todo list:

- [X] Make UI for local networking on game tab
- [ ] Try out `react-native-zeroconf` for local networking
- [ ] Build server and client modes for the game engine
- [ ] Tests out with multiple devices