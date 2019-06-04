all:
	@for file in layouts.yaml/*.yaml; do \
		kalamine $$file --out "layouts/$$(basename $${file%.*}).json"; \
	done
