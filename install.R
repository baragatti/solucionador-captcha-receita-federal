r = getOption("repos")
r["CRAN"] = "http://cran.us.r-project.org"
options(repos = r, force = TRUE)

install.packages("devtools")

require(devtools)
install_version("tensorflow", version = "1.5", force = TRUE)

install_version("keras", version = "2.2.0", force = TRUE)

install.packages("rjson")

devtools::install_github("decryptr/decryptr", force = TRUE)
devtools::install_github("decryptr/decryptrModels", force = TRUE)

library(keras)
install_keras(method = "virtualenv", tensorflow = "1.5", extra_packages = "h5py")
