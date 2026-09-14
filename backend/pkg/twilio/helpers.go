package messaging

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
)

func voiceIdentity() (string, error) {
	value := make([]byte, 16)
	if _, err := rand.Read(value); err != nil {
		return "", fmt.Errorf("generate Voice identity: %w", err)
	}

	return "visitor-" + hex.EncodeToString(value), nil
}
