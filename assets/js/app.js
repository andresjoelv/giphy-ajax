$(function() {
    // Initial array of movies
    var games = ["COD", "fifa18", "rainbow six siege", "outlast ps4"];

    // api call
    const api_key = "4i2cKQvU5RTeTcXWvIdf172GA46qQCaV";
    let url = "https://api.giphy.com/v1/gifs/search"; //host+path
    var limit = 10;

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
        *   add ten
        */
    $("#add-ten").on("click", function(e){
        e.preventDefault();
        
        limit = 20;

         // reset arrays
        gifUrls = [];
        gifUrlsStill = [];
 
        $("#giphy-list").empty();

        var game = $(this).attr("data-name");
        
        url = "https://api.giphy.com/v1/gifs/search";

        url += "?" + $.param({
            'q' : game,
            'api_key' : api_key,
            'limit' : limit
        });
        makeApiCall(game);
        limit = 10;
    });


    /*
    *   display gifs onto screen
    */
    function displayGifs(){
        // reset arrays
        gifUrls = [];
        gifUrlsStill = [];

        $("#giphy-list").empty();
        var game = $(this).attr("data-name");

        url = "https://api.giphy.com/v1/gifs/search";

        url += "?" + $.param({
            'q' : game,
            'api_key' : api_key,
            'limit' : limit
        });

        makeApiCall(game);
    }

    var favorites = [];
    var favUrls = [];

    function makeApiCall(game){
        $.ajax({
            url: url,
            method: "GET"
        }).then((response) => { 
            console.log(response); 
            for(var i = 0; i < response.data.length; i++){
                var panel = $("<div class='panel'>");
                var overlay = $('<div class="overlay">');
                //var favorite = $('<div class="favorite">');

                var rating = response.data[i].rating;
                var p = $("<p>").text("Rating: " + rating);

                var a = $(`<a href='${response.data[i].images.fixed_height.url}' download>`);
                var iLink = $("<i class='fas fa-download'>");
                a.append(iLink);

                // fav section
                var favGif = $("<div class='list'>")
                var favGifSpan = $(`<spani class='favme fas fa-heart' data-id="${i}" data-url='${response.data[i].images.fixed_height.url}'></span>`)
                favGif.append(favGifSpan);

                var gifImage = $("<img>");
                gifImage.attr("src", response.data[i].images.fixed_height_still.url);
                
                /* for gif click */
                gifUrls.push(response.data[i].images.fixed_height.url);
                gifUrlsStill.push(response.data[i].images.fixed_height_still.url);
                /* * */
                
                gifImage.attr("data-gif-id", i)
                gifImage.attr("data-playing", "static");

                gifImage.addClass("play");

                overlay.append(a);
                //overlay.append(favGif);
                panel.append(gifImage);
                panel.append(p);
                panel.append(overlay);
                panel.append(favGif);

                $("#giphy-list").prepend(panel);

                $("#add-ten").attr("data-name", game);
            }
            // get favorites from local storage or empty array
            favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                // add class 'fav' to each favorite
            favorites.forEach(function(favorite) {
                $(`[data-id='${favorite}']`).css("color", "red");
            });
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

   

    /*
     * favMe
     */

    function favMe(){
        
        localStorage.clear();

        var id = $(this).attr('data-id'),
            favUrl = $(this).attr("data-url"),
            index = favorites.indexOf(id);

        console.log(parseInt(index));

        // return if target doesn't have an id (shouldn't happen)
        if (!id) return;
        // item is not favorite
        if (index == -1) {
            favorites.push(id);
            favUrls.push(favUrl);
            $(this).css('color', 'red');
        // item is already favorite
        } else {
            favorites.splice(index, 1);
            $(this).css("color", 'white');
        }
        // store array in local storage
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    $(document).on("click", ".game", displayGifs);
    $(document).on("click", ".play", playGif);

    $(document).on("click", ".favme", favMe);

    renderButtons();
});