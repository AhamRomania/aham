package c

import "go.uber.org/zap"

func Log() *zap.SugaredLogger {
	logger, _ := zap.NewProduction()
	return logger.Sugar()
}
