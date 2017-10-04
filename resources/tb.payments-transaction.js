var mongoose = require('mongoose'),  
    Schema   = mongoose.Schema;

const actionEnum = ["pay", "refund"];

var TransactionSchema = new Schema({  
  action: { type: String, enum:actionEnum, required: true},
  orderId: { type: String },
  amount: { type: Number },
  currency: { type: String },
  payTs: { type: Date }, 
  optional : { type: Boolean }, //¿? es un Boolean?
  cardNumber : { type: String }, // Solo se guardan los 4 ultimos digitos con asteriscos el resto si es el numero de tarjeta y si es referencia la referencia
  rPayReference : { type: String },
  rPayTs: { type: Date }, 
  rApproved: { type: Boolean },
  rPaycode: { type: String },
  respts: {type: Date} 
});

module.exports = TransactionSchema; 
