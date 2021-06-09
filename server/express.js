import express from 'express';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';
// import devBundle from './devBundle'; -- development only
import routes from './routes/routes'
import session from 'express-session'
import config from '../config/config'
import connectStore from 'connect-mongo'
import path from 'path'



const app = express();

// devBundle.compile(app); -- development only
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet({
    contentSecurityPolicy:false
}));

app.use(cors());

app.use(session({
    name: config.sessionName,
    resave: false,
    secret: config.sessionSecret,
    saveUninitialized: false,
    store: connectStore.create({
        mongoUrl: config.mongoUrl,
        collectionName: 'session',
        ttl: parseInt(config.sessionAge) / 1000
    }),
    cookie: {
        maxAge: config.sessionAge,
        sameSite: true,
        secure: false,

    }
}))

app.use('/uploads', express.static('uploads'));
app.use('/dist', express.static('dist'))

app.get(/^(?!\/api|\/uploads).+/, (req, res) => {
    res.set('content-type', 'text/html')
    res.sendFile(path.join(__dirname,"index.html"));
  });
app.use('/', routes);


app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ "error": err.name + ": " + err.message })
    } else if (err) {
        res.status(400).json({ "error": err.name + ": " + err.message })
        console.log(err);
    }
})


export default app;
