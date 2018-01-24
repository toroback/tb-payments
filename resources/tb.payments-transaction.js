var mongoose = require('mongoose'),  
    Schema   = mongoose.Schema;

const actionEnum = ["pay", "refund"];

/** 
 * Modelo de datos que contiene información sobre una transacción, que puede ser pago o devolución
 * @class TransactionSchema
 * @memberOf module:tb-payments
 * @property {String} action Acción que se realiza en la transaccion, indicando pago o devolución. Values(pay, refund)
 * @property {String} orderId Identificador de orden de la transacción.
 * @property {Number} amount Cantidad de dinero de la transacción
 * @property {String} currency ISO de la Moneda de la transacción
 * @property {String} [payReference] Referencia del pago que se utiliza en la transacción (Para devoluciones)
 * @property {Date} payTs Timestamp de la fecha en que se solicita la transaccion 
 * @property {Object} optional Información adicional relacionada con la transaccion
 * @property {String} cardNumber  Número de tarjeta o referencia de tarjeta registrada. Los números de tajerjeta se almacenan guardando los 4 ultimos digitos completando con asteriscos el resto y si es la referencia se guarda el numero completo
 * @property {String} rPayReference Número de referencia del pago o devolución de la transaccion realizada
 * @property {Date} rPayTs Timestamp de la fecha en que se realiza la transaccion 
 * @property {Boolean} rApproved Flag que indica si la transacción fue aprobada
 * @property {String} rPaycode Código de respuesta del estado de la transacción 
 * @property {Date} respts Timestamp de la fecha en que se recibe la respuesta de la transaccion
 */ 
var TransactionSchema = new Schema({  
  action: { type: String, enum:actionEnum, required: true}, //Acción que se realiza en la transaccion, indicando pago o devolución. Values(pay, refund)
  orderId: { type: String, index: true }, //Identificador de orden de la transacción.
  amount: { type: Number }, // Cantidad de dinero de la transacción
  currency: { type: String }, // ISO de la Moneda de la transacción
  payReference : { type: String }, //Referencia del pago que se utiliza en la transacción (Para devoluciones)
  payTs: { type: Date }, // Timestamp de la fecha en que se solicita la transaccion 
  optional : { }, //Información adicional relacionada con la transaccion
  cardNumber : { type: String, index: true }, // Solo se guardan los 4 ultimos digitos con asteriscos el resto si es el numero de tarjeta y si es referencia la referencia
  rPayReference : { type: String }, //Número de referencia del pago o devolución de la transaccion realizada
  rPayTs: { type: Date }, // Timestamp de la fecha en que se realiza la transaccion 
  rApproved: { type: Boolean }, //Flag que indica si la transacción fue aprobada
  rPaycode: { type: String }, //Código de respuesta del estado de la transacción 
  respts: {type: Date}  // Timestamp de la fecha en que se recibe la respuesta de la transaccion 
});

module.exports = TransactionSchema; 
