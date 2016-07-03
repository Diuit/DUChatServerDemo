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

1. Installation of full features will ask for your credit card information, because of the MongoDB [add-on](https://elements.heroku.com/addons/mongolab) (You still have to register credit card inofrmation for free plan.)  
    [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

2. If you hate to fill in your credit card number, use the following button for database-free installation. Noted that this also means you can only do "signup" and nothing will be saved in the backend.

   [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Diuit/DUChatServerDemo/tree/noDatabase)



Remember your heroku app address. ex: `https://APP_ADDRESS.herokuapp.com/`

### Configurations

After you clicked `Deploy to Heroku`, you will be asked to fill a form of configuration variables.

The configuration variables are set with environment variables and/or using `.env` file (environment variable takes preference over `.env` file if found).



| Environment Variable | Required | Description                              | Example                                  |
| -------------------- | -------- | ---------------------------------------- | ---------------------------------------- |
| APP_ID               | Y        | Your Diuit APP ID, get it from [dashboard](https://developer.diuit.com/dashboard) | f10d0cef060cad00798a215943b8a99a         |
| APP_KEY              | Y        | Your Diuit APP KEY, get it from [dashboard](https://developer.diuit.com/dashboard) | d9954e5d7cfaeac96b8296654b118a6f         |
| KEY_ID               | Y        | Your KEY ID, get it from [dashboard](https://developer.diuit.com/dashboard) | 841ec54725099ff1c04f67c3f0971314         |
| PRIVATE_KEY          | Y        | The private key downloaded when you clicked `Generate Key`. Open the file with text editor, copy the content, replace line breaks with `\n` and past it. (*) | ![privateKey](http://i.imgur.com/vt7FFah.png) |
| PLATFORM             | N        | Platform string of the device using Diuit API, the string can only be **"gcm", "ios_sandbox" or "ios_production"** according to its push notification certificate type. | ios_sandbox                              |



(*)

For enviroment variables don't accept multiple-line value, you have to do some transform on the privat key content from the downloaded file:

1. Open the downloaded file with any text editor, and copy all the content.
2. Use the [helper](http://www.gillmeister-software.com/online-tools/text/remove-line-breaks.aspx) to replace the line breaks with `\n`
   ![steps](http://api.diuit.com/images/replace_steps.png)
3. Paste the result in the config variables field.


---



## Retrieve session token

After deploying the app, you have two RESTFul APIs ( one for database-free installation):

### Sign Up

1. Imagine that you have a backend, and this is the first time to use it. First step is to sign up a new account. You can do it with [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop).
   ![signup](http://api.diuit.com/images/signup_postman_example.png)

2. You will get a session token in response. Noted that the expired date of the session token is sever days later.

3. Signup with another **different** username to get another session token.

   ​

### Sign In

If you use database-free installation, this API does not exist.

1.  After you register your account, the very next time when you want to use the service, you have to sign in.
2.  It's also easy to implement it with Postman:
   ![signin](http://api.diuit.com/images/signin_postman_example.png)
3.  You will also receive a session token in response. If your token is expired when sign in, the backend will refresh it for you.



That's it!! Now you already complete the authentication procedure with your backend and Diuit API server.

## Where to Go From Here?

1. You should sign up for tow accounts to communicate with each other.
2. If you'd like to try Diuit API on mobile devices, you should [install our framework](http://api.diuit.com/doc/en/guideline.html#getting-started).
3. With the session tokens, you can [try our API](http://api.diuit.com/doc/en/guideline.html#real-time-communication) now!



___

## Behind the API

This seciont will briefly explain whe the code does when you call these two APIs:

### Sign Up

1. Check the database if the username you post exists, return an error if it does.
2. Use your username as `userSerial` (in format `user.USERNAME`) and `deviceSerial` (in format `user.USERNAME.device.0`), which are the required fields for Diuit session token.
3. Request for session token with a Node.js package `diuit-auth` and return the result in response.
4. Save user data and session in the database (expired date is set to seven days later). If you are using database-free installation, nothing will be saved.



### Sign in

1. Verify the credential of signed in user.
2. Return session token if it's still valid; Refresh the token and return otherwise.