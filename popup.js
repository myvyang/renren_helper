console.log("popup.js")

var BtnStatus = localStorage.BtnStatus;
if(BtnStatus === undefined)
    BtnStatus = "close";

if(localStorage.KeyWord === undefined)
    localStorage.KeyWord = "";
var WordList = localStorage.KeyWord;
TagValues = WordList.split(" ");
for(i in TagValues){
    //console.log(TagValues[i]);
    AddKeyWord(TagValues[i]);
}

var OpenBtn = document.getElementById("open");
var CloseBtn = document.getElementById("close");
var AddBtn = document.getElementById("AddWord");


var ZanBtn = document.getElementById("ZanBtn");
var ZanAddName = document.getElementById("ZanAddName");
var ZanNote = $("ZanNote");



if(localStorage.ZanStatus == "open")
    ZanBtn.innerText = "停止";
var ZanNameTmp = localStorage.ZanName;
if(ZanNameTmp){
    ZanNote.innerHTML = ZanNameTmp;
}else{
    ZanNote.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
    ZanBtn.disabled = true;
    ZanBtn.style.backgroundColor = "#E7F3F9";
}


if(BtnStatus == "open"){
  OpenBtn.disabled = true;
  OpenBtn.style.backgroundColor = "#f0f0f0";
  CloseBtn.disabled = false;
  CloseBtn.style.backgroundColor = "#85c926";
}else{
  OpenBtn.disabled = false;
  OpenBtn.style.backgroundColor = "#85c926";
  CloseBtn.disabled = true;
  CloseBtn.style.backgroundColor = "#f0f0f0";
}

var ChooseTags = localStorage.ChooseList;
if(ChooseTags){
    var ChooseSet = $("ChooseSet");
    if(ChooseSet) ChooseSet = ChooseSet.children;
    for(i in ChooseSet){
        var node = ChooseSet[i];
        //console.log(node);
        if(!node.title) continue;
        //console.log(node);
        if(ChooseTags.indexOf(node.title) > -1){
            node.style.backgroundColor = "#11F3F9";
        }else{
            node.style.backgroundColor = "#E7F3F9";
        }
    }
}


function $(id){
    return document.getElementById(id);
}

function trim(str){   
    str = str.replace(/^(\s|\u00A0)+/,'');   
    for(var i=str.length-1; i>=0; i--){   
        if(/\S/.test(str.charAt(i))){   
            str = str.substring(0, i+1);   
            break;   
        }   
    }   
    return str;   
}  

function AddKeyWord(str){
    if(!str) return;
    var Word = trim(str);
    if(!Word) return;
    var WordSet = $("WordSet");
    var node = document.createElement("span");
    node.className = "tag";
    node.innerText = Word;
    WordSet.appendChild(node);
    node.onclick = function(e){
        var node = e.target;
        var Word = node.innerText;
        var WordSet = localStorage.KeyWord;
        var temp = [];
        WordSet = WordSet.split(" ");
        for(i in WordSet){
            if(WordSet[i] != Word) temp.push(WordSet[i]);
        }
        localStorage.KeyWord = temp.join(" ");
        node.parentNode.removeChild(node);
    }
}

var SaveKeyWord = function(){
    var tags = $("WordSet").children;
    var WordList = [];
    for(i in tags){
        Word = tags[i].innerText;
        if(Word && Word != " "){
            WordList.push(Word);
        }
    }
    console.log(WordList);
    localStorage.KeyWord = WordList.join(" ");
}

var SendKeyWord = function(){
    var Store = localStorage.KeyWord;
    var WordList = Store.split(" ");
    chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendRequest(tab.id, {name: "KeyWord",word:WordList}, function(response) {
                if(response && response.name == "true") return;
                console.log("failed");
                });
            setTimeout(SendKeyWord,1000);
    });
}

function SendStatus(str){
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendRequest(tab.id, {name: "FilterStatus",word:str}, function(response) {
            if(response && response.name == "true") return;
            console.log("failed");
            });
            setTimeout(SendChooseTag,1000);
        });
}

function SendChooseTag(){
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

if(BtnStatus === "open") {
    OpenBtn.disabled = true;
    CloseBtn.disabled = false;
}
if(BtnStatus === "close") {
    OpenBtn.disabled = false;
    CloseBtn.disabled = true;
}

OpenBtn.onclick = function() {
  OpenBtn.disabled = true;
  OpenBtn.style.backgroundColor = "#f0f0f0";
  CloseBtn.disabled = false;
  CloseBtn.style.backgroundColor = "#85c926";
  localStorage.BtnStatus = "open";
  //chrome.extension.sendMessage({"status": "open"});
  SendStatus("open");
};
CloseBtn.onclick = function() {
  OpenBtn.disabled = false;
  OpenBtn.style.backgroundColor = "#85c926";
  CloseBtn.disabled = true;
  CloseBtn.style.backgroundColor = "#f0f0f0";
  localStorage.BtnStatus = "close";
  //chrome.extension.sendMessage({"status": "close"});
  SendStatus("close");
};

function SendFontChange(){
    var FontStatus = localStorage.FontStatus;
    if(!FontStatus) FontStatus = " ";
    chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendRequest(tab.id, {name: "FontChange",word:FontStatus}, function(response) {
                if(response && response.name == "true") return;
                console.log("failed");
                });
            setTimeout(SendFontChange,1000);
    });
}

AddBtn.onclick = function() {
    var str = $("In").value;
    if(!str) return;
    var Word = trim(str);
    if(!Word) return;
    AddKeyWord(str);
    var WordSet = localStorage.KeyWord;
    var temp = [];
    WordSet = WordSet.split(" ");
    WordSet.push(Word);
    localStorage.KeyWord = WordSet.join(" ");
    $("In").value = "";
    SendKeyWord();
};


ZanAddName.onclick = function() {
    var url = ""+($("ZanId").value - 0);
    ZanBtn.disabled = true;
    ZanBtn.style.backgroundColor = "#E7F3F9";
    ZanNote.innerHTML = "查询中...";
    localStorage.ZanUrl = "";
    localStorage.ZanName = ""
    if(url == "394003637") {
        ZanNote.innerHTML = "Id错误";
        return;
        }
    if(url != "NaN"){
        var Url = "http://www.renren.com/"+url+"/profile";
        var data="";
        var req = new XMLHttpRequest();  
        req.open("GET",Url,false);
        req.send(null);
        var result = req.status;
        if(result == 200){
            data = req.responseText;
            //console.log(data);
        }else{
            ZanNote.innerHTML = "Id错误";
        }
        if(/class="avatar_title"/.test(data)){
            var Name = data.match('avatar_title(.*?)<span')[1].substring(2,6);
            var User = "<a href='"+Url+"'>"+Name+"</a>";
            ZanNote.innerHTML = User;
            localStorage.ZanUrl = url;
            localStorage.ZanName = Name;
            ZanBtn.disabled = false;
            ZanBtn.style.backgroundColor = "#85c926";
        }else if(/username lively-user/.test(data)){
            var Name = data.match('<h1 class="username lively-user" title="(.*?)">(.*?)</h1>')[2].substring(0,4);
            var User = "<a href='"+Url+"'>"+Name+"</a>";
            ZanNote.innerHTML = User;
            localStorage.ZanUrl = url;
            localStorage.ZanName = Name;
            ZanBtn.disabled = false;
            ZanBtn.style.backgroundColor = "#85c926"; 
        }else if(/username/.test(data)){
            var Name = data.match('<h1 class="username">(.*?)</h1>')[1].substring(0,4);
            var User = "<a href='"+Url+"'>"+Name+"</a>";
            ZanNote.innerHTML = User;
            localStorage.ZanUrl = url;
            localStorage.ZanName = Name;
            ZanBtn.disabled = false;
            ZanBtn.style.backgroundColor = "#85c926"; 
        }else{
            ZanNote.innerHTML = "无此用户";
        }
    }else{
        ZanNote.innerHTML = "Id错误";
    }
    
}

ZanBtn.onclick = function(){
    if(ZanBtn.innerText == "开始"){
        ZanBtn.innerText = "停止";
        localStorage.ZanStatus = "open";
    }else{
        ZanBtn.innerText = "开始";
        localStorage.ZanStatus = "close";
        ZanNote.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
        localStorage.ZanName = "";
        localStorage.ZanUrl = "";
        ZanBtn.disabled = true;
    }
}




//删除多余模块
var ChooseSet = $("ChooseSet");
if(ChooseSet) ChooseSet = ChooseSet.children;
var ChooseDown = function(e){
    var ChooseList = localStorage.ChooseList;
    var temp1 = [],temp2 = [];
    if(ChooseList) temp1 = ChooseList.split(" ");
    var node = e.target;
    var title = node.title;
    if(ChooseList && ChooseList.indexOf(title) > -1){
        for(j in temp1){
            if(temp1[j] != title) temp2.push(temp1[j]);
        }
        localStorage.ChooseList = temp2.join(" ");
        node.style.backgroundColor = "#E7F3F9";
    }else{
        if(!ChooseList){
            localStorage.ChooseList = title;
        }else{
            temp1.push(title);
            localStorage.ChooseList = temp1.join(" ");
        }
        node.style.backgroundColor = "#11F3F9";
    }
    SendChooseTag();
}
for(i in ChooseSet){
    ChooseSet[i].onclick = ChooseDown;
}
