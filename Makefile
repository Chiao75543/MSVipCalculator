# Go parameters
GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get
GOMOD=$(GOCMD) mod
BINARY_NAME=msvip-calculator
BINARY_UNIX=$(BINARY_NAME)_unix

# Build targets
.PHONY: all build build-linux clean test deps help run-cli run-demo

all: test build

help: ## Show this help message
	@echo 'Usage:'
	@echo '  make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build the CLI application
	$(GOBUILD) -o $(BINARY_NAME) -v ./cmd/msvip-calculator

build-linux: ## Build for Linux
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 $(GOBUILD) -o $(BINARY_UNIX) -v ./cmd/msvip-calculator

clean: ## Remove build artifacts
	$(GOCLEAN)
	rm -f $(BINARY_NAME)
	rm -f $(BINARY_UNIX)

test: ## Run tests
	$(GOTEST) -v ./...

deps: ## Download dependencies
	$(GOMOD) download
	$(GOMOD) tidy

run-cli: build ## Run the CLI calculator
	./$(BINARY_NAME)

run-demo: ## Run the demo
	$(GOCMD) run ./cmd/demo

fmt: ## Format Go code
	$(GOCMD) fmt ./...

vet: ## Vet Go code
	$(GOCMD) vet ./...

web-serve: ## Serve web version locally (requires Python)
	@echo "Starting web server at http://localhost:4000"
	@cd web && python3 -m http.server 4000

install: ## Install the CLI tool globally
	$(GOCMD) install ./cmd/msvip-calculator

# Development helpers
dev-setup: deps ## Set up development environment
	@echo "Development environment ready!"

check: fmt vet test ## Run all checks (format, vet, test)

.DEFAULT_GOAL := help