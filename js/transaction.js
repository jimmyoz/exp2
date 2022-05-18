 
$(function () {
    var hash = getUrlParam("hash");
    var apiUrl = 'http://'+Config.ette+'/v1/transaction?hash=' + hash;
    $.ajax(
        {
            url: apiUrl,
            type: 'get',
            dataType: 'json', 
            beforeSend: function (xhr) {
            },
            headers: {
                'APIKey': '0x51d9a52d29c99b6bde0f118fdd829097d18a9f041fc6fa661ace13cb93b7f389'
            },
            success: function (data) {
                if (data) {
                    var obj = data;
                    var age = (Math.floor(Date.now() / 1000) - obj.timestamp) % 60; 
                    var istate = obj.state == 1 ? "Success" : "Failed";
                    $('#transaction').html('Transaction   '+obj.hash);
                    $('#transactionHash').html(obj.hash);
                    $('#age').html(age + " mins ago"); 
                    $('#block').html(obj.blockNumber);
                    $('#status').html(istate); 
                    $('#from').html(obj.from);
                    $('#to').html(obj.to);
                    $('#nonce').html(obj.nonce);
                    $('#inputData').html(obj.inputData);  
                } else {
                    $('#transaction').html('');
                    $('#transactionHash').html('');
                    $('#age').html('');
                    $('#block').html('');
                    $('#status').html('');
                    $('#from').html('');
                    $('#to').html('');
                    $('#nonce').html('');
                    $('#inputData').html('');  
                }
            },
            error: function (data) { console.log("error"); $('.search-null').show(); }
        }
    );  
}) 
 