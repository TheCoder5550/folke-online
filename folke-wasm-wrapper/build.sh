#!/bin/sh

ghc_wasm=/root/.ghc-wasm

NODE="$ghc_wasm/nodejs/bin/node"
CABAL="$ghc_wasm/wasm32-wasi-cabal/bin/wasm32-wasi-cabal"
GHC="$ghc_wasm/wasm32-wasi-ghc/bin/wasm32-wasi-ghc"

# From https://github.com/fourmolu/fourmolu/blob/main/web/fourmolu-wasm/build.sh
listbin() {
    # https://github.com/haskell/cabal/commit/ed407b17f371c5b9ce3d40db6c939b408ef9e093
    local BIN="$($CABAL list-bin -v0 "$@")"
    case "${BIN}" in
        (*.wasm) echo "${BIN}" ;;
        (*) echo "${BIN}.wasm" ;;
    esac
}

# Remove dist-newstyle
cd ../folke
rm -rf dist-newstyle
cd ../folke-wasm-wrapper
rm -rf dist-newstyle

# Build cabal project
# wasm32-wasi-cabal v2-build exe:folke-wasm-wrapper
$CABAL build exe:folke-wasm-wrapper

# Create empty output directory
rm -rf output
mkdir output

# Find and copy bult .wasm file to output dir
cp "$(listbin folke-wasm-wrapper)" output/folke-wasm-wrapper.wasm

# Create js file to specify imports for WebAssembly.instantiate
$NODE $($GHC --print-libdir)/post-link.mjs \
  -i ./output/folke-wasm-wrapper.wasm \
  -o ./output/ghc_wasm_jsffi.js

# # Compile Haskell to WASM
# wasm32-wasi-ghc hello.hs \
#   -outputdir ./output/ \
#   -o ./output/hello.wasm \
#   -no-hs-main \
#   -optl-mexec-model=reactor \
#   -optl-Wl,--export=hs_init,--export=my_fac

# # Create js file to specify imports for WebAssembly.instantiate
# /home/node/.ghc-wasm/nodejs/bin/node $(wasm32-wasi-ghc --print-libdir)/post-link.mjs \
#   -i ./output/hello.wasm \
#   -o ./output/ghc_wasm_jsffi.js

. ./build-no-tail.sh