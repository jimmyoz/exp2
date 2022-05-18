 
//# sourceURL=nodes.js
var transactions_height = 0; //½»Ò××ÜÊý
var block_height = 0;
var pageSize = 50; //Ò³×Ü¼ÇÂ¼Êý
var rowCount = 0;  //×ÜÐÐÊý 
var pages = 1;     //×ÜÒ³Êý
var iPage = 1;     //µ±Ç°Ò³
$(function () {
    goPage("top");
   
}); 

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
    
    

     
    var apiUrl = 'http://'+Config.url+':'+Config.port+'/ette/get_nodes';//?max_block=' + block_height + '&current_page=' + iPage + '&items_per_page=' + pageSize;
    var opt = {"current_page": iPage, "items_per_page": pageSize };
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
               if(data[1]) 
			   {
   
			     
				   rowCount=data[1];
				   pages=pageTotal(rowCount, pageSize);
				   $(".pageInfo").html(iPage + "/" + pages);
			   }
			   
			   if(data[2])
			   {  var nodes=data[2];
		       
              
              var htmlList='';
            
              var len=nodes.length;
              for(idx=0;idx<len;idx++){
                      var iNode =nodes[idx];
                    if (iNode) { 
                    // var istate = iNode.status == 1 ? "Active" : "Inactive"; 
                        htmlList += '<tr>\n';
                        htmlList += '    <td><a href="nodes_detail.html?address=' + iNode.owner_address + '" style="color:#337ab7 !important"><span class="ellipsis hash-tag">' + iNode.owner_address + '</span></a></td>\n';
                       htmlList += '    <td>' + iNode.total_reward + '</td>\n';
                        htmlList += '    <td>' + iNode.location + '</td>\n';
                        htmlList += '    <td>' + iNode.TOT + '</td>\n';
                        htmlList += '    <td>' + iNode.COT + '</td>\n';
                         htmlList += '    <td>' + iNode.Status +' </td>\n';
                        htmlList += '</tr>\n';

                    }
                }
                
                 $('#signersCount').html('Active Node Machines (Total Active Node Machines ' + data[0] + ')')
                //ÔÚÐÐ×îºóÌí¼ÓÊý¾Ý
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