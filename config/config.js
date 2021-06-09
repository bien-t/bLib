const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    mongoUrl: process.env.MONGODB_URL || process.env.MONGO_HOST ||
        'mongodb://' + (process.env.IP || 'localhost') + ':' + (process.env.MONGO_PORT || '27017') + '/books',
    sessionName: process.env.S_NAME || 'sid',
    sessionSecret: process.env.S_SECRET || 'temporarySecret',
    sessionAge: process.env.S_AGE || 1000 * 60 * 60,
}

export default config;
