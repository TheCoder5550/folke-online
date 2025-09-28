#
# Development 
#
FROM thecoder5550/ghc-wasm-no-tail-call AS development

# Copy .cabal config
COPY cabal-config /root/.ghc-wasm-no-tail-call/.cabal/config

# Normal ghc, hls, cabal versions
ARG GHC_VERSION=9.10.2
ARG HLS_VERSION=2.10.0.0
ARG CABAL_VERSION=3.12.1.0
# Separate node install version
ENV NODE_VERSION=24.8.0
# Handle unicode???
ENV LANG=C.UTF-8

# Unset from when installing ghc-wasm inside thecoder5550/ghc-wasm-no-tail-call
ENV PREFIX=
ENV FLAVOUR=

# Install packages
RUN apt-get update \
  && apt-get install -y \
    curl \
    libnuma-dev \
    zlib1g-dev \
    libgmp-dev \
    libgmp10 \
    git \
    wget \
    lsb-release \
    software-properties-common \
    gnupg2 \
    apt-transport-https \
    gcc \
    autoconf \
    automake \
    build-essential \
    jq \
    zstd \
    zip \
    unzip

# Install prebuilt ghc-wasm
RUN export PREFIX="/root/.ghc-wasm" \
  && export FLAVOUR="9.10" \
  && curl https://gitlab.haskell.org/haskell-wasm/ghc-wasm-meta/-/raw/master/bootstrap.sh | sh

# Install node since ghc-wasms node doesnt
# work for building the project
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN unset PREFIX \
  && . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION} \
  && . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION} \
  && . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:$PATH"

WORKDIR /root/.ghc-wasm-no-tail-call

# Install ghcup
RUN curl --fail --output '/usr/bin/ghcup' \
    'https://downloads.haskell.org/ghcup/x86_64-linux-ghcup' \
  && chmod 0755 '/usr/bin/ghcup' \

  # GHC
  && ghcup install ghc --isolate /usr/local --force "${GHC_VERSION}" \

  # Cabal
  && ghcup install cabal --isolate /usr/local/bin --force "${CABAL_VERSION}" \

  # HLS
  && mkdir '/usr/local/opt' \
  && ghcup install hls "${HLS_VERSION}" \
      --isolate "/usr/local/opt/hls-${HLS_VERSION}" \
  && find "/usr/local/opt/hls-${HLS_VERSION}/bin" \
      \( -type f -o -type l \) -exec ln -s {} '/usr/local/bin' \;

# Create cabal version for no-tail-call
RUN mkdir -p /root/.ghc-wasm-no-tail-call/wasm32-wasi-cabal/bin \
  && echo "#!/bin/sh" >> /root/.ghc-wasm-no-tail-call/wasm32-wasi-cabal/bin/wasm32-wasi-cabal \
  && echo \
    'CABAL_DIR=/root/.ghc-wasm-no-tail-call/.cabal' \
    'exec' \
    '/usr/local/bin/cabal' \
    '--enable-shared' \
    '--enable-executable-dynamic' \
    '--no-semaphore' \
    '--with-compiler=/root/.ghc-wasm-no-tail-call/wasm32-wasi-ghc/ghc/_build/stage1/bin/wasm32-wasi-ghc' \
    '--with-hc-pkg=/root/.ghc-wasm-no-tail-call/wasm32-wasi-ghc/ghc/_build/stage1/bin/wasm32-wasi-ghc-pkg' \
    '--with-hsc2hs=/root/.ghc-wasm-no-tail-call/wasm32-wasi-ghc/ghc/_build/stage1/bin/wasm32-wasi-hsc2hs' \
    '--with-haddock=/root/.ghc-wasm-no-tail-call/wasm32-wasi-ghc/ghc/_build/stage1/bin/wasm32-wasi-haddock' \
    '${1+"$@"}' >> /root/.ghc-wasm-no-tail-call/wasm32-wasi-cabal/bin/wasm32-wasi-cabal \
  && chmod 755 /root/.ghc-wasm-no-tail-call/wasm32-wasi-cabal/bin/wasm32-wasi-cabal \
  && /root/.ghc-wasm-no-tail-call/wasm32-wasi-cabal/bin/wasm32-wasi-cabal update

# Install folke dependencies
RUN cabal update \
  && cabal install alex --installdir=/usr/local/bin --overwrite-policy=always \
  && cabal install happy --installdir=/usr/local/bin --overwrite-policy=always \
  && cabal install BNFC --installdir=/usr/local/bin --overwrite-policy=always

#
# Production
#
FROM development AS production

USER root

COPY . .

RUN npm install

RUN chmod +x entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]