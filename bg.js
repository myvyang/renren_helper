if(!localStorage.Flag){
    localStorage.Flag = "1";
    localStorage.ChooseList="LastY topic left music comst FriList logo head come FriSe selfmsg La2";
}

ZanIng();


var updateTab = function(tab) {
  if (!/http(.+)renren\.com/.test(tab.url)) return;
  file = "contexts.js";
  chrome.tabs.executeScript(tab.id, {
    file : file,
    runAt: "document_start"
  }, function() {});
  SendChooseTag();
  SendStatus2();
  SendFontChange();
  if(localStorage.BtnStatus === "open") Send();
};

function SendFontChange(){
    var FontStatus = localStorage.FontStatus;
    if(!FontStatus) FontStatus = " ";
    var flag = 0;
    chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendRequest(tab.id, {name: "FontChange",word:FontStatus}, function(response) {
                if(response && response.name == "true") 
                    flag = 1;
                else
                    console.log("failed");
                //setTimeout(SendFontChange,1000);
                });
    });
    //if(flag == 0)
        //setTimeout(SendFontChange,1000);
}

function SendStatus2(){
    var str = localStorage.BtnStatus;
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendRequest(tab.id, {name: "FilterStatus",word:str}, function(response) {
            if(response && response.name == "true") return;
            console.log("failed");
            });
            setTimeout(SendChooseTag,1000);
        });
}

function Send(){
    console.log("send KeyWord");
    var Store = localStorage.KeyWord;
    if(!Store) return;
    var WordList = Store.split(" ");
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendRequest(tab.id, {name: "KeyWord",word:WordList}, function(response) {
            if(response && response.name == "true") return;
            console.log("failed");
            setTimeout(Send,1000);
        });
    });
}

function SendChooseTag(){
    console.log("send Tags");
    var Store = localStorage.ChooseList;
    var WordList = Store.split(" ");
    chrome.tabs.getSelected(null, function(tab) {
        try{
            chrome.tabs.sendRequest(tab.id, {name: "ChooseTag",word:WordList}, function(response) {
                if(response && response.name == "true") return;
                console.log("failed");
                });
        }catch(e){
            setTimeout(SendChooseTag,1000);
        }        
    });
}

/*
var count = 0
function ZanIng(){
    //开始点赞~
    count = 0;
    var Url = "http://status.renren.com/GetSomeomeDoingList.do?userId="+localStorage.ZanUrl+"&curpage="+count;
    if(localStorage.ZanStatus == "open" && localStorage.ZanUrl != ""){
        var data="";
        var us1 = "http://like.renren.com/addlike?gid=status_";
        var us1_ = "http://like.renren.com/removelike?gid=status_"
        var us2 = "&uid=";
        var us3 = "&owner="+localStorage.ZanUrl+"&type=6";
        var req = new XMLHttpRequest();  
        req.open("GET",Url,false);
        req.send(null);
        var result = req.status;
        if(result == 200){
            data = req.responseText;
            if(data) data = JSON.parse(data);
            //console.log(data);
            var sArray = data.doingArray;
            if(sArray[0]){
                var uid = data.host;
                var m = sArray.length > 5 ? 5 : sArray.length;
                //var m = sArray.length;
                for(var i = 0; i< m; i++){
                    if(sArray[i] && sArray[i].id) {
                        var AddLike = us1+sArray[i].id+us2+uid+us3;
                        var RmLike = us1_+sArray[i].id+us2+uid+us3;
                        var req = new XMLHttpRequest();  
                        req.open("GET",RmLike,false);
                        req.send(null);
                        var req = new XMLHttpRequest();  
                        req.open("GET",AddLike,false);
                        req.send(null);               
                    }
                }
            }else{
                count = -1;
            }
        }
    }
    console.log(count);
    count += 1;
    setTimeout(ZanIng,1000);
}
*/
var count = 0
function ZanIng(){
    //开始点赞~
    var Url = "http://status.renren.com/GetSomeomeDoingList.do?userId="+localStorage.ZanUrl+"&curpage="+count;
    if(localStorage.ZanStatus == "open" && localStorage.ZanUrl != ""){
        var data="";
        var us1 = "http://like.renren.com/addlike?gid=";
        var us1_ = "http://like.renren.com/removelike?gid="
        var us2 = "&uid=";
        var us3 = "&owner="+localStorage.ZanUrl+"&type=6";
        var req = new XMLHttpRequest();  
        req.open("GET",Url,false);
        req.send(null);
        var result = req.status;
        if(result == 200){
            data = req.responseText;
            if(data) data = JSON.parse(data);
            //console.log(data);
            
            var likeInfoMap = data.likeInfoMap;
            var uid = data.host;
            var tmp = 0;
            for(var key in likeInfoMap){
                    if(key) {
                        tmp += 1;
                        var AddLike = us1+key+us2+uid+us3;
                        var RmLike = us1_+key+us2+uid+us3;
                        var req = new XMLHttpRequest();  
                        req.open("GET",RmLike,false);
                        req.send(null);
                        var req = new XMLHttpRequest();  
                        req.open("GET",AddLike,false);
                        req.send(null);               
                    }
            }
            if(tmp == 0){
                count = -1;
            }
        }
    }
    //console.log(count);
    count += 1;
    setTimeout(ZanIng,1000);
}


if (localStorage.BtnStatus != "open") {
  localStorage.BtnStatus = "close";
}

chrome.tabs.getAllInWindow(function(tabs) {
  tabs.forEach(updateTab);
});

chrome.extension.onMessage.addListener(function(req) {
  chrome.tabs.getAllInWindow(function(tabs) {
    tabs.forEach(updateTab);
  });
});

chrome.tabs.onUpdated.addListener(function(id, data, tab) {
  updateTab(tab);
});



//setTimeout("Send()",500);
console.log("bg.js");

