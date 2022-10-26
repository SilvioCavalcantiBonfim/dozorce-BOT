const controller = require('../controller/controller');

module.exports = (app) => {
    app.get('/:server',controller.server);
    app.get('/:server/:user',controller.user);
    app.get('/auth/:code',controller.auth);
}