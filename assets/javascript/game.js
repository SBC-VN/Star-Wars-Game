// Game script

// Setup the array of Jedis. 
var jediArray = [{name:"Darth Vader",strength:0,regen:0,picture:"./assets/images/darth_vader.jpg",status:"ready"},
                 {name:"Count Dooku",strength:0,regen:0,picture:"./assets/images/count_dooku.jfif",status:"ready"},
                 {name:"Darth Maul",strength:0,regen:0,picture:"./assets/images/darth_maul.jpg",status:"ready"},
                 {name:"Luke Skywalker",strength:0,regen:0,picture:"./assets/images/luke_skywalker.jpg",status:"ready"},
                 {name:"Mace Windu",strength:0,regen:0,picture:"./assets/images/mace_windu.png",status:"ready"}, 
                 {name:"Obi Wan Kenobi",strength:0,regen:0,picture:"./assets/images/obiwan_kenobi.jpg",status:"ready"}];
                 
// Generate somewhat random characteristics.   
// Range of values: Strength 50 - 150, Regen 25 - 75
// Also limit strength + regen so that we don't get any Over/Under power Jedi's.
for (var i=0; i<jediArray.length; i++) {
    do {
        jediArray[i].strength = Math.floor(Math.random() * 100) + 50;
        jediArray[i].regen = Math.floor(Math.random() * 50) + 25;
    } while (jediArray[i].strength + jediArray[i].regen < 120 ||
             jediArray[i].strength + jediArray[i].regen > 180);
}
  

var attackChoiceElement=$("#attacker-choices");
var defenderChoiceElement=$("#defender-choices");

function createJediCard (index, name, strength, regen, imageSrc) {
    var newCard = $("<div>");

    newCard.addClass("card mb-3 jedi-card");
    newCard.attr("id", index);
    newCard.css("max-width","350px");
    newCard.css("background-color","grey");

    var cardRow = $("<div>");
    newCard.append(cardRow);
    cardRow.addClass("row no-gutters");
    
    var rowColumn1 = $("<div>");
    cardRow.append(rowColumn1);
    rowColumn1.addClass("col-md-7");

    var cardImage = $("<img>");
    rowColumn1.append(cardImage);
    cardImage.addClass("card-img");
    cardImage.attr("src",imageSrc);
    cardImage.attr("width","100px");
    cardImage.attr("height","200px");

    var rowColumn2 = $("<div>");
    cardRow.append(rowColumn2);
    rowColumn2.addClass("col-md-5");

    var column2Body = $("<div>");
    rowColumn2.append(column2Body);
    column2Body.addClass("card-body");
    column2Body.append("<h5 class=\"card-title\">"+ name +"</h5>");
    column2Body.append("<p class=\"card-text\">Strength: " + strength +"</p>");
    column2Body.append("<p class=\"card-text\">Regen: " + regen +"</p>");

    return newCard;
}

function setAttacker(indx) {    
    $("#attacker-header").text("Attacker");
    $("#attacker-choices").css("display","none");
    $("#defender-container").css("display","inline-flex");

    for (i = 0; i < jediArray.length; i++) {

        var card = $("#"+i);

        if (i === indx) {
            jediArray[i].status = "attacker";
            $("#attacker-card").append(card);
        }
        else {
             $("#defender-choices").append(card);
        }
    }
}

function setDefender(indx) {    
    $("#defender-header").text("Defender");
    $("#defender-choices").css("display","none");
    $("#remainder-container").css("display","inline-flex");

    for (i = 0; i < jediArray.length; i++) {

        var card = $("#"+i);
        console.log(i);
        if (i === indx) {
            jediArray[i].status = "defender";
            $("#defender-card").append(card);
        }
        else if (jediArray[i].status === "ready") {
            console.log(jediArray[i].status);
            $("#remainder-choices").append(card);
        }
    }
}

for (i=0; i<jediArray.length; i++) {
    var jediCard1 = createJediCard(i,
                                   jediArray[i].name,
                                   jediArray[i].strength,
                                   jediArray[i].regen,
                                   jediArray[i].picture);
    $("#attacker-choices").append(jediCard1);
}

// Hide the defender section until an attacker is selected.
$("#defender-container").css("display","none");
// Hide the remaiing section until after both attacker and defender are declared.
$("#remainder-container").css("display","none");

var selectionMode = "attacker";

$(".jedi-card").on("mouseenter", function() {
      if (jediArray[parseInt(this.id)].status === "ready") {
        this.style.backgroundColor = "white";
    }
});

$(".jedi-card").on("mouseleave", function() {
    if (jediArray[parseInt(this.id)].status === "ready") {
        this.style.backgroundColor = "grey";
    }
});

$(".jedi-card").on("dblclick", function() {
    var jediIndex = parseInt(this.id);
    if (jediArray[jediIndex].status === "ready") {
        if (selectionMode === "attacker") {
            setAttacker(jediIndex);
            selectionMode = "defender";
        }
        else if (selectionMode === "defender") {
            setDefender(jediIndex);
            selectionMode = "combat";
        }
    }
});
