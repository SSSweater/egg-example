'use strict';

/** x
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io } = app;
  router.get('/', controller.home.index);
  router.post('/api/login', controller.home.login);
  router.post('/api/register', controller.home.register);
  router.post('/api/getHistoryMes', controller.home.getData);
  io.of('/').route('chat', controller.home.getUser);
  io.of('/').route('talking', controller.home.talk);
  io.of('/').route('logout', controller.home.userOffline);
  io.of('/').route('disconnect', controller.home.userOffline);
  io.of('/').route('connect', controller.home.show);

};
