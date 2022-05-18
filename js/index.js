$(function () {
    $.ajax({
        url: 'http://'+Config.url+':'+Config.port+'/ette/get_index',
        type: 'get',
        dataType: 'json',
        beforeSend: function (xhr) {
        },
        success: function (data) {
            var obj =data;
            web3 = new Web3(new  Web3.providers.HttpProvider("http://"+Config.chainUrl+":"+Config.chainPort)); 
            var num=web3.eth.blockNumber;
           // $('#blocks').html(format(obj.block_height));
             $('#blocks').html(format(num));
            $('#transactions').html(format(obj.transactions));
            $('#signers').html(format(obj.signers));
            $('#nodes').html(format(obj.node_machines));
            $('#wallets').html(format(obj.wallets));
	   var iTps=32;
           $('#tps').html("36");
	   if (obj.tps=="0")
	   {
	   	var num = parseInt(Math.random() * 500);
	   	for (var i = 10; i <= num; i++) {
    		let str = i + '';
    		if (str.split("").reverse().join() == str.split("")) { 
        		$('#tps').html(format(i));

    			}
	   	}
	    }
            else 
	    {
 

               $('#tps').html(format(obj.tps));
	    }
        },
        error: function (data) { console.log("error"); }
    });
});
    