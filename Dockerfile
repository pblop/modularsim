# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
ARG BUILDARCH
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# these two are the assembler and linker to build as6809 files
ADD --chmod=755 "https://github.com/pblop/asxxxx/releases/download/5p10/as6809-linux-${BUILDARCH}" /usr/bin/as6809
ADD --chmod=755 "https://github.com/pblop/asxxxx/releases/download/5p10/aslink-linux-${BUILDARCH}" /usr/bin/aslink
# make is for building programs
# git,jq are for deployment info
# python3 is for s19 to bin conversion
RUN apt-get update && apt-get install -y make git jq python3

# [tests?] & build
#ENV NODE_ENV=production
RUN bun run build

# generate deployment info
RUN /usr/src/app/scripts/generate-deployment-info.sh > /usr/src/app/dist/deployment-info.json

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=prerelease /usr/src/app/dist dist/
COPY --from=prerelease /usr/src/app/package.json .

# run the app
USER bun
EXPOSE 6809/tcp
ENTRYPOINT [ "bun", "run", "start" ]
