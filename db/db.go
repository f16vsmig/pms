package db

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"gopms/ent"

	_ "github.com/lib/pq"
)

var Client *ent.Client

func init() {

	dbip := ""
	debug := false
	for _, v := range os.Args {
		if strings.Index(v, "-debug") == 0 {
			debug = true
		}
	}

	if debug {
		dbip = "152.69.232.58" // 공공아이피, 고정 아님
	} else {
		dbip = "10.1.0.70" // 클라우드 내부 프라이빗아이피
	}
	// databaseUrl := os.Getenv("DATABASE_URL")
	databaseUrl := fmt.Sprintf(
		"host=%s port=%s dbname=%s user=%s password=%s sslmode=disable",
		dbip,
		"5432",
		"pop",
		"f16vsmig",
		"dongha20!*",
	)

	client, err := ent.Open("postgres", databaseUrl)
	if err != nil {
		log.Fatalf("failed opening connection to postgres: %v", err)
	}
	// defer client.Close()
	// Run the auto migration tool.
	ctx := context.Background()
	if err := client.Schema.Create(ctx); err != nil {
		log.Fatalf("failed creating schema resources: %v", err)
	}

	Client = client

	fmt.Println("데이터베이스가 연결되었습니다.")

	// Client.User.Create().SetEmail("f16vsmig@gmail.com").SetPassword("dongha20!*").Save(ctx)
}
