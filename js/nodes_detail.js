 
var transactions_height = 0; //??¨°¡Á¡Á¨¹¨ºy
var block_height = 0;
var pageSize = 50; //¨°3¡Á¨¹????¨ºy
var rowCount = 0;  //¡Á¨¹DD¨ºy 
var pages = 1;     //¡Á¨¹¨°3¨ºy
var iPage = 1;     //¦Ì¡À?¡ã¨°3
var address="";
$(function () {
	
	address=getUrlParam("address");	
    goPage("top");
   
}); 

     function goPage(iType) {
    //?£¤2?
    if (iType == "top") {
        iPage = 1; 
    }
    //¡Á?o¨®
    if (iType == "last") {
        iPage = pageTotal(rowCount, pageSize);
 
    }
    //??¨°?¨°3
    if (iType == "down") {
        if (iPage == pages) return;
        iPage++;
 
    }
    //¨¦?¨°?¨°3
    if (iType == "up") {
        if (iPage == 1) return;
        iPage--;
       
    }
    
    

     
    var apiUrl = 'http://'+Config.url+':'+Config.port+'/ette/get_ifi_award_log';//?max_block=' + block_height + '&current_page=' + iPage + '&items_per_page=' + pageSize;
    var opt = {"address": address,"current_page": iPage, "items_per_page": pageSize };
    var jsonData = JSON.stringify(opt);
    
       
    $.ajax(
        {
            url: apiUrl,
            type: 'POST',
            dataType: "json",
            data: jsonData, 
            beforeSend: function (xhr) {
            },
            success: function (data) {
               if(data[0]) 
			   {
				   rowCount=data[0];
				   pages=pageTotal(rowCount, pageSize);
				   $(".pageInfo").html(iPage + "/" + pages);
			   }
			   if(data[1])
			   {  var nodes=data[1];
		       
              
              var htmlList='';
            
              var len=nodes.length;
              for(idx=0;idx<len;idx++){
                      var iNode =nodes[idx];
                    if (iNode) { 
                    
                        htmlList += '<tr>\n';
                        htmlList += '    <td>' + iNode.type + '</span></a></td>\n';
                       htmlList += '    <td>' + iNode.amount + '</td>\n';
                        htmlList += '    <td>' + iNode.balance + '</td>\n';
                        htmlList += '    <td>' + iNode.time + '</td>\n';
                        htmlList += '    <td>' + iNode.status + '</td>\n';
                        htmlList += '</tr>\n';

                    }
                }
                
              //   $('#signersCount').html('Node Machines (total Node Machines ' + data[0] + ')')
			   $('#signersCount').html('Address: '+address+'(Total Transactions: '+data[0]+')');
                //?¨²DD¡Á?o¨®¨¬¨ª?¨®¨ºy?Y
                $('#signers_table_tbody').empty();
                $(htmlList).appendTo('#signers_table_tbody').trigger('create');
                if (rowCount < 50) {
                    $(".pagination").hide();
                } else {
                    $(".pagination").show();
                }  
			   }                 
                
            },
            error: function (data) { console.log("error"); }
        }
    );
   
} 