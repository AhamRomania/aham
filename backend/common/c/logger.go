package c

import "go.uber.org/zap"

func Log() *zap.SugaredLogger {
	logger := zap.Must(zap.NewDevelopment())
	return logger.Sugar()
}
