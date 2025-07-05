# Docker ARM64 Compatibility Issue - Database Migration Container Fails on Apple Silicon

## Title
Database migration container fails to start on Apple Silicon (M1/M2) Macs due to ARM64 architecture incompatibility

## Summary
The database migration service fails to build and run on Apple Silicon Macs because it attempts to download and use x86_64 binaries that are incompatible with ARM64 architecture.

## Steps to Reproduce
1. Use an Apple Silicon Mac (M1 or M2 chip)
2. Run `docker compose -f compose.dev.yml up --build`
3. Observe the database-migration container build process

## Expected Behavior
- Database migration container should build successfully
- Migration should run and complete without errors
- All Docker services should start normally

## Actual Behavior
- Database migration container fails to build with error: `rosetta error: failed to open elf at /lib64/ld-linux-x86-64.so.2`
- Container exits with code 133
- Backend service cannot start due to failed database setup

## Environment
- **Platform**: Apple Silicon Mac (ARM64)
- **Docker**: Running on macOS
- **Architecture**: aarch64

## Root Cause
The database migration Dockerfile downloads a pre-compiled x86_64 binary of refinery:
```dockerfile
RUN wget https://github.com/rust-db/refinery/releases/download/0.8.6/refinery-0.8.6-x86_64-unknown-linux-musl.tar.gz
```

This x86_64 binary is incompatible with ARM64 architecture, causing the container to fail.

## Fix Applied
Modified `/database/migration/Dockerfile` to build refinery from source using Rust, making it compatible with both architectures:

```dockerfile
FROM rust:1.82-slim-bullseye

WORKDIR /service

# Install dependencies for building
RUN apt update && apt install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Install refinery CLI
RUN cargo install refinery_cli --version 0.8.6

# Copy the binary to a predictable location
RUN cp /usr/local/cargo/bin/refinery /service/refinery

ENTRYPOINT ["/service/refinery"]
```

## Verification
After applying the fix:
1. Database migration container builds successfully
2. Migration runs and completes without errors
3. All services start normally on Apple Silicon Macs

## Impact
- **Severity**: High
- **Affected Users**: All developers using Apple Silicon Macs
- **Workaround**: Use the source-based build approach described in the fix