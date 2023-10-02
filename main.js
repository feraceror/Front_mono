const apiKey = "sandbox_1kJc12gVbY2ZL7H72sdyh9gQbWSgIi7CQ";
var bans = []

$(document).ready(function() {
    const socket = new WebSocket('ws://https://backmono-g4qpz4v8.b4a.run'); 
    socket.addEventListener('message', (event) => {
        const eventData = JSON.parse(event.data)
        alert("El estado de tu transferencia ahora es: " + eventData.status + "\nCon motivo: " + eventData.reason)
    });
    $.ajax({
        url: 'https://backmono-g4qpz4v8.b4a.run/api/v1/mono/getBanks',  
        type: 'GET',  
        success: function (data, textStatus, jqXHR) {
            if(!!data && !!data.banks){
                var selectBanks = $('#bank')
                selectBanks
                          .find('option')
                            .remove()
                            .end()
                banks = data.banks;
                banks.forEach((element, index) => {
                        var option = $("<option>");
                          option.val(element.code);
                          option.text(element.name);
                          selectBanks.append(option);
                  });
                  bankChange()
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error en la solicitud:', errorThrown);
        }
    });
});

function bankChange () {
    var selectBank = $('#bank').val()
    if(!!banks){
        var bank = banks.filter((val)=> val.code == selectBank)[0]
        var selectAccountType = $('#accountType')
        selectAccountType
        .find('option')
        .remove()
        .end()

        bank.supported_account_types.forEach((element, index) => {
            var option = $("<option>");
              option.val(element);
              option.text(element);
              selectAccountType.append(option);
      });
    }

}


function submitTransfer (event){
    event.preventDefault();
    const amount = $('#amount').val()
    const email = $('#email').val()
    const bank = $('#bank').val()
    const accountNumber = $('#accountNumber').val()
    const accountType = $('#accountType').val()
    const documentType = $('#documentType').val()
    const document = $('#document').val()
    const name = $('#name').val()
    
    var payload = {
        "account_id": "acc_1EZX7Kh7dkL38NiI1G3ij6",
        "transfers": [
          {
            "amount": {
              "amount": amount,
              "currency": "COP"
            },
            "description": "Test Transfer",
            "emails_to_notify": [
                email
            ],
            "entity_id": `${generateRandomNumber()}`,
            "fallback_routing": [],
            "payee": {
              "bank_account": {
                "bank_code": bank,
                "number": accountNumber,
                "type": accountType
              },
              "document_number": document,
              "document_type":documentType,
              "email": email,
              "name": name
            }
          }
        ]
    }
    console.log(JSON.stringify(payload));
    $.ajax({
        url: 'https://backmono-g4qpz4v8.b4a.run/api/v1/mono/transfer',  
        type: 'POST',  
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function (data, textStatus, jqXHR) {
            alert("La transferencia se ha hecho correctamente")
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error en la solicitud:', errorThrown);
            alert("ha ocurrido un error")
        }
    });
}

function generateRandomNumber() {
    return Math.floor(Math.random() * 900000) + 100000;
}
