# Integrate In-app Messaging with Diuit PART1: Backend Server Integration and Authentication

When using Diuit API to add instant mesaging into your app/website, the top 1 question we got from users is: it is very complicated to authenticate my server on Diuit server. This repo demonstrates step-by-step how to deploy a server on Heroku by just one-click, and get the session token from Diuit server. 

If you'd like to intergrate your own server, scroll down to the [**Behind the API**](#behind-the-api) session, which also provides a step-by-step tutorial on how to do it.



For Chinese tutorial , please check [here](https://github.com/Diuit/DUChatServerDemo/blob/master/README_TW.md)

## What we'll cover in this tutorial

* Sign up a new user and get a new session token from Diuit API server.
* Sign in as an existing user and get session token, or you can request a new one if expired.

## Requirements

* A Diuit account ( [Get one for free ](https://developer.diuit.com/))
* [Node.js](http://nodejs.org/) (If you want to deploy locally)
* A [Heroku](https://www.heroku.com/) account (If you prefer automated deploy)

## Automated Installation

1. Installation of full features will ask for your credit card information, because of the MongoDB [add-on](https://elements.heroku.com/addons/mongolab) (You still have to register credit card inofrmation for free plan.)  
    [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

2. If you don't want to fill in your credit card information, use the following button for database-free installation. Note that this also means you can only do "signup" and nothing will be saved in the backend.

   [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Diuit/DUChatServerDemo/tree/noDatabase)



Remember your heroku app address. ex: `https://APP_NAME.herokuapp.com/`

### Configurations

After you click `Deploy to Heroku`, you will be asked to fill a form of configuration variables.

The configuration variables are set with environment variables and/or using `.env` file (environment variable takes preference over `.env` file if found).



| Environment Variable | Required | Description                              | Example                                  |
| -------------------- | -------- | ---------------------------------------- | ---------------------------------------- |
| APP_ID               | Y        | Your Diuit APP ID, get it from [dashboard](https://developer.diuit.com/dashboard) | f10d0cef060cad00798a215943b8a99a         |
| APP_KEY              | Y        | Your Diuit APP KEY, get it from [dashboard](https://developer.diuit.com/dashboard) | d9954e5d7cfaeac96b8296654b118a6f         |
| KEY_ID               | Y        | Your KEY ID, get it from [dashboard](https://developer.diuit.com/dashboard) | 841ec54725099ff1c04f67c3f0971314         |
| PRIVATE_KEY          | Y        | The private key downloaded when you clicked `Generate Key`. Open the file with text editor, copy the content, replace line breaks with `\n` and past it. We also prepared an instruction(*) below to help you on this. | ![privateKey](http://i.imgur.com/vt7FFah.png) |
| PLATFORM             | N        | Platform string of the device using Diuit API, the string can only be **"gcm", "ios_sandbox" or "ios_production"** according to its push notification certificate type. | ios_sandbox                              |



(*) Follow this instruction to transform the private key content in the downloaded file, if the environment variables don't accept multiple-line value.

1. Open the downloaded file with text editor, and copy the entire content.
2. Use this [tool](http://www.gillmeister-software.com/online-tools/text/remove-line-breaks.aspx) and follow the screenshot instruction to replace the line breaks with `\n`
   ![steps](http://api.diuit.com/images/replace_steps.png)
3. Paste the result back into the config variables field.


**【Note】**Private Key must include  **“-----BEGIN RSA PRIVATE KEY ----- “**  and  **“-----END RSA PRIVATE KEY -----“** . Otherwise, It will show an error message when using Postman to get session token in the next step.



---

## Retrieve session token

After deploying the app, you have two RESTFul APIs (one for database-free installation):

### Sign Up

1. Just like you have a backend server, and this is the first time you use it. The first step is to sign up a new account. You can do it with [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop).
   ![signup](http://api.diuit.com/images/signup_postman_example.png)

2. You will get a session token in response. Note that the expired date of the session token is seven days later.

3. If you'd like to send messages between two devices, you have to sign up a **different** username to get another session token.

   ​

### Sign In

Note that this API isn't for the database-free installation case.

1.  After you register your account, the next time when you want to use the service, you have to sign in.
2.  It's also easy to implement with Postman:
   ![signin](http://api.diuit.com/images/signin_postman_example.png)
3.  You will also receive a session token in response. If your token is expired when signing in, the backend will refresh it for you.





That's it! Now you've already completed the authentication procedure. In PART2 we'll start building instand messaging in your app using Diuit API. Stay tuned.

## Where to Go From Here?

1. You should sign up two accounts to communicate with each other.
2. If you'd like to try Diuit API on mobile devices, you have to [install its framework](http://api.diuit.com/doc/en/guideline.html#getting-started).
3. With the session tokens, you can [try out Diuit API](http://api.diuit.com/doc/en/guideline.html#real-time-communication) now!
4. Wait for tutorial PART2!






___

## Behind the API

In this session we will briefly explain what the code does when you call these two APIs:

### Sign Up

1. Check the database to see if the username you posted already exists. It will return an error if the username already exists.
2. Use your username as `userSerial` (in the format of `user.USERNAME`) and `deviceSerial` (in the format of `user.USERNAME.device.0`), which are the two required fields for Diuit session token.
3. Request a session token with a Node.js package `diuit-auth` and return the result in response.
4. Save user data and session in the database (by default, expired date is seven days later). If you are using database-free installation, nothing will be saved.



### Sign in

1. Verify the credential of a signed in user.
2. Return session token if it's still valid; Refresh the token and return otherwise.


---

## Contact

This tutorial was prepared by [Diuit](http://api.diuit.com/) team. If you have any questions, feel free to [contact us](support@diuit.com) or join our [Slack channel](http://slack.diuit.com/).