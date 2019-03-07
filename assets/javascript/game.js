// A few global variables so all functions know what's going on...
var jediArray = [];
var attackingJedi=null;
var defendingJedi=null;

var selectionMode="attacker";

// Next two functions are event handlers - when a Jedi Card gets focus it's background changes.
function cardMouseEnter(evt) {
    this.style.backgroundColor = "white";
}

function cardMouseLeave(evt) {
    this.style.backgroundColor = "grey";
}

//
//  Click handler when an attack button is clicked.    This handler compares the
//  attack selected by the player against a random defense selected by the computer to determine
//  who takes damage, and how much.
//
function attackButtonClick(evt) {
    // If we are selecting either an attacker or defender - don't process any attack button clicks.
    if (selectionMode != "none") {
        return;
    }

    var attackIndex = parseInt(this.value);
    var defendIndex = Math.floor(3 * Math.random());
    var defendStr = defendingJedi.defends[defendIndex][0];
    if (defendStr > defendingJedi.strength) {
        defendStr = 0;
        for (var i=0; i < defendingJedi.defends.length; i++) {
            if (defendingJedi.defends[defendIndex][0] <= defendingJedi.strength) {
                defendStr = defendingJedi.defends[defendIndex][0];
                break;
            }
        }
    }

    // Both attacker and defender's strength is decreased by the primary mode (first value) of
    //  the chosen attack/defense.
    attackingJedi.decreaseStrength(attackingJedi.attacks[attackIndex][0]);
    defendingJedi.decreaseStrength(defendStr);

    var attackValue = attackingJedi.attacks[attackIndex][0] - defendStr;
    if (attackValue > 0) {
        $("#results-text").append("Attacker hits defender for " + attackValue + " hit points.");
        defendingJedi.decreaseHitPoints(attackValue);
        // A Jedi regains some strength (for the turn after the next) if they don't take damage this turn.
        attackingJedi.doRegen();
    }
    else if (attackValue < 0) {
        defendValue = defendingJedi.defends[defendIndex][1] - attackingJedi.attacks[attackIndex][1];
        if (defendValue > 0) {
            $("#results-text").append("Defender counters attacker for " + defendValue + " hit points.");
            attackingJedi.decreaseHitPoints(defendValue);
            defendingJedi.doRegen();
        }
        else {
            $("#results-text").append("Unsucessful attack and counter attack, no damage.");
            // A Jedi regains some strength (for the turn after the next) if they don't take damage this turn.
            attackingJedi.doRegen();
            defendingJedi.doRegen();
        }
    }
    else {
        $("#results-text").append("Even match, no damage.");
        attackingJedi.doRegen();
        defendingJedi.doRegen();
    }
    $("#results-text").append($("<br>"));    
}

//
//  This function creates the attack buttons.   It is designed so that it can be called 
//  more than once and create different attack values each time.   This can be used to 
//  randomize things even more...
//
function setAttackButtons(jediRec) {
    $("#attacker-buttons").empty();

    // Aggressive attack
    var attackValue = Math.floor(jediRec.strength * 0.6 + ((jediRec.strength * 0.2) * Math.random()));
    jediRec.attacks[0][0] =  Math.floor(attackValue * 0.8);
    jediRec.attacks[0][1] =  Math.floor(attackValue * 0.2);
    var button = $("<button type=\"button\" class=\"btn btn-danger button-attack\"  id=\"btn-attack-1\">");
    button.text("Lunge (" + jediRec.attacks[0][0] + "/" + jediRec.attacks[0][1]+")");
    button.val(0);
    button.on("click",attackButtonClick);
    $("#attacker-buttons").append(button);

    // Balanced attack
    attackValue = Math.floor(jediRec.strength * 0.4 + ((jediRec.strength * 0.1) * Math.random()));
    jediRec.attacks[1][0] =  Math.floor(attackValue * 0.6);
    jediRec.attacks[1][1] =  Math.floor(attackValue * 0.4);
    button = $("<button type=\"button\" class=\"btn btn-danger button-attack\"  id=\"btn-attack-2\">");
    button.text("Slash (" + jediRec.attacks[1][0] + "/" + jediRec.attacks[1][1]+")");
    button.val(1);
    button.on("click",attackButtonClick);
    $("#attacker-buttons").append(button);

    // Light attack
    attackValue = Math.floor(jediRec.strength * 0.4 + ((jediRec.strength * 0.1) * Math.random()));
    jediRec.attacks[2][0] =  Math.floor(attackValue * 0.4);
    jediRec.attacks[2][1] =  Math.floor(attackValue * 0.6);
    button = $("<button type=\"button\" class=\"btn btn-danger button-attack\"  id=\"btn-attack-3\">");
    button.text("Jab (" + jediRec.attacks[2][0] + "/" + jediRec.attacks[2][1]+")");
    button.val(2);
    button.on("click",attackButtonClick);
    $("#attacker-buttons").append(button);
    $("#attacker-buttons").css("display","inline-grid");
    $("#attacker-buttons").css("margin-bottom","1rem");
}

//
//   Similar function to the attack buttons - however no values are displayed on the buttons so that
//   it's a bit more mysterious to the player.  (And they can't choose attacks based on the possible
//   defense values.)
//
function setDefendButtons(jediRec) {
    $("#defender-buttons").empty();

    // Aggressive defense
    var attackValue = Math.floor(jediRec.strength * 0.6 + ((jediRec.strength * 0.2) * Math.random()));
    jediRec.defends[0][0] =  Math.floor(attackValue * 0.8);
    jediRec.defends[0][1] =  Math.floor(attackValue * 0.2);
    var button = $("<button type=\"button\" class=\"btn btn-info button-defend\"  id=\"btn-defend-1\">");
    button.text("Block (?/?)");
    $("#defender-buttons").append(button);

    // Balanced defense
    attackValue = Math.floor(jediRec.strength * 0.4 + ((jediRec.strength * 0.1) * Math.random()));
    jediRec.defends[1][0] =  Math.floor(attackValue * 0.6);
    jediRec.defends[1][1] =  Math.floor(attackValue * 0.4);
    button = $("<button type=\"button\" class=\"btn btn-info button-defend\"  id=\"btn-defend-2\">");
    button.text("Parry (?/?)");
    $("#defender-buttons").append(button);

    // Light defense
    attackValue = Math.floor(jediRec.strength * 0.4 + ((jediRec.strength * 0.1) * Math.random()));
    jediRec.defends[2][0] =  Math.floor(attackValue * 0.4);
    jediRec.defends[2][1] =  Math.floor(attackValue * 0.6);
    button = $("<button type=\"button\" class=\"btn btn-info button-defend\"  id=\"btn-defend-3\">");
    button.text("Evade (?/?))");
    $("#defender-buttons").append(button);

    $("#defender-buttons").css("display","inline-grid");
    $("#defender-buttons").css("margin-bottom","1rem");
}


//
//   Initiate the "Select Attacker" mode.   Will not affect defender section, but will 'hide'
//   the remainder section.
//
function setAttackerSelectionMode() {
    $("#attacker-card").empty();
    $("#attacker-buttons").empty();

    $("#attacker-choices").css("display","inline-flex");
    $("attacker-header").text("Select Attacker:");

    // Only 'ready' status jedis are eligible for selection.
    for (var i=0; i<jediArray.length; i++) {
        if (jediArray[i].status === "ready") {
             $("#attacker-choices").append(jediArray[i].card);
        }
    }

    // When cards are cleared off the page, they lose click handlers - so gotta put them back on.
    $(".jedi-card").on("mouseenter",cardMouseEnter);
    $(".jedi-card").on("mouseleave",cardMouseLeave);
    $(".jedi-card").on("dblclick",jediCardDoubleClick);

    attackingJedi = null;
    selectionMode = "attacker";
    $("#remainder-container").css("display","hidden");
}

//
//   Initiate the "Select Defender" mode.   Will not affect the attacker section, but will 'hide'
//   the remainder section.
//
function setDefenderSelectionMode() {
    $("#defender-card").empty();
    $("#defender-buttons").empty();

    $("#defender-container").css("display","block");
    $("#defender-choices").css("display","inline-flex");
    $("#defender-header").text("Select Defender:");
 
    for (var i=0; i<jediArray.length; i++) {
        if (jediArray[i].status === "ready") {
             $("#defender-choices").append(jediArray[i].card);
        }
    }

    // When cards are cleared off the page, they lose click handlers - so gotta put them back on.
    $(".jedi-card").on("mouseenter",cardMouseEnter);
    $(".jedi-card").on("mouseleave",cardMouseLeave);
    $(".jedi-card").on("dblclick",jediCardDoubleClick);

    defendingJedi = null;
    selectionMode = "defender";
    $("#remainder-container").css("display","hidden");
}

//
//  Puts remaining 'live' jedi in the standy-by area, and sets selection mode to 'none'.
//
function populateRemainingSelection() {
    $("#remainder-container").empty();
    $("#remainder-container").css("display","block");
    $("#remainder-choices").css("display","inline-flex");
 
    for (var i=0; i<jediArray.length; i++) {
        if (jediArray[i].status === "ready") {
             $("#remainder-choices").append(jediArray[i].card);
        }
    }
    selectionMode = "none";
    $("#defender-choices").empty();
    $("#attacker-choices").empty();
}

//
//  Double click event handler.   Uses the 'selectionmode' variable to determine which
//  was selected - attacking or defending jedi, then 'moves' the selection mode to the 
//  next state based on current selection mode and what jedis have been selected already.
//
function jediCardDoubleClick(evt) {
  
    var jediInfo = jediArray[parseInt(this.getAttribute("id"))];

    // Only jedis in a ready state can respond to the double click (and get selected).
    if (jediInfo.status === "ready") {
       
        if (selectionMode === "attacker") {
            //  Mode indicates that we set this jedi as the attacker.
            $("#attacker-card").empty();
            $("#attacker-card").append(jediInfo.card);
            $("#attacker-header").text("Attacker:");
            jediInfo.status = "attacker";
            attackingJedi = jediInfo;

            //  Now determine the 'next' selection mode.   If there is no defending jedi yet,
            //  then we move to 'select defender' mode.  If there is, then we were just replacing
            //  a fallen attacker - the rest of the jedi go to standby mode.
            if (defendingJedi == null) {
                setDefenderSelectionMode();
            }
            else {
                // Since we now have an attacker and defender, activate the attack/defend phase of game
                populateRemainingSelection();
                setAttackButtons(attackingJedi);
                setDefendButtons(defendingJedi);
                $("#results-container").css("display","inline-block");
                $("#results-text").empty();

                selectionMode = "none";
            }
        }
        else if (selectionMode === "defender") {
            // Selection mode sets this jedi as defender.
            $("#defender-card").empty();
            $("#defender-card").append(jediInfo.card);
            $("#defender-header").text("Defender:");
            $("#defender-selected").css("display","contents");   // When the game starts up, this is hidden.
            jediInfo.status = "defender";
            defendingJedi = jediInfo;

            // Next selection mode is set to attacker if there is no attacker (selected attacker == null)
            // or all remaining jedi are moved 'to the bench'.
            if (attackingJedi == null) {
                setAttackerSelectionMode();
            }
            else {
                // Since we now have an attacker and defender, activate the attack/defend phase of game
                populateRemainingSelection();
                setAttackButtons(attackingJedi);
                setDefendButtons(defendingJedi);
                $("#results-container").css("display","inline-block");
                $("#results-text").empty();

                selectionMode = "none";
            }
        }
    }
}

//
//  This function dynamically creates a bootstrap 'card' for the given jedi (information);
//
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
    col2Div.append("<p class=\"card-text\">Strength <span id=\"strength"+ jediId + "\">"+ strength + "</span></p>");
    col2Div.append("<p class=\"card-text\">Regen <span id=\"regen"+ jediId + "\">"+ regen + "</span></p>");
    col2Div.append("<p class=\"card-text\">Hp <span id=\"hp"+ jediId + "\">"+hp+"</span></p>");
    newCard.css("background-color","grey");
    return newCard;
}

//
//   This is the heart of the script: the Jedi class.   It stores the information about a jedi and
//   does a lot of work.
//
class Jedi {
    constructor (jediId, jediName, JediPicture) {
        this.jediId = jediId;
        this.name = jediName;
        this.picture = JediPicture;

        // Calculate somewhat random str, hp, and regen stats - but keep total in a tight range
        // so that no jedi is OP or UP.
        do {
            this.strength = Math.floor(Math.random() * 100) + 50;
            this.hp = Math.floor(Math.random() * 50) + 100;
            this.regen = Math.floor(Math.random() * 25) + 25;
        }  while (this.strength + this.hp + this.regen < 200 &&
                  this.strength + this.hp + this.regen > 300);

        this.baseStrength = this.strength;
        this.baseHp = this.hp;
        // Calculate the jedi's attack modes.
        
        this.attacks = [];
        this.attacks[0] = [];
        this.attacks[1] = [];
        this.attacks[2] = [];

        this.defends = [];
        this.defends[0] = [];
        this.defends[1] = [];
        this.defends[2] = [];

        // Dynamically create a bootstrap card for this jedi and store it (we'll use it a lot)
        this.card = createJediCard( jediId,
                                    this.name,
                                    this.picture,
                                    this.strength,
                                    this.regen,
                                    this.hp);
        this.status = "ready";
    }

    //
    //   Method that decreases the jedi's hit points by the given amount.   Handles 
    //   removing the jedi from attack/defend when they get 0 or less HP.
    //
    decreaseHitPoints(points) {
        this.hp -= points;
        if (this.hp <= 0) {
            var loseDiv = $("<h3>");
            loseDiv.text(this.name + " is defeated.");
            if (this.status === "defender") {
                this.status = "dead";
                setDefenderSelectionMode();
                attackingJedi.victory();   
            }
            else {
                attackingJedi = null;
                this.status = "dead";
                setAttackerSelectionMode();
                defendingJedi.victory();  
            }                   
        }
        else {
            $("#hp" + this.jediId).text(this.hp);
        }
    }

    //  If the jedi is the attacker..
    //  This method checks the attack values to see if the jedi has enough strength
    //  to use the attack, and disables any (buttons) that can't be used.
    attackButtonCheck() {
        if (this.status === "attacker") {
            var attackStr = 0;
            for (var i=0; i<this.attacks.length; i++) {
                attackStr = this.attacks[i][0];
                  if (attackStr > this.strength) {         
                    $("#btn-attack-"+i).attr("disabled","true");
                }
                else {
                    $("#btn-attack-"+i).removeAttr("disabled");
                }
            }
        }
    }

    //
    //  This method increases the jedi's strenght, up to their max, based on the regen rate.
    //
    doRegen() {
        this.strength += this.regen;
        if (this.strength > this.baseStrength) {
            this.strength = this.baseStrength;
        }
    }


    //  
    //  Method that decreases the jedi's strength and calls the check to see which 
    //   attacks the jedi has the strength to make.
    //  
    decreaseStrength(amount) {
        this.strength -= amount;
        if (this.strength < 0) {
            this.strength = 0;
        }

        $("#strength" + this.jediId).text(this.strength);
        this.attackButtonCheck();
    }

    victory() {
        // Increase base strength by a random amount. 1 - 25
        this.baseStrength + Math.floor(25 * Math.random()) + 1;

        this.strength = this.baseStrength;
        this.hp = this.baseHp;
    }
}


// Main function.   After the html loads, generate the jedi array and initite the attacker selection.
//  all the rest is event driven.
$(document).ready(function() {
    jediArray[0] = new Jedi(0, "Darth Vader", "./assets/images/darth_vader.jpg");
    jediArray[1] = new Jedi(1, "Count Dooku", "./assets/images/count_dooku.jfif");
    jediArray[2] = new Jedi(2, "Darth Maul", "./assets/images/darth_maul.jpg");
    jediArray[3] = new Jedi(3, "Luke Skywalker", "./assets/images/luke_skywalker.jpg");
    jediArray[4] = new Jedi(4, "Mace Windu", "./assets/images/mace_windu.png");
    jediArray[5] = new Jedi(5, "Obi Wan Kenobi", "./assets/images/obiwan_kenobi.jpg");
    
    //$("#attacker-choices").css("display","inline-flex");
    setAttackerSelectionMode();
 
    // for (var i=0; i<jediArray.length; i++) {
    //     if (jediArray[i].status === "ready") {
    //          $("#attacker-choices").append(jediArray[i].card);
    //     }        
    // }
    
});