// Grab the articles as a json

empezar();

function empezar() {
    $.getJSON("/articles", function(data) {
        // For each one
        var numero = 1
        var articulos = ""
        for (var i = 0; i < data.length; i++) {
            // Display the apropos information on the page
            if (numero === 1) {
                // $("#articles").append(" <div class='row'>");

                articulos = articulos + " <div class='row'> ";
                console.log(numero);
            }
            articulos = articulos + "<div class='col-sm-3'> <div class='card h-100'>  <div class='card-body text-center'>  <p class='card-text' data-id='" + data[i]._id + "'>" + data[i].title + "</p></div>" + "<div class='card-footer bg-transparent text-center'> <a href='" + data[i].link + "'class='btn btn-primary' target='_blank'>Link</a>&nbsp;&nbsp;";
            articulos = articulos + "<button type='button' id='btnmodal' class='btn btn-primary' data-toggle='modal' data-idnews='" + data[i]._id + "' data-target='#myModal'>Notes</button>";


            articulos = articulos + "</p> </div> </div> </div> ";

            //        $("#articles").append(" <div class='col-sm-3'> <div class='card bg-primary'>  <div class='card-body text-center'>  <p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p> </div> </div> </div>");

            if (numero === 4) {
                articulos = articulos + "</div> <br>";

                //$("#articles").append("</div>");
                console.log(numero);
                numero = 1;

            } else {
                console.log(numero);
                numero = numero + 1;

            }


        }

        articulos = articulos + "<!-- The Modal -->";
        articulos = articulos + "  <div class='modal' id='myModal'>";
        articulos = articulos + "    <div class='modal-dialog'>";
        articulos = articulos + "      <div class='modal-content'>";
        articulos = articulos + "      ";
        articulos = articulos + "        <!-- Modal Header -->";
        articulos = articulos + "        <div class='modal-header'>";
        articulos = articulos + "          <h4 class='modal-title'>Modal Heading</h4>";
        articulos = articulos + "          <button type='button' class='close' data-dismiss='modal'>&times;</button>";
        articulos = articulos + "        </div>";
        articulos = articulos + "        ";
        articulos = articulos + "        <!-- Modal body -->";
        articulos = articulos + "        <div class='modal-body'><p>Nota:</p>";
        articulos = articulos + "         <div id='nota1'></div><br><div id='nota2'></div>";
        articulos = articulos + "        </div>";
        articulos = articulos + "        ";
        articulos = articulos + "        <!-- Modal footer -->";
        articulos = articulos + "        <div class='modal-footer'>";
        articulos = articulos + "          <div id='botonnota'></div> &nbsp;&nbsp;<button type='button' class='btn btn-danger' data-dismiss='modal'>Close</button>";
        articulos = articulos + "        </div>";
        articulos = articulos + "        ";
        articulos = articulos + "      </div>";
        articulos = articulos + "    </div>";
        articulos = articulos + "  </div>";


        $("#articles").append(articulos);
    });

}

// Whenever someone clicks a p tag
$(document).on("click", "#btnmodal", function() {
    //alert("I want this to appear after the modal has opened!");
    console.log("Se mostro una ventana");
    // Empty the notes from the note section
    $("#notes").empty();
    $(".modal-title").empty();
    $("#nota1").empty();
    $("#nota2").empty();
    $("#botonnota").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-idnews");
    console.log(thisId);

    // Now make an ajax call for the Article
    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        // With that done, add the note information to the page
        .then(function(data) {
            console.log(data);
            // The title of the article
            $("#notes").append("<h2>" + data.title + "</h2>");

            $(".modal-title").append("<h2>" + data.title + "</h2>");

            // An input to enter a new title
            $("#nota1").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#nota2").append("<textarea id='bodyinput' name='body' style='min-width: 100%'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#botonnota").append("<button class='btn btn-primary' data-id='" + data._id + "' id='savenote' data-dismiss='modal'>Save Note</button>");

            // If there's a note in the article
            if (data.note) {
                console.log(data.note);
                // Place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});

// Srcrap

$(document).on("click", "#scrap", function() {

    $("#scrap").empty();
    $("#scrap").append("<button type='button' class='btn btn-danger'>Scraping...</button>");

    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function() {
        empezar();

        $("#scrap").empty();
        $("#scrap").append("<button type='button' class='btn btn-success'>Scrap Updated</button>");

    });


});



// When you click the savenote button
$(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
        // With that done
        .then(function(data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();


        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});