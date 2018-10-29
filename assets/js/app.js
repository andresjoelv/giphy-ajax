$(function() {
    // Initial array of movies
    var topics = ["COD", "fifa18", "rainbow six siege", "outlast ps4"];

    // api call
    const api_key = "4i2cKQvU5RTeTcXWvIdf172GA46qQCaV";
    let url = "https://api.giphy.com/v1/gifs/search"; //host+path

    var isPLayingGif = false;
    var still = "";
    var lastbtn = "";
    var gifUrls = [];

    function renderButtons(){
        $("#btns-view").empty();

        topics.forEach( topic => {
            var a = $("<button>")
            
            a.addClass("game");
            a.attr("data-name", topic);
            a.text(topic);
            $("#btns-view").append(a);
        });
    }

    /*
    *   TO-DO
    */
    // $("#add-game").on("click", function(e){
    //     e.preventDefault();

    //     var game = $("#game-input").val().trim();

    // });

    /*
    *   TO-DO
    */
    function displayGifs(){
        var game = $(this).attr("data-name");

        url = "https://api.giphy.com/v1/gifs/search";

        url += "?" + $.param({
            'q' : game,
            'api_key' : api_key,
            'limit' : "10"
        });
        $.ajax({
            url: url,
            method: "GET"
        }).then((response) => { 
            console.log(response); 
            for(var i = 0; i < response.data.length; i++){
                var gifDiv = $("<div>");

                var rating = response.data[i].rating;

                var p = $("<p>").text("Rating: " + rating);

                var gifImage = $("<img>");
                gifImage.attr("src", response.data[i].images.fixed_height_still.url);
                gifImage.attr("data-gif", response.data[i].images.fixed_height.url)
                //gifUrls.push(response.data[i].images.fixed_height.url);
                gifImage.attr("data-gif-id", i)
                gifImage.addClass("play");

                gifDiv.prepend(p);
                gifDiv.prepend(gifImage);

                $("#giphy-list").prepend(gifDiv);

                isPLayingGif = false;
            }
        });


    }

    function playGif(){
        // if not playing then play gif
        if(!isPLayingGif){
            console.log("play gif");
            isPLayingGif = true;
            still = $(this).attr("src");
            var gif = $(this).attr("data-gif");
            $(this).attr("src", gif);
        }
        else {
            isPLayingGif = false;
            $(this).attr("src", still);
            console.log("stop gif");
        }
        
    }

    $(document).on("click", ".game", displayGifs);
    $(document).on("click", ".play", playGif);
    renderButtons();
});