“# tb-pay”

#### - **Instalación:**
  
  Para utilizar los servicios de pago es necesario tener instalada la librería "tb-payments" y la libreria del servicio que se vaya a utilizar, como por ejemplo "tb-payments-globalonepay".

  Además es importante inicializar la librería en el archivo "boot.js" dentro de app. Para ello incluir la siguiente linea dentro de la funcion Boot:

  ```
  App.payments.init();
  ``


#### - **Configuración del servicio:**

  + **Configuración desde A2Server:** 

    NO DISPONIBLE

  + **Configuración manual:**

    La configuración manual se realiza en el archivo "config.json".

    Para ello hay que añadir el objeto "paymentsOptions", si no se tenía enteriormente, y agregar un objeto con la configuración del servicio que se vaya a utilizar. Al completarlo, debería quedar de la siguiente manera:

    ```
    "paymentsOptions":{
      <paymentService>:{
        …
        …
      }
    }
    ```

#### - **Servicios disponibles:**
  
  - GlobalOnePay

  Identificador: "globalonepay"


#### - **Ejemplos de uso:**

  - Registrar una tarjeta:

    ```
    var data = {
     cardNumber:demoCreditCard.MasterCard,
     cardExpiry:"1220",
     cardType:"MASTERCARD",
     cardHolderName:"Messi"  
    };

    App.payments.forService(service)
      .then(client => client.register(data))
      .then(resp => console.log(resp))
      .catch(err => console.log(err));
    ```

  - Pago:

    ```
    var data = {
     orderId        : "19827391827392",
     amount         : "289",
     currency       : "USD",
     cardNumber     : demoCreditCard.MasterCard,
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

  - Pago con una tarjeta registrada:

    ```
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

  - Devolución:

    ```
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

    