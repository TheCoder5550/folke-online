#!/bin/sh

ghc_wasm=/home/node/.ghc-wasm

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

# # Clean cabal update
# rm -r "$ghc_wasm/.cabal/logs"
# rm -r "$ghc_wasm/.cabal/packages"
# rm -r "$ghc_wasm/.cabal/store"
# $CABAL update

# # Remove dist-newstyle
# cd ../folke
# rm -rf dist-newstyle
# cd ../folke-wasm-wrapper
# rm -rf dist-newstyle

# Build project
$CABAL build exe:folke-wasm-wrapper

# Find and copy bult .wasm file to output dir
cp "$(listbin folke-wasm-wrapper)" output/folke-wasm-wrapper-fallback.wasm

# Create js file to specify imports for WebAssembly.instantiate
$NODE $($GHC --print-libdir)/post-link.mjs \
  -i ./output/folke-wasm-wrapper-fallback.wasm \
  -o ./output/ghc_wasm_jsffi_fallback.js