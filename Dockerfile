# SDE Utils — static site container image.
# No build step: this is plain HTML/CSS/JS, so the image just serves the
# repo root with nginx. Works on Render (Docker web service), Fly.io,
# Railway, plain Docker/K8s, etc.
FROM nginx:1.29-alpine

# Render (and most PaaS) inject a dynamic $PORT at runtime instead of a
# fixed port, so the nginx config is a template rendered at container
# start via envsubst rather than a static file.
ENV PORT=8080
COPY deploy/nginx.conf.template /etc/nginx/templates/default.conf.template

# Site content
COPY index.html doc.html json-escape.html /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY data/ /usr/share/nginx/html/data/
COPY tools/ /usr/share/nginx/html/tools/

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/" > /dev/null 2>&1 || exit 1

# The official nginx image already renders any *.template file in
# /etc/nginx/templates via envsubst on startup (docker-entrypoint.d),
# substituting ${PORT} before nginx starts.
CMD ["nginx", "-g", "daemon off;"]
