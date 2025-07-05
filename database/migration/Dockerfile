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
