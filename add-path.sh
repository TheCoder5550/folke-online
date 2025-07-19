# Add ghc-wasm to PATH (for node user!) and place alpines node first in PATH
# to not use ghc-wasms node by default
source /home/node/.ghc-wasm/env
export PATH=/usr/local/bin:$PATH

# Add alex, happy, bnfc to path
export PATH=/home/node/.local/bin/:$PATH