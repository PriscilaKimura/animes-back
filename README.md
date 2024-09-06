<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# API RESTful de Animes - Backend

## Descrição

Este repositório contém o backend de uma API RESTful para gerenciamento de animes. O objetivo principal é permitir operações CRUD (Criar, Ler, Atualizar, Excluir) para animes. O backend foi desenvolvido utilizando o NestJS, e simula uma camada de acesso a dados (DAO) com armazenamento em memória.

## Funcionalidades

- **Listar Animes:** Recupera a lista de todos os animes.
- **Obter Anime:** Recupera um anime específico com base no ID.
- **Criar Anime:** Adiciona um novo anime à lista.
- **Atualizar Anime:** Atualiza as informações de um anime existente.
- **Excluir Anime:** Remove um anime da lista.

## Estrutura do Código

- **Controller:** Define as rotas e métodos para as operações CRUD.
- **Service:** Implementa a lógica de negócios e interage com a camada de armazenamento em memória.
- **Simulação de DAO:** Simula uma camada de acesso a dados com armazenamento em memória.

## Simulação de Armazenamento em Memória

A aplicação utiliza uma simulação de DAO para armazenar os dados dos animes em memória. Não há um banco de dados real; todos os dados são mantidos em uma estrutura de dados na memória do servidor.

## Boas Práticas de Desenvolvimento

O backend segue boas práticas de desenvolvimento com NestJS, incluindo:
- Estrutura modular do código.
- Uso de injeção de dependência.
- Separação clara entre controllers e services.
- Simulação de acesso a dados com uma abordagem simplificada para fins de treinamento.

## Como Rodar

3. Instale as dependências:
    npm install

4. Inicie o servidor:
     npm run start:dev

5. A API estará disponível em `http://localhost:8080`.

## Melhorias Futuras

Este projeto ainda tem muito a ser aprimorado. Algumas melhorias previstas incluem:
- Implementação de um banco de dados real para persistência de dados.
- Adição de autenticação e autorização.
- Melhoria na validação de dados e tratamento de erros.
- Expansão das funcionalidades da API.

## Contribuições

Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades. Por favor, envie um pull request com suas alterações e descreva as modificações realizadas.

