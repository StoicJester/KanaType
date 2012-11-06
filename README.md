KanaType
========

A JavaScript/jQuery program for converting Roman character typing into Japanese characters.
Was connected to a web based game, so functionality is slowly being pulled from the game into this module.

All images are open source from Wikimedia Commons.

How to Use:
This program currently works best with keypress or keydown events.

First, declare if you will be using images [charTables_useImages()] or if you will be using
 unicode characters [charTables_useUTF()].
 
After that, whenever a key is pressed, add it to the variable userInput.
Check to see if the added letter is a vowel.
If it isn't do nothing.
If it is a vowel, call toKana();
The variable playerKana should have an additional item added to it which should be the kana form of what was in userInput.