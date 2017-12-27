//When document loads..................................................

$(document).ready(function () {

	//$("#passbutton").hide(); 
	$(".turn").toggle();

	
	    $("#submitbutton").click(function(){

	    	var enteredname = document.getElementsByName('firstname')[0].value;

	    	if(enteredname == ""){
	    		alert("please enter your name");

	    	}else{//once name has been entered

	    	$("#username").html(enteredname);
	        $("#nameentryform").hide();

	        $("#ongoing").html("Hello, "+ enteredname + "! Your cards have been dealt. Please select 3 cards to pass.");


			 	var north = new ClickPlayer(enteredname);
			    var east = new DumbAI("Bob");
			    var south = new DumbAI("Carol");
			    var west = new DumbAI("David");
			 	var match = new HeartsMatch(north, east, south, west);

			    match.run();
			}		
	     
	    });

			 	
});


//Click Player object........................................................


var ClickPlayer = function (name) {

	var match = null;
    var position = null;
    var player_key = null;
    var current_game = null;

    var pointTotal = 0;
    var countHeartsGames = -1;



    var pass = [];
    var cardsDealtGlobal=[];
    //var typeOfPass =null;



//Updates interface with the current cards in the user's hand
    var updateHand = function(){

    	var cardsInHand = current_game.getHand(player_key).getUnplayedCards(player_key);
    	var canPlay = current_game.getHand(player_key).getPlayableCards(player_key);

    	$(".usercards").replaceWith("<tr class ='usercards'></tr>");

    		var i=0;
		cardsInHand.forEach(function(c){

			//reset the table row and append new divs then change the color instead of replacing only the first ones

			
			if(jQuery.inArray(c,canPlay)>-1){
				$(".usercards").append("<td id="+"uc"+String(i)+">"+c+"</td>");
				//$("#uc"+String(i)).replaceWith("<td id="+"uc"+String(i)+">"+c+"</td>");
				$("#uc"+String(i)).css("background-color", "pink");
				var carddiv = $("#uc"+String(i));
				//add some sort of click functionality to it
				$(carddiv).click(function(){
					var wasPlayed = current_game.playCard(c,player_key);
					

					if(wasPlayed){
						$(".identifiers").append("<td>"+name+"</td>");
						//idleHand();
						updateHand();
						//$(carddiv).hide();
					}

				});

			}else{
				$(".usercards").append("<td id="+"uc"+String(i)+">"+c+"</td>");
				//$("#uc"+String(i)).replaceWith("<td id="+"uc"+String(i)+">"+c+"</td>");

			}

			i++;

		});

    }

    var idleHand = function(){

    	$(".usercards").replaceWith("<tr class ='usercards'></tr>");

    	var cardsInHand = current_game.getHand(player_key).getUnplayedCards(player_key)

    	var i=0;
		cardsInHand.forEach(function(c){
			$(".usercards").append("<td id="+"uc"+String(i)+">"+c+"</td>");
			i++;
		});



    }
//************************************************************


    this.getCards = function(){
    	return cardsDealtGlobal;
    }

	this.getName = function () {
		return name;
	}

    this.setupMatch = function (hearts_match, pos) {
	match = hearts_match;
	position = pos;
    }


    this.setupNextGame = function (game_of_hearts, pkey) {
    	current_game = game_of_hearts;
    	player_key = pkey;

    	current_game.registerEventHandler(Hearts.GAME_STARTED_EVENT, function (e) {

    		var typeOfPass = e.getPassType();

    		$(".usercards").replaceWith("<tr class='usercards'></tr>");

		    	//alert("key " + player_key);
		    		
		    	var cardsDealt = current_game.getHand(player_key).getDealtCards(player_key);
		    	//cardsDealtGlobal=cardsDealt;
		    	//console.log(getCards());


		    	//for(i=0;i<13;i++){ //in essence is this
		    	var i=0;
		    	cardsDealt.forEach(function(c){
		    		

		    		$(".usercards").append("<td id="+"uc"+String(i)+">"+c+"</td>");
		    		var carddiv = $("#uc"+String(i));
		    	
		    		$(carddiv).click(function(){

		    			if(jQuery.inArray(c,pass)>-1){

		    				alert("already selected");

		    			}else if(pass.length < 3){
		    				pass.push(c);
		    				$(this).css("background-color", "yellow");

		    				if(pass.length ==3){
			    				//console.log("Pass button appears");
			    				//$("#passbutton").toggle();
			    				//$("#passbutton").html("pass of type: "+ typeOfPass);
		    					updateHand();

		    				}

		    			}else{
		    				alert("ready to pass cards");

		    			}



		    			if(pass.length == 3){

		    			if(current_game.passCards(pass,player_key)){
		    			

		    			//Clear pass array

		    			pass = [];

			    		}else{
			    			alert("passing NOT successful");
			    		}


		    			}



		    		});

		    		i++;
		    	
		    	});



		});



		current_game.registerEventHandler(Hearts.TRICK_START_EVENT, function (e) {

			


			var startposition = e.getStartPos();


			if(startposition == position){

				$("p#ongoing").html("It is your turn to begin the trick. Please select a card to play.<br>(The highlighted cards may be played)</br>");

				$("#northturn").show();
				//alert that it is user's turn

				updateHand(); //visually shows cards in hand and highlights playable
			

			}else{
				$("p#ongoing").html(name + ", please wait as your opponents make their moves");
			}

		});

		current_game.registerEventHandler(Hearts.TRICK_CONTINUE_EVENT, function (e) {

			var nextposition = e.getNextPos();
			//alert("TRICK_CONTINUE " + nextposition);

			if(nextposition == position){
				$("p#ongoing").html("It is your turn! Please select a card to play.<br>(The highlighted cards may be played)</br>");

				$("#northturn").show();
				//alert that it is user's turn
				//alert(current_game.getHand(player_key).getUnplayedCards(player_key));

				updateHand(); //visually shows cards in hand and highlights the playable cards
				

				//When user clicks one of the playable cards, play using current_game.playCard();

			}else{
				$("p#ongoing").html(name + ", please wait as your opponents make their moves");
			}
			
		});

		current_game.registerEventHandler(Hearts.TRICK_COMPLETE_EVENT, function (e) {

			//getTrick() --> returns completed trick
			//updates scores


			setTimeout(function () {

				$(".centerBoard").replaceWith("<tr class='centerBoard'></tr>");
				$(".identifiers").replaceWith("<tr class='identifiers'></tr>");

				var pointsInTrick = e.getTrick().getPoints();

				var winnerOfTrick = e.getTrick().getWinner();

				//var winnerName = winnerOfTrick.getName();
				var outputName="example";

				if(winnerOfTrick == "North"){
					outputName="You";
				}else if(winnerOfTrick == "South"){
					outputName="Carol";
				}else if(winnerOfTrick == "East"){
					outputName="Bob";
				}else if(winnerOfTrick == "West"){
					outputName="David";
				}

				
				

					//********************
				$("box#boxy").html(outputName+ " won the most recent trick.");
					//********************

				

				if(winnerOfTrick == position){
					pointTotal = pointTotal + pointsInTrick;

				}


				$("#userscore").html("Score: "+pointTotal);

				//$("#userscore").html("Score: "+current_game.getScore(position));
				

			},1000);

		});

		current_game.registerEventHandler(Hearts.CARD_PLAYED_EVENT, function (e) {
			//Returns card that was played

			//Places card in center board

			var cardPlayed = e.getCard();

			$(".centerBoard").append("<td>"+cardPlayed+"</td>");
			// $(".identifiers").append("<td>"+name+"</td>");

			//$(".usercards").append("<td id="+"uc"+String(i)+">"+c+"</td>");

			//alert(e.getCard());
			$(".turn").hide();


		});

		current_game.registerEventHandler(Hearts.GAME_OVER_EVENT, function (e) {

			pointTotal = current_game.getScore(position);

			$("#userscore").html("Score: "+pointTotal);

			var count = countHeartsGames + 1;

			$("#ongoing").html("You have finished "+count+" game of hearts. Please wait as you are dealt another hand.");

		});

		current_game.registerEventHandler(Hearts.GAME_STARTED_EVENT,function (e){
			countHeartsGames++;

			if(countHeartsGames>0){
				$("#ongoing").html("You have finished "+countHeartsGames+" game of hearts. Another game is about to start. </br>You have been dealt another hand. Please select 3 cards to pass to your opponent.");
				
			}

		});

    }


}