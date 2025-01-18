start:
	docker compose -f ./setup/composer.yml -p aham down
	docker compose -f ./setup/composer.yml -p aham up -d

test:
	docker compose -f ./setup/composer-test.yml -p aham-test down
	docker compose -f ./setup/composer-test.yml -p aham-test up -d
	
	cd backend/service/cdn && \
		LISTEN=:8081 \
		REDIS=redis://:aham@localhost:6380/0?protocol=3 \
		FILES=$(realpath data) \
		go test -v ./...

	docker compose -f ./setup/composer-test.yml -p aham-test down