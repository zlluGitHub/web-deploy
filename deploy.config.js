
module.exports = {
  port: 80,
  mongodb: {
    ip: "127.0.0.1",
    port: "27017",
    database: "webdeploy",
    username: null,
    password: null
  },
  user: {
    name: 'admin',
    email: 'xxxxxxx@163.com',
    password: 'xxxxxxx'
  },
  email: {
    host: 'smtp.163.com',
    port: 465,
    username: 'xxxxxxxxxxx',
    password: "xxxxxxxxxxxx",
  },
  ws: {
    port: 3006
  },
  oauth: {
    github: {
      state: true,
      user_agent: " ",
      client_ID: " ",
      client_Secret: " ",
      authorize_url: "https://github.com/login/oauth/authorize",
      access_token_url: "https://github.com/login/oauth/access_token",
      user_info_url: "https://api.github.com/user",
      redirect_uri: "http://127.0.0.1/login"
    },
    gitee: {
      state: true,
      user_agent: "",
      client_ID: "",
      client_Secret: "",
      authorize_url: "https://gitee.com/oauth/authorize",
      access_token_url: "https://gitee.com/oauth/token",
      user_info_url: "https://gitee.com/api/v5/user",
      redirect_uri: "http://127.0.0.1/login"
    },
    gitlab: {
      state: true,
      client_ID: "",
      client_Secret: "",
      authorize_url: "http://127.0.0.1/oauth/authorize",
      access_token_url: "http://127.0.0.1/oauth/token",
      user_info_url: "http://127.0.0.1/api/v4/user",
      redirect_uri: "http://127.0.0.1/login"
    },
    gitea: {
      state: true,
      client_ID: "",
      client_Secret: "",
      authorize_url: "http://127.0.0.1/login/oauth/authorize",
      access_token_url: "http://127.0.0.1/login/oauth/access_token",
      user_info_url: "http://127.0.0.1/api/v1/user",
      redirect_uri: "http://127.0.0.1/login"
    }
  }
}