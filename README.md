# bLib
A simple web application that will allow you to create your own book library.

# Setup
The application requires MongoDB to work.
```
yarn 
```
```
yarn run build
```
```
yarn start
```
For development purposes uncomment below in server/express.js file:
```
import devBundle from './devBundle';
devBundle.compile(app);
```
```
yarn run development
```

# Demo

[Demo](https://b-lib.herokuapp.com)
>login: test@test.pl

>password: 123456
