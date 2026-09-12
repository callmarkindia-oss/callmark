package main

import (
	"log"
	"os"

	"github.com/DeveloperAromal/callmark/pkg/banner"
	"github.com/DeveloperAromal/callmark/pkg/logger"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"

	authModule "github.com/DeveloperAromal/callmark/internal/features/auth"

	databseAdapter "github.com/DeveloperAromal/callmark/internal/adapters/postgresql"
)

func main() {

	// APP BANNER
	banner.Banner()

	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env")
	}

	cfg := config{
		addr: ":8080",
		db: dbConfig{
			dsn: os.Getenv("DB_CONN_STRING"),
		},
	}
	// Logger
	logger := logger.New(logger.INIT)

	// DATABASE CONNECTION

	conn := databseAdapter.PostgresConnection(cfg.db.dsn)

	// WARNING:
	// 		Uncomment this in production
	//		USE:
	//			This ping /health endpoint in each 10 minutes to avoid render cooldown
	// go func() {
	// 	ticker := time.NewTicker(5 * time.Minute)

	// 	for range ticker.C {
	// 		err := scheduler.PingHost(os.Getenv("PROD_HEALTH_ENDPOINT"))
	// 		if err != nil {
	// 			logger.Error(fmt.Sprintf("Ping failed: %v", err))
	// 		} else {
	// 			logger.Success("Ping success")
	// 		}
	// 	}
	// }()

	api := application{
		config:     cfg,
		db:         conn,
		authModule: authModule.NewRepository(conn),
	}

	r := api.mount()

	if err := api.run(r); err != nil {
		logger.Fatal("server failed to start")
		os.Exit(1)
	}

}
