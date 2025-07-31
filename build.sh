# Build haskell
cd folke
make
cd ..

cd folke-wasm-wrapper
source build.sh
cd ..

# Create temp dir
tmp_dir=$( mktemp -d )

# Compile to js
echo "Compiling ts"
npx tsc -t es2022 -m es2022 --moduleResolution node --outDir "$tmp_dir" generate-exercise-components.mts

# Clear components
echo "Clearing old components"
rm -rf src/exercise-components
mkdir src/exercise-components

# Run js
echo "Generating components"
node "$tmp_dir"/generate-exercise-components.mjs

rm -fr "$tmp_dir"
echo "Done!"