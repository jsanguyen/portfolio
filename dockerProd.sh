sudo docker build -f Dockerfile.prod -t portfolio:prod .
sudo docker run -it --rm -p 1337:80 portfolio:prod