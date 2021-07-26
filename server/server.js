import config from './../config/config'
import app from './express';
import mongoose from 'mongoose';


mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUrl,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology:true
})

mongoose.connection.on('error',()=>{
    throw new Error(`unable to connect to database${config.mongoUrl}`)
})

app.listen(config.port, (err)=> {
    if (err) {
        console.log(err)
    }
    console.info('Server started at port %s.', config.port)
})