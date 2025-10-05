#!/bin/sh

# Make alex, happy, bnfc available
export PATH="$HOME/.local/bin:$PATH"

# Build haskell
cd folke
make
cd ..

cd folke-wasm-wrapper
. ./build.sh
cd ..

echo "Done!"