

let router = new require('express').Router();
let path = require('path');

let Client = require('./index.js');


let log;

/**
 * @module tb-payments/routes
 */
function setupRoutes(App){

  log = App.log.child({module:'payRoute'});

  log.debug("Setup routes payments");


  router.use(function(req, res, next){
    req._ctx['service']  = "payments";
    req._ctx['resource']  = req.query.service;
    next();
  });


  /** 
   * Registra una tarjeta de credito
   *
   * @name  Registro de tarjeta de crédito
   * 
   * @route {POST} srv/payments/register
   *
   * @queryparam {String} [service] Servicio en el que registrar la tarjeta. (Ej. "service=globalonepay")
   *
   * @bodyparam  {Object} data Información de la tarjeta que se va a registrar.
   * @bodyparam  {String} data.cardNumber Número de la tarjeta de crédito.
   * @bodyparam  {String} data.cardExpiry Fecha de vencimiento de la tarjeta de crédito en formato "MMDD" (Ej:0920 -> "20 de septiembre").
   * @bodyparam  {String} data.cardType  Tipo de tarjeta de crédito (EJ: MASTERCARD).
   * @bodyparam  {String} data.cardHolderName Nombre en la tarjeta de crédito.
   *
   */
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

   /** 
   * Desregistra una tarjeta de credito. 
   *
   * @name  Desregistro de tarjeta de crédito
   * 
   * @route {POST} srv/payments/unregister
   *
   * @queryparam {String} [service] Servicio en el que desregistrar la tarjeta. (Ej. "service=globalonepay")
   *
   * @bodyparam  {Object} data Información del pago que se va a realizar. La información dependerá del servicio a utilizar.
   *
   */
  router.post("/unregister",function(req, res, next){
    var ctx = req._ctx;
    let service = ctx.resource;
    let payload = ctx.payload;
    ctx.model = "payments";
    ctx.method = 'unregister';

    console.log("entra en payments.unregister route")
    Client.forService(service)
      .then(client => client.unregister(payload.data))
      .then(resp => res.status(200).json(resp))
      .catch(err => next(err));

  });

   /** 
   * Realiza un pago
   *
   * @name  Pago
   * 
   * @route {POST} srv/payments/pay
   *
   * @queryparam {String} [service] Servicio por el que realizar el pago. (Ej. "service=globalonepay")
   *
   * @bodyparam  {Object} data Información del pago que se va a realizar. La información dependerá del servicio a utilizar.
   * @bodyparam  {String} data.orderId Identificador de la compra
   * @bodyparam  {String} data.amount  Valor de la compra
   * @bodyparam  {String} data.currency  Divisa en la que se va a realizar el pago
   * @bodyparam  {String} data.cardNumber Número de la tarjeta de crédito.
   * @bodyparam  {String} data.cardExpiry Fecha de vencimiento de la tarjeta de crédito en formato "MMDD" (Ej:0920 -> "20 de septiembre").
   * @bodyparam  {String} data.cardType  Tipo de tarjeta de crédito (EJ: MASTERCARD).
   * @bodyparam  {String} data.cardHolderName Nombre en la tarjeta de crédito.
   * @bodyparam  {String} data.cvv Código secreto que aparece en la tarjeta
   * @bodyparam  {Object} [options] Opciones extras relacionadas con el pago. La información dependerá del servicio a utilizar.
   * @bodyparam  {String} options.terminalType Terminal Type del servicio
   * @bodyparam  {String} options.transactionType Tipo de transacción del servicio
   *
   */
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

   /** 
   * Realiza un pago con una tarjeta de crédito previamente registrada
   *
   * @name  Pago con tarjeta registrada
   * 
   * @route {POST} srv/payments/payRegistered
   *
   * @queryparam {String} [service] Servicio por el que realizar el pago. (Ej. "service=globalonepay")
   *
   * @bodyparam  {Object} data Información del pago que se va a realizar. La información dependerá del servicio a utilizar.
   * @bodyparam  {String} data.orderId Identificador de la compra
   * @bodyparam  {String} data.amount  Valor de la compra
   * @bodyparam  {String} data.currency  Divisa en la que se va a realizar el pago
   * @bodyparam  {String} data.cardNumber Identificador de la tarjeta de crédito registrada
   * @bodyparam  {Object} [options] Opciones extras relacionadas con el pago. La información dependerá del servicio a utilizar.
   * @bodyparam  {String} options.terminalType Terminal Type del servicio
   * @bodyparam  {String} options.transactionType Tipo de transacción del servicio
   *
   */
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

   /** 
   * Realiza una devolución
   *
   * @name  Devolución
   * 
   * @route {POST} srv/payments/refund
   *
   * @queryparam {String} [service] Servicio por el que realizar la devolucion. (Ej. "service=globalonepay")
   *
   * @bodyparam  {Object} data Información de la devolución que se va a realizar.
   * @bodyparam  {String} data.paymentRef  Referencia del pago del que se va a realizar la devolución
   * @bodyparam  {String} data.amount      Cantidad a devolver
   * @bodyparam  {Object} [options] Opciones extras relacionadas con la devolución.
   * @bodyparam  {String} [options.operator]  Nombre de quien realiza la operacion
   * @bodyparam  {String} [options.reason]    Razón de la devolución
   *
   */
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

  App.app.use(`${App.baseRoute}/srv/payments`, router);
}


module.exports = setupRoutes;