# **tb-payments**

Módulo que ofrece servicios de pago, registro de tarjetas de crédito, devoluciones, etc…. Para ello utiliza servicios de terceros ofrecidos a través de distintos módulos. 

## **Instalación:**
  
Para utilizar los servicios de pago es necesario tener instalada la librería **tb-payments** junto con la librería del servicio que se vaya a utilizar, como por ejemplo **tb-payments-globalonepay**, y tener una cuenta creada para dicho servicio.

Además es importante inicializar la librería en el archivo "boot.js" dentro de app. Para ello incluir la siguiente linea dentro de la función Boot:

```javscript
App.payments.init();
```

## **Configuración del servicio:**

### **- Servicios disponibles:**
Para poder utilizar un servicio se utilizarán los identificadores de cada uno de ellos.
Por ahora los servicios disponibles son:

- **GlobalOnePay**
  + Nombre de módulo: [**tb-payments-globalonepay**](https://github.com/toroback/tb-payments-globalonepay)
  + Identificador: "globalonepay"
  + [Página web](https://www.globalonepay.com/)

### **- Configuración desde interfaz administrativa:** 

Por el momento no la opción de configuración a través de la interfaz de administración no está disponible.

### **- Configuración manual**

La configuración manual se realiza en el archivo "config.json".

Para ello hay que añadir el objeto "paymentsOptions", si no se tenía anteriormente, y agregar un objeto con la configuración del servicio que se vaya a utilizar. Al completarlo, debería quedar de la siguiente manera:

```javascript
"paymentsOptions":{
  <paymentService>:{
    …
    …
  }
}
```

#### **• Ejemplo:**
```javascript
"paymentsOptions":{
  "globalonepay":{
    "terminalId": "myTerminalId",
    "sharedSecret": "mySharedSecret",
    "mcp": <True, False. Flag que indica si soporta multiples monedas>,
    "url": <Url del servicio>,
    "port": <Puerto de comunicacion del servicio>
  }
}
```

Al completarlo, debería quedar de la siguiente manera:

```javascript
"paymentsOptions":{
  "globalonepay":{
    "terminalId": "99089",
    "sharedSecret": "123456789XX",
    "mcp": true,
    "url": myServiceUrl,
    "port": myServicePort
  }
}
```

## **Funcionalidades**

### **- Registrar una tarjeta:**

#### **• REST Api:**

**Petición:**

|HTTP Method|URL|
|:---:|:---|
|POST| `https://[domain]:[port]/api/v[apiVersion]/srv/payments/register?service=<service>`|

**Parámetros del query:**

| Clave | Tipo | Opcional   | Descripción  |
|---|---|:---:|---|
|service|String|X|Servicio de pago a utilizar (valores: globalonepay)|

**Parámetros del body:**

| Clave | Tipo | Opcional   | Descripción  |
|---|---|:---:|---|
|data|Object||Información de la tarjeta que se va a registrar. La información dependerá del servicio a utilizar|
|data.merchantRef|String||Identificador único para la tarjeta que se va a registrar| 
|data.cardNumber|String||Número de la tarjeta de crédito.|
|data.cardExpiry|String||Fecha de vencimiento de la tarjeta de crédito en formato "MMYY" (Ej:0920 -> "Septiembre de 2020").|
|data.cardType|String||Información de la tarjeta que se va a registrar. La información dependerá del servicio a utilizar|
|data.cvv|String||Código de seguridad impreso en la tarjeta| 
|data.cardHolderName|String||Información de la tarjeta que se va a registrar. La información dependerá del servicio a utilizar|

**Respuesta:**

| Clave | Tipo | Opcional | Descripción |
|---|---|:---:|---|
|register|tb.payments-register||Objeto con la información de la tarjeta registrada|
|register.cardNumber|String||Número de tarjeta. Los números de tajerjeta se almacenan guardando los 4 ultimos digitos completando con asteriscos el resto|
|register.cardExpiry|String||Fecha de vencimiento de la tarjeta de crédito en formato "MMYY" (Ej:0920 -> "Septiembre de 2020").|
|register.cardHolderName|String||Nombre en la tarjeta de crédito.|
|register.regts|Date||Timestamp de la fecha de registro|
|register.regrespts|Date||Timestamp de le fecha de la respuesta del registro|
|register.reference|String||Referencia de la tarjeta registrada|
|register.active|Boolean||Flag que indica si la tarjeta está activa o no|

**Ejemplo:**

POST: `https://a2server.a2system.net:1234/api/v1/srv/payments/register?service=globalonepay`

* BODY: 

```javascript
 {
   "data": {
     "merchantRef":"1234567890123459",
     "cardNumber":myCardNumber,
     "cardExpiry":"1220",
     "cardType":"MASTERCARD",
     "cardHolderName":"Messi",
     "cvv": "231"  
   }
 }
```

#### **• Código Javascript:**

**Parámetros:**

| Clave | Tipo | Opcional   | Descripción  |
|---|---|:---:|---|
|data|Object||Información de la tarjeta que se va a registrar. La información dependerá del servicio a utilizar|
|data.merchantRef|String||Identificador único para la tarjeta que se va a registrar| 
|data.cardNumber|String||Número de la tarjeta de crédito.|
|data.cardExpiry|String||Fecha de vencimiento de la tarjeta de crédito en formato "MMYY" (Ej:0920 -> "Septiembre de 2020").|
|data.cardType|String||Información de la tarjeta que se va a registrar. La información dependerá del servicio a utilizar|
|data.cvv|String||Código de seguridad impreso en la tarjeta| 
|data.cardHolderName|String||Información de la tarjeta que se va a registrar. La información dependerá del servicio a utilizar|

**Respuesta:**

| Clave | Tipo | Opcional | Descripción |
|---|---|:---:|---|
|register|tb.payments-register||Objeto con la información de la tarjeta registrada|
|register.cardNumber|String||Número de tarjeta. Los números de tajerjeta se almacenan guardando los 4 ultimos digitos completando con asteriscos el resto|
|register.cardExpiry|String||Fecha de vencimiento de la tarjeta de crédito en formato "MMYY" (Ej:0920 -> "Septiembre de 2020").|
|register.cardHolderName|String||Nombre en la tarjeta de crédito.|
|register.regts|Date||Timestamp de la fecha de registro|
|register.regrespts|Date||Timestamp de le fecha de la respuesta del registro|
|register.reference|String||Referencia de la tarjeta registrada|
|register.active|Boolean||Flag que indica si la tarjeta está activa o no|

**Ejemplo:**

```javascript
var service = "globalonepay";

var data = {
  merchantRef:"1234567890123459",
  cardNumber:myCardNumber,
  cardExpiry:"1220",
  cardType:"MASTERCARD",
  cvv: "231",
  cardHolderName:"Messi" 
};

App.payments.forService(service)
  .then(client => client.register(data))
  .then(resp => console.log(resp))
  .catch(err => console.log(err));
```

### **- Desregistrar una tarjeta:**

#### **• REST Api:**

**Petición:**

|HTTP Method|URL|
|:---:|:---|
|POST| `https://[domain]:[port]/api/v[apiVersion]/srv/payments/unregister?service=<service>`|

**Parámetros del query:**

| Clave | Tipo | Opcional   | Descripción  |
|---|---|:---:|---|
|service|String|X|Servicio de pago a utilizar (valores: globalonepay)|

**Parámetros del body:**

| Clave | Tipo | Opcional   | Descripción  |
|---|---|:---:|---|
|data|Object||Información de la tarjeta que se va a registrar. La información dependerá del servicio a utilizar|
|data.merchantRef|String||Identificador único para la tarjeta que se va a registrar| 
|data.reference|String||Referencia en el servicio de la tarjeta de crédito registrada.|

**Respuesta:**

| Clave | Tipo | Opcional | Descripción |
|---|---|:---:|---|
|register|tb.payments-register||Objeto con la información de la tarjeta registrada|
|register.cardNumber|String||Número de tarjeta. Los números de tajerjeta se almacenan guardando los 4 ultimos digitos completando con asteriscos el resto|
|register.cardExpiry|String||Fecha de vencimiento de la tarjeta de crédito en formato "MMYY" (Ej:0920 -> "Septiembre de 2020").|
|register.cardHolderName|String||Nombre en la tarjeta de crédito.|
|register.regts|Date||Timestamp de la fecha de registro|
|register.regrespts|Date||Timestamp de le fecha de la respuesta del registro|
|register.reference|String||Referencia de la tarjeta registrada|
|register.active|Boolean||Flag que indica si la tarjeta está activa o no|
|register.unregts|Date||Timestamp de la fecha de desregistro de la tarjeta. Solo tarjetas desregistradas|
|register.unregrespts|Date||Timestamp de le fecha de la respuesta del desregistro. Solo tarjetas desregistradas|


**Ejemplo:**

POST: `https://a2server.a2system.net:1234/api/v1/srv/payments/unregister?service=globalonepay`

* BODY: 

```javascript
 {
   "data": {
     "merchantRef":"1234567890123459",
     "reference": "L190394333"
   }
 }
```

#### **• Código Javascript:**

**Parámetros:**

| Clave | Tipo | Opcional   | Descripción  |
|---|---|:---:|---|
|data|Object||Información de la tarjeta que se va a registrar. La información dependerá del servicio a utilizar|
|data.merchantRef|String||Identificador único para la tarjeta que se va a registrar| 
|data.reference|String||Referencia en el servicio de la tarjeta de crédito registrada.|

**Respuesta:**

| Clave | Tipo | Opcional | Descripción |
|---|---|:---:|---|
|register|tb.payments-register||Objeto con la información de la tarjeta registrada|
|register.cardNumber|String||Número de tarjeta. Los números de tajerjeta se almacenan guardando los 4 ultimos digitos completando con asteriscos el resto|
|register.cardExpiry|String||Fecha de vencimiento de la tarjeta de crédito en formato "MMYY" (Ej:0920 -> "Septiembre de 2020").|
|register.cardHolderName|String||Nombre en la tarjeta de crédito.|
|register.regts|Date||Timestamp de la fecha de registro|
|register.regrespts|Date||Timestamp de le fecha de la respuesta del registro|
|register.reference|String||Referencia de la tarjeta registrada|
|register.active|Boolean||Flag que indica si la tarjeta está activa o no|
|register.unregts|Date||Timestamp de la fecha de desregistro de la tarjeta. Solo tarjetas desregistradas|
|register.unregrespts|Date||Timestamp de le fecha de la respuesta del desregistro. Solo tarjetas desregistradas|

**Ejemplo:**

```javascript
var service = "globalonepay";

var data = {
  merchantRef:"1234567890123459",
  reference:L190394333
};

App.payments.forService(service)
  .then(client => client.unregister(data))
  .then(resp => console.log(resp))
  .catch(err => console.log(err));
```

### **- Pago:**

#### **• REST Api:**

**Petición:**

|HTTP Method|URL|
|:---:|:---|
|POST| `https://[domain]:[port]/api/v[apiVersion]/srv/payments/pay?service=<service>`|

**Parámetros del query:**

| Clave | Tipo | Opcional   | Descripción  |
|---|---|:---:|---|
|service|String|X|Servicio de pago a utilizar (valores: globalonepay)|

**Parámetros del body:**

| Clave | Tipo | Opcional   | Descripción  |
|---|---|:---:|---|
|data|Object||Información del pago que se va a realizar. La información dependerá del servicio a utilizar.|
|data.orderId|String||Identificador de la compra|
|data.amount|String||Valor de la compra|
|data.currency|String||Divisa en la que se va a realizar el pago|
|data.cardNumber|String||Número de la tarjeta de crédito|
|data.cardExpiry|String||Fecha de vencimiento de la tarjeta de crédito en formato "MMYY" (Ej:0920 -> "Septiembre de 2020").|
|data.cardType|String||Tipo de tarjeta de crédito (EJ: MASTERCARD).|
|data.cardHolderName|String||Nombre en la tarjeta de crédito.|
|data.cvv|String||Código secreto que aparece en la tarjeta|
|options|Object|X|Opciones extras relacionadas con el pago. La información dependerá del servicio a utilizar.|
|options.terminalType|String||Terminal Type del servicio|
|options.transactionType|String||Tipo de transacción del servicio|

**Respuesta:**

| Clave | Tipo | Opcional | Descripción |
|---|---|:---:|---|
|transaction|tb.payments-transaction||Objeto con la información de la transacción|
|transaction.action|String||"pay" - Acción que se realiza en la transacción|
|transaction.orderId|String||Identificador de orden de la transacción|
|transaction.amount|Number||Cantidad de dinero de la transacción|
|transaction.currency|tString||ISO de la Moneda de la transacción|
|transaction.payReference|String||Referencia del pago que se utiliza en la transacción (Para devoluciones)|
|transaction.payTs|Date||Timestamp de la fecha en que se solicita la transacción |
|transaction.optional|Object||Información adicional relacionada con la transacción|
|transaction.cardNumber|String||Número de tarjeta o referencia de tarjeta registrada. Los números de tajerjeta se almacenan guardando los 4 ultimos digitos completando con asteriscos el resto y si es la referencia se guarda el numero completo|
|transaction.rPayReference|String||Número de referencia del pago o devolución de la transaccion realizada|
|transaction.rPayTs|Date||Timestamp de la fecha en que se realiza la transacción|
|transaction.rApproved|Boolean||Flag que indica si la transacción fue aprobada|
|transaction.rPaycode|String||Código de respuesta del estado de la transacción |
|transaction.respts|Date||Timestamp de la fecha en que se recibe la respuesta de la transacción|

**Ejemplo:**

POST: `https://a2server.a2system.net:1234/api/v1/srv/payments/pay?service=globalonepay`

* BODY: 

```javascript
 {
   "data": {
     "orderId"        : "19827391827392",
     "amount"         : "289",
     "currency"       : "USD",
     "cardNumber"     : myCardNumber,
     "cardType"       : "MASTERCARD",
     "cardExpiry"     : "1220",
     "cardHolderName" : "Messi" ,
     "cvv"            : "124" 
   }
 }
```

#### **• Código Javascript:**

**Parámetros:**

| Clave | Tipo | Opcional   | Descripción  |
|---|---|:---:|---|
|data|Object||Información del pago que se va a realizar. La información dependerá del servicio a utilizar.|
|data.orderId|String||Identificador de la compra|
|data.amount|String||Valor de la compra|
|data.currency|String||Divisa en la que se va a realizar el pago|
|data.cardNumber|String||Número de la tarjeta de crédito|
|data.cardExpiry|String||Fecha de vencimiento de la tarjeta de crédito en formato "MMYY" (Ej:0920 -> "Septiembre de 2020").|
|data.cardType|String||Tipo de tarjeta de crédito (EJ: MASTERCARD).|
|data.cardHolderName|String||Nombre en la tarjeta de crédito.|
|data.cvv|String||Código secreto que aparece en la tarjeta|
|options|Object|X|Opciones extras relacionadas con el pago. La información dependerá del servicio a utilizar.|
|options.terminalType|String||Terminal Type del servicio|
|options.transactionType|String||Tipo de transacción del servicio|

**Respuesta:**

| Clave | Tipo | Opcional | Descripción |
|---|---|:---:|---|
|transaction|tb.payments-transaction||Objeto con la información de la transacción|
|transaction.action|String||"pay" - Acción que se realiza en la transacción|
|transaction.orderId|String||Identificador de orden de la transacción|
|transaction.amount|Number||Cantidad de dinero de la transacción|
|transaction.currency|tString||ISO de la Moneda de la transacción|
|transaction.payReference|String||Referencia del pago que se utiliza en la transacción (Para devoluciones)|
|transaction.payTs|Date||Timestamp de la fecha en que se solicita la transacción |
|transaction.optional|Object||Información adicional relacionada con la transacción|
|transaction.cardNumber|String||Número de tarjeta o referencia de tarjeta registrada. Los números de tajerjeta se almacenan guardando los 4 ultimos digitos completando con asteriscos el resto y si es la referencia se guarda el numero completo|
|transaction.rPayReference|String||Número de referencia del pago o devolución de la transaccion realizada|
|transaction.rPayTs|Date||Timestamp de la fecha en que se realiza la transacción|
|transaction.rApproved|Boolean||Flag que indica si la transacción fue aprobada|
|transaction.rPaycode|String||Código de respuesta del estado de la transacción |
|transaction.respts|Date||Timestamp de la fecha en que se recibe la respuesta de la transacción|

**Ejemplo:**

```javascript
var service = "globalonepay";

var data = {
 orderId        : "19827391827392",
 amount         : "289",
 currency       : "USD",
 cardNumber     : myCardNumber,
 cardType       : "MASTERCARD",
 cardExpiry     : "1220",
 cardHolderName : "Messi" ,
 cvv            : "124" 
};

App.payments.forService(service)
  .then(client => client.pay(data))
  .then(resp => console.log(resp))
  .catch(err => console.log(err));
```

### **- Pago con una tarjeta registrada:**

#### **• REST Api:**

**Petición:**

|HTTP Method|URL|
|:---:|:---|
|POST| `https://[domain]:[port]/api/v[apiVersion]/srv/payments/payRegistered?service=<service>`|

**Parámetros del query:**

| Clave | Tipo | Opcional | Descripción |
|---|---|:---:|---|
|transaction|tb.payments-transaction||Objeto con la información de la transacción|
|transaction.action|String||"pay" - Acción que se realiza en la transacción|
|transaction.orderId|String||Identificador de orden de la transacción|
|transaction.amount|Number||Cantidad de dinero de la transacción|
|transaction.currency|tString||ISO de la Moneda de la transacción|
|transaction.payReference|String||Referencia del pago que se utiliza en la transacción (Para devoluciones)|
|transaction.payTs|Date||Timestamp de la fecha en que se solicita la transacción |
|transaction.optional|Object||Información adicional relacionada con la transacción|
|transaction.cardNumber|String||Número de tarjeta o referencia de tarjeta registrada. Los números de tajerjeta se almacenan guardando los 4 ultimos digitos completando con asteriscos el resto y si es la referencia se guarda el numero completo|
|transaction.rPayReference|String||Número de referencia del pago o devolución de la transaccion realizada|
|transaction.rPayTs|Date||Timestamp de la fecha en que se realiza la transacción|
|transaction.rApproved|Boolean||Flag que indica si la transacción fue aprobada|
|transaction.rPaycode|String||Código de respuesta del estado de la transacción |
|transaction.respts|Date||Timestamp de la fecha en que se recibe la respuesta de la transacción|

**Parámetros del body:**

| Clave | Tipo | Opcional   | Descripción  |
|---|---|:---:|---|
|data|Object||Información del pago que se va a realizar. La información dependerá del servicio a utilizar.|
|data.orderId|String||Identificador de la compra|
|data.amount|String||Valor de la compra|
|data.currency|String||Divisa en la que se va a realizar el pago|
|data.cardNumber|String||Identificador de la tarjeta de crédito registrada|
|options|Object|X|Opciones extras relacionadas con el pago. La información dependerá del servicio a utilizar.|
|options.terminalType|String||Terminal Type del servicio|
|options.transactionType|String||Tipo de transacción del servicio|

**Respuesta:**

| Clave | Tipo | Opcional | Descripción |
|---|---|:---:|---|
|transaction|tb.payments-transaction||Objeto con la información de la transacción|

**Ejemplo:**

POST: `https://a2server.a2system.net:1234/api/v1/srv/payments/payRegistered?service=globalonepay`

* BODY: 

```javascript
 {
   "data": {
     "orderId"        : "19827391827393",
     "amount"         : "289",
     "currency"       : "USD",
     "cardNumber"     : "2967535088608700"
   }
 }
```

#### **• Código Javascript:**

**Parámetros:**

| Clave | Tipo | Opcional   | Descripción  |
|---|---|:---:|---|
|data|Object||Información del pago que se va a realizar. La información dependerá del servicio a utilizar.|
|data.orderId|String||Identificador de la compra|
|data.amount|String||Valor de la compra|
|data.currency|String||Divisa en la que se va a realizar el pago|
|data.cardNumber|String||Identificador de la tarjeta de crédito registrada|
|options|Object|X|Opciones extras relacionadas con el pago. La información dependerá del servicio a utilizar.|
|options.terminalType|String||Terminal Type del servicio|
|options.transactionType|String||Tipo de transacción del servicio|

**Respuesta:**

| Clave | Tipo | Opcional | Descripción |
|---|---|:---:|---|
|transaction|tb.payments-transaction||Objeto con la información de la transacción|
|transaction.action|String||"pay" - Acción que se realiza en la transacción|
|transaction.orderId|String||Identificador de orden de la transacción|
|transaction.amount|Number||Cantidad de dinero de la transacción|
|transaction.currency|tString||ISO de la Moneda de la transacción|
|transaction.payReference|String||Referencia del pago que se utiliza en la transacción (Para devoluciones)|
|transaction.payTs|Date||Timestamp de la fecha en que se solicita la transacción |
|transaction.optional|Object||Información adicional relacionada con la transacción|
|transaction.cardNumber|String||Número de tarjeta o referencia de tarjeta registrada. Los números de tajerjeta se almacenan guardando los 4 ultimos digitos completando con asteriscos el resto y si es la referencia se guarda el numero completo|
|transaction.rPayReference|String||Número de referencia del pago o devolución de la transaccion realizada|
|transaction.rPayTs|Date||Timestamp de la fecha en que se realiza la transacción|
|transaction.rApproved|Boolean||Flag que indica si la transacción fue aprobada|
|transaction.rPaycode|String||Código de respuesta del estado de la transacción |
|transaction.respts|Date||Timestamp de la fecha en que se recibe la respuesta de la transacción|

**Ejemplo:**

```javascript
var service = "globalonepay";

var data = {
 orderId        : "19827391827393",
 amount         : "289",
 currency       : "USD",
 cardNumber     : "2967535088608700"
};

App.payments.forService(service)
  .then(client => client.payRegistered(data))
  .then(resp => console.log(resp))
  .catch(err => console.log(err));
```

### **- Devolución:**

#### **• REST Api:**

**Petición:**

|HTTP Method|URL|
|:---:|:---|
|POST| `https://[domain]:[port]/api/v[apiVersion]/srv/payments/refund?service=<service>`|

**Parámetros del query:**

| Clave | Tipo | Opcional   | Descripción  |
|---|---|:---:|---|
|service|String|X|Servicio de pago a utilizar (valores: globalonepay)|

**Parámetros del body:**

| Clave | Tipo | Opcional   | Descripción  |
|---|---|:---:|---|
|data|Object||Información del pago que se va a realizar.|
|data.paymentRef|String||Referencia del pago del que se va a realizar la devolución|
|data.amount|String||Cantidad a devolver|
|options|Object|X|Opciones extras relacionadas con la devolución. |
|options.operator|String||Nombre de quien realiza la operacion|
|options.reason|String||Razón de la devolución|

**Respuesta:**

| Clave | Tipo | Opcional | Descripción |
|---|---|:---:|---|
|transaction|tb.payments-transaction||Objeto con la información de la transacción|
|transaction.action|String||"refund" - Acción que se realiza en la transacción|
|transaction.orderId|String||Identificador de orden de la transacción|
|transaction.amount|Number||Cantidad de dinero de la transacción|
|transaction.currency|tString||ISO de la Moneda de la transacción|
|transaction.payReference|String||Referencia del pago que se utiliza en la transacción (Para devoluciones)|
|transaction.payTs|Date||Timestamp de la fecha en que se solicita la transacción |
|transaction.optional|Object||Información adicional relacionada con la transacción|
|transaction.cardNumber|String||Número de tarjeta o referencia de tarjeta registrada. Los números de tajerjeta se almacenan guardando los 4 ultimos digitos completando con asteriscos el resto y si es la referencia se guarda el numero completo|
|transaction.rPayReference|String||Número de referencia del pago o devolución de la transaccion realizada|
|transaction.rPayTs|Date||Timestamp de la fecha en que se realiza la transacción|
|transaction.rApproved|Boolean||Flag que indica si la transacción fue aprobada|
|transaction.rPaycode|String||Código de respuesta del estado de la transacción |
|transaction.respts|Date||Timestamp de la fecha en que se recibe la respuesta de la transacción|

**Ejemplo:**

POST: `https://a2server.a2system.net:1234/api/v1/srv/payments/refund?service=globalonepay`

* BODY: 

```javascript
 {
   "data": {
      "paymentRef" : "DG5Z3SB3QJ",
      "amount"     : "53"
   }
 }
```

#### **• Código Javascript:**

**Parámetros:**

| Clave | Tipo | Opcional   | Descripción  |
|---|---|:---:|---|
|data|Object||Información del pago que se va a realizar.|
|data.paymentRef|String||Referencia del pago del que se va a realizar la devolución|
|data.amount|String||Cantidad a devolver|
|options|Object|X|Opciones extras relacionadas con la devolución. |
|options.operator|String||Nombre de quien realiza la operacion|
|options.reason|String||Razón de la devolución|

**Respuesta:**

| Clave | Tipo | Opcional | Descripción |
|---|---|:---:|---|
|transaction|tb.payments-transaction||Objeto con la información de la transacción|
|transaction.action|String||"refund" - Acción que se realiza en la transacción|
|transaction.orderId|String||Identificador de orden de la transacción|
|transaction.amount|Number||Cantidad de dinero de la transacción|
|transaction.currency|tString||ISO de la Moneda de la transacción|
|transaction.payReference|String||Referencia del pago que se utiliza en la transacción (Para devoluciones)|
|transaction.payTs|Date||Timestamp de la fecha en que se solicita la transacción |
|transaction.optional|Object||Información adicional relacionada con la transacción|
|transaction.cardNumber|String||Número de tarjeta o referencia de tarjeta registrada. Los números de tajerjeta se almacenan guardando los 4 ultimos digitos completando con asteriscos el resto y si es la referencia se guarda el numero completo|
|transaction.rPayReference|String||Número de referencia del pago o devolución de la transaccion realizada|
|transaction.rPayTs|Date||Timestamp de la fecha en que se realiza la transacción|
|transaction.rApproved|Boolean||Flag que indica si la transacción fue aprobada|
|transaction.rPaycode|String||Código de respuesta del estado de la transacción |
|transaction.respts|Date||Timestamp de la fecha en que se recibe la respuesta de la transacción|

**Ejemplo:**

```javascript
var service = "globalonepay";

var data = {
 paymentRef : "DG5Z3SB3QJ",
 amount     : "53"
};
var options = {
  operator : "Someone",
  reason   : "My reason"
}
App.payments.forService(service)
  .then(client => client.refund(data, options))
  .then(resp => console.log(resp))
  .catch(err => console.log(err));
```
