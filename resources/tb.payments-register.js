var mongoose = require('mongoose'),  
    Schema   = mongoose.Schema;

/** 
 * Modelo de datos que contiene información sobre el registro de una tarjeta de crédito
 * @class PaymentRegisterSchema
 * @memberOf module:tb-payments
 */ 
var PaymentRegisterSchema = new Schema({  
  cardNumber : { type: String }, // Solo se guardan los 4 ultimos digitos con asteriscos el resto si es el numero de tarjeta y si es referencia la referencia
  cardExpiry : { type: String }, 
  cardHolderName : { type: String },
  regts : { type: Date }, //timestamp de la fecha de registro
  regrespts: { type: Date }, // timestamp de le fecha de la respuesta del registro
  reference : { type: String }, //referencia de la tarjeta registrada
  
  active: { type: Boolean }, // flag que indica si la tarjeta está activa o no

  unregts : { type: Date }, //timestamp de la fecha de desregistro de la tarjeta
  unregrespts: { type: Date } // timestamp de le fecha de la respuesta del desregistro
});

PaymentRegisterSchema.index({ reference: 1 });

module.exports = PaymentRegisterSchema; 
