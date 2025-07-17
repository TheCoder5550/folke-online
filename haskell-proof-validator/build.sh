# Create empty output directory
rm -rf output
mkdir output

# Compile Haskell to WASM
wasm32-wasi-ghc hello.hs \
  -outputdir ./output/ \
  -o ./output/hello.wasm \
  -no-hs-main \
  -optl-mexec-model=reactor \
  -optl-Wl,--export=hs_init,--export=my_fac

# Create js file to specify imports for WebAssembly.instantiate
/home/node/.ghc-wasm/nodejs/bin/node $(wasm32-wasi-ghc --print-libdir)/post-link.mjs \
  -i ./output/hello.wasm \
  -o ./output/ghc_wasm_jsffi.js