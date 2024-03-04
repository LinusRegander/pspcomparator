IMAGE_NAME = backend

.PHONY: build run stop lint

build:
	docker build -t ${IMAGE_NAME} .

run:
	docker run -p 1337:1337 --name ${CONTAINER_NAME} ${IMAGE_NAME}

stop:
	docker stop ${CONTAINER_NAME}
	docker rm ${CONTAINER_NAME}