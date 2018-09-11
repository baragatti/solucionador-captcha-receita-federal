// Imports
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const rscript = require('js-call-r');
const tmp = require('tmp');
const fs = require('fs');
const app = express();

// Configurações
const configuracoes = (() => {
  let configuracoesAdicionais = JSON.parse(fs.readFileSync("config.json"));

  return {
    extensoesPermitidas: ["jpeg", "jpg", "png"],
    porta: configuracoesAdicionais["porta"]
  }
})();

app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded());

// Endpoints
app.post('/solucionar', function (req, res) {
  if (!req.files || !req.files.arquivo)
    return res.status(400).json({erro: "Nenhum arquivo foi enviado"});

  let extensaoArquivo = req.files.arquivo.name.substr(req.files.arquivo.name.lastIndexOf(".") + 1);

  if (configuracoes.extensoesPermitidas.indexOf(extensaoArquivo) === -1)
    return res.status(400).json({erro: "Extensão de arquivo não permitida"});

  let caminhoArquivo = tmp.tmpNameSync({postfix: ("." + extensaoArquivo)});

  req.files.arquivo.mv(caminhoArquivo, function (err) {
    if (err)
      return res.status(500).json({erro: "Falha ao mover arquivo"});

    rscript.call('captcha.R', {
      arquivo: caminhoArquivo
    }).then((result) => {
      res.json({resultado: result.resultado});
    }).catch(err => {
      res.status(500).json({erro: "Falha ao processar captcha"});
    }).finally(() => fs.unlink(caminhoArquivo, (err) => null));
  });
});

app.listen(configuracoes.porta, () => {
  console.log("Servidor iniciado na porta " + configuracoes.porta);
});
