# The image files 44 and 48 build and push to GHCR.
#
# Deliberately boring: one stage, an official base image, no root. The lesson
# is the pipeline, not the Dockerfile — but the two habits below are the ones
# worth copying into a real project.
#
# ⚠️ The build CONTEXT is `./sample-app` (see file 44's build-push step), so
#    every path here is relative to THIS folder, not the repo root. Point the
#    context at the repo root instead and `COPY package.json` fails with
#    "not found" — the most common first-try error with this file.

FROM node:20-alpine

WORKDIR /app

# HABIT 1 — copy the manifest + lockfile FIRST, install, then copy the source.
# Docker caches each layer and invalidates everything after the first change.
# Source changes on every commit; dependencies almost never do. This ordering
# means an edit to math.js does NOT re-run the install. Copy everything in one
# `COPY . .` and you re-install on every single build.
COPY package.json package-lock.json ./

# `npm ci` (not `npm install`) for the same reason CI uses it: it installs
# exactly the lockfile. `--omit=dev` leaves dev dependencies out of the shipped
# image. This app has none — the habit is the point.
RUN npm ci --omit=dev

COPY src/ ./src/

# HABIT 2 — drop root. The official node images ship an unprivileged `node`
# user; containers run as root unless you say otherwise, and root in the
# container is one escape away from root on the host.
USER node

CMD ["node", "src/index.js"]
