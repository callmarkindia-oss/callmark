package banner

import (
	"fmt"
	"os"
	"strings"
	"unicode/utf8"

	"golang.org/x/term"
)

func Banner() {
	lines := []string{
		` ▄████████    ▄████████  ▄█        ▄█         ▄▄▄▄███▄▄▄▄      ▄████████    ▄████████    ▄█   ▄█▄ `,
		`███    ███   ███    ███ ███       ███       ▄██▀▀▀███▀▀▀██▄   ███    ███   ███    ███   ███ ▄███▀ `,
		`███    █▀    ███    ███ ███       ███       ███   ███   ███   ███    ███   ███    ███   ███▐██▀   `,
		`███          ███    ███ ███       ███       ███   ███   ███   ███    ███  ▄███▄▄▄▄██▀  ▄█████▀    `,
		`███        ▀███████████ ███       ███       ███   ███   ███ ▀███████████ ▀▀███▀▀▀▀▀   ▀▀█████▄    `,
		`███    █▄    ███    ███ ███       ███       ███   ███   ███   ███    ███ ▀███████████   ███▐██▄   `,
		`███    ███   ███    ███ ███▌    ▄ ███▌    ▄ ███   ███   ███   ███    ███   ███    ███   ███ ▀███▄ `,
		`████████▀    ███    █▀  █████▄▄██ █████▄▄██  ▀█   ███   █▀    ███    █▀    ███    ███   ███   ▀█▀ `,
		`                        ▀         ▀                                        ███    ███   ▀         `,
	}

	width := 80
	if w, _, err := term.GetSize(int(os.Stdout.Fd())); err == nil && w > 0 {
		width = w
	}

	maxLen := 0
	for _, line := range lines {
		if n := utf8.RuneCountInString(line); n > maxLen {
			maxLen = n
		}
	}

	leftPad := (width - maxLen) / 2
	if leftPad < 0 {
		leftPad = 0
	}
	padding := strings.Repeat(" ", leftPad)

	const (
		colorReset = "\033[0m"
		colorCyan  = "\033[1;36m"
	)

	fmt.Println()
	for _, line := range lines {
		fmt.Printf("%s%s%s%s\n", padding, colorCyan, line, colorReset)
	}
	fmt.Println()
}
