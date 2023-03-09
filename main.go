package main

import (
	"crypto/tls"
	"gopms/db"
	"log"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/template/html"
)

func main() {

	// 종료시 db 클라이언트 종료
	defer db.Client.Close()

	// Template render engine
	engine := html.New("./templates", ".html")

	// Fiber instance
	app := fiber.New(fiber.Config{
		Views: engine, //set as render engine
	})

	// Static resources
	app.Static("/public", "./public")

	// Default middleware config
	app.Use(logger.New())

	// Routes
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Render("index", nil)
	})
	app.Get("/api/getPerms", func(c *fiber.Ctx) error {
		return c.JSON(map[string]string{
			"test": "success",
		})
	})
	app.Get("/about", func(c *fiber.Ctx) error {
		return c.Render("index", nil)
	})

	// 404 Handler
	app.Use(func(c *fiber.Ctx) error {
		return c.SendStatus(404) // => 404 "Not Found"
	})

	// Default middleware config
	app.Use(recover.New())

	// CORS middleware handler
	// app.Use(cors.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://apis.data.go.kr",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// 인허가 데이터 수집
	// api.GetPermsDataFromCSV("20220101", "20221231")

	// 서버 실행
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
