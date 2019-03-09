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
//  Click handler when an attack button is clicked.
//
function attackButtonClick(evt) {
    // Must have an attacker and defender.
    if (attackingJedi == null || defendingJedi == null) {
        return;
    }

    $("#attack-results").append(attackingJedi.name + " attacks " + defendingJedi.name + " for " + 
                              attackingJedi.attack + " hp.");

    defendingJedi.decreaseHitPoints(attackingJedi.attack);
    if (defendingJedi != null) {
        // The defending jedi must live through the attack to give a counter...
        attackingJedi.decreaseHitPoints(defendingJedi.counterAttack);
        $("#attack-results").append($("<br>"));
        $("#attack-results").append(defendingJedi.name + " counters " + attackingJedi.name + " for " + 
                                  defendingJedi.counterAttack + " hp.");
    }

    // It's possible that the game ended and the attacking jedi is null...
    if (attackingJedi != null) {        
        attackingJedi.increaseAttackStr();        
    }
    
    $("#attack-results").append($("<br>"));    
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

    //$("#results-container").css("display","none");
    $("#remainder-container").css("display","none");
    
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
    $("#remainder-choices").empty();
    $("#remainder-container").css("display","block");
    $("#remainder-choices").css("display","inline-flex");
 
    for (var i=0; i<jediArray.length; i++) {
        if (jediArray[i].status === "ready") {
            console.log("Append jedi card.");
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
  
    // The event is on the jedi card - use the card's id to access the jedi information in the
    // array.
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
            $("#attack-button").css("display","block");
            setDefenderSelectionMode();
            $("#attack-button").on("click",attackButtonClick);
        }
        else if (selectionMode === "defender") {
            // Selection mode sets this jedi as defender.
            $("#defender-card").empty();
            $("#defender-card").append(jediInfo.card);
            $("#defender-header").text("Defender:");
            $("#defender-selected").css("display","contents");   // When the game starts up, this is hidden.
            jediInfo.status = "defender";
            defendingJedi = jediInfo;

            // Move the other jedis to the stand by box.
            populateRemainingSelection();
            // Bring the results container back up.
            //$("#results-container").css("display","inline-block");
            selectionMode = "none";
            $("#attack-results").empty();
        }
    }
}

//
//  This function dynamically creates a bootstrap 'card' for the given jedi (information);
//
function createJediCard(jediId, jediName, jediImage, attack, counter, hp) {
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
    col2Div.append("<p class=\"card-text\">Attack <span id=\"attack"+ jediId + "\">"+ attack + "</span></p>");
    col2Div.append("<p class=\"card-text\">Counter <span id=\"counter"+ jediId + "\">"+ counter + "</span></p>");
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

        // Simple random stats, not a lot of 'balance' type gymnastics.
        // However, it seems good that the 'ideal' game allows a jedi to withstand
        // three attacks.
        //
        this.baseAttack = Math.floor(Math.random() * 5) + 5;  // Between 5-10 points.
        this.hp = Math.floor(Math.random() * 15) + 15;        // Between 15-30 points.  
        this.counterAttack =  Math.floor(Math.random() * 5) + 5;  // Same as attack.

        this.attack = this.baseAttack;  // Start off at base attack.

        // Dynamically create a bootstrap card for this jedi and store it (we'll use it a lot)
        this.card = createJediCard( jediId,
                                    this.name,
                                    this.picture,
                                    this.attack,
                                    this.counterAttack,
                                    this.hp);
        this.status = "ready";
    }

    //
    //   Method that decreases the jedi's hit points by the given amount.   Handles 
    //   removing the jedi from defend when they get 0 or less HP and ending the
    //   game if the attacker loses.
    //
    decreaseHitPoints(points) {
        this.hp -= points;
        if (this.hp <= 0) {
            var loseDiv = $("<h5>");
            loseDiv.text(this.name + " is defeated.");
            $("#attack-results").append(loseDiv);
            
            //$("#results-text").append($("<p>"));
            if (this.status === "defender") {
                this.status = "dead";
                $("#attack-results").append("Select another defender");
                setDefenderSelectionMode();   
            }
            else {
                alert("Attacker (" + this.name +") looses.  Game over.");
                attackingJedi = null;
                defendingJedi = null;
                this.status = "dead";                        
            }                   
        }
        else {
            $("#hp" + this.jediId).text(this.hp);
        }
    }

    increaseAttackStr() {
        this.attack += this.baseAttack;
        $("#attack" + this.jediId).text(this.attack);
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

    $("#attacker-choices").css("display","inline-flex");
    setAttackerSelectionMode();
 });