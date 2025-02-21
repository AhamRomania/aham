package c

import (
	"context"
	"os"
	"runtime"

	"github.com/jackc/pgx/v5/pgxpool"
)

var _pool *pgxpool.Pool

// DB returns a connection to the database
func DB() *pgxpool.Conn {

	if _pool != nil {

		conn, err := _pool.Acquire(context.Background())

		if err != nil {
			Log().Error(err)
			os.Exit(1)
		}

		return conn
	}

	buf := make([]byte, 1024)
	runtime.Stack(buf, false)

	config, err := pgxpool.ParseConfig(os.Getenv("DB"))
	if err != nil {
		Log().Error(err)
		os.Exit(1)
	}

	// Connect to the database
	pool, err := pgxpool.NewWithConfig(context.Background(), config)

	if err != nil {
		Log().Error(err)
		os.Exit(1)
	}

	_pool = pool

	conn, err := pool.Acquire(context.Background())

	if err != nil {
		Log().Error(err)
		os.Exit(1)
	}

	return conn
}
