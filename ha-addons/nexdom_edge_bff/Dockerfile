ARG BUILD_FROM=ghcr.io/hassio-addons/base:16.2.0
FROM ${BUILD_FROM}

# Add required packages (Node.js + npm) to build server and UI
RUN apk add --no-cache nodejs npm

WORKDIR /opt/nexdom

# Copy server and UI sources
COPY server ./server
COPY ui ./ui
COPY run.sh /run.sh

# Install and build server
RUN cd /opt/nexdom/server \
    && npm ci --no-audit --no-fund \
    && npm run build \
    && npm prune --omit=dev

# Install and build UI
RUN cd /opt/nexdom/ui \
    && npm ci --no-audit --no-fund \
    && npm run build \
    && rm -rf node_modules

# Make run script executable
RUN chmod a+x /run.sh

ENV PORT=8099 \
    UI_DIST=/opt/nexdom/ui/dist

EXPOSE 8099

CMD [ "/run.sh" ]
