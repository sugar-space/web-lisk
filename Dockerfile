FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm i

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM node:20-alpine
COPY ./package.json /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
COPY --from=build-env /app/public /app/public
# COPY --from=build-env /app/.env /app/.env
COPY --from=development-dependencies-env /app/.docker/apps/entry.sh /app/.docker/apps/entry.sh
WORKDIR /app

# RUN chmod +x .docker/apps/entry.sh
# ENTRYPOINT [".docker/apps/entry.sh"]
CMD ["npm", "run", "start"]