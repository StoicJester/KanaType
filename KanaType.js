 /*	KanaType v1.1.1 - A JavaScript/jQuery program for converting Roman character typing into Japanese characters
	Copyright (c) 2013 Brian Crucitti - bcrucitti(at)gmail.com

	Permission is hereby granted, free of charge, to any person obtaining a copy of 
	this software and associated documentation files (the "Software"), to deal in 
	the Software without restriction, including without limitation the rights to use,
	copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the 
	Software, and to permit persons to whom the Software is furnished to do so, 
	subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all 
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
	WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
* Kanatype Object
*	Takes a hash of settings to apply before init
*/
var KanaType = function(objSettings){
	this.objSettings = objSettings;
	//input element
	this.input = document;
	
	this.kanaArray = [];
	this.romajiArray = [];
	this.deleteRecord = [];
	this.userInput = "";
	
	this.patternAccept = /([a-z]|[A-Z]|[-])/;
	this.patternVowel = /[aeiou]/i;
	this.patternSpecial = /nn/i;
	
	this.isHiragana = true;
	
	this.smallCharacters;
	this.romajiTable;
	
	this.charTables_useUTF();
	this.run();
}

/**************************************************
* Modifiable Functions
*	functions that are ok to modify;
*	pass new functions in when initializing KanaType object
*/
/**
* Function that deals with what to do before initial settings are applied
*/
KanaType.prototype.onSetup = function(){};
/**
* Function that deals with what to do before running key catches
*/
KanaType.prototype.onRun = function(){};
/**
* Function that deals with what to do when a key is caught
*	receives keypress event
*	returning true stops the event from being passed forward
*/
KanaType.prototype.keyCatch = function(event){
	if(event.which==47){ // '/'
		this.supressEvent(event);
		this.switchKana();
		return true;
	}
};
/**
* Function that deals with what to do with output
*	function receives array of kana characters, 
*	 a String of the user input since the last conversion,
*	 and an array of user input converted to standard romaji (e.g. zi becomes ji)
*/
KanaType.prototype.printOut = function(kanaArray, userInput, romajiArray){};

/**************************************************
* Functions from here on should not be modified
* ...Unless you really want to. Don't blame me for the results though
*/
/**
* Function for switching output from hiragana to katakana and vis a vis
*/
KanaType.prototype.switchKana = function(){
	var t = this; //a habit of mine to maintain scope on 'this' in the function
	t.isHiragana = !t.isHiragana;
};
/**
* Function for applying developer input settings
*/
KanaType.prototype.setup = function(){
	var t = this;
	t.onSetup();
	if(t.objSettings != undefined){
		for(var key in t.objSettings){
			t[key] = t.objSettings[key];
		}
	}
};
/**
* Function that applies the event listeners
*/
KanaType.prototype.run = function(){
	var t = this;
	t.setup();
	t.onRun();
	$(t.input).keypress(function(event) {
		// console.log("press: "+event.which);
		if((event.charCode != 0)||(event.which == 8)){
			t.checkKeys(event);
		}
	});
	$(t.input).keydown(function(event) {//needed for FF backspace
		// console.log("down: "+event.charCode);
		if((event.charCode != 0)||(event.which == 8)){
			t.checkKeys(event);
		}
	});
};
/**
* Function called when a key is pressed, or down for FF
*/
KanaType.prototype.checkKeys = function(event){
	var t = this;
	if(!t.keyCatch(event)){
		t.parse(event);
	}
};
/**
* Function which determines how input is handled and delegates work
*/
KanaType.prototype.parse = function(event){
	var t = this;
	if(event.which==8){ //backspace
		t.supressEvent(event);
		if(t.userInput.length == 0){ //if there is only kana, no new user input since last conversion
			var bks = t.deleteRecord.pop();
			for(var i=0;i<bks;i++){
				if(t.romajiArray.length>0){
					t.romajiArray.pop();
					t.kanaArray.pop();
				}
			}			
		}
		else{ //erase new input rather than converted characters
			t.userInput = t.userInput.substring(0,t.userInput.length-1);
		}
		
	}else{
		t.supressEvent(event);
		
		var letter = String.fromCharCode(event.charCode); //get the letter from the charCode
		if(t.patternAccept.test(letter)){ //check to see if it is a letter we accept
			t.userInput += letter; //add it to the user input string
			if(t.patternVowel.test(letter) || t.patternSpecial.test(t.userInput)){ //check to see if the letter is a vowel or a special character we will accept
				t.convert(t.userInput); //attempt to convert it to kana
			}
		}
	}
	t.printOut(t.kanaArray, t.userInput, t.romajiArray); //call the printOut function
};

//Parsing Functions**********************************************************
/**
* Function to check user input against various cases of potential kana input
*/
KanaType.prototype.convert = function(input){
	var t = this;
	input = t.checkSpecialInput(input);
	if(t.checkKanaRegular(input)){ return true; }
	if(t.checkKanaSmall(input)){ return true; }
	if(t.checkKanaDiagraph(input)){ return true; }
	if(t.checkKanaDoubleConsonant(input)){ return true; }
	if(t.checkKanaNPlus(input)){ return true; }
	return false;
}
/**
* Function to convert common shorthand romaji spellings into full spellings
*/
KanaType.prototype.checkSpecialInput = function (inp){
	var t = this;
	var input = inp;
	switch(inp){
		case "si":
			input = "shi";
			break;
		case "ti":
			input = "chi";
			break;
		case "tu":
			input = "tsu";
			break;
		case "hu":
			input = "fu";
			break;
		case "ji":
			input = "zi";
			break;
		case "ja":
			input = "jya";
			break;
		case "ju":
			input = "jyu";
			break;
		case "jo":
			input = "jyo";
			break;
		case "sha":
			input = "shya";
			break;
		case "shu":
			input = "shyu";
			break;
		case "sho":
			input = "shyo";
			break;
		case "cha":
			input = "chya";
			break;
		case "chu":
			input = "chyu";
			break;
		case "cho":
			input = "chyo";
			break;
	}
	return input;
};
/**
* Function to find the user input in the basic kana set
*/
KanaType.prototype.checkRomajiTable = function (input){
	var t = this;
	for(var i=0;i<t.romajiTable.length;i++){
		if(input==t.romajiTable[i][0]){
			return i;
		}
	}
	return -1;
};
/**
* Function to find the user input in the set of small kana
*/
KanaType.prototype.checkSmallCharactersTable = function(input){
	var t = this;
	for(var i=0;i<t.smallCharacters.length;i++){
		if(input==t.smallCharacters[i][0]){
			return i;
		}
	}
	return -1;
};
/**
* Function to push the correct kana into the kanaArray, assuming it is in the set of normal kana
*/
KanaType.prototype.checkKanaRegular = function(input){
	var t = this;
	var kana = (t.isHiragana)? 1 : 2;
	
	var location = t.checkRomajiTable(input);
	if(location != (-1)){
		t.romajiArray.push(input);
		t.kanaArray.push(intToKana(t.romajiTable[location][kana]));
		t.deleteRecord.push(1);
		t.userInput = "";
		return true; 
	}
	return false;
};
/**
* Function to push the correct kana into the kanaArray, assuming it is in the set of small kana
*/
KanaType.prototype.checkKanaSmall = function(input){
	var t = this;
	var kana = (t.isHiragana)? 1 : 2;
	
	var ch0 = input.charAt(0);
	var chRest = input.slice(1);
	
	if(ch0 != 'x'){ return false; }
	
	var location = t.checkSmallCharactersTable(chRest);
	if(location != (-1)){
		t.romajiArray.push(chRest);
		t.kanaArray.push(intToKana(t.smallCharacters[location][kana]));
		t.deleteRecord.push(1);
		t.userInput = "";
		return true; 
	}
	return false;
};
/**
* Function to push the correct kana into the kanaArray, assuming it is input that converts to a digraph
* Note: A digraph is when you have two characters that make up one sound. For example, 'Jyo' or 'Jo' is made up of
*  a 'Ji' and a small 'Yo'character. Two characters, one sound.
*/
KanaType.prototype.checkKanaDiagraph = function(input){
	var t = this;
	var kana = (t.isHiragana)? 1 : 2;
	
	var locations = t.parseDiagraph(input);
	if((locations[0] == -1)||(locations[1] == -1)){ return false; }
	t.romajiArray.push(input[0]);
	t.romajiArray.push(input.substr(1));
	t.kanaArray.push(intToKana(t.romajiTable[locations[0]][kana]));
	t.kanaArray.push(intToKana(t.smallCharacters[locations[1]][kana]));
	t.deleteRecord.push(2);
	t.userInput = "";
	return true;
};
/**
* Function to parse a digraph into its component parts
*/
KanaType.prototype.parseDiagraph = function (input){
	var t = this;
	var locations = new Array(-1,-1);
	
	var ch0 = input.charAt(0);
	var rest = input.slice(1);
	
	// v(a/i/e/o) characters
	if(ch0 == "v"){
		locations[0] = 77;
		locations[1] = t.checkSmallCharactersTable(rest);
		if(locations[1] != -1){	return locations; }	
	}
	
	// Contains small ya/yu/yo
	var y = input.indexOf("y"); //get the location of a 'y' character in the input
	if(y!=(-1)){
		ch0 = input.substr(0,y)+"i";
		rest = input.slice(y);
	}
	locations[0] = t.checkRomajiTable(ch0);
	if(locations[0]!=(-1)){
		locations[1] = t.checkSmallCharactersTable(rest);
	}
	return locations;
};
/**
* Function to push the correct kana into the kanaArray, assuming the input starts with a double consonant
*/
KanaType.prototype.checkKanaDoubleConsonant = function(input){
	var t = this;
	var kana = (t.isHiragana)? 1 : 2;
	
	if(input[0]!=input[1]){ return false; } //check to see if the first two characters are the same
	
	var hold, hold2;
	var firstC = input[0];
	var newInput = t.checkSpecialInput(input.substr(1)); //check to see if the second part of the input is romaji shorthand
	//What follows is similar to the 'convert' function, but accounts for the double consonant situation
	if(t.checkKanaRegular(newInput)){
		hold = t.romajiArray.pop();
		t.romajiArray.push(firstC);
		t.romajiArray.push(hold);
		
		hold = t.kanaArray.pop();
		t.kanaArray.push(intToKana(t.smallCharacters[8][kana])); //push a small 'tsu'character
		t.kanaArray.push(hold);
		
		t.deleteRecord.pop(); //remove the normal delete record and replace it with a double delete situation
		t.deleteRecord.push(2);
		
		return true;
	}
	if(t.checkKanaDiagraph(newInput)){ 
		hold2 = t.romajiArray.pop();
		hold = t.romajiArray.pop();
		t.romajiArray.push(firstC);
		t.romajiArray.push(hold);
		t.romajiArray.push(hold2);
		
		hold2 = t.kanaArray.pop();
		hold = t.kanaArray.pop();
		t.kanaArray.push(intToKana(t.smallCharacters[8][kana])); //push a small 'tsu'character
		t.kanaArray.push(hold);
		t.kanaArray.push(hold2);
		
		t.deleteRecord.pop(); //remove the normal delete record and replace it with a triple delete situation
		t.deleteRecord.push(3);
		
		return true;
	}
}
/**
* Function to push the correct kana into the kanaArray, assuming the input starts with the character 'n' and than has more
* This function deals with the cases where a user will type "n[next character]", with the assumption that typing 'n' is enough
*  to convert to the appropriate kana, which it is.
*/
KanaType.prototype.checkKanaNPlus = function(input){
	var t = this;
	var kana = (t.isHiragana)? 1 : 2;
	
	if(input[0]!="n"){ return false; }
	
	var firstC = "nn";
	var newInput = t.checkSpecialInput(input.substr(1)); //check to see if the second part of the input is romaji shorthand
	//What follows is similar to the 'convert' function, but accounts for this specific situation
	if(t.checkKanaRegular(newInput)){
		hold = t.romajiArray.pop();
		t.romajiArray.push(firstC);
		t.romajiArray.push(hold);
		
		hold = t.kanaArray.pop();
		t.kanaArray.push(intToKana(t.romajiTable[70][kana]));
		t.kanaArray.push(hold);
		
		t.deleteRecord.pop();
		t.deleteRecord.push(2);
		
		return true;
	}
	if(t.checkKanaDiagraph(newInput)){ 
		hold2 = t.romajiArray.pop();
		hold = t.romajiArray.pop();
		t.romajiArray.push(firstC);
		t.romajiArray.push(hold);
		t.romajiArray.push(hold2);
		
		hold2 = t.kanaArray.pop();
		hold = t.kanaArray.pop();
		t.kanaArray.push(intToKana(t.romajiTable[70][kana]));
		t.kanaArray.push(hold);
		t.kanaArray.push(hold2);
		
		t.deleteRecord.pop();
		t.deleteRecord.push(3);
		
		return true;
	}
}

//Other---------------------------------------------------------
/**
* Function to prevent events from bubbling up to the browser
*/
KanaType.prototype.supressEvent = function(e){
	var flag = false;
	if (e.preventDefault){
		e.preventDefault();
		flag = true;
	}
	if (e.stopPropagation){
		e.stopPropagation();
		flag = true;
	}
	if(!flag){
		e.returnValue = false;
	}
}

//Character Tables--------------------------------------------------------
/**
* Function to create the kana conversion tables.
* Kana are maintained in this table as their specific charCode, because 
*  some text editors had trouble with them and would either corrupt the 
*  whole file on opening, or corrupt this table.
*/
KanaType.prototype.charTables_useUTF = function(){
	var t = this;
	t.romajiTable = new Array(
		new Array("a",12354,12450), 
		new Array("i",12356,12452), 
		new Array("u",12358,12454), 
		new Array("e",12360,12456), 
		new Array("o",12362,12458), 
		new Array("ka",12363,12459), 
		new Array("ki",12365,12461), 
		new Array("ku",12367,12463), 
		new Array("ke",12369,12465), 
		new Array("ko",12371,12467), 
		new Array("ga",12364,12460), 
		new Array("gi",12366,12462), 
		new Array("gu",12368,12464), 
		new Array("ge",12370,12466), 
		new Array("go",12372,12468), 
		new Array("sa",12373,12469), 
		new Array("shi",12375,12471), 
		new Array("su",12377,12473), 
		new Array("se",12379,12475), 
		new Array("so",12381,12477), 
		new Array("za",12374,12470), 
		new Array("zi",12376,12472), 
		new Array("zu",12378,12474), 
		new Array("ze",12380,12476), 
		new Array("zo",12382,12478), 
		new Array("ta",12383,12479), 
		new Array("chi",12385,12481), 
		new Array("tsu",12388,12484), 
		new Array("te",12390,12486), 
		new Array("to",12392,12488), 
		new Array("da",12384,12480), 
		new Array("di",12386,12482), 
		new Array("du",12389,12485), 
		new Array("de",12391,12487), 
		new Array("do",12393,12489), 
		new Array("na",12394,12490), 
		new Array("ni",12395,12491), 
		new Array("nu",12396,12492), 
		new Array("ne",12397,12493), 
		new Array("no",12398,12494), 
		new Array("ha",12399,12495), 
		new Array("hi",12402,12498), 
		new Array("hu",12405,12501), 
		new Array("he",12408,12504), 
		new Array("ho",12411,12507), 
		new Array("ba",12400,12496), 
		new Array("bi",12403,12499), 
		new Array("bu",12406,12502), 
		new Array("be",12409,12505), 
		new Array("bo",12412,12508), 
		new Array("pa",12401,12497), 
		new Array("pi",12404,12500), 
		new Array("pu",12407,12503), 
		new Array("pe",12410,12506), 
		new Array("po",12413,12509), 
		new Array("ma",12414,12510), 
		new Array("mi",12415,12511), 
		new Array("mu",12416,12512), 
		new Array("me",12417,12513), 
		new Array("mo",12418,12514), 
		new Array("ya",12420,12516), 
		new Array("yi",12421,12517), 
		new Array("yu",12422,12518), 
		new Array("ye",12423,12519), 
		new Array("yo",12424,12520), 
		new Array("ra",12425,12521), 
		new Array("ru",12427,12523), 
		new Array("ro",12429,12525), 
		new Array("wa",12431,12527), 
		new Array("wo",12434,12530), 
		new Array("nn",12435,12531), 
		new Array("-",12541,12540),
		new Array("vu",12436,12532)
	);

	t.smallCharacters = new Array(// small characters
		new Array("ya",12419,12515),
		new Array("yu",12421,12517),
		new Array("yo",12423,125159),
		new Array("a",12353,12449),
		new Array("i",12355,12451),
		new Array("u",12357,12453),
		new Array("e",12359,12455),
		new Array("o",12361,12457),
		new Array("tsu",12387,12483)
	);
};
/**
* Function to transform number into character
*/
function intToKana(val){
	return String.fromCharCode(val);
}
