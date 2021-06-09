import config from './../config/config'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from './../webpack.config.client.js'
import path from 'path'



const compile = (app) => {

  const compiler = webpack(webpackConfig)
  const middleware = webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath
  })
  app.use(middleware)
  app.use(webpackHotMiddleware(compiler))
  app.get(/^(?!\/api|\/uploads).+/, (req, res, next) => {
    compiler.outputFileSystem.readFile(path.join(__dirname, 'index.html'), (err, result) => {
      if (err) {
        return next(err)
      }
      res.set('content-type', 'text/html')
      res.send(result)
      res.end()
    })
  })
}




export default {
  compile
}