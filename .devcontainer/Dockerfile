FROM node:24-alpine3.21

RUN apk add git

# RUN apk add --no-cache \
#         curl \
#     && apk add --no-cache \
#         xz \
#     && apk add --no-cache \
#         bash \
#     && curl -L https://nixos.org/nix/install | sh -s -- --daemon

# RUN echo 'https://dl-cdn.alpinelinux.org/alpine/edge/testing' >> /etc/apk/repositories
# RUN apk add --update --no-cache shadow bash curl ca-certificates jq unzip zstd make

# RUN groupadd nixbld -U node && mkdir /nix && \
#     curl -L https://hydra.nixos.org/job/nix/maintenance-2.14/buildStatic.x86_64-linux/latest/download-by-type/file/binary-dist > /bin/nix && chmod +x /bin/nix && \
#     echo "alias nix='nix --extra-experimental-features \"nix-command flakes\"'" > ~/.profile && ln -s ~/.profile ~/.bashrc

# RUN nix shell --extra-experimental-features "nix-command flakes" 'gitlab:haskell-wasm/ghc-wasm-meta?host=gitlab.haskell.org'

# USER node
# RUN echo 'https://dl-cdn.alpinelinux.org/alpine/edge/testing' >> /etc/apk/repositories

# Fixes: /usr/bin/env: unrecognized option: S 
RUN apk add --no-cache coreutils

# Install normal ghc
# From https://github.com/ExtremaIS/lsupg-haskell/blob/4a33818d5906d39c905b95f30a7845ace833e21c/docker/Dockerfile
ARG GHC_VERSION=9.12.2

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
    && curl --fail --output '/usr/local/bin/ghcup' \
        'https://downloads.haskell.org/ghcup/x86_64-linux-ghcup' \
    && chmod 0755 '/usr/local/bin/ghcup' \
    # && ghcup install cabal --isolate '/usr/local/bin' \
    && mkdir '/usr/local/opt' \
    && ghcup install ghc "${GHC_VERSION}" \
        --isolate "/usr/local/opt/ghc-${GHC_VERSION}" \
    && find "/usr/local/opt/ghc-${GHC_VERSION}/bin" \
        \( -type f -o -type l \) -exec ln -s {} '/usr/local/bin' \; \
    && find "/usr/local/opt/ghc-${GHC_VERSION}/lib" \
        -type f \( -name '*_p.a' -o -name '*.p_hi' \) -delete \
    && rm -rf "/usr/local/opt/ghc-${GHC_VERSION}/share" \
    && ghcup gc -p -s -c -t \
    && rm '/usr/local/bin/ghcup'

# Install ghc-wasm where node user can access it 
ENV PREFIX="/home/node/.ghc-wasm"

# Select ghc version
ENV FLAVOUR="9.12"

# Install ghc-wasm and make user node owner of the folder
RUN apk add --update --no-cache shadow bash curl ca-certificates jq unzip zstd make \
    && curl https://gitlab.haskell.org/haskell-wasm/ghc-wasm-meta/-/raw/master/bootstrap.sh | sh \
    && chown -R node:node /home/node/.ghc-wasm

# RUN chmod 777 /home/node/.ghc-wasm

USER node

# Install folke dependencies
RUN /home/node/.ghc-wasm/cabal/bin/cabal update \
    && /home/node/.ghc-wasm/cabal/bin/cabal install alex \
    && /home/node/.ghc-wasm/cabal/bin/cabal install happy \
    && /home/node/.ghc-wasm/cabal/bin/cabal install BNFC