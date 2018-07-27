library(rjson)
library(decryptr)

args <- commandArgs(trailingOnly = TRUE)
parametros <- fromJSON(args)

arquivoCaptcha <- read_captcha(parametros$arquivo)
resultado <- list(resultado = decrypt(arquivoCaptcha, model = "rfb")[1])

print(toJSON(resultado));
