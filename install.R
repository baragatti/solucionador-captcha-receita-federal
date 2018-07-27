if (!require(devtools))
    install.packages("devtools")

install.packages("tensorflow")
install.packages("keras")
install.packages("h5py")
devtools::install_github("decryptr/decryptr")
devtools::install_github("decryptr/decryptrModels")

library(keras)
install_keras()
