 /*	KanaType v0.5 - A JavaScript/jQuery program for converting Roman character typing into Japanese characters
	Copyright (c) 2012 Brian Crucitti - bcrucitti@gmail.com	
	
	This file is part of KanaType.

    KanaType is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    KanaType is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with KanaType.  If not, see <http://www.gnu.org/licenses/>.
*/

var isHiragana = true;
var userInput = "";//direct user input
var playerKana = [];//list of kana input by the user
var playerword = [];//list of romanized kana input by the user
var deleteRecord = [];//used with images if a digraph is used
var currentLiteral = [];

var isVowel = function (lettercode) {
	switch(lettercode){
	case 97:
		return true;
	case 101:
		return true;
	case 105:
		return true;
	case 111:
		return true;
	case 117:
		return true;
	}
	return false;
};

var isVowelCharacter = function (letter) {
	switch(letter){
	case 97:
		return true;
	case 101:
		return true;
	case 105:
		return true;
	case 111:
		return true;
	case 117:
		return true;
	}
	return false;
};

var toKana = function (){
	isDigraph = false;
	var kana, res, di;
	checkStr();
	if(isHiragana){
		kana = 1;
	}else {
		kana = 2;
	}
	//case normal kana
	res = checkRomajiTable(userInput);
	if(res != -1){
		pushWord(userInput);
		playerKana.push(romajiTable[res][kana]);
		deleteRecord.push(1);
		userInput = "";
		return;
	}
	//case diagraph
	di = parseDiagraph(userInput);
	if(testDi(di)){
		isDigraph = true;
		playerword.push(userInput[0]);
		playerword.push(userInput.substr(1));
		if(di[0]!=(-1)){
			playerKana.push(romajiTable[di[0]][kana]);
		}
		if(di[1]!=(-1)){
			playerKana.push(specialCharacters[di[1]][kana]);
		}
		deleteRecord.push(2);
		userInput = "";
		return;
	}
	//case double consonant
	if(userInput[0]==userInput[1]){
		res = checkRomajiTable(userInput.substr(1))
		if(res != -1){
			pushWord(userInput[0]);
			pushWord(userInput.substr(1));
			playerKana.push(specialCharacters[8][kana]);
			playerKana.push(romajiTable[res][kana]);
			deleteRecord.push(2);
			userInput = "";
			return;
		}
		di = parseDiagraph(userInput.substr(1));
		if(testDi(di)){
			playerword.push(userInput[0]);
			playerword.push(userInput[1]);
			playerword.push(userInput.substr(2));
			playerKana.push(specialCharacters[8][kana]);
			if(di[0]!=(-1)){
				playerKana.push(romajiTable[di[0]][kana]);
			}
			if(di[1]!=(-1)){
				playerKana.push(specialCharacters[di[1]][kana]);
			}
			deleteRecord.push(3);
			userInput = "";
			return;
		}
	}
	//case "n" followed by more
	if(userInput[0]=="n"){
		res = checkRomajiTable(userInput.substr(1));
		if(res != -1){
			pushWord("nn");
			pushWord(userInput.substr(1));
			playerKana.push(romajiTable[49][kana]);
			playerKana.push(romajiTable[res][1]);
			deleteRecord.push(1);
			deleteRecord.push(1);
			userInput = "";
			return;
		}
		di = parseDiagraph(userInput.substr(1));
		if(testDi(di)){
			pushWord("nn");
			playerword.push(userInput[1]);
			playerword.push(userInput.substr(2));
			playerKana.push(romajiTable[49][kana]);
			if(di[0]!=(-1)){
				playerKana.push(romajiTable[di[0]][kana]);
			}
			if(di[1]!=(-1)){
				playerKana.push(specialCharacters[di[1]][kana]);
			}
			deleteRecord.push(1);
			deleteRecord.push(2);
			userInput = "";
			return;
		}
	}
};

var pushWord = function ($str){
	playerword.push($str);
	currentLiteral.push($str);
};

var checkRomajiTable = function (x){
	var i;
	for(i=0;i<romajiTable.length;i++){
		if(x==romajiTable[i][0]){
			return i;
		}
	}
	return -1;
};

var checkSpecialCharacters = function (x){
	var i;
	for(i=0;i<specialCharacters.length;i++){
		if(x==specialCharacters[i][0]){
			return i;
		}
	}
	return -1;
};

/* parseDiagraph(String x)
* x: potential diagraph string
*/
var parseDiagraph = function (x){
	var res1, res2;
	var res = new Array(-1,-1);
	var cZero = x.charAt(0);
	var rest = x.slice(1);
	if(cZero == "x"){// small characters
		res2 = checkSpecialCharacters(rest);
		if(res2 != -1){
			res = Array(-1, res2);
			currentLiteral.push(rest);
			return res;
		}	
	}
	if(cZero == "v"){// v(a/i/e/o) characters
		res1 = checkRomajiTable("vu");
		res2 = checkSpecialCharacters(rest);
		if(res2 != -1){
			res = Array(res1, res2);
			currentLiteral.push("vu");
			currentLiteral.push(rest);
			return res;
		}	
	}
	// Contains small ya/yu/yo
	switch(x){ // special cases
	case "ja":
		x = userInput = "jya";
		break;
	case "ju":
		x = userInput = "jyu";
		break;
	case "jo":
		x = userInput = "jyo";
		break;
	case "sha":
		x = userInput = "shya";
		break;
	case "shu":
		x = userInput = "shyu";
		break;
	case "sho":
		x = userInput = "shyo";
		break;
	case "cha":
		x = userInput = "chya";
		break;
	case "chu":
		x = userInput = "chyu";
		break;
	case "cho":
		x = userInput = "chyo";
		break;
	
	}
	var y = x.indexOf("y");
	if(y!=(-1)){
		cZero = x.substr(0,y)+"i";
		rest = x.slice(y);
	} else {
	
	}
	//$("#notice1").html(cZero);
	//$("#notice2").html(rest);
	res1 = checkRomajiTable(cZero);
	if(res1==(-1)){
	}else {
		res2 = checkSpecialCharacters(rest);
		if(res2 != -1){
			res = Array(res1, res2);
			currentLiteral.push(cZero);
			currentLiteral.push(rest);
			return res;
		}
	}
	return res;
};

var checkStr = function (){
	switch(userInput){
		case "si":
			userInput = "shi";
			break;
		case "ti":
			userInput = "chi";
			break;
		case "tu":
			userInput = "tsu";
			break;
		case "hu":
			userInput = "fu";
			break;
		case "zi":
			userInput = "ji";
			break;
	}
};

var testDi = function (di){
	if(di[0] == (-1)){
		if(di[1] == (-1)){
			return false;
		}else{
			return true;
		}
	}else if(di[1] == (-1)){
		return false;
	}else{
		return true;
	}
};

var arrayPeek = function (array){
	var len = array.length;
	if(len == 0)
		return 0;
	return array[len-1];
};