# Container image that runs your code
FROM node:22.16-alpine
LABEL authors="Traxmaxx"
# update dependencies and install curl
RUN apk upgrade --no-cache
RUN apk --no-cache add curl
WORKDIR /app

# Copies your code file from your action repository to the filesystem path `/` of the container
COPY dist ./dist
COPY package.json .
COPY package-lock.json .
# TODO: should be done with an appropriate environment variable setup
COPY .env.example ./.env.production

RUN npm ci --omit=dev
EXPOSE 3111
CMD ["npm", "run", "start"]
