var topicArr = ["cats", "puppies", "fish", "owls", "kids", "falling down", "skunks", "nerds", "parades"];
var favArr = [];
var buttonDel = false;
var addFav = false;


// giphy api key = 4hOSx38y08m8D16miIeYgpnQTT2nKkae
// giphy cat query var queryURL = "https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=cats";

function bottonPopulate(arrType){
    $("#buttonBox").empty();
    for(let i = 0; i < arrType.length; i++){
        let btn = $("<button>").attr({"type": "button", "value": arrType[i], "offset": 0}).text(arrType[i]);
        btn.addClass("btn btn-primary btn-sm topicBtn");
        $("#buttonBox").append(btn);
    }

}

/* <button type="button" value="cat" class="btn btn-primary btn-sm">Cat</button> */

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
            let gifNumber = $("#gifNumber").val();
            callGihpy(topic, offset, gifNumber, 0);
            offset = offset + gifNumber;
            $(this).attr("offset", offset);
        }
    })
}

function buttonDropDown(){
    $(":button[value='remove-topic']").on("click", function(){
        buttonDel = true;
    });

    $(":button[value='clearGifs']").on("click", function(){
        $("#gifBox").empty();
    })
    $(":button[value='favGifs']").on("click", function(){
        addFav = true;
    })
    $(":button[value='showFavs']").on("click", function(){
        $("#gifBox").empty();
        callGihpy(0, 0, 0, 1);
    })
}

function gifClick(){
    $(document).on("click", ".gif", function(){
        console.log(favArr)
        if(addFav){
            $(this).fadeTo(120, 0.65).fadeTo(120, 1.0);
            addFav = false;
            let fav = $(this).attr("gifID");
            if(!favArr.includes(fav)){
            favArr.push(fav);}
        }else{
            let stop = $(this).attr("data-still");
            let anim = $(this).attr("data-animate");
            if ($(this).attr("data-state") === "stopped"){
                $(this).attr("data-state", "started");
                $(this).attr("src", anim);
            }else {
                $(this).attr("data-state", "stopped");
                $(this).attr("src", stop);
            }
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

}



function callGihpy(topic, offSet, gifNumber, type){
    var queryURL;
    var ajAy = ["https://api.giphy.com/v1/gifs/search?api_key=4hOSx38y08m8D16miIeYgpnQTT2nKkae&limit=" + gifNumber + "&offset=" + offSet + "&q=" + topic, "http://api.giphy.com/v1/gifs?api_key=4hOSx38y08m8D16miIeYgpnQTT2nKkae&ids="];
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

function drawGifs(giphyObj){
    for (let i = 0; i < giphyObj.data.length; i++){
        let cGifurl = giphyObj.data[i].images.fixed_height_still.url
        let cGifStill = giphyObj.data[i].images.fixed_height_still.url
        let cGifAnimate = giphyObj.data[i].images.fixed_height.url
        let gifID = giphyObj.data[i].id;
        let gifRating = giphyObj.data[i].rating;
        let cGif = $("<img>").addClass("gif");
        cGif.attr({"src": cGifurl, "data-still": cGifStill, "data-animate": cGifAnimate, "data-state": "stopped", "gifID": gifID});
        cGif.attr({"data-toggle": "tooltip", "data-placement": "top", "title": "Rated: " + gifRating});
        $("#gifBox").prepend(cGif);
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