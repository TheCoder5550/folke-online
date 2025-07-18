# From https://github.com/fourmolu/fourmolu/blob/main/web/fourmolu-wasm/build.sh
listbin() {
    # https://github.com/haskell/cabal/commit/ed407b17f371c5b9ce3d40db6c939b408ef9e093
    local BIN="$(wasm32-wasi-cabal list-bin -v0 "$@")"
    case "${BIN}" in
        (*.wasm) echo "${BIN}" ;;
        (*) echo "${BIN}.wasm" ;;
    esac
}

# Create empty output directory
rm -rf output
mkdir output

# Build cabal project
# wasm32-wasi-cabal v2-build exe:haskell-proof-validator
wasm32-wasi-cabal build exe:haskell-proof-validator

# Find and copy bult .wasm file to output dir
cp "$(listbin haskell-proof-validator)" output/haskell-proof-validator.wasm

# Create js file to specify imports for WebAssembly.instantiate
/home/node/.ghc-wasm/nodejs/bin/node $(wasm32-wasi-ghc --print-libdir)/post-link.mjs \
  -i ./output/haskell-proof-validator.wasm \
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