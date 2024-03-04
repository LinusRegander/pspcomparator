IMAGE_NAME = backend
CONTAINER_NAME = pspcomparator

.PHONY: build run stop lint

build:
	docker build -t ${IMAGE_NAME} .

run:
	docker run -p 1337:1337 --name ${CONTAINER_NAME} ${IMAGE_NAME}

stop:
	docker stop ${CONTAINER_NAME}
	docker rm ${CONTAINER_NAME}

lint:
	docker run --rm -v $(PWD):/app -w /app node:18 eslint .