/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_12345';

  // add your middleware config here
  config.middleware = [];
  config.middleware = [];

  config.io = {
    init: { }, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
    },
  }

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: false,
    },
    domainWhiteList: [ '172.17.36.170:8080' ],
  };
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: 'maoyu123',
      // 数据库名
      database: 'sys',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
