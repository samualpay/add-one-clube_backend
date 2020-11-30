docker rmi samualpay/add_one_club-backend:latest
docker build -t samualpay/add_one_club-backend:latest .
docker login --username=samualpay
docker push samualpay/add_one_club-backend:latest