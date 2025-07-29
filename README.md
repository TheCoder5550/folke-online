# Folke online
Web version of [Folke](https://github.com/lambducas/folke)

## Development
Tech-stack:
* **React**: to simplify state managment, supports components with JSX, update only parts of UI that changes state
* **Typescript**: add types to javascript
* **Vite**: Compile typescript and allows for hot reloading
* **Haskell**: Folke is built with haskell

Requirements (windows):
* Docker with WSL enabled
* VSCode with dev container extensions installed

Install:
1. Clone the repo inside WSL (hot reloading doesn't work otherwise)
1. Open the cloned repo in VSCode
1. Re-open in dev container (to use the correct node version)
1. Install dependencies:
    ```bash
    npm install
    ```
1. Build haskell and generate components
    ```bash
    source build.sh
    ```
1. Start dev server with hot reloading enabled
    ```bash
    npm run dev
    ```