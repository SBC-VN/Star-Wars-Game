// Game script

// Setup the array of Jedis. 
var jediArray = [{name:"Darth Vader",strength:0,regen:0,hp:0,picture:"./assets/images/darth_vader.jpg",status:"ready"},
                 {name:"Count Dooku",strength:0,regen:0,hp:0,picture:"./assets/images/count_dooku.jfif",status:"ready"},
                 {name:"Darth Maul",strength:0,regen:0,hp:0,picture:"./assets/images/darth_maul.jpg",status:"ready"},
                 {name:"Luke Skywalker",strength:0,regen:0,hp:0,picture:"./assets/images/luke_skywalker.jpg",status:"ready"},
                 {name:"Mace Windu",strength:0,regen:0,hp:0,picture:"./assets/images/mace_windu.png",status:"ready"}, 
                 {name:"Obi Wan Kenobi",strength:0,regen:0,hp:0,picture:"./assets/images/obiwan_kenobi.jpg",status:"ready"}];
                 
// Generate somewhat random characteristics.   
// Range of values: Strength 50 - 150, Regen 25 - 75, HitPoints 225 - 325
// Also limit strength + regen so that we don't get any Over/Under power Jedi's.
for (var i=0; i<jediArray.length; i++) {
    do {
        jediArray[i].strength = Math.floor(Math.random() * 100) + 50;
        jediArray[i].regen = Math.floor(Math.random() * 50) + 25;
        jediArray[i].hp = Math.floor(Math.random() * 100) + 225;
    } while (jediArray[i].strength + jediArray[i].regen < 120 ||
             jediArray[i].strength + jediArray[i].regen > 180);
}
  

var attackChoiceElement=$("#attacker-choices");
var defenderChoiceElement=$("#defender-choices");

//
//  Create the boostrap card for the jedi
//
function createJediCard (index, name, strength, regen, hitpoints, imageSrc) {
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
    column2Body.append("<p class=\"card-text\">HP: " + hitpoints +"</p>");

    return newCard;
}

//
//   Create 3 buttons for the attacker with attack/defend values.
//
function createAttackerButtons(jediId) {
    var jediStr = jediArray[jediId].strength;
    var attackPwr=0;
    var defendPwr=0;
    var cardSection = $("#attacker-card-container");
    cardSection.css("display","inline-flex");
    var buttonContainer = $("<div>");

    buttonContainer.css("display","block");
    cardSection.append(buttonContainer);
    //  First is 'aggressive attack' where there is little/no defense vs counter attack
    attackPwr = Math.floor((jediStr/2 * Math.random()) + jediStr/2);
    defendPwr = Math.floor((jediStr - attackPwr)/2 * Math.random());

    var buttonDiv = $("<button type=\"button\" class=\"btn btn-danger button-attack\">Lunge (" + attackPwr + " / " + defendPwr +") </button>");
    buttonDiv.attr("id","attack-1");
    buttonDiv.css("display","block");
    buttonDiv.css("height","30%");
    buttonDiv.css("margin","2px");
    buttonDiv.css("width","100%");
    buttonDiv.attr("id","attack-1");
    buttonDiv.val(attackPwr + ":" + defendPwr);
    buttonDiv.attr("attack-name","Lunge");
    buttonDiv.on("click",attackClick);
    buttonContainer.append(buttonDiv);

    // More balanced attack.

    var baseValue = Math.floor(jediStr/2 * Math.random());
    var adjustValue = Math.floor(jediStr/8 * Math.random());
    attackPwr = baseValue + adjustValue;
    if (adjustValue > baseValue) {
        defendPwr = baseValue;
    }
    else {
        defendPwr = baseValue - adjustValue;
    }

    var buttonDiv = $("<button type=\"button\" class=\"btn btn-danger button-attack\">Slash (" + attackPwr + " / " + defendPwr +") </button>");
    buttonDiv.css("display","block");
    buttonDiv.css("height","30%");
    buttonDiv.css("margin","2px");
    buttonDiv.css("width","100%");
    buttonDiv.attr("id","attack-2");
    buttonDiv.val(attackPwr + ":" + defendPwr);
    buttonDiv.attr("attack-name","Slash");
    buttonDiv.on("click",attackClick);
    buttonContainer.append(buttonDiv);

    // More 'defensive' attack.
    defendPwr = Math.floor((jediStr/2 * Math.random()) + jediStr/2);
    attackPwr = Math.floor((jediStr - defendPwr) * Math.random());    
 
    var buttonDiv = $("<button type=\"button\" class=\"btn btn-danger button-attack\">Jab (" + attackPwr + " / " + defendPwr +") </button>");
    buttonDiv.css("display","block");
    buttonDiv.css("height","30%");
    buttonDiv.css("margin","2px");
    buttonDiv.css("width","100%");
    buttonDiv.attr("id","attack-3");
    buttonDiv.val(attackPwr + ":" + defendPwr);
    buttonDiv.attr("attack-name","Jab");
    buttonDiv.on("click",attackClick);
    buttonContainer.append(buttonDiv);

    // $("#button-attack").on("click",function() {
    //     console.log(this);
    // });
}

//
//   Create 3 buttons for the defender with defend/counter values.
//
function createDefenderButtons(jediId) {
    console.log("Creating defender buttons");
    var jediStr = jediArray[jediId].strength;
    var counterPwr=0;
    var defendPwr=0;
    var cardSection = $("#defender-card-container");
    cardSection.css("display","inline-flex");
    var buttonContainer = $("<div>");

    buttonContainer.css("display","block");
    cardSection.append(buttonContainer);
    //  First is 'aggressive attack' where there is little/no defense vs counter attack
    defendPwr = Math.floor((jediStr/2 * Math.random()) + jediStr/2);
    counterPwr = Math.floor((jediStr - defendPwr)/2 * Math.random());

    var buttonDiv = $("<button type=\"button\" class=\"btn btn-info button-defend\">Block (" + defendPwr + " / " + counterPwr +") </button>");
    buttonDiv.css("display","block");
    buttonDiv.css("height","30%");
    buttonDiv.css("margin","2px");
    buttonDiv.css("width","100%");
    buttonDiv.val(defendPwr + ":" + counterPwr);
    buttonDiv.attr("defense-name","Block");
    buttonDiv.name = "Block";
    buttonDiv.attr("id","defend-1");
    buttonContainer.append(buttonDiv);

    // More balanced attack.

    var baseValue = Math.floor(jediStr/2 * Math.random());
    var adjustValue = Math.floor(jediStr/8 * Math.random());
    defendPwr = baseValue + adjustValue;
    if (adjustValue > baseValue) {
        counterPwr = baseValue;
    }
    else {
        counterPwr = baseValue - adjustValue;
    }

    var buttonDiv = $("<button type=\"button\" class=\"btn btn-info button-defend\">Parry (" + defendPwr + " / " + counterPwr +") </button>");
    buttonDiv.css("display","block");
    buttonDiv.css("height","30%");
    buttonDiv.css("margin","2px");
    buttonDiv.css("width","100%");
    buttonDiv.val(defendPwr + ":" + counterPwr);
    buttonDiv.attr("id","defend-2");
    buttonDiv.attr("defense-name","Parry");
    buttonDiv.name = "Parry";
    buttonContainer.append(buttonDiv);

    // More 'defensive' attack.
    counterPwr = Math.floor((jediStr/2 * Math.random()) + jediStr/2);
    defendPwr = Math.floor((jediStr - counterPwr) * Math.random());    
 
    var buttonDiv = $("<button type=\"button\" class=\"btn btn-info button-defend\">Evade (" + defendPwr + " / " + counterPwr +") </button>");
    buttonDiv.css("display","block");
    buttonDiv.css("height","30%");
    buttonDiv.css("margin","2px");
    buttonDiv.css("width","100%");
    buttonDiv.val(defendPwr + ":" + counterPwr);
    buttonDiv.attr("id","defend-3");
    buttonDiv.attr("defense-name","Evade");
    buttonDiv.name = "Evade";
    buttonContainer.append(buttonDiv);
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
    $("#remainder-container").css("display","block");

    for (i = 0; i < jediArray.length; i++) {

        var card = $("#"+i);
        if (i === indx) {
            jediArray[i].status = "defender";
            $("#defender-card").append(card);
        }
        else if (jediArray[i].status === "ready") {
            $("#remainder-choices").append(card);
        }
    }
}

//
//  The attack will compare the (first) set of items in the list: the attack power verses the defense
//  power.   If attack power > defense, then the defender takes the damage.  If the defense
//  power is greater, then the routine compares the second set of items in the list: counter attack
//  power verses the counter defense power.  If the counter attack power is greater, the attacker takes
//  the damage.
//
//  When either Jedi's hit points fall below zero, they are 'out' of the game.
//
//  The attacker's power is reduced by the power that the attack took.   The defender's power is likewise
//  reduced by the amount of power that the defense took.
//
//  The attack/defend modes are checked to make sure that the Jedi has enough power to activate them, and
//  are disabled if the Jedi is 'too weak'.
//
//  Finally, at the end of the attack logic the Jedi 'regenerates' some strength - it is NOT available 
//  for caclulating which attacks/defences the Jedi can use for the next round, but will be available after
//  that.  
// 
function attackClick(evt) {
    var resultsDiv = $("#results-text");
    var attackValueStr = evt.target.value;
    var attackValueArray = attackValueStr.split(":");
    resultsDiv.append(evt.target.getAttribute("attack-name"));

    var defendChoice = Math.floor(3 * Math.random())+1;   // Number 1-3
    var defendButton = $("#defend-" + defendChoice);
    var defendValueStr = defendButton.val();
    var defendValueArray = defendValueStr.split(":");

    var attackPower = parseInt(attackValueArray[0]);
    var defensePower = parseInt(defendValueArray[0]);
    var delta = attackPower - defensePower;   

    if (delta > 0) {
        resultsDiv.append(" attack wins, defender loses " + delta + " hit points.");
        console.log($("#defender-card"));
    }
    else if (delta <= 0) {
        attackPower = parseInt(defendValueArray[1]);
        defensePower = parseInt(attackValueArray[1]);
        counterDelta = attackPower - defensePower;
        if (counterDelta > 0) {
            resultsDiv.append(" attack countered, attacker loses " + counterDelta + " hit points.");
        }
        else {
            resultsDiv.append(" attack countered, no loss of hitpoints.");
        }
    }

    resultsDiv.append("<br>");
}

$(document).ready(function() {

    for (i=0; i<jediArray.length; i++) {
        var jediCard1 = createJediCard(i,
                                    jediArray[i].name,
                                    jediArray[i].strength,
                                    jediArray[i].regen,
                                    jediArray[i].hp,
                                    jediArray[i].picture);
        $("#attacker-choices").append(jediCard1);
    }


    // Hide the results container until there's results...
    $("#results-container").css("display","none");
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

    var attackerId=0;
    var defenderId=0;

    $(".jedi-card").on("dblclick", function() {
        var jediIndex = parseInt(this.id);
        if (jediArray[jediIndex].status === "ready") {
            if (selectionMode === "attacker") {
                setAttacker(jediIndex);
                attackerId = jediIndex;
                selectionMode = "defender";
            }
            else if (selectionMode === "defender") {
                setDefender(jediIndex);
                defenderId = jediIndex;
                selectionMode = "combat";
                createAttackerButtons(attackerId);
                createDefenderButtons(defenderId);
                console.log("Display results container");
                $("#results-container").css("display","inline-block");             
            }
        }
    });
});
