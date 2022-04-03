const CracoLessPlugin = require('craco-less');
const path = require('path')
module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  babel: {
    plugins: [
      ['import', { libraryName: 'antd', libraryDirectory: "es", style: true }]
    ]
  },
  //配置代理解决跨域
  // devServer: {
  //   proxy: {
  //     "/api": {
  //       target: "http://localhost:8081",
  //       changeOrigin: true,
  //       pathRewrite: {
  //         "^/api": ""
  //       }
  //     }
  //   }
  // },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@primary-color": '#e91e63' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};