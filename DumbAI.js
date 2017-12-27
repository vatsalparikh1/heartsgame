var DumbAI = function (name) {

    var match = null;
    var position = null;
    var current_game = null;
    var player_key = null;

    var pointTotal = 0;

    this.setupMatch = function (hearts_match, pos) {
	match = hearts_match;
	position = pos;
    }

    this.getName = function () {
	return name;
    }

    this.setupNextGame = function (game_of_hearts, pkey) {
	current_game = game_of_hearts; //GameOfHearts object
	player_key = pkey;

	current_game.registerEventHandler(Hearts.GAME_STARTED_EVENT, function (e) {

		setTimeout(function () {

		    if (e.getPassType() != Hearts.PASS_NONE) {
			var cards = current_game.getHand(player_key).getDealtCards(player_key);
			
			console.log(position+" passed: "+cards.splice(0,3));

			current_game.passCards(cards.splice(0,3), player_key);

		    }
		},1000);
	});

	var startTrick = current_game.registerEventHandler(Hearts.TRICK_START_EVENT, function (e) {

		var cardsInHand = current_game.getHand(player_key).getUnplayedCards(player_key);

		$(".ai"+String(name)).replaceWith("<td class=ai"+name+"></td>");

		var i=0;
		cardsInHand.forEach(function(c){
		// $(".ai"+String(name)).append("<td id="+name+"Card"+String(i)+">"+c+"</td>");
		$(".ai"+String(name)).append("<td class='oppCards' id="+name+"Card"+String(i)+"></td>");


		i++;
		});

		
		    if (e.getStartPos() == position) {

		    	$("#"+name+"turn").toggle();

			    setTimeout(function () {
					var playable_cards = current_game.getHand(player_key).getPlayableCards(player_key);
					current_game.playCard(playable_cards[0], player_key);
					$(".identifiers").append("<td>"+name+"</td>");
				//$("#"+name+"turn").hide();
				},1000);
		    }

		 

	});

	var continueTrick = current_game.registerEventHandler(Hearts.TRICK_CONTINUE_EVENT, function (e) {

		var cardsInHand = current_game.getHand(player_key).getUnplayedCards(player_key);


		$(".ai"+String(name)).replaceWith("<td class=ai"+name+"></td>");


		var i=0;
		cardsInHand.forEach(function(c){
		// $(".ai"+String(name)).append("<td id="+name+"Card"+String(i)+">"+c+"</td>");
		$(".ai"+String(name)).append("<td class='oppCards' id="+name+"Card"+String(i)+"></td>");


		i++;
		});

		    if (e.getNextPos() == position) {

		    	$("#"+name+"turn").toggle();

			    setTimeout(function () {
					var playable_cards = current_game.getHand(player_key).getPlayableCards(player_key);
					current_game.playCard(playable_cards[0], player_key);
					$(".identifiers").append("<td>"+name+"</td>");
				},1000);
				
				// $("#"+name+"turn").toggle();
		    }

		

	});



	var completeTrick = current_game.registerEventHandler(Hearts.TRICK_COMPLETE_EVENT, function (e) {


		var pointsInTrick = e.getTrick().getPoints();
		var winnerOfTrick = e.getTrick().getWinner();

		if(winnerOfTrick == position){
			pointTotal = pointTotal + pointsInTrick;

		}

		$("#"+name+"score").html("Score: "+pointTotal);

		

	});



	var completeTrick = current_game.registerEventHandler(Hearts.GAME_OVER_EVENT, function (e) {

		pointTotal = current_game.getScore(position);

		$("#"+name+"score").html("Score: "+pointTotal);

		$("#ai"+name).replaceWith("<tr class='ai"+name+"'></tr>");

		


	});


    }
}

