var mongoose = require('mongoose'),  
    Schema   = mongoose.Schema;

/** 
 * Modelo de datos que contiene información sobre el registro de una tarjeta de crédito
 * @class PaymentRegisterSchema
 * @memberOf module:tb-payments
 * @property {String} cardNumber Número de tarjeta. Los números de tajerjeta se almacenan guardando los 4 ultimos digitos completando con asteriscos el resto
 * @property {String} cardExpiry Fecha de vencimiento de la tarjeta de crédito en formato "MMYY" (Ej:0920 -> "Septiembre de 2020").
 * @property {String} cardHolderName Nombre en la tarjeta de crédito.
 * @property {Date} regts Timestamp de la fecha de registro
 * @property {Date} regrespts Timestamp de le fecha de la respuesta del registro
 * @property {String} reference Referencia de la tarjeta registrada
 * @property {Boolean} active Flag que indica si la tarjeta está activa o no
 * @property {Date} [unregts] Timestamp de la fecha de desregistro de la tarjeta. Solo tarjetas desregistradas
 * @property {Date} [unregrespts] Timestamp de le fecha de la respuesta del desregistro. Solo tarjetas desregistradas
 * @property {Object} originalResponse Respuesta original del registro
 * @property {String} serviceProvider Servicio de pagos utilizado para el registro
 */ 
var PaymentRegisterSchema = new Schema({  
  cardNumber : { type: String }, // Número de tarjeta. Los números de tajerjeta se almacenan guardando los 4 ultimos digitos completando con asteriscos el resto
  cardExpiry : { type: String }, 
  cardHolderName : { type: String },
  regts : { type: Date }, //timestamp de la fecha de registro
  regrespts: { type: Date }, // timestamp de le fecha de la respuesta del registro
  reference : { type: String }, //referencia de la tarjeta registrada
  
  active: { type: Boolean }, // flag que indica si la tarjeta está activa o no

  unregts : { type: Date }, //timestamp de la fecha de desregistro de la tarjeta
  unregrespts: { type: Date }, // timestamp de le fecha de la respuesta del desregistro

  originalResponse: { }, //Respuesta original del registro
  serviceProvider: { type: String } //Proveedor del servicio de pagos
});

PaymentRegisterSchema.index({ reference: 1 });

module.exports = PaymentRegisterSchema; 
