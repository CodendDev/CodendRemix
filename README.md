# CodendRemix

## Run application

### Docker Compose

**Clone repository**

```bash
git clone https://github.com/CodendDev/CodendRemix codendui
cd codendui
```

**Start the application**

```bash
docker compose --env-file .env.docker up
```

**Access the application**

Visit http://127.0.0.1:3000 in your browser.

## Development 

There are two possible ways to start the application:

* [run whole application with docker compose](#run-whole-application-inside-docker-containers)
* [run only dependencies inside docker and start application on local environment](#run-only-dependencies-inside-docker-and-start-application-on-local-environment)

Preferred way is to dockerize only dependencies. If you decide to use the other way around you will have to manually
refresh the page after editing components.

#### Run whole application inside docker containers

```bash
docker compose -f docker-compose.development.yml --env-file .env.docker up 
```

#### Run only dependencies inside docker and start application on local environment

```sh
docker compose -f docker-compose.dependencies.yml --env-file .env.docker up -d
npm install
npm run dev
```

#### Access the application after start

Visit http://127.0.0.1:3000 in your browser.

You have also the access to api server at http://127.0.0.1:8080
