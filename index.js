
let rscPath  = __dirname +'/resources';

let App;
let log;

class Client {
  constructor(options, Adapter) {
    this.options = options || {};
    this.adapter = new Adapter(this);
  }
  
  register(data) {
    return new Promise((resolve, reject) =>{
      console.log("entra en payments.register index")
      this.adapter.register(data)
        .then(registrationData => {
          console.log("vuelve a payments.register index")
          let PaymentsRegister = App.db.model('tb.payments-register');
          let registration = new PaymentsRegister(registrationData);
          return registration.save();
        })
        .then(resolve)
        .catch(reject);
    });
  }

  pay(data, options){
    return new Promise((resolve, reject) =>{
      console.log("entra en payments.pay index")
      this.adapter.pay(data, options)
        .then(transactionData => {
          console.log("vuelve a payments.pay index")
          let PaymentsTransaction = App.db.model('tb.payments-transaction');
          let transaction = new PaymentsTransaction(transactionData);
          return transaction.save();
        })
        .then(resolve)
        .catch(reject);
    });
    
  }
  
  payRegistered(data, options){
    return new Promise((resolve, reject) =>{
      console.log("entra en payments.payRegistered index")
      this.adapter.payRegistered(data, options)
        .then(transactionData => {
          console.log("vuelve a payments.payRegistered index")
          let PaymentsTransaction = App.db.model('tb.payments-transaction');
          let transaction = new PaymentsTransaction(transactionData);
          return transaction.save();
        })
        .then(resolve)
        .catch(reject);
    });
  }

  refund(data, options){
    return new Promise((resolve, reject) =>{
      console.log("entra en payments.refund index")
      this.adapter.refund(data, options)
        .then(transactionData => {
          console.log("vuelve a payments.refund index")
          let PaymentsTransaction = App.db.model('tb.payments-transaction');
          let transaction = new PaymentsTransaction(transactionData);
          return transaction.save();
        })
        .then(resolve)
        .catch(reject);
    });
  }


  static setup(app){
    return new Promise((resolve,reject)=>{
      App = app;
      log = App.log.child({module:'pay'});

      log.debug("iniciando Módulo Pay");

      require("./routes")(app);
    
      resolve();

    });
  }


  static  init(){
    return new Promise( (resolve, reject) => {
      App.db.setModel('tb.payments-transaction',rscPath + '/tb.payments-transaction');
      App.db.setModel('tb.payments-register',rscPath + '/tb.payments-register');
      resolve();
    });
  }

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