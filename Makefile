publish:
	npm run build
	npm run lint
	npm publish

layouts: layouts.yaml
	@for file in layouts.yaml/*.yaml; do \
		kalamine $$file --out "layouts/$$(basename $${file%.*}).json"; \
	done
