#!/bin/sh

# Build haskell
cd folke
make
cd ..

cd folke-wasm-wrapper
. ./build.sh
cd ..

# Compile to js
echo "Compiling component generator"
npx tsc -t es2022 -m es2022 --moduleResolution node generate-exercise-components.mts

# Clear components
echo "Clearing old components"
rm -rf src/exercise-components
mkdir src/exercise-components

# Run js
echo "Generating components"
node generate-exercise-components.mjs

rm generate-exercise-components.mjs
echo "Done!"