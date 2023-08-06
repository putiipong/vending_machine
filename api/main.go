package main

import (
	"context"
	"log"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/jackc/pgx/v4"
)

type Product struct {
	ID       int    `json:"id" db:"id"`
	Name     string `json:"name" db:"name"`
	Price    int    `json:"price" db:"price"`
	Quantity int    `json:"quantity" db:"quantity"`
}

var db *pgx.Conn

func main() {
	// Database connection
	conn, err := pgx.Connect(context.Background(), "postgres://admin:admin@localhost:5432/products")
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
	db = conn

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowHeaders:     "Origin, Content-Type, Accept, Content-Length, Accept-Language, Accept-Encoding, Connection, Access-Control-Allow-Origin",
		AllowOrigins:     "*",
		AllowCredentials: true,
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
	}))
	// GET all products
	app.Get("/products", getProductsHandler)

	// POST add new product
	app.Post("/product", addProductHandler)

	// PUT update product
	app.Put("/product/:id", updateProductHandler)

	// DELETE delete product
	app.Delete("/product/:id", deleteProductHandler)

	log.Fatal(app.Listen(":8080"))
}

func getProductsHandler(c *fiber.Ctx) error {
	rows, err := db.Query(context.Background(), "SELECT * FROM products")
	if err != nil {
		return err
	}

	var products []Product
	for rows.Next() {
		var product Product
		err := rows.Scan(&product.ID, &product.Name, &product.Price, &product.Quantity)
		if err != nil {
			return err
		}
		products = append(products, product)
	}

	return c.JSON(products)
}

func addProductHandler(c *fiber.Ctx) error {
	var product Product
	if err := c.BodyParser(&product); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	_, err := db.Exec(context.Background(), "INSERT INTO products (name, price,quantity) VALUES ($1, $2,$3)", product.Name, product.Price, product.Quantity)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(product)
}

func updateProductHandler(c *fiber.Ctx) error {
	productID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid product ID"})
	}

	var updatedProduct Product
	if err := c.BodyParser(&updatedProduct); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	_, err = db.Exec(context.Background(), "UPDATE products SET name=$1, price=$2,quantity=$3 WHERE id=$4", updatedProduct.Name, updatedProduct.Price, updatedProduct.Quantity, productID)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(updatedProduct)
}

func deleteProductHandler(c *fiber.Ctx) error {
	productID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid product ID"})
	}

	_, err = db.Exec(context.Background(), "DELETE FROM products WHERE id=$1", productID)
	if err != nil {
		return err
	}

	return c.SendStatus(fiber.StatusNoContent)
}
