# Diuit API Tutorial - Backend

This repo demonstrates how to integrate your backend with Diuit API.

## Features

* Sign up a new user and get a new session token from Diuit API server.
* Sign in an existed user and get its session token or request a new one if expired.

## Requirements

* A Diuit API account ( [Get one ](https://developer.diuit.com/))
* [Node.js](http://nodejs.org/) (If you want to deploy locally)
* A [Heroku](https://www.heroku.com/) account (If you prefer automated installation)

## Automated Installation

 [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Configurations

After you clicked `Deploy to Heroku`, you will be asked to fill a form of configuration variables.

The configuration variables are set with environment variables and/or using `.env` file (environment variable takes preference over `.env` file if found).



| Environment Variable | Required | Description                              | Example                                  |
| -------------------- | -------- | ---------------------------------------- | ---------------------------------------- |
| APP_ID               | Y        | Your Diuit APP ID, get it from [dashboard](https://developer.diuit.com/dashboard) | f10d0cef060cad00798a215943b8a99a         |
| APP_KEY              | Y        | Your Diuit APP KEY, get it from [dashboard](https://developer.diuit.com/dashboard) | d9954e5d7cfaeac96b8296654b118a6f         |
| KEY_ID               | Y        | Your KEY ID, get it from [dashboard](https://developer.diuit.com/dashboard) | 841ec54725099ff1c04f67c3f0971314         |
| PRIVATE_KEY          | Y        | The private key downloaded when you clicked `Generate Key`. Open the file with text editor, copy the content and past it. | ![privateKey](http://i.imgur.com/vt7FFah.png) |



---



