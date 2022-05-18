 
var transactions_height = 0; //½»Ò××ÜÊý
var block_height = 0;
var pageSize = 50; //Ò³×Ü¼ÇÂ¼Êý
var rowCount = 0;  //×ÜÐÐÊý 
var pages = 0;     //×ÜÒ³Êý
var iPage = 1;     //µ±Ç°Ò³
$(function () {
   /* $.ajax(
        {
            url: 'http://web.ifichain.com:8080/ette/get_transactions_count',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                var obj =  data;
                transactions_height = obj.trans_count;
                block_height = obj.block_height;
                rowCount = transactions_height;
                pages = pageTotal(rowCount, pageSize);
                $("#transactionsCount").html('Transactions (total ' + format(transactions_height) + ' transactions found)');
                goPage("top");
            },
            error: function (data) { console.log("error"); }
        }
    );
	*/
	goPage("top");
}) 
function goPage(iType) {
    //¶¥²¿
    if (iType == "top") {
        iPage = 1; 
    }
    //×îºó
    if (iType == "last") {
        iPage = pageTotal(rowCount, pageSize);
 
    }
    //ÏÂÒ»Ò³
    if (iType == "down") {
        if (iPage == pages) return;
        iPage++;
 
    }
    //ÉÏÒ»Ò³
    if (iType == "up") {
        if (iPage == 1) return;
        iPage--;
       
    }
 
    
    var apiUrl = 'http://'+Config.url+':'+Config.port+'/ette/get_transactions';//?max_block=' + block_height + '&current_page=' + iPage + '&items_per_page=' + pageSize;
 //  contentType: "application/json;charset=utf-8",
    var opt = { "max_block": block_height, "current_page": iPage, "items_per_page": pageSize };
    var jsonData = JSON.stringify(opt);
    $.ajax(
        {
            url: apiUrl,
            type: 'POST', 
            dataType: "json",
            data: jsonData , 
            beforeSend: function (xhr) {
            },
            success: function (data) {
                 if(iPage==1){
					 
				var obj =  data;				
				transactions_height = obj.total_records;
                block_height = obj.block_height;
                rowCount = transactions_height;
                pages = pageTotal(rowCount, pageSize);
                $("#transactionsCount").html('Transactions (total ' + format(transactions_height) + ' transactions found)');				 
				 }
				$(".pageInfo").html(iPage + "/" + pages);
				
                var trans = data.data;
                //ÔÚÐÐ×îºóÌí¼ÓÊý¾Ý
                var htmlList = "";
                for (var Idx = 0; Idx <= trans.length - 1; Idx++) {
                    var iTran = trans[Idx];
                    if (iTran) {
                        var age = iTran.age;// (Math.floor(Date.now() / 1000) - iTran.timestamp) % 60;
                        var istate = iTran.state == 1 ? "Success" : "Failed";
                        htmlList += '<tr>\n';
                        htmlList += '<td><a href="transaction.html?hash=' + iTran.hash + '" style="color:#337ab7 !important"><span class="ellipsis hash-tag">' + iTran.hash + '</span></a></td>\n';
                        htmlList += '<td>' + iTran.blockNumber + '</td>\n'
                        htmlList += '<td>' + age + 'S</td>\n'
                        htmlList += '<td><span class="ellipsis hash-tag">' + iTran.from + '</span></td>\n';
                        htmlList += '<td><span class="ellipsis hash-tag">' + iTran.to + '</span></td>\n';
                        htmlList += '<td>' + istate + '</td>\n';
                        htmlList += '</tr>\n'; 
                    }
                }

                //ÔÚÐÐ×îºóÌí¼ÓÊý¾Ý
                $('#transactions_table_tbody').empty();
                $(htmlList).appendTo('#transactions_table_tbody').trigger('create');
            },
            error: function (data) { console.log("error"); }
        }
    );
     
} 