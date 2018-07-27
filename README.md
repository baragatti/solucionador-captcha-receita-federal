# Solucionador de captcha da receita federal

### Requisitos
* NodeJS >= 6
* Python
* RScript

### Instalação
Crie uma pasta para baixar o projeto e clone o projeto usando
```
git clone https://github.com/baragatti/solucionador-captcha-receita-federal.git
```

Após o término do download, navegue com o terminal até a pasta e execute o npm para instalar as dependências
```
npm install
```

Instale as dependências do Python
```
pip install tensorflow keras h5py --user
```

E, finalmente, instale dependências da linguagem R
```
rscript install.R
```

### Configuração
No momento a configuração do projeto é bem simples, contendo apenas parâmetros estritamente necessários.

A configuração se encontra no arquivo config.json, conforme exemplo abaixo
```json
{ 
  "porta": 8080 // Porta utizada pelo servidor
}
```

### Rodando o projeto
Para deixar o microservice rodando, basta executar o comando
```
node index.js
```
### Como usar
Basta enviar uma requisição REST, como POST, para o endpoint /solucionar, enviando o arquivo de imagem no parâmetro "arquivo".

O resultado é retornado sempre em JSON, e retornará com código de status do HTTP 200 em caso de sucesso.

Exemplo de retorno com sucesso
```json
{ "resultado": "abcdef" }
```

Exemplo de retorno com erro
```json
{ "erro": "Descrição do erro" }
```
