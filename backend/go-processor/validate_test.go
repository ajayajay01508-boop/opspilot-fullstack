package main

import "testing"

func TestValidateEvent(t *testing.T) {
	tests := []struct {
		name    string
		event   Event
		wantErr bool
	}{
		{name: "valid", event: Event{Service: "payments", Latency: 120}, wantErr: false},
		{name: "missing service", event: Event{Latency: 120}, wantErr: true},
		{name: "blank service", event: Event{Service: "  ", Latency: 120}, wantErr: true},
		{name: "negative latency", event: Event{Service: "payments", Latency: -1}, wantErr: true},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if got := validateEvent(test.event); (got != nil) != test.wantErr {
				t.Fatalf("validateEvent() error = %v, wantErr %v", got, test.wantErr)
			}
		})
	}
}
