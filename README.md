# AKS Memory Driver

[![Build Status](https://travis-ci.org/dopry/express-aks-driver-memory.svg?branch=master)](https://travis-ci.org/dopry/express-aks-driver-memory)

[![Dependency Status](https://david-dm.org/dopry/express-aks-driver-memory.svg)](https://david-dm.org/dopry/express-aks-driver-memory)

[![Coverage Status](https://coveralls.io/repos/dopry/express-aks-driver-memory/badge.svg?branch=master&service=github)](https://coveralls.io/github/dopry/express-aks-driver-memory?branch=master)

This is a Memory storage driver for the reference implementation of the  [HTTP Authoritative Keyserver](https://github.com/AuthoritativeKeyServerWG/aks).

It provides emphermal storage of keys. Anything in memory will be lost when the process ends. It is useful as a reference driver implementation and for testing.
