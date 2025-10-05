all: build

generate-exercise-components.mjs: generate-exercise-components.mts
	npx tsc -t es2022 -m es2022 --moduleResolution node generate-exercise-components.mts

build: generate-exercise-components.mjs
	. ./build.sh

	rm -rf src/exercise-components
	mkdir src/exercise-components

	node generate-exercise-components.mjs