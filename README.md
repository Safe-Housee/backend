# Backend

Esse é o projeto da nossa api rest em JavaScript

### Pré-requisitos

Para rodar o projeto local é necessário ter instalado em sua máquina

* Node v >= *12.19.0*
* Docker
* docker-composer

### Como rodar a api local

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

> Os containers dos bancos serão criados no mesmo momento então não se preocupe
### Para rodar os testes

Caso não tenha instalado as dependecias ainda execute o comando:

```bash
$ npm i 
```

Se já tiver feito basta executar o comando

```bash
$ npm t
```