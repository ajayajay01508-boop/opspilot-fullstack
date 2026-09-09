package main

import (
	"errors"
	"strings"
)

func validateEvent(event Event) error {
	if strings.TrimSpace(event.Service) == "" {
		return errors.New("service is required")
	}
	if event.Latency < 0 {
		return errors.New("latency cannot be negative")
	}
	return nil
}
