$(function() {
    // Initial array of movies
    var games = ["COD", "fifa18", "rainbow six siege", "outlast ps4"];

    // api call
    const api_key = "4i2cKQvU5RTeTcXWvIdf172GA46qQCaV";
    let url = "https://api.giphy.com/v1/gifs/search"; //host+path

    //var isPLayingGif = false;
    var still = "";
    var lastbtn = "";
    var gifUrls = [];
    var gifUrlsStill = [];

    /*
    * display buttons
    */
    function renderButtons(){
        $("#btns-view").empty();

        games.forEach( topic => {
            var a = $("<button>")
            
            a.addClass("game");
            a.attr("data-name", topic);
            a.text(topic);
            $("#btns-view").append(a);
        });
    }

    /*
    *   add button
    */
    $("#add-game").on("click", function(e){
        e.preventDefault();

        var game = $("#game-input").val().trim();

        games.push(game);

        renderButtons();

    });

    /*
    *   display gifs onto screen
    */
    function displayGifs(){
        // reset arrays
        gifUrls = [];
        gifUrlsStill = [];

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
                var gifDiv = $("<div class='download'>");
                var overlay = $('<div class="overlay">');

                var rating = response.data[i].rating;

                var a = $("<a href='#'>");
                var iLink = $("<i class='fas fa-download'>");
                a.append(iLink);
                var p = $("<p>").text("Rating: " + rating);

                var gifImage = $("<img>");
                gifImage.attr("src", response.data[i].images.fixed_height_still.url);
                
                /* for gif click */
                gifUrls.push(response.data[i].images.fixed_height.url);
                gifUrlsStill.push(response.data[i].images.fixed_height_still.url);
                /* * */
                
                gifImage.attr("data-gif-id", i)
                gifImage.attr("data-playing", "static");

                gifImage.addClass("play");

                overlay.append(p);
                overlay.append(a);
                gifDiv.append(gifImage);
                gifDiv.append(overlay);

                
                $("#giphy-list").prepend(gifDiv);
            }
        });

    }

    /*
    * Image manipulation to play Gifs
    */
    function playGif(){
        // if not playing then play gif
        console.log($(this).attr("data-playing"));
        if($(this).attr("data-playing") === "static"){
            $(this).attr("data-playing", "playing");
            var index = $(this).attr("data-gif-id");
            $(this).attr("src", gifUrls[parseInt(index)]);
        }
        else {
            $(this).attr("data-playing", "static");
            var index = $(this).attr("data-gif-id");
            $(this).attr("src", gifUrlsStill[parseInt(index)]);
        }
        
    }

    $(document).on("click", ".game", displayGifs);
    $(document).on("click", ".play", playGif);
    renderButtons();
});