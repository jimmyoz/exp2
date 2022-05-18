var keyValue = "";
var isOk = false;
$(function () {
    keyValue = getUrlParam("key");
    $('#iKey').html(keyValue);
    var keyv = keyValue.split('0x').join('');
  
    $('.search-null').hide();
    $('#blockDiv').hide();
    $('#transactionDiv').hide();
    $('#addressDiv').hide(); 
    if (keyv.length === 40)
        goToAddress();
    else {
        if (keyv.length === 64) {
            if (/[0-9a-zA-Z]{64}?/.test(keyv))
                goToTxInfos('0x' + keyValue);
            else if (/[0-9]{1,7}?/.test(keyv))
                goToBlockInfosByHash();
        } else if (parseInt(keyv) > 0)
            goToBlockInfosByNumber();

        //判断是否搜索的是区块
        if (!isOk) $('.search-null').show();
    }
}) 

function goToBlockInfosByNumber() {
    $.ajax(
        {
            url: 'http://'+Config.ette+'/v1/block?number=' + keyValue,
            type: 'get',
            async: false,
            dataType: 'json',
            beforeSend: function (xhr) {
            },
            headers: {
                'APIKey': '0x51d9a52d29c99b6bde0f118fdd829097d18a9f041fc6fa661ace13cb93b7f389'
            },
            success: function (data) {
                console.log(data);
                if (data) {
                    var obj = data;
                    var age = (Math.floor(Date.now() / 1000) - obj.time) % 60;

                    $('#blockNumber').html("Block   #" + obj.number);
                    $('#blockHeight').html(obj.number);
                    $('#timestamp').html(age + " mins ago");
                    $('#transactions').html(obj.txNum);
                    $('#signedby').html(obj.miner);
                    $('#difficalty').html(obj.difficalty);
                    $('#totalDifficulty').html(obj.totalDifficulty);
                    $('#size').html(obj.size);
                    $('#extraData').html(obj.extraData);
                    $('#hash').html(obj.hash);
                    $('#parentHash').html(obj.uncleHash);
                    $('#blockDiv').show();
                    isOk = true;
                }
            },
            error: function (data) { console.log("error"); }
        }
    );
}

function goToBlockInfosByHash() {
    //判断是否搜索的是区块
    $.ajax(
        {
            url: 'http://'+Config.ette+'/v1/block?hash=' + keyValue,
            type: 'get',
            async: false,
            dataType: 'json',
            beforeSend: function (xhr) {
            },
            headers: {
                'APIKey': '0x51d9a52d29c99b6bde0f118fdd829097d18a9f041fc6fa661ace13cb93b7f389'
            },
            success: function (data) {
                if (data) {
                    var obj = data;
                    var age = (Math.floor(Date.now() / 1000) - obj.time) % 60;

                    $('#blockNumber').html("Block   #" + obj.number);
                    $('#blockHeight').html(obj.number);
                    $('#timestamp').html(age + " mins ago");
                    $('#transactions').html(obj.txNum);
                    $('#signedby').html(obj.miner);
                    $('#difficalty').html(obj.difficalty);
                    $('#totalDifficulty').html(obj.totalDifficulty);
                    $('#size').html(obj.size);
                    $('#extraData').html(obj.extraData);
                    $('#hash').html(obj.hash);
                    $('#parentHash').html(obj.uncleHash);
                    $('#blockDiv').show();

                    isOk = true;
                }
            },
            error: function (data) { console.log("error"); }
        }
    );

}

function goToTxInfos() {
    $.ajax(
        {
            url: 'http://'+Config.ette+'/v1/transaction?hash=' + keyValue,
            type: 'get',
            async: false,
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
                    $('#transaction').html('Transaction   ' + obj.hash);
                    $('#transactionHash').html(obj.hash);
                    $('#age').html(age + " mins ago");
                    $('#block').html(obj.blockNumber);
                    $('#status').html(istate);
                    $('#from').html(obj.from);
                    $('#to').html(obj.to);
                    $('#nonce').html(obj.nonce);
                    $('#inputData').html(obj.inputData);
                    $('#transactionDiv').show();
                    isOk = true;
                } else {
                }
            },
            error: function (data) { console.log("error"); }
        }
    );

}


function goToAddress() {

    var eth_node_url = 'http://'+Config.chainUrl+':'+Config.chainPort;//35.76.239.114
    let web3 = new Web3(new Web3.providers.HttpProvider(eth_node_url));
    web3.eth.getBalance(keyValue, function (error, result) {
        if (!error) {
            isOk = true;
            window.location.href = "address.html?hash=" + keyValue;
        } else {
            isOk = false; 
            if (!isOk) $('.search-null').show();
        }
    }); 
}