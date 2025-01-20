package c

import (
	"time"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func Log() *zap.SugaredLogger {
	config := zap.NewProductionConfig()
	config.DisableStacktrace = true
	config.Encoding = "console"
	config.EncoderConfig.EncodeTime = zapcore.TimeEncoderOfLayout(time.RFC3339)
	config.EncoderConfig.EncodeLevel = zapcore.CapitalLevelEncoder
	logger := zap.Must(config.Build())
	return logger.Sugar()
}
