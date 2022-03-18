 
var transactions_height = 0; //��������
var block_height = 0;
var pageSize = 50; //ҳ�ܼ�¼��
var rowCount = 0;  //������ 
var pages = 0;     //��ҳ��
var iPage = 1;     //��ǰҳ
$(function () {
    $.ajax(
        {
            url: 'http://112.35.192.13:8081/ette/get_index',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                var obj =  data;
                transactions_height = obj.transactions;
                block_height = obj.block_height;
                rowCount = transactions_height;
                pages = pageTotal(rowCount, pageSize);
                $("#transactionsCount").html('Transactions (total ' + format(obj.transactions) + ' transactions found)')
                goPage("top");
            },
            error: function (data) { console.log("error"); }
        }
    );
}) 
function goPage(iType) {
    //����
    if (iType == "top") {
        iPage = 1; 
    }
    //���
    if (iType == "last") {
        iPage = pageTotal(rowCount, pageSize);
 
    }
    //��һҳ
    if (iType == "down") {
        if (iPage == pages) return;
        iPage++;
 
    }
    //��һҳ
    if (iType == "up") {
        if (iPage == 1) return;
        iPage--;
       
    }
 
    $(".pageInfo").html(iPage + "/" + pages);
    var apiUrl = 'http://112.35.192.13:8081/ette/get_transactions';//?max_block=' + block_height + '&current_page=' + iPage + '&items_per_page=' + pageSize;
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

                var trans = data.data;
                //��������������
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

                //��������������
                $('#transactions_table_tbody').empty();
                $(htmlList).appendTo('#transactions_table_tbody').trigger('create');
            },
            error: function (data) { console.log("error"); }
        }
    );
     
} 