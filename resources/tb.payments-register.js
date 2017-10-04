var mongoose = require('mongoose'),  
    Schema   = mongoose.Schema;


var PaymentRegisterSchema = new Schema({  
  cardNumber : { type: String }, // Solo se guardan los 4 ultimos digitos con asteriscos el resto si es el numero de tarjeta y si es referencia la referencia
  cardExpiry : { type: String }, 
  cardHolderName : { type: String },
  regts : { type: Date },
  reference : { type: String },
  respts: {type: Date} // 

});

module.exports = PaymentRegisterSchema; 
