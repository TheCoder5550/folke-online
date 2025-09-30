#
# Development 
#
FROM node:24-alpine3.21 AS development

RUN apk add git

# Fixes: /usr/bin/env: unrecognized option: S 
RUN apk add --no-cache coreutils

# Install ghc-wasm and make user node owner of the folder
ARG GHC_USER="/home/node"

RUN export PREFIX="${GHC_USER}/.ghc-wasm" \
    # Select ghc version
    && export FLAVOUR="9.10" \
    && apk add --update --no-cache shadow bash curl ca-certificates jq unzip zstd make \
    && curl https://gitlab.haskell.org/haskell-wasm/ghc-wasm-meta/-/raw/master/bootstrap.sh | sh \
    && chown -R node:node ${GHC_USER}/.ghc-wasm

# Install normal ghc
# From https://github.com/ExtremaIS/lsupg-haskell/blob/4a33818d5906d39c905b95f30a7845ace833e21c/docker/Dockerfile
ARG GHC_VERSION=9.10.2
ARG HLS_VERSION=2.10.0.0
ARG CABAL_VERSION=3.12.1.0

RUN apk upgrade --no-cache \
    && apk add --no-cache \
        bash \
        binutils-gold \
        curl \
        g++ \
        gcc \
        gmp-dev \
        libc-dev \
        libffi-dev \
        make \
        musl-dev \
        ncurses-dev \
        perl \
        pkgconfig \
        shadow \
        tar \
        xz \
    # Install ghcup
    && curl --fail --output '/usr/local/bin/ghcup' \
        'https://downloads.haskell.org/ghcup/x86_64-linux-ghcup' \
    && chmod 0755 '/usr/local/bin/ghcup' \
    #
    # Cabal
    && ghcup install cabal "${CABAL_VERSION}" \
        --isolate '/usr/local/bin' \
    #
    # HLS
    && mkdir '/usr/local/opt' \
    && ghcup install hls "${HLS_VERSION}" \
        --isolate "/usr/local/opt/hls-${HLS_VERSION}" \
    && find "/usr/local/opt/hls-${HLS_VERSION}/bin" \
        \( -type f -o -type l \) -exec ln -s {} '/usr/local/bin' \; \
    #
    # GHC
    && ghcup install ghc "${GHC_VERSION}" \
        --isolate "/usr/local/opt/ghc-${GHC_VERSION}" \
    && find "/usr/local/opt/ghc-${GHC_VERSION}/bin" \
        \( -type f -o -type l \) -exec ln -s {} '/usr/local/bin' \; \
    && find "/usr/local/opt/ghc-${GHC_VERSION}/lib" \
        -type f \( -name '*_p.a' -o -name '*.p_hi' \) -delete \
    && rm -rf "/usr/local/opt/ghc-${GHC_VERSION}/share" \
    #
    # Remove ghcup
    && ghcup gc -p -s -c -t \
    && rm '/usr/local/bin/ghcup'

USER node

# Install folke dependencies
RUN cabal update \
    && cabal install alex \
    && cabal install happy \
    && cabal install BNFC

#
# Production
#
FROM development AS production

USER root

COPY . .

RUN npm install

RUN chmod +x entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]