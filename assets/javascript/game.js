
var attackingJedi=null;
var defendingJedi=null;

var selectionMode="attacker";

function cardMouseEnter(evt) {
    this.style.backgroundColor = "white";
}

function cardMouseLeave(evt) {
    this.style.backgroundColor = "grey";
}

function populateAttackerSelection() {

}

function populateDefenderSelection() {

}

function populateRemainingSelection() {

}

function cardDoubleClick(evt) {
    
    if (this.status === "ready") {
        if (selectionMode === "attacker") {
            $("#attacker-card").empty();
            $("#attacker-card").append(this.card);
            this.status = "attacker";
            attackingJedi = this;
            if (defendingJedi == null) {
                populateDefenderSelection();
                selectionMode = "defender";
            }
            else {
                populateRemainingSelection();
                selectionMode = "none";
            }
        }
        else if (selectionMode === "defender") {
            $("#defender-card").empty();
            $("#defender-card").append(this.card);
            this.status = "defender";
            defendingJedi = this;
            if (attackingJedi == null) {
                populateAttackerSelection();
                selectionMode = "attacker";
            }
            else {
                populateRemainingSelection();
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
    newCard.on("dblclick",cardDoubleClick)
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
        var attackValue = Math.floor(this.strength * 0.6 + ((this.strength * 0.2) * Math.random()));
        this.attacks = [];
        this.attacks[0] = [];
        this.attacks[0][1] =  Math.floor(attackValue * 0.8);
        this.attacks[0][2] =  Math.floor(attackValue * 0.2);

        attackValue = Math.floor(this.strength * 0.4 + ((this.strength * 0.1) * Math.random()));
        this.attacks[1] = [];
        this.attacks[1][1] =  Math.floor(attackValue * 0.6);
        this.attacks[1][2] =  Math.floor(attackValue * 0.4);

        attackValue = Math.floor(this.strength * 0.4 + ((this.strength * 0.1) * Math.random()));
        this.attacks[2] = [];
        this.attacks[2][1] =  Math.floor(attackValue * 0.4);
        this.attacks[2][2] =  Math.floor(attackValue * 0.6);

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
    var jediArray = [];
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