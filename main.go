package main

import (
	"crypto/tls"
	"log"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/template/html"
)

func main() {

	// Template render engine
	engine := html.New("./templates", ".html")

	// Fiber instance
	app := fiber.New(fiber.Config{
		Views: engine, //set as render engine
	})

	// Static resources
	app.Static("/public", "./public")

	// Routes
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Render("index", nil)
	})

	// 404 Handler
	app.Use(func(c *fiber.Ctx) error {
		return c.SendStatus(404) // => 404 "Not Found"
	})

	// CORS middleware handler
	// app.Use(cors.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "https://gomunamu.gq, http://apis.data.go.kr",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	debug := false
	for _, v := range os.Args {
		if strings.Index(v, "-debug") == 0 {
			debug = true
		}
	}

	if debug {
		log.Fatal(app.Listen(":8080"))

	} else {
		// Create tls certificate
		cer, err := tls.LoadX509KeyPair("/etc/letsencrypt/live/gomunamu.gq/fullchain.pem", "/etc/letsencrypt/live/gomunamu.gq/privkey.pem")
		if err != nil {
			log.Fatal(err)
		}

		config := &tls.Config{Certificates: []tls.Certificate{cer}}

		// Create custom listener
		ln, err := tls.Listen("tcp", ":443", config)
		if err != nil {
			panic(err)
		}

		// Start server with https/ssl enabled on http://localhost:443
		log.Fatal(app.Listener(ln))
	}

}
