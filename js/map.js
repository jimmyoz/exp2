
mapboxgl.accessToken = 'pk.eyJ1Ijoibm9uZ3d1IiwiYSI6ImNrc2lvenp3eDI2YjQyb28zZDRoNTl4MmkifQ.56beuMBX-ueYfWNmQKcFeA';// "pk.eyJ1IjoicGV0ZXJtYWluIiwiYSI6ImNrbXV5OTFibjAwYzAycXBmMTgyNG5tbzEifQ.SBG9J52tWMtnzei4-j-nIg";//'pk.eyJ1IjoiaG91YmlhbyIsImEiOiJjajdnNjVicDYxNHAzMndvMmI4NGgzaTZrIn0.ZvpHO1bVunIhgsBq_nVYFQ'; //'pk.eyJ1IjoicGV0ZXJtYWluIiwiYSI6ImNrbXV5OTFibjAwYzAycXBmMTgyNG5tbzEifQ.SBG9J52tWMtnzei4-j-nIg';//

//var blankStyle = {
//    version: 8,
//    name: "BlankMap",
//    sources: {},
//    layers: [
//        {
//            id: 'background',
//            type: 'background',
//            paint: { 'background-color': '#0c1a36' } /* 背景颜色 */
//        }
//    ]
//};

//var map = new mapboxgl.Map({
//    container: "map",
//    zoom: 3,
//    center: [0, 0],
//    style: blankStyle
//});
 
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/nongwu/cksjx87islc1l17qw0k1rawgs',
    center: [80, 42],
    zoom: 2.5
});

map.on('load', function () {
   
    //取nodes
    var apiUrl = 'http://'+Config.url+':'+Config.port+'/ette/get_nodes_location';
    var opt = { "current_page": 1, "items_per_page": 100 };
    var jsonData = JSON.stringify(opt);
    $.ajax(
        {
            url: apiUrl,
            //async: false,
            type: 'POST',
            dataType: "json",
            data: jsonData,
            beforeSend: function (xhr) {
            },
            success: function (data) {
                var nodes = data;// $.parseJSON(idata);
                var htmlList = "";
                for (var Idx = nodes.length - 1; Idx >= 0; Idx--) {
                    var iNode = nodes[Idx];
                    if (iNode) {
                        var d1 = new Date(Date.parse(iNode.last_updated.replace(/-/g, "/"))); //转换成Data();
                        var d2 = new Date();
                        
                        if (getInervalHour(d1, d2) > 24) {
                            console.log(iNode);
                            continue;
                        }
                   

                        var el = document.createElement('div');
                        el.id = 'nodes' + Idx;
                        el.className = 'marker';
                        el.style.backgroundImage = 'url(images/xx.png)';
                        el.style.width = '24px';
                        el.style.height = '24px';
                        //el.addEventListener('click', function (e) {
                        //    var description = marker.properties.description;
                        //    var coordinates = marker.properties.coordinates;
                        //});
                        el.addEventListener('mouseenter', function () {
                            this.style.cursor = 'pointer';
                            this.style.backgroundImage = 'url(images/yy.png)';

                        });
                        el.addEventListener('mouseleave', function () {
                            this.style.cursor = '';
                            this.style.backgroundImage = 'url(images/xx.png)';

                        });
                        var htmlString = '<div class="infobox-title">Node Machine' + iNode.id + '</div>'
                            + '<div class="infobox-info" >'
                            + '<div><span>Address:</span><br>' + iNode.owner_address + '</div>'
                            + '<div><span>Location:</span><br>' + iNode.local_ip + '</div>'
                            + '<div><span>Total IFI Rewarded:</span><br>' + iNode.total_reward + '</div>'
                            + '<div><span>IFI Rewarded in Last 30 Days:</span><br>' + iNode.reward_30days + '</div>'
                            + '<div><span>IFI Rewarded Increases:</span><br>' + iNode.increase_ratio + '</div></div>';
                        const popup = new mapboxgl.Popup({ offset: 25, className:'mapdlg' }).setMaxWidth('480px').setHTML(
                            htmlString
                        );
                        new mapboxgl.Marker(el)
                            .setLngLat([iNode.longitude, iNode.latitude])
                            .setPopup(popup)
                            .addTo(map);

                    }
                }
            },
            error: function (data) { console.log("error"); }
        }
    );

    //取signers
    var apiUrl = 'http://'+Config.url+':'+Config.port+'/ette/get_common_signers';
    var opt = { "current_page": 1, "items_per_page": 100 };
    var jsonData = JSON.stringify(opt);
    $.ajax(
        {
            url: apiUrl,
           // async: false,
            type: 'POST',
            dataType: "json",
            data: jsonData,
            beforeSend: function (xhr) {
            },
            success: function (data) {
                var signers = data.data;// $.parseJSON(idata);
                var htmlList = "";
                for (var Idx = signers.length - 1; Idx >= 0; Idx--) {
                    var iSigner = signers[Idx];
                    if (iSigner) {
                        var el = document.createElement('div');
                        el.id = 'signers' + Idx;
                        el.className = 'marker';
                        el.style.backgroundImage = 'url(images/aa.png)';
                        el.style.width = '24px';
                        el.style.height = '32px';
                        el.addEventListener('mouseenter', function () {
                            this.style.cursor = 'pointer';
                            this.style.backgroundImage = 'url(images/bb.png)';

                        });
                        el.addEventListener('mouseleave', function () {
                            this.style.cursor = '';
                            this.style.backgroundImage = 'url(images/aa.png)';

                        });
                        var htmlString = '<div class="infobox-title">Signer</div>'
                            + '<div class="infobox-info" >'
                            + '<div><span>Address:</span><br>' + iSigner.address + ' </div>'
                            + '<div><span>Location:</span><br>' + iSigner.country + '</div>'
                            + '<div><span>Total BlockSigned:</span><br>' + iSigner.total_blocks + '</div>'
                            + '<div><span>Latest Block Signed:</span><br>' + iSigner.max_block+' </div>'
                            + '<div><span>Monitoring:</span><br>'
                            + '<a href="http://web.ifichain.com:3000/d/YbsVMZGnz/node-singapore?orgId=1&kiosk" style="color:#337ab7 !important">Show Info</a></div></div>';


                        //var markerHeight = 50, markerRadius = 10, linearOffset = 25;
                        //var popupOffsets = {
                        //    'top': [60, 0],
                        //    'top-left': [0, 0],
                        //    'top-right': [0, 0],
                        //    'bottom': [30, -markerHeight],
                        //    'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
                        //    'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
                        //    'left': [markerRadius, (markerHeight - markerRadius) * -1],
                        //    'right': [-markerRadius, (markerHeight - markerRadius) * -1]
                        //};
                        //var popup = new mapboxgl.Popup({ offset: popupOffsets, className: 'mapdlg' })
                        //    .setLngLat([lng, lat])
                        //    .setHTML(htmlString)
                        //    .setMaxWidth("480px") 
                        const popup = new mapboxgl.Popup({ offset: 25, className: 'mapdlg' }).setMaxWidth('480px').setHTML(
                            htmlString
                        );
                        //popup.on('open', function () { 
                        //    var ele = $(that.popup.getElement());
                        //    var offset = ele.offset();
                        //    var top = offset.top;
                        //    var left = offset.left;
                        //    var right = ele.width() + left;
                        //    var mapEle = $(map.getContainer());
                        //    var mapOffset = mapEle.offset();
                        //    var mapTop = mapOffset.top;
                        //    var mapLeft = mapOffset.left;
                        //    var mapRight = mapEle.width() + mapLeft;
                        //    var center = map.getCenter();
                        //    var centerPx = map.project(center);
                        //    var h = 0, v = 0, size = 20;
                        //    if (top < mapTop) { 
                        //        v = mapTop - top + size;
                        //    }
                        //    if (left < mapLeft) { 
                        //        h = mapLeft - left + size;
                        //    }
                        //    if (right > mapRight) { 
                        //        h = mapRight - right - size;
                        //    }
                        //    centerPx = [centerPx.x - h, centerPx.y - v];
                        //    map.panTo(map.unproject(centerPx));
                        //});
                        //var lng = -80;
                        //var lat = 36;
                        //if (Idx == 1) { lng = 80; lat = 36; }
                        //if (Idx == 2) { lng = 90; lat = 30; }
                        //if (Idx == 3) { lng = 75; lat = 32; }
                        //if (Idx == 4) { lng = 86; lat = 40; } 
                        new mapboxgl.Marker(el)
                            .setLngLat([iSigner.longitude, iSigner.latitude])
                            .setPopup(popup)
                            .addTo(map);

                    }
                }
            },
            error: function (data) { console.log("error"); }
        }
    );
    
});

 
//map.on('mousemove', function (e) {
//    document.getElementById('info').innerHTML = JSON.stringify(e.point) + '|' + JSON.stringify(e.lngLat);  /* JSON.stringify() 方法可以将任意的 JavaScript 值序列化成 JSON 字符串 */
//});
