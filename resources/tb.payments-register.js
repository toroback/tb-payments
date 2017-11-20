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
  regts : { type: Date },
  reference : { type: String },
  respts: {type: Date} // 

});

module.exports = PaymentRegisterSchema; 
