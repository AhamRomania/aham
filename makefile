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

clean:
	rm  -rf data/wp
	rm  -rf data/db/wp
	mkdir -rf data/wp
	mkdir -rf data/db/wp

backup:
	sudo ./scripts/backup.py /media/cosmin/DataStorage/Backup/Aham/Data

prod:
	./setup/provision.sh
	./setup/docker.sh
	docker system prune

run:
	gnome-terminal --tab --title="CDN" -- bash -c "cd backend/service/cdn; ~/go/bin/air"
	gnome-terminal --tab --title="API" -- bash -c "cd backend/service/api; ~/go/bin/air"
	gnome-terminal --tab --title="WEB" -- bash -c "cd web/; npm run dev;"

dev:
	docker compose -f setup/docker/compose/development.yml -p aham_dev down
	docker compose -f setup/docker/compose/development.yml -p aham_dev up -d
	@read -p "Run the project? (y/n) " ans; \
	if [ "$$ans" = "y" ]; then make run; else echo "Run from IDE."; fi

stop:
	docker compose -f setup/docker/compose/development.yml -p aham_dev down

