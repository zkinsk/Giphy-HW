
// declare global variables

var topicArr = ["Perfomance Art", "Mountain Climbing", "Clouds", "Landscape", "Painting", "Sculpting", "Mountain Bike", "Hiking", "Climbing", "Dirt Bike", "Jumping", "Surfing", "Jellyfish"];
var favArr = [];
var gifArr = [];
var buttonDel = false;
var addFav = false;
var rowCount = 0;
var resetTopic = false;
var react1;
var react2;

// giphy api key = 4hOSx38y08m8D16miIeYgpnQTT2nKkae

// functions
function bottonPopulate(arrType){
    $("#buttonBox").empty();
    for(let i = 0; i < arrType.length; i++){
        let btn = $("<button>").attr({"type": "button", "value": arrType[i], "offset": 0}).text(arrType[i]);
        btn.addClass("btn btn-primary btn-sm topicBtn");
        $("#buttonBox").append(btn);
    }

}
// topic button clicks
function buttonClick(){
    $("button[value='back']").hide();
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

    $("button[value='back']").click(function(){
        $(this).fadeOut(100);
        $(".gifCols").empty();
        callGihpy(0, 0, 0, 1, gifArr);

    })
 

}
// drop down button fuctionality
function buttonDropDown(){
    $(":button[value='remove-topic']").on("click", function(){
        buttonDel = true;
    });

    $(":button[value='clearGifs']").on("click", function(){
        $(".gifCols").empty();
        gifArr= [];
    })
    $(":button[value='resetTopic']").on("click", function(){
        resetTopic = true;
    })
    $(":button[value='showFavs']").on("click", function(){
        $(".gifCols").empty();
        $("button[value='back']").fadeIn(100);
        let favArrDB = JSON.parse(localStorage.getItem("favDB"))
        callGihpy(0, 0, 0, 1, favArrDB);
        // setTimeout(function(){ 
        //     $("#buttonBox, #addButtonBox, .navbar").on("click", function(){
        //         $("button[value='back']").fadeOut(100);
        //         $("#buttonBox, #addButtonBox, .navbar").off(function(){
        //             alert("Off")
        //         });
        //     });
        // }, 100);

    })

}
// gif click functions & gif favorites
function gifClick(){
    $("#gifBox").on("click", ".gif", function(){
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

    // favories picker
    $("#gifBox").on("click", ".gifStar", function(){
        if(($(this).attr("fave-state")) == "notfaved"){
            // alert("not fav")
            $(this).css("color", "red").attr("fave-state", "faved");
            let fav = $(this).attr("gifID");
            if(!favArr.includes(fav)){
            favArr.push(fav);
            // localStorage.clear();
            // JSON.stringify(favArr)
            localStorage.setItem("favDB", ( JSON.stringify(favArr)) );
            }

        }
        else{
            $(this).css("color", "rgba(255, 255, 0, 0.75)").attr("fave-state", "notfaved");
            let fav = $(this).attr("gifID");
            favArr.indexOf(fav);
            favArr.splice((favArr.indexOf(fav)), 1);
            // localStorage.clear();
            localStorage.setItem("favDB", ( JSON.stringify(favArr)) );
        }
    });

//     $("#gifBox").on("click", ".dlBut", function(){
//         let gifURL = $(this).attr("gifAddr");
//         // FileSaver.saveAs(gifAddr, "image.gif");
//         // import saveAs from 'file-saver';
//         FileSaver saveAs(Blob/File/Url, optional DOMString filename, optional Object { autoBOM })
//         var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
// FileSaver.saveAs(blob, "hello world.txt");
//     });
    
}
// hover functions
function gifHover(){
    $("#gifBox").on("mouseenter", ".gif", function(){
        let anim = $(this).attr("data-animate");
        if ($(this).attr("data-state") === "stopped"){
            $(this).attr("src", anim);
        }

    });
    $("#gifBox").on("mouseleave", ".gif", function(){
        let stop = $(this).attr("data-still");
        if ($(this).attr("data-state") === "stopped"){
            $(this).attr("src", stop);
        }
    });
}
// function to add new topic buttons to page
function addTopic(){
    $(":button[value='new-topic']").on("click", function(event){
        event.preventDefault();
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


// calls giphy api via AJAX - calls both a search query and specific gifs by ID
function callGihpy(topic, offSet, gifNumber, type, ArrDB){
    var queryURL;
    var ajAy = ["https://api.giphy.com/v1/gifs/search?api_key=4hOSx38y08m8D16miIeYgpnQTT2nKkae&limit=" + gifNumber + "&offset=" + offSet + "&q=" + topic, "https://api.giphy.com/v1/gifs?api_key=4hOSx38y08m8D16miIeYgpnQTT2nKkae&ids="];
    if (type == 1){
        queryURL = ajAy[type] + ArrDB;
    }else {
        queryURL = ajAy[type];
    }
    console.log("query URL: " + queryURL);
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
    $(".gifDiv").hide();
    for (let i = 0; i < giphyObj.data.length; i++){
        let cGifurl = giphyObj.data[i].images.fixed_width_still.url
        let cGifStill = giphyObj.data[i].images.fixed_width_still.url
        let cGifAnimate = giphyObj.data[i].images.fixed_width.url
        let cGifOrig = giphyObj.data[i].images.original.url
        let gifID = giphyObj.data[i].id;
        if (!gifArr.includes(gifID)){gifArr.push(gifID)};
        console.log("gif Arr: " + gifArr);
        while(gifArr.length > 60){
            gifArr.shift();
        }
        let gifRating = giphyObj.data[i].rating;
        let gifDl = $("<div class='dlButton'><a href='" + cGifOrig + "' target = 'blank'><span class='fas fa-cloud-download-alt dlBut'></span></a>").css("display", "none")
        // let gifDl = $("<div class='fas fa-cloud-download-alt dlBut' gifAddr = '" + cGifOrig + "'>");
        // .addClass("fas fa-cloud-download-alt dlBut");
        let gifDiv = $("<div>").addClass("gifDiv");
        let gifStar = $("<div>").addClass("gifStar fas fa-star").css("display", "none")
        // checks for state of favorite to determine whether to re-draw with a red star
        if (favArr.includes(gifID)){
            gifStar.attr({"fav-state":"faved", "gifID": gifID});
            gifStar.css("color", "red");
        }else{gifStar.attr({"gifID": gifID, "fave-state": "notfaved"});
        };
        let cGif = $("<img>").addClass("gif");
        cGif.attr({"src": cGifurl, "data-still": cGifStill, "data-animate": cGifAnimate, "data-state": "stopped", "gifID": gifID});
        cGif.attr({"data-toggle": "tooltip", "data-placement": "top", "title": "Rated: " + gifRating});
        gifDiv.append(cGif, gifStar, gifDl).css("display", "none");
        // resets row count and also forces all gif in one row for responsive layour
        if (rowCount >= 3 || ($(window).width()) <= 767 ){
            rowCount = 0;
            // react2 = true;
        }
        // $(".gifStar, dlBut").hide()
        $(".gifRow .gifCol" + rowCount).prepend(gifDiv);
        rowCount++
    }
    $(".gifDiv").fadeIn(150);
    $(".gifStar, .dlButton").fadeIn(700);
    $('[data-toggle="tooltip"]').tooltip()
}
function screenCheck(){
        if (($(window).width()) <= 767) {
        react2 = true
    }
    else {react2 = false}

    window.addEventListener("resize", function() {
        if ( (window.matchMedia("(min-width: 768px)").matches) ) {
            react1 = false;
            if (react1 != react2){
                $(".gifCols").empty()
                $(".tooltip").remove();
                callGihpy(0, 0, 0, 1, gifArr)
                react2 = false;
                this.console.log("not equal large")
            }
        } else {
            react1 = true;
            if (react1 != react2){
                $(".gifCols").empty()
                $(".tooltip").remove();
                callGihpy(0, 0, 0, 1, gifArr)
                react2 = true;
                this.console.log("not equal skinny")
            }
        }
    });
};



$( document ).ready(function() {
    if ( JSON.parse(localStorage.getItem("favDB")) !== null ){
        favArr = JSON.parse(localStorage.getItem("favDB"))
    };
    screenCheck();

    bottonPopulate(topicArr);
    buttonClick();
    gifClick();
    gifHover();
    addTopic();
    buttonDropDown();

    console.log(JSON.parse(localStorage.getItem("favDB")));
   console.log("window Width: " + $(window).width());
   console.log("Doc Width: " + $(document).width()); 


    

// end of document.read
});