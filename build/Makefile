CHROME := $(shell which chromium)

build_copy := $(patsubst static/%,build/%,$(shell find static -type f -or -type l))
build_coffee := $(patsubst src/%.coffee,build/%.js,$(shell find src -name *.coffee -type f))
build_less := $(patsubst src/%.less,build/%.css,$(shell find src -name *.less -type f))
build_svg := $(patsubst src/%.svg,build/%.png,$(shell find src -name *.svg -type f))
build_yaml := $(patsubst src/%.yaml,build/%.json,$(shell find src -name *.yaml -type f))

.PHONY: all release zip clean

all: build $(build_copy) $(build_coffee) $(build_less) $(build_svg) $(build_yaml) | build

$(build_copy) : build/% : static/%
	cp -L $^ $@

$(build_coffee) : build/%.js : src/%.coffee
	coffee --compile --stdio < $^ > $@

$(build_less) : build/%.css : src/%.less
	lessc $^ $@

$(build_svg) : build/%.png : src/%.svg
	inkscape -f $^ -e $@ -d 90

$(build_yaml) : build/%.json : src/%.yaml
	python3 yaml2json.py < $^ > $@

build:
	mkdir -p build

release: all
	$(CHROME) --pack-extension=build --pack-extension-key="$$ENCIRCLE_CHROME_KEY"
	mv build.crx encircle-pricing-`git rev-parse --short HEAD`.crx

zip: all
	zip -r encircle-pricing-`git rev-parse --short HEAD`.zip build

clean:
	rm -rf build
	rm -f encircle-pricing-*.crx
	rm -f encircle-pricing-*.zip
