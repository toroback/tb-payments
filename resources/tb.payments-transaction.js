var mongoose = require('mongoose'),  
    Schema   = mongoose.Schema;

const actionEnum = ["pay", "refund"];

/** 
 * Modelo de datos que contiene información sobre una transacción, que puede ser pago o devolución
 * @class TransactionSchema
 * @memberOf module:tb-payments
 */ 
var TransactionSchema = new Schema({  
  action: { type: String, enum:actionEnum, required: true},
  orderId: { type: String },
  amount: { type: Number },
  currency: { type: String },
  payTs: { type: Date }, 
  optional : { },
  cardNumber : { type: String }, // Solo se guardan los 4 ultimos digitos con asteriscos el resto si es el numero de tarjeta y si es referencia la referencia
  rPayReference : { type: String },
  rPayTs: { type: Date }, 
  rApproved: { type: Boolean },
  rPaycode: { type: String },
  respts: {type: Date} 
});

module.exports = TransactionSchema; 
