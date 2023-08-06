# Use the official Go image as the base image
FROM golang:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the Go application code to the container
COPY . .

# Build the Go application
RUN go build -o go-app .

# Expose the port on which the Go application will listen
EXPOSE 8080

# Run the Go application
CMD ["./go-app"]
