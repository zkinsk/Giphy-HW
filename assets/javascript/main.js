var topicArr = ["cats", "puppies", "fish", "owls", "kids", "falling down", "skunks", "nerds", "parades"];
var favArr = [];
var buttonDel = false;
var addFav = false;
var rowCount = 0;
var resetTopic = false;


// giphy api key = 4hOSx38y08m8D16miIeYgpnQTT2nKkae

function bottonPopulate(arrType){
    $("#buttonBox").empty();
    for(let i = 0; i < arrType.length; i++){
        let btn = $("<button>").attr({"type": "button", "value": arrType[i], "offset": 0}).text(arrType[i]);
        btn.addClass("btn btn-primary btn-sm topicBtn");
        $("#buttonBox").append(btn);
    }

}

function buttonClick(){
    $(document).on("click", ".topicBtn", function(){
        if (buttonDel == true){
            buttonDel = false;
            let topic = $(this).attr("value");
            let x = topicArr.indexOf(topic);
            topicArr.splice(x, 1);
            bottonPopulate(topicArr);
        }else{
            let topic = $(this).attr("value");
            let offset = parseInt($(this).attr("offset"));
            let gifNumber = parseInt($("#gifNumber").val());
            callGihpy(topic, offset, gifNumber, 0);
            offset += gifNumber;
            if (resetTopic){
                console.log("true")
                resetTopic = false;
                offset = 0;
            }
            $(this).attr("offset", offset);
            console.log("Offset: " + offset);
            
        }
    })
}

function buttonDropDown(){
    $(":button[value='remove-topic']").on("click", function(){
        buttonDel = true;
    });

    $(":button[value='clearGifs']").on("click", function(){
        $(".gifCols").empty();
    })
    $(":button[value='resetTopic']").on("click", function(){
        resetTopic = true;
    })
    $(":button[value='showFavs']").on("click", function(){
        $(".gifCols").empty();
        callGihpy(0, 0, 0, 1);
    })
    $(document).on("click", ".gifStar", function(){
        if(($(this).attr("fave-state")) == "notfaved"){
            // alert("not fav")
            $(this).css("color", "red").attr("fave-state", "faved");
            let fav = $(this).attr("gifID");
            if(!favArr.includes(fav)){
            favArr.push(fav);}

        }
        else{
            $(this).css("color", "yellow").attr("fave-state", "notfaved");
            let fav = $(this).attr("gifID");
            favArr.indexOf(fav);
            favArr.splice((favArr.indexOf(fav)), 1);
        }
    //    alert("click")
    })
}

function gifClick(){
    $(document).on("click", ".gif", function(){
        console.log(favArr)
            let stop = $(this).attr("data-still");
            let anim = $(this).attr("data-animate");
            if ($(this).attr("data-state") === "stopped"){
                $(this).attr("data-state", "started");
                $(this).attr("src", anim);
            }else {
                $(this).attr("data-state", "stopped");
                $(this).attr("src", stop);
            }
    });
}

function gifHover(){
    $(document).on("mouseenter", ".gif", function(){
        let anim = $(this).attr("data-animate");
        if ($(this).attr("data-state") === "stopped"){
            $(this).attr("src", anim);
        }

    });
    $(document).on("mouseleave", ".gif", function(){
        let stop = $(this).attr("data-still");
        if ($(this).attr("data-state") === "stopped"){
            $(this).attr("src", stop);
        }
        
    });
}

function addTopic(){
    $(":button[value='new-topic']").on("click", function(){
        let newT = $("#newTopic").val();
        if (newT !== "" && !topicArr.includes(newT)){
            topicArr.push(newT);
            bottonPopulate(topicArr);
            $("#newTopic").val("");
        }else{
            alert("try again");
            $("#newTopic").val("");
        };
    })
    $("#butnForm").on('keyup', function(event){ 
        event.preventDefault();
        let newT = $("#newTopic").val();
        if(event.keyCode == 13){ 
          event.preventDefault();
          if (newT !== "" && !topicArr.includes(newT)){
            topicArr.push(newT);
            bottonPopulate(topicArr);
            $("#newTopic").val("");
        }else{
            alert("try again");
            $("#newTopic").val("");
        };
          
        }
      });

}


// calls giphy api via AJAX - calls both a search query and specific gifs by ID
function callGihpy(topic, offSet, gifNumber, type){
    var queryURL;
    var ajAy = ["https://api.giphy.com/v1/gifs/search?api_key=4hOSx38y08m8D16miIeYgpnQTT2nKkae&limit=" + gifNumber + "&offset=" + offSet + "&q=" + topic, "https://api.giphy.com/v1/gifs?api_key=4hOSx38y08m8D16miIeYgpnQTT2nKkae&ids="];
    if (type == 1){
        queryURL = ajAy[type] + favArr;
    }else {
        queryURL = ajAy[type];
    }
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
            console.log(response);
            giphyObj = response;
            drawGifs(giphyObj);
        });
}
// draws the gifs on the DOM - adds attribute data from the JSON object from giphy
function drawGifs(giphyObj){
    if( ($(".gifRow .gifCol0").is(":empty"))  && ($(".gifRow .gifCol1").is(":empty")) && ($(".gifRow .gifCol2").is(":empty")) ){
        rowCount = 0
        console.log("empty");
    };
    for (let i = 0; i < giphyObj.data.length; i++){
        let cGifurl = giphyObj.data[i].images.fixed_width_still.url
        let cGifStill = giphyObj.data[i].images.fixed_width_still.url
        let cGifAnimate = giphyObj.data[i].images.fixed_width.url
        let gifID = giphyObj.data[i].id;
        let gifRating = giphyObj.data[i].rating;
        let gifDiv = $("<div>").addClass("gifDiv");
        let gifStar = $("<div>").addClass("gifStar fas fa-star");
        // gifStar.attr({"fav-state": "notfaved", "gifID": gifID})
        if (favArr.includes(gifID)){
            gifStar.attr({"fav-state":"faved", "gifID": gifID});
            gifStar.css("color", "red");
        }else{gifStar.attr({"gifID": gifID, "fave-state": "notfaved"});
        // gifStar.attr("fave-state", "notfaved")
        };
        let cGif = $("<img>").addClass("gif");
        cGif.attr({"src": cGifurl, "data-still": cGifStill, "data-animate": cGifAnimate, "data-state": "stopped", "gifID": gifID});
        cGif.attr({"data-toggle": "tooltip", "data-placement": "top", "title": "Rated: " + gifRating});
        gifDiv.append(cGif, gifStar);
        if (rowCount >= 3){
            rowCount = 0
        };

        $(".gifRow .gifCol" + rowCount).prepend(gifDiv);
        rowCount++
    }
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      });
}
// data-toggle="tooltip" data-placement="top"



$( document ).ready(function() {
    bottonPopulate(topicArr);
    buttonClick();
    gifClick();
    gifHover();
    addTopic();
    buttonDropDown();

// end of document.read
});