# Clear build dir
rm -rf build
mkdir build

# Clear components
rm -rf src/exercise-components
mkdir src/exercise-components

# Compile to js
npx tsc -t es2022 -m es2022 --moduleResolution node --outDir build generate-exercise-components.mts

# Run js
node build/generate-exercise-components.mjs