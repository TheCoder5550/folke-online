#!/bin/sh -l

# Update path
export PATH=/home/node/.local/bin/:\
/usr/local/bin:\
/home/node/.ghc-wasm/wasm32-wasi-ghc/bin:\
/home/node/.ghc-wasm/wasi-sdk/bin:\
/home/node/.ghc-wasm/nodejs/bin:\
/home/node/.ghc-wasm/binaryen/bin:\
/home/node/.ghc-wasm/wasmtime/bin:\
/home/node/.ghc-wasm/wasm32-wasi-cabal/bin:\
/home/node/.ghc-wasm/wasm-run/bin:\
$PATH

echo $PATH

npm run build