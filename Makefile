watch:
	npm run watch

publish:
	npm run prettify
	npm run build
	npm run lint
	npm publish

layouts: layouts.yaml
	@for file in layouts.yaml/{*.yaml,*.toml}; do \
		kalamine $$file --out "layouts/$$(basename $${file%.*}).json"; \
	done
