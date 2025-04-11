## Introdução
Este projeto é uma automação desenvolvida com **NestJS** e **Puppeteer**. Ele utiliza o navegador externo **Browserless**, executado em um container Docker, para realizar a automação de busca de preços de hospedagem.

## Funcionalidades
- **NestJS**: Framework progressivo para construção de aplicações server-side eficientes, confiáveis e escaláveis.
- **Puppeteer**: Biblioteca para controle automatizado de navegadores.
- **Browserless**: Navegador externo executado em Docker para automações de forma eficiente.
- **Automação**: Busca de preços de hospedagem em sites específicos.
- **Pipeline CI**: Verifica automaticamente a integridade do código, incluindo testes e lint.

## Pré-requisitos
- Node.js (>=18.x)
- Docker e Docker Compose

## Comandos
- **Iniciar o projeto**:
  - Desenvolvimento: `npm run start:dev`
  - Produção: `npm run start:prod`
- **Executar os containers Docker**: `npm run server:up`
- **Executar testes**:
  - Todos os testes: `npm run test`
  - Testes unitários: `npm run test:unit`
  - Testes de integração: `npm run test:integration`
  - Cobertura de testes: `npm run test:coverage`
- **Preparar Husky para hooks do Git**: `npm run prepare`
- **Commitar usando Commitizen**: `npm run commit`


## Lint
Para verificar e corrigir problemas de lint, utilize os seguintes comandos:
- **Verificar lint**:
    ```bash
    npm run lint:test
    ```
- **Corrigir problemas de lint**:
    ```bash
    npm run lint:fix
    ```

## Passo a Passo para Rodar o Projeto

Siga os passos abaixo para configurar e executar o projeto:

1. **Instale a extensão Dev Containers no VS Code**:
   - Certifique-se de que o Visual Studio Code está instalado.
   - Instale a extensão **Dev Containers** no VS Code. Você pode encontrá-la na aba de extensões pesquisando por "Dev Containers".

2. **Crie o arquivo `.env`**:
   - Na raiz do projeto, crie um arquivo chamado `.env`.
   - Copie o conteúdo do arquivo `.env.example` e cole no arquivo `.env`.
   - Configure as variáveis de ambiente conforme necessário.

3. **Abra o projeto no container Dev Container**:
   - Abra o VS Code na pasta do projeto.
   - Abra extensão dev container e faça o attach do container ao vscode, apos isso procure a pasta app e lá estará projeto

4. **Inicie o projeto em modo de desenvolvimento**:
   - Execute o seguinte comando no terminal:
     ```bash
     npm run start:dev
     ```

5. **Abra o Postman e importe a documentação da API**:
   - Use o link abaixo para acessar a documentação da API no Postman:
     [![Executar no Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/37022898/2sB2cYdLuG)
   - Importe a documentação no Postman e configure as variáveis de ambiente, se necessário.

6. **Chame aAPI no Postman**:
   - Utilize os endpoints disponíveis na documentação para testar a API.

---

## Sobre o Projeto
Este projeto foi desenvolvido para realizar automações de busca de preços de hospedagem utilizando o Puppeteer no NestJS. Ele utiliza o navegador externo Browserless, executado em um container Docker, para garantir eficiência e escalabilidade.

---
## Por Gabriel Soares Maciel