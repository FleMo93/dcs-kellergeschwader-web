const path = require('path');

module.exports = (env, params) => {
  const production = params.mode === 'production';

  return {
    entry: {
      'index': './src/Index.ts',
      'impressum': './src/Impressum.ts',
      'server': './src/Server.ts',
      'tacview': './src/Tacview.ts',
    },
    devtool: production ? false : 'source-map',
    mode: production ? 'production' : 'developement',
    module: {
      rules: [{
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader'
        }]
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          minimize: {
            removeComments: false
          },
          esModule: false
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(gif|png|jpe?g)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              disable: true, // webpack@2.x and newer
            },
          },
        ],
      },
      {
        test: /\.svg/,
        use: { loader: 'svg-url-loader' }
      }]
    },
    resolve: {
      extensions: ['.ts', '.js'],
      fallback: {
        http: require.resolve("stream-http"),
        stream: require.resolve("stream-browserify"),
      },
      alias: {
        "src": path.resolve(__dirname, "src"),
      }
    },
    output: {
      filename: '[name].js',
    },
    devServer: {
      static: [{
        directory: 'public',
        publicPath: '/'
      }],
      dev: {
        publicPath: '/',
      },
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
        }
      },
      port: 8081,
    }
  };
}