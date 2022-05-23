@echo off 

if [%1]==[] (
    echo "Usage: build.cmd <version>"
) else (
    docker build -t saramorillon/mini-board .
    docker image tag saramorillon/mini-board saramorillon/mini-board:%1
    docker push -a saramorillon/mini-board
)
