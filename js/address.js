var address = "";
var transactions_height = 0; //交易总数
var block_height = 0;
var pageSize = 50; //页总记录数
var rowCount = 50;  //总行数 
var pages = 0;     //总页数
var iPage = 1;     //当前页
var selectIndex = 0;
var block_height1 = 0;
var pageSize1 = 50; //页总记录数
var rowCount1 =50;  //总行数 
var pages1 = 0;     //总页数
var iPage1 = 1;     //当前页
$(function () {
    address = getUrlParam("hash");
    $("#addressHash").html("Address:" + address);

   

    getAddressInfos(); 
    
    $.ajax(
        {
            url: 'http://web.ifichain.com:8080/ette/get_index',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                var obj = data;
                transactions_height = obj.transactions;
                block_height = obj.block_height;
                rowCount = transactions_height;
                pages = pageTotal(rowCount, pageSize); 
                goPage("top");
            },
            error: function (data) { console.log("error"); }
        }
    );
    
    $('.nav-tabs li').click(function () { 
        selectIndex = $(this).attr('data-id');
        if (selectIndex == "0") {
            //获取最大交易笔数
            rowCount = 10000;
            pages = pageTotal(rowCount, pageSize);
            $(".pageInfo").html(iPage + "/" + pages);
            goPage("top");
        } else {
            //获取最大交易笔数
            rowCount1 = 10000;
            pages1 = pageTotal(rowCount1, pageSize1); 
            $(".pageInfo").html(iPage1 + "/" + pages1);
            goPage1("top");
        }
    });

})

function getAddressInfos() {
    var opt = { "address": address };
    var jsonData = JSON.stringify(opt);
    $.ajax(
        {
            url: 'http://web.ifichain.com:8080/ette/get_address_type',
            type: 'POST',
            dataType: "json",
            data: jsonData,
            beforeSend: function (xhr) {
            },
            success: function (data) {
                if (data.type == "s") {
                    $("#node_s").show();
                }
                if (data.type == "n") {
                    $("#node_n").show();
                }
                if (data.type == "c") {
                    $("#node_c").show();
                }

            },
            error: function (data) { console.log("error"); }
        }
    ); 

    var eth_node_url = 'http://18.216.66.9:8545';
    let web3 = new Web3(new Web3.providers.HttpProvider(eth_node_url)); 
    web3.eth.getBalance(address, function (error, result) {
        if (!error) { 
            var balanceMain = result;
            var balanceInEther = web3.fromWei(result, 'ether');
            $("#balanceInfo").html("Balance:" + balanceInEther + " IFI");
            return true;
        } else {
            return false;
        }
    });

    return true;
}

function getERC20Balance(fromAddress, contractObj, bookmark) {
    contractObj.methods.balanceOf(fromAddress).call().then(
        function (wei) {
            balance = web3.utils.fromWei(wei, 'ether');
            console.log(bookmark + balance);
        });
} 
 
function goPageAll(t) {
    if (selectIndex == "0") {
        goPage(t);
    } else {
        goPage1(t)
    }
}
function goPage(iType) {

    //顶部
    if (iType == "top") {
        iPage = 1;
    }
    //最后
    if (iType == "last") {
        iPage = pageTotal(rowCount, pageSize);

    }
    //下一页
    if (iType == "down") {
        if (iPage == pages) return;
        iPage++;

    }
    //上一页
    if (iType == "up") {
        if (iPage == 1) return;
        iPage--;

    } 
    $(".pageInfo").html(iPage + "/" + pages);
    var apiUrl = 'http://web.ifichain.com:8080/ette/get_address_trx';//?max_block=' + block_height + '&current_page=' + iPage + '&items_per_page=' + pageSize;
    //  contentType: "application/json;charset=utf-8",
    var opt = { "address": address, "current_page": iPage, "items_per_page": pageSize };
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
                rowCount = data.total_records;
                pages = pageTotal(rowCount, pageSize);
                $(".pageInfo").html(iPage + "/" + pages);
                var trans = data.data;
                //在行最后添加数据
                var htmlList = "";
                for (var Idx = 0; Idx <= trans.length - 1; Idx++) {
                    var iTran = trans[Idx];
                    if (iTran) {
                        var istate = iTran.state == 1 ? "Success" : "Failed";
                        htmlList += '<tr>\n';
                        htmlList += '    <td><span class="ellipsis hash-tag">' + iTran.hash + '</span></td>\n';
                        htmlList += '    <td>' + iTran.blockNumber + '</td>\n';
                        htmlList += '    <td>' + iTran.age + 's</td>\n';
                        htmlList += '    <td><span class="ellipsis hash-tag">' + iTran.from + '</span></td>\n';
                        htmlList += '    <td><span class="ellipsis hash-tag">' + iTran.to + '</span></td>\n';
                        htmlList += '    <td>' + istate + '</td>\n';
                        htmlList += ' </tr>\n';
                    }
                } 
                //在行最后添加数据
                $('#transactions_table_tbody').empty();
                $(htmlList).appendTo('#transactions_table_tbody').trigger('create');
            },
            error: function (data) { console.log("error"); }
        }
    ); 
}  


function goPage1(iType) {

    //顶部
    if (iType == "top") {
        iPage1 = 1;
    }
    //最后
    if (iType == "last") {
        iPage1 = pageTotal(rowCount1, pageSize1);

    }
    //下一页
    if (iType == "down") {
        if (iPage1 == pages1) return;
        iPage++;

    }
    //上一页
    if (iType == "up") {
        if (iPage1 == 1) return;
        iPage1--;

    }

    $(".pageInfo").html(iPage1 + "/" + pages1);
    var apiUrl = 'http://web.ifichain.com:8080/ette/get_signed_blocks';
    var opt = { "address": address, "current_page": iPage1, "items_per_page": pageSize1 };
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
                rowCount1 = data.total_records;
                pages1 = pageTotal(rowCount1, pageSize1);
                $(".pageInfo").html(iPage1 + "/" + pages1);

                var signed = data.data;
                //在行最后添加数据
                var htmlList = "";
                for (var Idx = 0; Idx <= signed.length - 1; Idx++) {
                    var iSigned = signed[Idx];
                    if (iSigned) { 
                        htmlList += ' <tr>\n';
                        htmlList += '    <td>' + iSigned.number + '</td>\n';
                        htmlList += '    <td>' + iSigned.age + 's</td>\n';
                        htmlList += '    <td>' + iSigned.tx_num + '</td>\n';
                        htmlList += '    <td><span class="ellipsis hash-tag">' + iSigned.miner + '</span></td>\n';
                        htmlList += '   <td>' + iSigned.size + ' bytes</td>\n';
                        htmlList += '    <td>' + iSigned.difficulty + '</td>\n';
                        htmlList += ' </tr>\n';  
                    }
                }
                if (htmlList == "") { 
                    htmlList += '<tr  >\n';
                    htmlList += '    <td colspan="6">\n';
                    htmlList += '        <div class="null flex flex-align-center flex-pack-center flex-column">\n';
                    htmlList += '            <img src="images/null1.jpg"><br>No Signed Blocks Found\n';
                    htmlList += '        </div>\n';
                    htmlList += '    </td>\n';
                    htmlList += '</tr>\n'; 
                }

                //在行最后添加数据
                $('#transactions_table_signed').empty();
                $(htmlList).appendTo('#transactions_table_signed').trigger('create');
            },
            error: function (data) { console.log("error"); }
        }
    );

} 