
frontend: dep-check
	@echo "Preparing slayer" && \
	cd slayer && \
	npm install . && \
	ng serve

backend: dep-check
	@echo "Preparing backstabber" && \
	cd backstabber && \
	docker build -t ponyslaystation:v1 . && \
	docker run --rm -p 5000:5000 ponyslaystation:v1

fill-db:
	@./post_records.py data/dump1.json && \
	./post_records.py data/dump2.json

dep-check:
	@echo "Checking dependencies";
	@./check-deps.sh;