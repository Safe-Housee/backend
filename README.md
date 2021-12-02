# SafeHouse


### :page_facing_up: Sobre

Esse repositório contém a API Rest do nosso projeto de conclusão de curso SafeHouse. Ele foi criado com javascript e com TDD.

### :bookmark_tabs: Pré-requisitos

Para rodar o projeto local é necessário ter instalado em sua máquina

* Node v >= *12.19.0*
* Docker
* docker-composer

### :scroll: Scripts 

Script   | Função
--------- | ------
npm test | Roda todos os testes
npm run prd | Roda a aplicação no modo de produção
npm run dev | Roda a aplicação em modo de desenvolvimento e sobe o container
npm run clean | Derruba o banco de dados e limpa
npm run reset | Reseta o banco de dados
npm run build | Transpila a aplicação
npm run test:staged | Roda o script da staged area do git
npm run migrate | Roda todas as migrations e seed
npm start | Apenas roda a aplicação

### :package: Bibliotecas

* Sequelize
* Express
* Eslint
* Prettier
* Lint-staged
* Husky
* Jest
* Mysql
* Socket.io (Usado para criação do chat e interações em tempo real)
* Multer (Para receber as imagens)
### :arrow_forward: Como rodar a api local

Para instalar as depêndencias do projeto em sua máquina rode:

```bash
$ npm i 
```

Para executar o projeto basta rodar o comando abaixo: 

```bash
$ npm run dev
```
Rode as migrations

```bash
$ npx sequelize-cli db:migrate 
```

Para adicionar os jogos no banco de dados rode o comando
> Apenas depois de rodar as migrations

```bash
$ npx sequelize db:seed:all 
```

Para resetar todas as tabelas do banco basta rodar

```bash
$ npm run reset
```

> Os containers dos bancos serão criados no mesmo momento então não se preocupe
### :red_circle: Para rodar os testes

Caso não tenha instalado as dependecias ainda execute o comando:

```bash
$ npm i 
```

Se já tiver feito basta executar o comando

```bash
$ npm t
```

### :man_technologist: Colaboradores 

[<img src="https://media-exp1.licdn.com/dms/image/C4D03AQFlypTHsH6VmA/profile-displayphoto-shrink_800_800/0/1601033670503?e=1643846400&v=beta&t=5xtBd7YaZhAXhtjSl8plBdXZus5qZSjWcDPtE1JJzcQ" width=115 > <br> <sub> Willian Francisco   </sub>](https://www.linkedin.com/in/willian-francisco-479b47a4/) | [<img src="https://media-exp1.licdn.com/dms/image/C4E03AQEhYEuXoJCKyQ/profile-displayphoto-shrink_800_800/0/1598641124733?e=1643846400&v=beta&t=BTXkD07TMItzbjkkQrs-zbcy_QK6aO--2cVV5SScylU" width=115 > <br> <sub> Cristian Silva </sub>](https://www.linkedin.com/in/cristian-silva-dev/) | 
| :---: | :---: |