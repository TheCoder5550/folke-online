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

ENV PREFIX="/home/node/.ghc-wasm"

RUN apk add --update --no-cache shadow bash curl ca-certificates jq unzip zstd make \
    && curl https://gitlab.haskell.org/haskell-wasm/ghc-wasm-meta/-/raw/master/bootstrap.sh | sh \
    && chown -R node:node /home/node/.ghc-wasm

USER node

RUN source /home/node/.ghc-wasm/env \
    && export PATH=/usr/local/bin:$PATH

# RUN chmod 777 /home/node/.ghc-wasm