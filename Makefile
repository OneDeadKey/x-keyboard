all:
	npm run build
	npm run lint

layouts: layouts.yaml
	@for file in layouts.yaml/*.yaml; do \
		kalamine $$file --out "layouts/$$(basename $${file%.*}).json"; \
	done
