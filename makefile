env PATH=$PATH:/usr/local/go/bin

start-api:
	docker compose -f ./setup/composer.yml -p aham up -d
	cd "backend/service/api" && \
	go run ./main.go

start-cdn:
	pwd
	docker compose -f ./setup/composer.yml -p aham up -d
	cd "backend/service/cdn" && \
	go run ./main.go

start-web:
	cd web/ && npm run start

test:
	
	@echo "\033[0;32m> Docker Up...\033[0m"

	@docker compose --progress=quiet -f ./setup/composer-test.yml -p aham-test down
	@docker compose --progress=quiet -f ./setup/composer-test.yml -p aham-test up -d

	@echo "\033[0;32m> Test CDN...\033[0m"

	cd backend/service/cdn && \
	go test -v ./...

	@echo "\033[0;32m> Test API...\033[0m"

	cd backend/service/api && \
	go test -v ./...

	@echo "\033[0;32m> Docker Down...\033[0m"
	@docker compose --progress=quiet -f ./setup/composer-test.yml -p aham-test down

setup:
	cd ./setup && ./nginx.sh

nic:
	go run backend/service/nic/main.go

clean:
	rm  -rf data/wp
	rm  -rf data/db/wp
	mkdir -rf data/wp
	mkdir -rf data/db/wp

start-docker:
	docker compose -f ./setup/composer.yml -p aham up -d
stop-docker:
	docker compose -f ./setup/composer.yml -p aham down