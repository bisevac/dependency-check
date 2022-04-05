## Description

*Dependency Outdated Check and Subscribe*

*You can check outdated dependency your github project.*

`AVAILABLE DEPENDENCY REPOSITORY`
* [NPM](https://www.npmjs.com/)
* [COMPOSER](https://packagist.org/)

## Installation

```bash
$ yarn install
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

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API
----

### Dependency Check And Subscribe

`POST /dependency-check/`
```js
class RequestDTO {
  mails?: string[];
  url: string;
  subscribe: boolean;
}

class ResponseDTO {
  subscribeId: string|null;
  outdatedDependecyList: {
      type: string;
      packageName: string;
      currentVersion: string;
      latestVersion: string;
  }
}
```

`EXAMPLE`
```bash
curl --location --request POST 'localhost:3000/dependency-check' \
--header 'Content-Type: application/json' \
--data-raw '{
    "url":"https://github.com/nestjs/nest",
    "mails":["bisevac@example.com"],
    "subscribe":true
}'

RESPONSE
{
    "outdatedDependecyList":[
        {
            "type":"npm",
            "packageName":"path-to-regexp",
            "latestVersion":"6.2.0",
            "currentVersion":"3.2.0"
        }
    ],
    "subscribeId":"227293034"
}
```




### Dependency Check Unsubscribe

`POST /dependency-check/unsubscribe`

```js
class RequestDTO {
  subscribeId: string;
}

class ResponseDTO {
  status: boolean;
}
```

`EXAMPLE`

```bash
curl --location --request POST 'localhost:3000/dependency-check/unsubscribe' \
--header 'Content-Type: application/json' \
--data-raw '{
    "subscribeId":"863325849"
}'

RESPONSE
{
    "status":false
}
```

