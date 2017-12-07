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
    "merchandt": "1234XXXX",
    "terminalId": "990XX",
    "sharedSecret": "12345678XXX"
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
|data.cardNumber|String||Número de la tarjeta de crédito.|
|data.cardExpiry|String||Fecha de vencimiento de la tarjeta de crédito en formato "MMDD" (Ej:0920 -> "20 de septiembre").|
|data.cardType|String||Información de la tarjeta que se va a registrar. La información dependerá del servicio a utilizar|
|data.cardHolderName|String||Información de la tarjeta que se va a registrar. La información dependerá del servicio a utilizar|

**Ejemplo:**

POST: `https://a2server.a2system.net:1234/api/v1/srv/payments/register?service=globalonepay`

* BODY: 

```javascript
 {
   "data": {
     "cardNumber":myCardNumber,
     "cardExpiry":"1220",
     "cardType":"MASTERCARD",
     "cardHolderName2:"Messi"  
   }
 }
```

#### **• Código Javascript:**

**Parámetros:**

| Clave | Tipo | Opcional   | Descripción  |
|---|---|:---:|---|
|data|Object||Información de la tarjeta que se va a registrar. La información dependerá del servicio a utilizar|
|data.cardNumber|String||Número de la tarjeta de crédito.|
|data.cardExpiry|String||Fecha de vencimiento de la tarjeta de crédito en formato "MMDD" (Ej:0920 -> "20 de septiembre").|
|data.cardType|String||Información de la tarjeta que se va a registrar. La información dependerá del servicio a utilizar|
|data.cardHolderName|String||Información de la tarjeta que se va a registrar. La información dependerá del servicio a utilizar|

**Ejemplo:**

```javascript
var service = "globalonepay";

var data = {
 cardNumber:myCardNumber,
 cardExpiry:"1220",
 cardType:"MASTERCARD",
 cardHolderName:"Messi"  
};

App.payments.forService(service)
  .then(client => client.register(data))
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
|data.cardExpiry|String||Fecha de vencimiento de la tarjeta de crédito en formato "MMDD" (Ej:0920 -> "20 de septiembre").|
|data.cardType|String||Tipo de tarjeta de crédito (EJ: MASTERCARD).|
|data.cardHolderName|String||Nombre en la tarjeta de crédito.|
|data.cvv|String||Código secreto que aparece en la tarjeta|
|options|Object|X|Opciones extras relacionadas con el pago. La información dependerá del servicio a utilizar.|
|options.terminalType|String||Terminal Type del servicio|
|options.transactionType|String||Tipo de transacción del servicio|

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
|data.cardExpiry|String||Fecha de vencimiento de la tarjeta de crédito en formato "MMDD" (Ej:0920 -> "20 de septiembre").|
|data.cardType|String||Tipo de tarjeta de crédito (EJ: MASTERCARD).|
|data.cardHolderName|String||Nombre en la tarjeta de crédito.|
|data.cvv|String||Código secreto que aparece en la tarjeta|
|options|Object|X|Opciones extras relacionadas con el pago. La información dependerá del servicio a utilizar.|
|options.terminalType|String||Terminal Type del servicio|
|options.transactionType|String||Tipo de transacción del servicio|

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
|data.cardNumber|String||Identificador de la tarjeta de crédito registrada|
|options|Object|X|Opciones extras relacionadas con el pago. La información dependerá del servicio a utilizar.|
|options.terminalType|String||Terminal Type del servicio|
|options.transactionType|String||Tipo de transacción del servicio|

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
