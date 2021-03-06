/** 
 * @module tb-payments
 *
 * @description 
 *
 * Este módulo permite realizar pagos, registro de tarjetas de crédito y devoluciones.
 *
 * <p>
 * Servicios disponibles:
 * </p>
 * <p>
 * {@link module:tb-payments-globalonepay|GlobalOnePay}
 * </p>
 *
 * 
 * <p>
 * @see [Guía de uso]{@tutorial tb-payments} para más información.
 * @see [REST API]{@link module:tb-payments/routes} (API externo).
 * @see [Class API]{@link module:tb-payments.Client} (API interno).
 * @see Repositorio en {@link https://github.com/toroback/tb-payments|GitHub}.
 * </p>
 *
 * 

 * 
 */



let rscPath  = __dirname +'/resources';

let App;
let log;


/**
 * Clase que representa un gestor de pagos
 * @memberOf module:tb-payments
 */
class Client {
  /**
   * Crea un gestor de pagos. Utilizar los modulos tb-payments-globalonepay, etc…
   * @param  {Object} options               Objeto con las credenciales para el servicio.
   * @param  {Object} options.terminalId      TerminalID para el servicio
   * @param  {Object} options.sharedSecret    SharedSecret para el servicio
   * @param  {Object} [options.url]           URL para el servicio de pagos
   * @param  {Object} [options.port]          Puerto para el servicio de pagos
   * @param  {Object} Adapter        Adapter del servicio que se va a utilizar. 
   */
  constructor(options, Adapter) {
    this.options = options || {};
    this.adapter = new Adapter(this);
  }
  
   /**
   * Registra una tarjeta de credito
   * @param  {Object} data Información de la tarjeta a registrar.
   * @param  {String} data.cardNumber Número de la tarjeta de crédito.
   * @param  {String} data.cardExpiry Fecha de vencimiento de la tarjeta de crédito en formato "MMYY" (Ej:0920 -> "Septiembre de 2020").
   * @param  {String} data.cardType  Tipo de tarjeta de crédito (EJ: MASTERCARD).
   * @param  {String} data.cardHolderName Nombre en la tarjeta de crédito.
   * @return {Promise<PaymentRegisterSchema>} Promesa con la información del registro
   */
  register(data) {
    return new Promise((resolve, reject) =>{
      console.log("-> payments.register ");
      this.adapter.register(data)
        .then(registrationData => {
          let PaymentsRegister = App.db.model('tb.payments-register');
          let registration = new PaymentsRegister(registrationData);
          return registration.save();
        })
        .then(resolve)
        .catch(reject);
    });
  }

    /**
   * Desregistra una tarjeta de credito. 
   * @param  {Object} data Información de la tarjeta a desregistrar. La información dependerá del servicio a utilizar.
   * @param  {String} data.merchantRef Identificador personal de la tarjeta de crédito que se va a desregistrar.
   * @param  {String} data.reference Referencia en el servicio externo de la tarjeta de crédito registrada. 
   * @return {Promise<PaymentRegisterSchema>} Promesa que indica si se desregistró correctamente
   */
  unregister(data) {
    return new Promise((resolve, reject) =>{
      console.log("-> payments.unregister ");
      this.adapter.unregister(data)
        .then(unregistrationData => {  
          let PaymentsRegister = App.db.model('tb.payments-register');

          var match = { 'reference': unregistrationData.reference };
          var update =  { '$set': { active: false, unregts: unregistrationData.unregts, unregrespts: unregistrationData.unregrespts }};
          return PaymentsRegister.findOneAndUpdate(match, update, {'new': true});
        })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Realiza un pago
   * @param  {Object} data Información del pago que se va a realizar. La información dependerá del servicio a utilizar.
   * @param  {String} data.orderId Identificador de la compra
   * @param  {String} data.amount  Valor de la compra
   * @param  {String} data.currency  Divisa en la que se va a realizar el pago
   * @param  {String} data.cardNumber Número de la tarjeta de crédito.
   * @param  {String} data.cardExpiry Fecha de vencimiento de la tarjeta de crédito en formato "MMYY" (Ej:0920 -> "Septiembre de 2020").
   * @param  {String} data.cardType  Tipo de tarjeta de crédito (EJ: MASTERCARD).
   * @param  {String} data.cardHolderName Nombre en la tarjeta de crédito.
   * @param  {String} data.cvv Código secreto que aparece en la tarjeta
   * @param  {Object} [options] Opciones extras relacionadas con el pago. La información dependerá del servicio a utilizar.
   * @param  {String} options.terminalType Terminal Type de GlobalOnePay
   * @param  {String} options.transactionType Tipo de transacción de GlobalOnePay
   * @return {Promise<TransactionSchema>} Promesa con la información de la transacción
   */
  pay(data, options){
    return new Promise((resolve, reject) =>{
      console.log("-> payments.pay ");
      this.adapter.pay(data, options)
        .then(transactionData => {
          let PaymentsTransaction = App.db.model('tb.payments-transaction');
          let transaction = new PaymentsTransaction(transactionData);
          return transaction.save();
        })
        .then(resolve)
        .catch(reject);
    });
    
  }
  
  /**
   * Realiza un pago con una tarjeta de crédito previamente registrada
   * @param  {Object} data Información del pago que se va a realizar. La información dependerá del servicio a utilizar.
   * @param  {String} data.orderId Identificador de la compra
   * @param  {String} data.amount  Valor de la compra
   * @param  {String} data.currency  Divisa en la que se va a realizar el pago
   * @param  {String} data.cardNumber Identificador de la tarjeta de crédito registrada
   * @param  {Object} [options] Opciones extras relacionadas con el pago. La información dependerá del servicio a utilizar.
   * @param  {String} options.terminalType Terminal Type de GlobalOnePay
   * @param  {String} options.transactionType Tipo de transacción de GlobalOnePay
   * @return {Promise<TransactionSchema>} Promesa con la información de la transacción
   */
  payRegistered(data, options){
    return new Promise((resolve, reject) =>{
      console.log("-> payments.payRegistered ");
      this.adapter.payRegistered(data, options)
        .then(transactionData => {
          let PaymentsTransaction = App.db.model('tb.payments-transaction');
          let transaction = new PaymentsTransaction(transactionData);
          return transaction.save();
        })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Realiza una devolución
   * @param  {Object} data Información de la devolución que se va a realizar. La información dependerá del servicio a utilizar.
   * @param  {String} data.paymentRef  Referencia del pago del que se va a realizar la devolución
   * @param  {String} data.amount      Cantidad a devolver
   * @param  {Object} [options] Opciones extras relacionadas con la devolución. La información dependerá del servicio a utilizar.
   * @param  {String} [options.operator]  Nombre de quien realiza la operacion
   * @param  {String} [options.reason]    Razón de la devolución
   * @return {Promise<TransactionSchema>} Promesa con la información de la transacción
   */
  refund(data, options){
    return new Promise((resolve, reject) =>{
      console.log("-> payments.refund ");
      let PaymentsTransaction = App.db.model('tb.payments-transaction');
      var transactionData;
      this.adapter.refund(data, options)
        .then(resp => {
          transactionData = resp;
          return PaymentsTransaction.findOne({'action':'pay', 'rPayReference': data.paymentRef});
        })
        .then(doc =>{
          let transaction = new PaymentsTransaction(transactionData);
          transaction.orderId = doc.orderId;
          transaction.cardNumber = doc.cardNumber;
          return transaction.save();
        })
        .then(resolve)
        .catch(reject);
    });
  }


  /**
   * Setup del módulo. Debe ser llamado antes de crear una instancia
   * @param {Object} _app Objeto App del servidor
   * @return {Promise} Una promesa
   */
  static setup(app){
    return new Promise((resolve,reject)=>{
      App = app;
      log = App.log.child({module:'payments'});

      log.debug("Setup: Payments");

      require("./routes")(app);
    
      resolve();

    });
  }

  /**
   * Inicializa los modelos del módulo
   * @return {Promise} Una promesa
   */
  static  init(){
    return new Promise( (resolve, reject) => {
      App.db.setModel('tb.payments-transaction',rscPath + '/tb.payments-transaction');
      App.db.setModel('tb.payments-register',rscPath + '/tb.payments-register');
      resolve();
    });
  }

  /**
   * Obtiene un gestor de pagos ya configurado para un servicio indicado tomando la configuración del archivo de configuración del servidor(config.json).
   * @param  {String} service      El servicio para el que se quiere crear el gestor
   * @return {Promise<Object>} Una promesa con el gestor
   */
  static forService(service){
    return new Promise((resolve, reject) => {

      if (!App)
        throw new Error('setup() needs to be called first');

      if(!App.paymentsOptions)
        throw new Error('paymentsOptions not configured - see config.json');

      let credentials
      let options;
      let adapter;
      let client;
      service = service || "globalonepay";
      if(service){
        switch (service) {
          case "globalonepay":
            credentials = App.paymentsOptions.globalOnePay;
            if(!credentials)
               throw new Error('globalonepay options must be configured');

            adapter = require('tb-payments-globalonepay');
            options = credentials;
        
            break;
        }
      }
      if(options && adapter){
        client = new Client(options,adapter);
      }

      if(client){
        resolve(client);
      }else{
        reject(new Error('Service not exists'));
      }
    });
  }

}


module.exports = Client;