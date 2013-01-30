KanaType v1.0
========
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

Description:

A JavaScript/jQuery program for converting QWERTY keyboard input into Japanese characters.

Commenting has fallen behind, next update should be filled to the brim with commenting.


Requirements:

Requires jQuery for communication with the DOM.  
   If you don't want to include jQuery, you can modify anywhere there is a '$' to instead do normal javascript.

  
  
Usage:

variable = new KanaType( [settings] );

settings
   <br/>Type: Object
   <br/>A set of key/value pairs that configure the KanaType object. All settings are optional.
   <ul>
   <li>input(default: <code>document</code>)
   <br/>Type: String
   <br/>The DOM element to take keypress and keydown events from.</li>
   
   <li>onSetup
   <br/>Type: Function()
   <br/>A callback function to run before the KanaType object has any changes applied from the 'settings' argument.</li>
   
   <li>onRun
   <br/>Type: Function()
   <br/>A callback function to run before the KanaType object begings watching keydown/keypress events.</li>
   
   <li>keyCatch(defalut: 
      <br/><code>function(event){
         if(event.which==47){ // '/'
            this.supressEvent(event);
            this.switchKana();
            return true;
         }
      };</code>)
   <br/>Type: Function(keyevent event)
   <br/>A callback function that is called after every keydown/keypress event but before the event is passed into the function for parsing events into kana.
   <br/>Returning true from this function will prevent the event from being passed into the parsing function.
   <br/>Calling <code>this.supressEvent(event)</code> will prevent the default browser level event related to that keypress/keydown.  For example, surpressing the 'backspace' event will prevent Chrome or Firefox from going back a page.</li>
   
   <li>printOut
   <br/>Type: Function(Array kanaArray, String userInput, Array romajiArray)
   <br/>A callback function that is called after every key event that enters the parsing stage, i.e. not stopped by <code>keyCatch</code> function.
   <br/><code>kanaArray</code> is an array of kana characters parsed from user input.
   <br/><code>userInput</code> is a String containing the current user input that has not formed a complete kana syllable.
   <br/><code>romajiArray</code> is an array containing a nearly 1-to-1 match of romaji input for the output kana.</li>
</ul>



Accessable Methods:
switchKana
Type: Function()
Changes the type of kana output between hiragana and katakana.




Example:
An example_site file should have been included with the download of KanaType
It should contain a very basic sample site that shows the functionality of KanaType.

<code><script type="text/javascript" >
$("document").ready(function(){

$("#inpt").focus();

kt = new KanaType({
   input:'#inpt',
   keyCatch : function(event){
      if(event.which==32){ //spacebar
         return true;
      }
      if(event.which==13){ //enter
         return true;
      }
      if(event.which==47){ // '/'
         this.switchKana();
         return true;
      }
   },
   printOut : function(kanaArray, userInput, romajiArray){
      var t = this;
      output = kanaArray.join("")+userInput;
      $(t.input).val(output);
   }
});

});
</script></code>



Questions, comments, suggestions, and requests can be directed to bcrucitti(at)gmail.com