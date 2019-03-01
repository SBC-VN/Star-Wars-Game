// Game script

// Setup the array of Jedis. 
var jediArray = [{name:"Darth Vader",strength:0,regen:0,picture:"./assets/images/darth_vader.jpg",status:"ready"},
                 {name:"Count Dooku",strength:0,regen:0,picture:"./assets/images/count_dooku.jfif",status:"ready"},
                 {name:"Darth Maul",strength:0,regen:0,picture:"./assets/images/darth_maul.jpg",status:"ready"},
                 {name:"Luke Skywalker",strength:0,regen:0,picture:"./assets/images/luke_skywalker.jpg",status:"ready"},
                 {name:"Mace Windu",strength:0,regen:0,picture:"./assets/images/mace_windu.jpg",status:"ready"}, 
                 {name:"ObiWan Kenobi",strength:0,regen:0,picture:"./assets/images/obiwan_kenobi.jpg",status:"ready"}];
                 
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

function createJediCard (name, strength, regen, imageSrc) {
    var newCard = $("<div>");

    newCard.addClass("card mb-3");
    newCard.attr("style","max-width: 540px;");

    var cardRow = $("<div>");
    newCard.append(cardRow);
    cardRow.addClass("row no-gutters");
    
    var rowColumn1 = $("<div>");
    cardRow.append(rowColumn1);
    rowColumn1.addClass("col-md-4");

    var cardImage = $("<img>");
    rowColumn1.append(cardImage);
    cardImage.addClass("card-img");
    cardImage.attr("src",imageSrc);
    cardImage.attr("width","100px");
    cardImage.attr("height","100px");

    var rowColumn2 = $("<div>");
    cardRow.append(rowColumn2);
    rowColumn2.addClass("col-md-8");

    var column2Body = $("<div>");
    rowColumn2.append(column2Body);
    column2Body.addClass("card-body");
    column2Body.append("<h5 class=\"card-title\">"+ name +"</h5>");
    column2Body.append("<p class=\"card-text\">Strength:" + strength +"</p>");
    column2Body.append("<p class=\"card-text\">Regeneration:" + regen +"</p>");

    return newCard;
}

var jediCard1 = createJediCard("test",5,5,"./assets/images/obiwan_kenobi.jpg");
$("#attacker-choices").append(jediCard1);