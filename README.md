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

# Backend da API RESTful de Animes

## Descrição

O Backend da API RESTful de Animes é um serviço baseado em Node.js para gerenciar uma lista de animes. A API permite operações de CRUD (criar, ler, atualizar e excluir) para os animes e serve como a camada de dados para o frontend.

## Funcionalidades

- **Listar Animes**: Retorna uma lista de todos os animes no banco de dados.
- **Adicionar Anime**: Permite a inserção de um novo anime no banco de dados.
- **Editar Anime**: Atualiza as informações de um anime existente.
- **Excluir Anime**: Remove um anime do banco de dados.
- **Persistência de Dados**: Armazena dados em um banco de dados relacional.

## Tecnologias

- **Node.js**: Ambiente de execução para JavaScript no servidor.
- **Express**: Framework para construir a API RESTful.
- **Banco de Dados**: (Especifique o banco de dados utilizado, por exemplo, MongoDB, PostgreSQL, etc.)

Instale as Dependências
npm install

Inicie a Aplicação
npm start

A API estará disponível em http://localhost:8080.

##Notas
A API está configurada para uso local. Para produção, considere configurar um banco de dados em nuvem e ajustar as configurações de segurança.
O backend é compatível com o frontend da API RESTful de Animes. Certifique-se de que o frontend esteja configurado para se conectar à URL correta do backend.

##Melhorias Futuras
Autenticação e Autorização: Implementar autenticação e controle de acesso para proteger os endpoints.
Validação de Dados: Adicionar validação mais robusta para os dados recebidos nas requisições.
Documentação: Criar documentação mais detalhada para os endpoints da API.
Testes: Implementar testes unitários e de integração para garantir a qualidade e confiabilidade da API.

Contribuições
Sinta-se à vontade para contribuir com melhorias e correções. Crie um fork do repositório, faça suas alterações e envie um pull request.



