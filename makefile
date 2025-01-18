start:
	docker compose -f ./setup/composer.yml -p aham down
	docker compose -f ./setup/composer.yml -p aham up -d

test:
	cd backend/
	env FILES=../data/ \
		go test -v aham/service/cdn