FROM node:20-alpine AS base

FROM base as dependencies

WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM dependencies AS development

WORKDIR /app
RUN npm install
COPY . ./

EXPOSE 3000
ENTRYPOINT [ "npm", "run", "dev" ]

FROM dependencies AS production

WORKDIR /app
RUN npm install
COPY . ./
RUN npm run build

EXPOSE 3000
ENTRYPOINT ["npm", "start"]
