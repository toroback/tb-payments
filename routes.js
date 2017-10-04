

let router = new require('express').Router();
let path = require('path');

let Client = require('./index.js');


let log;

function setupRoutes(App){

  log = App.log.child({module:'payRoute'});

  log.debug("Setup routes payments");


  router.use(function(req, res, next){
    req._ctx['service']  = "payments";
    req._ctx['resource']  = req.query.service;
    next();
  });

  router.post("/register",function(req, res, next){
    var ctx = req._ctx;
    let service = ctx.resource;
    let payload = ctx.payload;
    ctx.model = "payments";
    ctx.method = 'register';

    console.log("entra en payments.register route")
    Client.forService(service)
      .then(client => client.register(payload.data))
      .then(resp => res.status(200).json(resp))
      .catch(err => next(err));

  });

  router.post("/pay",function(req, res, next){
    var ctx = req._ctx;
    let service = ctx.resource;
    let payload = ctx.payload;
    ctx.model = "payments";
    ctx.method = 'pay';

    Client.forService(service)
      .then(client => client.pay(payload.data, payload.options))
      .then(resp => {
        console.log("pay finished:", resp);
        return res.json(resp)
      })
      .catch(next);
  });

  router.post("/payRegistered",function(req, res, next){
    var ctx = req._ctx;
    let service = ctx.resource;
    let payload = ctx.payload;
    ctx.model = "payments";
    ctx.method = 'payRegistered';

    Client.forService(service)
      .then(client => client.payRegistered(payload.data, payload.options))
      .then(resp => res.status(200).json(resp))
      .catch(next);
  });

  router.post("/refund",function(req, res, next){
    var ctx = req._ctx;
    let service = ctx.resource;
    let payload = ctx.payload;
    ctx.model = "payments";
    ctx.method = 'refund';

    Client.forService(service)
      .then(client => client.refund(payload.data, payload.options))
      .then(resp => res.status(200).json(resp))
      .catch(next);

  }); 

  // router.post("/test",function(req, res, next){
  //   var ctx = req._ctx;
  //   let service = ctx.resource;
  //   let payload = ctx.payload;
  //   ctx.model = "pay";
  //   ctx.method = 'register';

  //   Client.forService(service)
  //     // .then(client => client.register(payload.data))
  //     .then(resp => res.status(200).json({resp: "ok"}))
  //     .catch(next);

  //   next();
  // });

  App.app.use(`${App.baseRoute}/srv/payments`, router);
}


module.exports = setupRoutes;