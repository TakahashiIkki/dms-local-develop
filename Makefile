.PHONY: up
up: setup ## up docker containers
	docker-compose up -d

.PHONY: down
down: ## down docker containers
	docker-compose down

.PHONY: setup
setup: network

network:
	@docker network create dms-dev > network

### clean系 ###

.PHONY: clean clean-postgres clean-server

clean: down clean-network clean-postgres clean-mysql clean-kafka clean-zookeeper

clean-network:
	-docker network rm dms-dev
	-rm network

clean-postgres:
	-docker volume rm dms-local-development_dms-pg-data

clean-mysql:
	-docker volume rm dms-local-development_dms-ms-data

clean-kafka:
	-docker volume rm dms-local-development_dms-kafka-data

clean-zookeeper:
	-docker volume rm dms-local-development_dms-zookeeper-data
	-docker volume rm dms-local-development_dms-zookeeper-txns