<!-- Step 1 -->
docker-compose build
<!-- Step 2 -->
docker-compose up -d
<!-- your docker will start container for DB postgress and api  -->
<!-- Step 3 for run migration to init data to database -->
migrate -path migrations -database "postgres://admin:admin@localhost:5432/products?sslmode=disable" up
<!-- you can run for start Project (project start port 8080) -->
go run . 