'use strict';

const Controller = require('egg').Controller;
const onlineUser = [];
const hashName = {};
class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  // 单纯校验密码正确与否，不做socket相关操作
  async login() {
    const { ctx } = this;
    const name = ctx.request.body.name;
    const pw = ctx.request.body.pw;
    const result = await this.app.mysql.select('userinfo', {
      where: {
        username: name,
        password: pw,
      }, // 查询条件
    });

    if (result.length > 0) {
      if (onlineUser.indexOf(name) !== -1) {
        ctx.body = 'hasLogin';
      } else {
        onlineUser.push(name);
        ctx.body = 'yes';
      }
    } else {
      ctx.body = 'wrong';
    }

  }

  async register() {
    const { ctx } = this;
    const name = ctx.request.body.name;
    const pw = ctx.request.body.pw;
    try {
      const result = await this.app.mysql.insert('userinfo', {
        username: name,
        password: pw,
      });
      console.log(result.affectedRows + 'insert:' + result);

      if (result.affectedRows === 1) {
        onlineUser.push(name);
        ctx.body = 'yes';
      }
    } catch (e) {
      console.log(e);
      ctx.body = 'hasRegistered';
    }

  }

  // 登陆或者注册成功之后，跳到聊天页面，获取在线用户列表，同时保存自身socket
  async getUser() {
    const user = this.ctx.args[0];
    console.log('chat user :', user + ' : ' + this.ctx.socket.id);
    // console.log(this.app.io.sockets.sockets);
    if (onlineUser.indexOf(user) === -1) {
      onlineUser.push(user);
    }
    hashName[user] = this.ctx.socket;
    this.ctx.socket.on('heartBeat', msg => {
      // console.log(msg);
    });
    console.log(onlineUser);
    // include this sender
    this.app.io.emit('online', onlineUser.toString());
  }

  // 发送消息
  async talk() {
    const message = JSON.parse(this.ctx.args[0]);
    hashName[message.receiver].emit('receive', message);
    try {
      const result = await this.app.mysql.insert('message', {
        sender: message.sender,
        receiver: message.receiver,
        content: message.content,
        time: message.time,
      });
      // console.log(result.affectedRows + 'insert:' + result);

      if (result.affectedRows === 1) {
        console.log('insert success');
      }
    } catch (e) {
      console.log(e);
    }
  }

  // 关闭页面或者登出导致下线
  async userOffline() {
    const id = this.ctx.socket.id;
    console.log(id + 'disconnect QAQ');
    // console.log('!!!' + JSON.stringify(this.app.io.sockets.sockets));
    for (const key in hashName) {
      if (hashName[key].id === id) {
        // delete hashName[key];
        console.log('find it!')
        const index = onlineUser.indexOf(key);
        onlineUser.splice(index, 1);
        this.app.io.emit('online', onlineUser.toString());
      }
    }
  }

  async show() {
    const id = this.ctx.socket.id;
    console.log(id + 'connect yeah');
  }

  // 得到历史聊天记录
  async getData() {
    const { ctx } = this;
    const name = ctx.request.body.name;
    const result = await this.app.mysql.query('SELECT * FROM message as p WHERE p.receiver = ? or p.sender = ? ORDER BY `time` ASC;', [ name, name ]);
    /*    const result = await this.app.mysql.select('message', {
      where: {
        from: name,
      }, // 查询条件
      orders: [
        [ 'time', 'asc' ], // 降序desc，升序asc
      ],
    });*/
    console.log('query' + result.length);
    ctx.body = result;
  }
}

module.exports = HomeController;
