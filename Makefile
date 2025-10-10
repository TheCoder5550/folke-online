all: build generate-components

generate-exercise-components.mjs: generate-exercise-components.mts
	npx tsc -t es2022 -m es2022 --moduleResolution node generate-exercise-components.mts

build:
	. ./build.sh

generate-components: generate-exercise-components.mjs
	rm -rf src/exercise-components
	mkdir src/exercise-components

	node generate-exercise-components.mjs