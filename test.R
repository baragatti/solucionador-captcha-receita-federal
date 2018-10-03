library(decryptr)

arquivoCaptcha <- read_captcha("test.png")
decrypt(arquivoCaptcha, model = "rfb")
