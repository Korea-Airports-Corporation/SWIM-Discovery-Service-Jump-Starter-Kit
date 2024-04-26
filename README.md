## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Usage (Example)
```bash
# /smxs/discovery-service
$ curl -H 'Accept: application/json' http://localhost:8000/smxs/discovery-service

# /smxs/peers
$ curl -H 'Accept: application/json' http://localhost:8000/smxs/peers

# /smxs/services
$ curl -H 'Accept: application/json' http://localhost:8000/smxs/services

# /smxs/services/{service-id}
$ curl -H 'Accept: application/json' http://localhost:8000/smxs/services/"http://swim-registry.kr:8000/swim-service-description/smxs-0.2.0"
```

## Description

This SWIM Discovery Service is devloped by KAC. 

## License

This SWIM Discovery Service is [MIT licensed](LICENSE).
