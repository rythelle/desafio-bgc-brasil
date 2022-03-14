# # Descrição da aplicação

- Aplicação desenvolvida para obter os três primeiro bestsellers (mais vendidos) da amazon.

# # Bibliotecas e ferramentas utilizadas

- Puppeteer (chrome-aws-lambda)
- Serverless
- DynamoDB
- AWS Lambda
- AWS APIGateway

# # Funcionamento

- Através da rota: https://2kb8wgvfq7.execute-api.us-east-1.amazonaws.com/dev/getBestsellersAmazon é possível atualizar no DynamoDB os três bestsellers da Amazon. Em caso de sucesso na chamada da função Lambda, irá receber a mensagem: Updated bestsellers from Amazon in DynamoDB. Em caso de erro, será lançado uma exceção com a mensagem correspondente do erro.

- Através da rota: https://2kb8wgvfq7.execute-api.us-east-1.amazonaws.com/dev/searchBestsellersAmazon é possível consultar os três bestsellers da Amazon diretamente do DynamoDB.

- Informações fornecidas pela rota de consulta dos bestsellers:

- [x] Titulo do produto

- [x] Preço do produto

- [x] Link para acessa a imagem do produto

- [x] Avaliação do produto

- [x] Link para acessar o produto na Amazon
