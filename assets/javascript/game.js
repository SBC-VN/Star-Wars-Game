
var jediArray = [];
var attackingJedi=null;
var defendingJedi=null;

var selectionMode="attacker";

function cardMouseEnter(evt) {
    this.style.backgroundColor = "white";
}

function cardMouseLeave(evt) {
    this.style.backgroundColor = "grey";
}

function setAttackButtons(jediRec) {
    $("#attacker-buttons").empty();

    // Aggressive attack
    var attackValue = Math.floor(jediRec.strength * 0.6 + ((jediRec.strength * 0.2) * Math.random()));
    jediRec.attacks[0][0] =  Math.floor(attackValue * 0.8);
    jediRec.attacks[0][1] =  Math.floor(attackValue * 0.2);
    var button = $("<button type=\"button\" class=\"btn btn-danger button-attack\"  id=\"btn-attack-1\">");
    button.text("Lunge (" + jediRec.attacks[0][0] + "/" + jediRec.attacks[0][1]+")");
    $("#attacker-buttons").append(button);

    // Balanced attack
    attackValue = Math.floor(this.strength * 0.4 + ((this.strength * 0.1) * Math.random()));
    jediRec.attacks[1][0] =  Math.floor(attackValue * 0.6);
    jediRec.attacks[1][1] =  Math.floor(attackValue * 0.4);
    button = $("<button type=\"button\" class=\"btn btn-danger button-attack\"  id=\"btn-attack-2\">");
    button.text("Slash (" + jediRec.attacks[1][0] + "/" + jediRec.attacks[1][1]+")");
    $("#attacker-buttons").append(button);

    // Light attack
    attackValue = Math.floor(this.strength * 0.4 + ((this.strength * 0.1) * Math.random()));
    jediRec.attacks[2][0] =  Math.floor(attackValue * 0.4);
    jediRec.attacks[2][1] =  Math.floor(attackValue * 0.6);
    button = $("<button type=\"button\" class=\"btn btn-danger button-attack\"  id=\"btn-attack-3\">");
    button.text("Jab (" + jediRec.attacks[2][0] + "/" + jediRec.attacks[2][1]+")");
    $("#attacker-buttons").append(button);
    $("#attacker-buttons").css("display","inline-grid");
    $("#attacker-buttons").css("margin-bottom","1rem");
}

function setDefendButtons(jediRec) {
    $("#defender-buttons").empty();

    // Aggressive defense
    var attackValue = Math.floor(jediRec.strength * 0.6 + ((jediRec.strength * 0.2) * Math.random()));
    jediRec.defends[0][0] =  Math.floor(attackValue * 0.8);
    jediRec.defends[0][1] =  Math.floor(attackValue * 0.2);
    var button = $("<button type=\"button\" class=\"btn btn-danger button-attack\"  id=\"btn-attack-1\">");
    button.text("Block (?/?)");
    $("#defender-buttons").append(button);

    // Balanced defense
    attackValue = Math.floor(this.strength * 0.4 + ((this.strength * 0.1) * Math.random()));
    jediRec.defends[1][0] =  Math.floor(attackValue * 0.6);
    jediRec.defends[1][1] =  Math.floor(attackValue * 0.4);
    button = $("<button type=\"button\" class=\"btn btn-danger button-attack\"  id=\"btn-attack-2\">");
    button.text("Parry (?/?)");
    $("#defender-buttons").append(button);

    // Light defense
    attackValue = Math.floor(this.strength * 0.4 + ((this.strength * 0.1) * Math.random()));
    jediRec.defends[2][0] =  Math.floor(attackValue * 0.4);
    jediRec.defends[2][1] =  Math.floor(attackValue * 0.6);
    button = $("<button type=\"button\" class=\"btn btn-danger button-attack\"  id=\"btn-attack-3\">");
    button.text("Evade (?/?))");
    $("#defender-buttons").append(button);
    $("#defender-buttons").css("display","inline-grid");
}

function populateAttackerSelection() {
    $("#attacker-choices").css("display","inline-flex");
 
    for (var i=0; i<jediArray.length; i++) {
        if (jediArray[i].status === "ready") {
             $("#attacker-choices").append(jediArray[i].card);
        }
    }
}

function populateDefenderSelection() {
    $("#defender-container").css("display","block");
    $("#defender-choices").css("display","inline-flex");
    $("#defender-selected").css("display","block");
 
    for (var i=0; i<jediArray.length; i++) {
        if (jediArray[i].status === "ready") {
             $("#defender-choices").append(jediArray[i].card);
        }
    }
}

function populateRemainingSelection() {
    $("#remainder-container").css("display","block");
    $("#remainder-choices").css("display","inline-flex");
 
    for (var i=0; i<jediArray.length; i++) {
        if (jediArray[i].status === "ready") {
             $("#remainder-choices").append(jediArray[i].card);
        }
    }
}

function jediCardDoubleClick(evt) {
  
    var jediInfo = jediArray[parseInt(this.getAttribute("id"))];

    if (jediInfo.status === "ready") {
        if (selectionMode === "attacker") {
            $("#attacker-card").empty();
            $("#attacker-card").append(jediInfo.card);
            $("#attacker-header").text("Attacker:");
            //$("#attacker-card-container").css("display","contents");
            //$("#attacker-choices").empty();
            jediInfo.status = "attacker";
            attackingJedi = jediInfo;
            if (defendingJedi == null) {
                populateDefenderSelection();
                selectionMode = "defender";
            }
            else {
                populateRemainingSelection();
                setAttackButtons(attackingJedi);
                setDefendButtons(defendingJedi);
                selectionMode = "none";
            }
        }
        else if (selectionMode === "defender") {
            $("#defender-card").empty();
            $("#defender-card").append(this.card);
            $("#defender-header").text("Attacker:");
            $("#defender-selected").css("display","contents");
            jediInfo.status = "defender";
            defendingJedi = jediInfo;
            if (attackingJedi == null) {
                populateAttackerSelection();
                selectionMode = "attacker";
            }
            else {
                populateRemainingSelection();
                setAttackButtons(attackingJedi);
                setDefendButtons(defendingJedi);
                selectionMode = "none";
            }
        }
    }
}

function createJediCard(jediId, jediName, jediImage,strength,regen,hp) {
    var newCard = $("<div class=\"card mb-3 jedi-card\" id=\"" + jediId + "\" style=\"max-width: 300px;\">");
    var rowDiv = $("<div class=\"row no-gutters\">");
    newCard.append(rowDiv);
    var col1Div = $("<div class=\"col-md-7\">");
    rowDiv.append(col1Div);
    col1Div.append($("<img src=\"" + jediImage + "\" class=\"card-img jedi-image\" alt=\""+ jediName + "\">"));
    var col2Div = $("<div class=\"col-md-5\">");
    rowDiv.append(col2Div);
    col2Div.css("padding-left","2px");
    col2Div.append("<h5 class=\"card-title\"> " + jediName + "</h5>");
    col2Div.append("<p class=\"card-text\">Strength <span class=\"strength\">"+ strength + "</span></p>");
    col2Div.append("<p class=\"card-text\">Regen <span class=\"regen\">"+ regen + "</span></p>");
    col2Div.append("<p class=\"card-text\">Hp <span class=\"hp\">"+hp+"</span></p>");
    newCard.css("background-color","grey");
    newCard.on("mouseenter",cardMouseEnter);
    newCard.on("mouseleave",cardMouseLeave)
    newCard.on("dblclick",jediCardDoubleClick)
    return newCard;
}


class Jedi {
    constructor (jediId, jediName, JediPicture) {
        this.name = jediName;
        this.picture = JediPicture;

        // Calculate somewhat random str, hp, and regen stats - but keep total in a tight range
        // so that no jedi is OP or UP.
        do
        {
            this.strength = Math.floor(Math.random() * 100) + 50;
            this.hp = Math.floor(Math.random() * 100) + 225;
            this.regen = Math.floor(Math.random() * 25) + 25;
        }  while (this.strength + this.hp + this.regen < 400 &&
                  this.strength + this.hp + this.regen > 475);

        // Calculate the jedi's attack modes.
        
        this.attacks = [];
        this.attacks[0] = [];
        this.attacks[1] = [];
        this.attacks[2] = [];

        this.defends = [];
        this.defends[0] = [];
        this.defends[1] = [];
        this.defends[2] = [];

        this.card = createJediCard( jediId,
                                    this.name,
                                    this.picture,
                                    this.strength,
                                    this.regen,
                                    this.hp);
        this.status = "ready";
    }
}

$(document).ready(function() {
    jediArray[0] = new Jedi(0, "Darth Vader", "./assets/images/darth_vader.jpg");
    jediArray[1] = new Jedi(1, "Count Dooku", "./assets/images/count_dooku.jfif");
    jediArray[2] = new Jedi(2, "Darth Maul", "./assets/images/darth_maul.jpg");
    jediArray[3] = new Jedi(3, "Luke Skywalker", "./assets/images/luke_skywalker.jpg");
    jediArray[4] = new Jedi(4, "Mace Windu", "./assets/images/mace_windu.png");
    jediArray[5] = new Jedi(5, "Obi Wan Kenobi", "./assets/images/obiwan_kenobi.jpg");

    $("#attacker-choices").css("display","inline-flex");
 
    for (var i=0; i<jediArray.length; i++) {
        if (jediArray[i].status === "ready") {
             $("#attacker-choices").append(jediArray[i].card);
        }
    }
    
});