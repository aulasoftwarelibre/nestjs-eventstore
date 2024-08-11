# EventSource module for NestJS

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/aulasoftwarelibre/nestjs-eventstore">
      <img width="200" src="./docs/images/logoasl.png" alt="Aula Software Libre de la UCO">
  </a>

  <h3 align="center">EventSource module for NestJS</h3>

  <p align="center">
    NestJS module for eventsourcing development with eventstore database
  </p>
</p>

<!-- ABOUT THE PROJECT -->

## About The Project

This module allows you to connect to a [EventstoreDB](https://www.eventstore.com/) to do event sourcing with nestjs.

**This is a Work In Progress**, not ready to use it in producction.

## Getting Started

WIP

See [example](./example)

### Prerequisites

You require to have a nestjs project with this modules already installed and loaded:

- [@nestjs/cqrs](https://www.npmjs.com/package/@nestjs/cqrs)
- [nestjs-console](https://www.npmjs.com/package/nestjs-console)

### Installation

- npm

        npm install @aulasoftwarelibre/nestjs-eventstore

- yarn

        yarn add @aulasoftwarelibre/nestjs-eventstore

## Usage

### Loading the module

## Contributing

## License

Distributed under the EUPL-1.2 License. See `LICENSE` for more information.

## Running the example

To run the example you will need docker. Just run:

```shell
docker compose up -d
```

And a few minutes later you will access to the example application in the next urls:

- [Swagger API](http://localhost:3000/api/)
- [EventStore Database (Write model)](http://localhost:2113)
- [Mongo Database (Read model)](http://admin:pass@localhost:8081/)

## Acknowledgements

This module was created following next articles:

- https://medium.com/@qasimsoomro/building-microservices-using-node-js-with-ddd-cqrs-and-event-sourcing-part-1-of-2-52e0dc3d81df
- https://medium.com/@qasimsoomro/building-microservices-using-node-js-with-ddd-cqrs-and-event-sourcing-part-2-of-2-9a5f6708e0f
- https://nordfjord.io/blog/event-sourcing-in-nestjs

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/aulasoftwarelibre/nestjs-eventstore.svg?style=for-the-badge
[contributors-url]: https://github.com/aulasoftwarelibre/nestjs-eventstore/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/aulasoftwarelibre/nestjs-eventstore.svg?style=for-the-badge
[forks-url]: https://github.com/aulasoftwarelibre/nestjs-eventstore/network/members
[stars-shield]: https://img.shields.io/github/stars/aulasoftwarelibre/nestjs-eventstore.svg?style=for-the-badge
[stars-url]: https://github.com/aulasoftwarelibre/nestjs-eventstore/stargazers
[issues-shield]: https://img.shields.io/github/issues/aulasoftwarelibre/nestjs-eventstore.svg?style=for-the-badge
[issues-url]: https://github.com/aulasoftwarelibre/nestjs-eventstore/issues
[license-shield]: https://img.shields.io/github/license/aulasoftwarelibre/nestjs-eventstore.svg?style=for-the-badge
[license-url]: https://github.com/aulasoftwarelibre/nestjs-eventstore/blob/master/LICENSE
