// Imports
const express = require('express');
const fileUpload = require('express-fileupload');
const rscript = require('js-call-r');
const tmp = require('tmp');
const fs = require('fs');
const imageType = require('image-type')
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
      fs.unlink(caminhoArquivo, (err) => null);
    }).catch(err => {
      res.status(500).json({erro: "Falha ao processar captcha", stack: err});
      fs.unlink(caminhoArquivo, (err) => null);
    });
  });
});

app.post('/solucionar-base64', function (req, res) {
  if (!req.body.arquivo)
    return res.status(400).json({erro: "Nenhum arquivo foi enviado"});

  const dadosImagem = Buffer.from(req.body.arquivo, 'base64');
  let tipoImagem = imageType(dadosImagem);

  if ((tipoImagem['mime'].indexOf('image/') !== 0) || (configuracoes.extensoesPermitidas.indexOf(tipoImagem['ext']) === -1))
    return res.status(400).json({erro: "Tipo de arquivo não permitido"});

  let caminhoArquivo = tmp.tmpNameSync({postfix: ("." + tipoImagem['ext'])});

  fs.writeFile(caminhoArquivo, dadosImagem, 'binary', function (err) {
    if (err)
      return res.status(500).json({erro: "Falha ao processar imagem"});

    rscript.call('captcha.R', {
      arquivo: caminhoArquivo
    }).then((result) => {
      res.json({resultado: result.resultado});
      fs.unlink(caminhoArquivo, (err) => null);
    }).catch(err => {
      res.status(500).json({erro: "Falha ao processar captcha", stack: err});
      fs.unlink(caminhoArquivo, (err) => null);
    });
  });
});

app.listen(configuracoes.porta, '0.0.0.0', () => {
  console.log("Servidor iniciado na porta " + configuracoes.porta);
});
