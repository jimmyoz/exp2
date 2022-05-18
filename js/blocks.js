 
var block_height = 0; //区块高度
var pageSize = 50; //页总记录数
var rowCount = 0;  //总行数
var maxBlock = 0;  //最大区块
var minBlock = 0;  //最小区块 
var pages = 0;     //总页数
var iPage = 1;     //当前页;
$(function () {   
    $.ajax(
        {
            url: 'http://'+Config.url+':'+Config.port+'/ette/get_index',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                var obj = data;
                web3 = new Web3(new  Web3.providers.HttpProvider("http://"+Config.chainUrl+":"+Config.chainPort)); 
                  var num=web3.eth.blockNumber;

                //block_height = obj.block_height;
                 block_height=num;
                rowCount = block_height;//obj.block_height;  
                pages = pageTotal(rowCount, pageSize);
                $("#blocksCount").html('Blocks  (block height ' + format(block_height) + ')'); 

                goPage("top");
            },
            error: function (data) { console.log("error"); }
        }
    );  
}) 
//$('#searchInput').change(initTable);   
function goPage(iType) {
    //顶部
    if (iType == "top") {
        iPage = 1;
        maxBlock = block_height;
        minBlock = maxBlock - (pageSize - 1); 
    }
    //最后
    if (iType == "last") {
        iPage = pageTotal(rowCount, pageSize);
        minBlock = 1;
        maxBlock = minBlock + (pageSize - 1);
    }
    //下一页
    if (iType == "down") {
        if (iPage == pages) return;
        iPage++;
        maxBlock = maxBlock - pageSize;
        minBlock = maxBlock - (pageSize - 1); 
    }
    //上一页
    if (iType == "up") {
        if (iPage == 1) return; 
        iPage--;
        maxBlock = maxBlock + pageSize;
        minBlock = maxBlock - (pageSize - 1); 
    }
    $(".pageInfo").html(iPage + "/" + pages);
    var apiUrl = 'http://'+Config.url+':'+Config.port+'/ette/get_blocks';// 'http://13.210.52.1:7000/v1/block?fromBlock=' + minBlock + '&toBlock=' + maxBlock;
    var opt = { "current_page": iPage, "items_per_page": pageSize };
    var jsonData = JSON.stringify(opt);
    $.ajax(
        {
            url: apiUrl,
            type: 'post',
            dataType: 'json',
            data: jsonData,
            beforeSend: function (xhr) {
            },
            success: function (data) {
                var blocks = data.data;
                //$("#blocksCount").html('Blocks  (block height ' + format(data.total_records) + ')'); 

                //在行最后添加数据
                var htmlList = "";
                for (var blockIdx = 0; blockIdx <= blocks.length - 1; blockIdx++) {
                    var iBlock = blocks[blockIdx];
                    if (iBlock) {
                        var age =iBlock.age;// Math.floor(Date.now() / 1000) - iBlock.time;
                        htmlList += '<tr>\n';
                        htmlList += '<td><a href="block.html?number=' + iBlock.number + '" style="color:#337ab7 !important">' + iBlock.number + '</a></td>\n';
                        htmlList += '<td>' + age + 's</td>\n'; 
                       // if (iBlock.tx_num != "0") {
                            htmlList += '<td><a href="transactionsInBlock.html?number=' + iBlock.number + '" style="color:#337ab7 !important">' + iBlock.tx_num + '</a></td>\n';
                        //}
                        //else {
                        //    htmlList += '<td><a href="block.html?number=' + iBlock.number + '" style="color:#337ab7 !important">' + iBlock.tx_num + '</a></td>\n';
                        //}
                        htmlList += '<td><span class="ellipsis hash-tag">' + iBlock.miner + '</span></td>\n';
                        htmlList += '<td>' + iBlock.size + ' bytes</td>\n';
                        htmlList += '<td>' + iBlock.difficulty + '</td>\n';
                        htmlList += '</tr>\n'; 

                        
                    }
                }
                //在行最后添加数据 

             
                $('#block_table_tbody').empty(); 
                $(htmlList).appendTo('#block_table_tbody').trigger('create');
            },
            error: function (data) { console.log("error"); }
        }
    );
}