dev:
	docker compose -f ./setup/composer.yml -p aham up -d
	read -p 'What projet? (api|cdn): ' app && \
	echo "Using $$app..." && \
	cd "backend/service/$$app" && \
	LISTEN=:8080 \
	DB=postgres://aham:aham@localhost:5432/aham \
	CDN=http://localhost:8081 \
	go run ./main.go

test:
	
	@echo "\033[0;32m> Docker Up...\033[0m"

	@docker compose --progress=quiet -f ./setup/composer-test.yml -p aham-test down
	@docker compose --progress=quiet -f ./setup/composer-test.yml -p aham-test up -d

	@echo "\033[0;32m> Test CDN...\033[0m"

	cd backend/service/cdn && \
	LISTEN=:8071 \
	REDIS=redis://:aham@localhost:6380/0?protocol=3 \
	FILES=$(realpath data) \
	go test -v ./...

	@echo "\033[0;32m> Test API...\033[0m"

	cd backend/service/api && \
	LISTEN=:8070 \
	DB=postgres://aham:aham@localhost:5433/aham \
	CDN=http://localhost:8071 \
	go test -v ./...

	@echo "\033[0;32m> Docker Down...\033[0m"
	@docker compose --progress=quiet -f ./setup/composer-test.yml -p aham-test down
