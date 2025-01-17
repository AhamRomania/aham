package c

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5"
)

var _conn *pgx.Conn

// DB returns a connection to the database
func DB() *pgx.Conn {

	if _conn != nil {
		return _conn
	}

	conn, err := pgx.Connect(context.Background(), os.Getenv("DB"))

	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	if err := conn.Ping(context.Background()); err != nil {
		fmt.Fprintf(os.Stderr, "Unable to ping database: %v\n", err)
		os.Exit(1)
	}

	_conn = conn

	return _conn
}
