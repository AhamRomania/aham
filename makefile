start:
	docker compose -f ./setup/composer.yml -p aham down
	docker compose -f ./setup/composer.yml -p aham up -d

test:
	@echo "Testing..."