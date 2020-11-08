# SecretsApp
Project that explores Authentication and Security.

This project was build incrementally. There are 7 levels that can be accessed through the commit history page.

Each level implements some sort of authentication and security to this application.

### Common to all levels:
- nodejs
- express
- ejs
- mongoose
- dotenv

In case you want to reproduce this project, you will also need to create an .env file on your SECRET, CLIENT_ID and CLIENT_SECRET keys.

## Level 1 - Username and Password Only.
Simplest implementation for a login / password authentication.

## Level 2 - Use Database Encryption and Env Variables
Extra: 
- mongoose-encryption

## Level 3 - Hashing Passwords with md5
Extra:
- md5

## Level 4 - Hashing and Salting with bcrypt
Extra:
- bcrypt

## Level 5 - Save Cookies and Sessions with passport and express-session
Extra:
- passport
- passport-local
- passport-local-mongoose
- express-session

## Level 6 - Sign In/Sign Up (Google) with OAuth2.0
Extra:
- Create OAuth client ID on google's developer page
- passport-google-oauth20
- mongoose-findorcreate

## Level 7 - Submit and visualize secrets from other users. Code cleanup.
At this point, the auth exploration is already completed and I'm only finalizing the app's implementation and cleaning up the code.


<br><br><br>
Thanks for checking out.

I hope you liked it! :)

Bruno Portela
