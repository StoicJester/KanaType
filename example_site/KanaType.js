 /*	KanaType v1.0 - A JavaScript/jQuery program for converting Roman character typing into Japanese characters
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

//Modifiable Functions
KanaType.prototype.onSetup = function(){};
KanaType.prototype.onRun = function(){};
KanaType.prototype.keyCatch = function(event){
	if(event.which==47){ // '/'
		this.supressEvent(event);
		this.switchKana();
		return true;
	}
};
KanaType.prototype.printOut = function(kanaArray, userInput, romajiArray){};

//Not to be modified
KanaType.prototype.switchKana = function(){
	var t = this;
	t.isHiragana = !t.isHiragana;
};
KanaType.prototype.setup = function(){
	var t = this;
	t.onSetup();
	if(t.objSettings != undefined){
		for(var key in t.objSettings){
			t[key] = t.objSettings[key];
		}
	}
};
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
	$(t.input).keydown(function(event) {
		// console.log("down: "+event.charCode);
		if((event.charCode != 0)||(event.which == 8)){
			t.checkKeys(event);
		}
	});
};
KanaType.prototype.checkKeys = function(event){
	var t = this;
	if(!t.keyCatch(event)){
		t.parse(event);
	}
};
KanaType.prototype.parse = function(event){
	var t = this;
	if(event.which==8){ //backspace
		t.supressEvent(event);
		if(t.userInput.length == 0){
			var bks = t.deleteRecord.pop();
			for(var i=0;i<bks;i++){
				if(t.romajiArray.length>0){
					t.romajiArray.pop();
					t.kanaArray.pop();
				}
			}			
		}
		else{
			t.userInput = t.userInput.substring(0,t.userInput.length-1);
		}
		
	}else{
		t.supressEvent(event)
		
		var letter = String.fromCharCode(event.charCode);
		if(t.patternAccept.test(letter)){
			t.userInput += letter;
			if(t.patternVowel.test(letter) || t.patternSpecial.test(t.userInput)){
				t.convert(t.userInput);
			}
		}
	}
	t.printOut(t.kanaArray, t.userInput, t.romajiArray);
};

//Parse------------------------------------------------------------
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
KanaType.prototype.checkSpecialInput = function (input){
	var t = this;
	switch(input){
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
		case "zi":
			input = "ji";
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
KanaType.prototype.checkRomajiTable = function (input){
	var t = this;
	for(var i=0;i<t.romajiTable.length;i++){
		if(input==t.romajiTable[i][0]){
			return i;
		}
	}
	return -1;
};
KanaType.prototype.checkSmallCharactersTable = function(input){
	var t = this;
	for(var i=0;i<t.smallCharacters.length;i++){
		if(input==t.smallCharacters[i][0]){
			return i;
		}
	}
	return -1;
};
KanaType.prototype.checkKanaRegular = function(input){
	var t = this;
	var kana = (t.isHiragana)? 1 : 2;
	
	var location = t.checkRomajiTable(input);
	if(location != (-1)){
		t.romajiArray.push(input);
		t.kanaArray.push(t.romajiTable[location][kana]);
		t.deleteRecord.push(1);
		t.userInput = "";
		return true; 
	}
	return false;
};
KanaType.prototype.checkKanaSmall = function(input){
	var t = this;
	var kana = (t.isHiragana)? 1 : 2;
	
	var ch0 = input.charAt(0);
	var chRest = input.slice(1);
	
	if(ch0 != 'x'){ return false; }
	
	var location = t.checkSmallCharactersTable(chRest);
	if(location != (-1)){
		t.romajiArray.push(chRest);
		t.kanaArray.push(t.smallCharacters[location][kana]);
		t.deleteRecord.push(1);
		t.userInput = "";
		return true; 
	}
	return false;
};
KanaType.prototype.checkKanaDiagraph = function(input){
	var t = this;
	var kana = (t.isHiragana)? 1 : 2;
	
	var locations = t.parseDiagraph(input);
	if((locations[0] == -1)||(locations[1] == -1)){ return false; }
	t.romajiArray.push(input[0]);
	t.romajiArray.push(input.substr(1));
	t.kanaArray.push(t.romajiTable[locations[0]][kana]);
	t.kanaArray.push(t.smallCharacters[locations[1]][kana]);
	t.deleteRecord.push(2);
	t.userInput = "";
	return true;
};
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
	var y = input.indexOf("y");
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
KanaType.prototype.checkKanaDoubleConsonant = function(input){
	var t = this;
	var kana = (t.isHiragana)? 1 : 2;
	
	if(input[0]!=input[1]){ return false; }
	
	var hold, hold2;
	var firstC = input[0];
	var newInput = t.checkSpecialInput(input.substr(1));
	if(t.checkKanaRegular(newInput)){
		hold = t.romajiArray.pop();
		t.romajiArray.push(firstC);
		t.romajiArray.push(hold);
		
		hold = t.kanaArray.pop();
		t.kanaArray.push(t.smallCharacters[8][kana]);
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
		t.kanaArray.push(t.smallCharacters[8][kana]);
		t.kanaArray.push(hold);
		t.kanaArray.push(hold2);
		
		t.deleteRecord.pop();
		t.deleteRecord.push(3);
		
		return true;
	}
}
KanaType.prototype.checkKanaNPlus = function(input){
	var t = this;
	var kana = (t.isHiragana)? 1 : 2;
	
	if(input[0]!="n"){ return false; }
	
	var firstC = "nn";
	var newInput = t.checkSpecialInput(input.substr(1));
	if(t.checkKanaRegular(newInput)){
		hold = t.romajiArray.pop();
		t.romajiArray.push(firstC);
		t.romajiArray.push(hold);
		
		hold = t.kanaArray.pop();
		t.kanaArray.push(t.romajiTable[49][kana]);
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
		t.kanaArray.push(t.romajiTable[49][kana]);
		t.kanaArray.push(hold);
		t.kanaArray.push(hold2);
		
		t.deleteRecord.pop();
		t.deleteRecord.push(3);
		
		return true;
	}
}

//Other---------------------------------------------------------
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
KanaType.prototype.charTables_useUTF = function(){
	var t = this;
	t.romajiTable = new Array(
			new Array("a","あ","ア"),
			new Array("i","い","イ"),
			new Array("u","う","ウ"),
			new Array("e","え","エ"),
			new Array("o","お","オ"),
			new Array("ka","か","カ"),
			new Array("ki","き","キ"),
			new Array("ku","く","ク"),
			new Array("ke","け","ケ"),
			new Array("ko","こ","コ"),
			new Array("sa","さ","サ"),
			new Array("shi","し","シ"),//+
			new Array("si","し","シ"),//+
			new Array("su","す","ス"),
			new Array("se","せ","セ"),
			new Array("so","そ","ソ"),
			new Array("ta","た","タ"),
			new Array("ti","ち","チ"),//+
			new Array("chi","ち","チ"),//+
			new Array("tu","つ","ツ"),//+
			new Array("tsu","つ","ツ"),//+
			new Array("te","て","テ"),
			new Array("to","と","ト"),
			new Array("na","な","ナ"),
			new Array("ni","に","ニ"),
			new Array("nu","ぬ","ヌ"),
			new Array("ne","ね","ネ"),
			new Array("no","の","ノ"),
			new Array("ha","は","ハ"),
			new Array("hi","ひ","ヒ"),
			new Array("hu","ふ","フ"),//+
			new Array("fu","ふ","フ"),//+
			new Array("he","へ","ヘ"),
			new Array("ho","ほ","ホ"),
			new Array("ma","ま","マ"),
			new Array("mi","み","ミ"),
			new Array("mu","む","ム"),
			new Array("me","め","メ"),
			new Array("mo","も","モ"),
			new Array("ya","や","ヤ"),
			new Array("yu","ゆ","ユ"),
			new Array("yo","よ","ヨ"),
			new Array("ra","ら","ラ"),
			new Array("ri","り","リ"),
			new Array("ru","る","ル"),
			new Array("re","れ","レ"),
			new Array("ro","ろ","ロ"),
			new Array("wa","わ","ワ"),
			new Array("wo","を","ヲ"),
			new Array("nn","ん","ン"),
			new Array("ga","が","ガ"),
			new Array("gi","ぎ","ギ"),
			new Array("gu","ぐ","グ"),
			new Array("ge","げ","ゲ"),
			new Array("go","ご","ゴ"),
			new Array("da","だ","ダ"),
			new Array("di","ぢ","ヂ"),
			new Array("du","づ","ヅ"),
			new Array("de","で","デ"),
			new Array("do","ど","ド"),
			new Array("za","ざ","ザ"),
			new Array("ji","じ","ジ"),//+
			new Array("zi","じ","ジ"),//+
			new Array("zu","ず","ズ"),
			new Array("ze","ぜ","ゼ"),
			new Array("zo","ぞ","ゾ"),
			new Array("ba","ば","バ"),
			new Array("bi","び","ビ"),
			new Array("bu","ぶ","ブ"),
			new Array("be","べ","ベ"),
			new Array("bo","ぼ","ボ"),
			new Array("pa","ぱ","パ"),
			new Array("pi","ぴ","ピ"),
			new Array("pu","ぷ","プ"),
			new Array("pe","ぺ","ペ"),
			new Array("po","ぽ","ポ"),
			new Array("-","ー","ー"),
			new Array("vu","ヴ","ヴ")
	);
		
	t.smallCharacters = new Array(// small characters
		new Array("ya","ゃ","ャ"),
		new Array("yu","ゅ","ュ"),
		new Array("yo","ょ","ョ"),
		new Array("a","ぁ","ァ"),
		new Array("i","ぃ","ィ"),
		new Array("u","ぅ","ゥ"),
		new Array("e","ぇ","ェ"),
		new Array("o","ぉ","ォ"),
		new Array("tsu","っ","ッ")
	);
};