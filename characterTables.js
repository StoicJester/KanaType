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
/*
	Currently in transition, adding functionality of using utf-8 characters.
	characterTables.js - Choose preference for using kana images or actual characters, currently defaults to using images
*/

var specialCharacters;
var romajiTable;

var charTables_useImages = function(){
	romajiTable = new Array(
			new Array("a","hiragana/hiragana_letter_a.png","katakana/katakana_letter_a.png"),
			new Array("i","hiragana/hiragana_letter_i.png","katakana/katakana_letter_i.png"),
			new Array("u","hiragana/hiragana_letter_u.png","katakana/katakana_letter_u.png"),
			new Array("e","hiragana/hiragana_letter_e.png","katakana/katakana_letter_e.png"),
			new Array("o","hiragana/hiragana_letter_o.png","katakana/katakana_letter_o.png"),
			new Array("ka","hiragana/hiragana_letter_ka.png","katakana/katakana_letter_ka.png"),
			new Array("ki","hiragana/hiragana_letter_ki.png","katakana/katakana_letter_ki.png"),
			new Array("ku","hiragana/hiragana_letter_ku.png","katakana/katakana_letter_ku.png"),
			new Array("ke","hiragana/hiragana_letter_ke.png","katakana/katakana_letter_ke.png"),
			new Array("ko","hiragana/hiragana_letter_ko.png","katakana/katakana_letter_ko.png"),
			new Array("sa","hiragana/hiragana_letter_sa.png","katakana/katakana_letter_sa.png"),
			new Array("shi","hiragana/hiragana_letter_si.png","katakana/katakana_letter_si.png"),//+
			new Array("si","hiragana/hiragana_letter_si.png","katakana/katakana_letter_si.png"),//+
			new Array("su","hiragana/hiragana_letter_su.png","katakana/katakana_letter_su.png"),
			new Array("se","hiragana/hiragana_letter_se.png","katakana/katakana_letter_se.png"),
			new Array("so","hiragana/hiragana_letter_so.png","katakana/katakana_letter_so.png"),
			new Array("ta","hiragana/hiragana_letter_ta.png","katakana/katakana_letter_ta.png"),
			new Array("ti","hiragana/hiragana_letter_ti.png","katakana/katakana_letter_ti.png"),//+
			new Array("chi","hiragana/hiragana_letter_ti.png","katakana/katakana_letter_ti.png"),//+
			new Array("tu","hiragana/hiragana_letter_tu.png","katakana/katakana_letter_tu.png"),//+
			new Array("tsu","hiragana/hiragana_letter_tu.png","katakana/katakana_letter_tu.png"),//+
			new Array("te","hiragana/hiragana_letter_te.png","katakana/katakana_letter_te.png"),
			new Array("to","hiragana/hiragana_letter_to.png","katakana/katakana_letter_to.png"),
			new Array("na","hiragana/hiragana_letter_na.png","katakana/katakana_letter_na.png"),
			new Array("ni","hiragana/hiragana_letter_ni.png","katakana/katakana_letter_ni.png"),
			new Array("nu","hiragana/hiragana_letter_nu.png","katakana/katakana_letter_nu.png"),
			new Array("ne","hiragana/hiragana_letter_ne.png","katakana/katakana_letter_ne.png"),
			new Array("no","hiragana/hiragana_letter_no.png","katakana/katakana_letter_no.png"),
			new Array("ha","hiragana/hiragana_letter_ha.png","katakana/katakana_letter_ha.png"),
			new Array("hi","hiragana/hiragana_letter_hi.png","katakana/katakana_letter_hi.png"),
			new Array("hu","hiragana/hiragana_letter_hu.png","katakana/katakana_letter_hu.png"),//+
			new Array("fu","hiragana/hiragana_letter_hu.png","katakana/katakana_letter_hu.png"),//+
			new Array("he","hiragana/hiragana_letter_he.png","katakana/katakana_letter_he.png"),
			new Array("ho","hiragana/hiragana_letter_ho.png","katakana/katakana_letter_ho.png"),
			new Array("ma","hiragana/hiragana_letter_ma.png","katakana/katakana_letter_ma.png"),
			new Array("mi","hiragana/hiragana_letter_mi.png","katakana/katakana_letter_mi.png"),
			new Array("mu","hiragana/hiragana_letter_mu.png","katakana/katakana_letter_mu.png"),
			new Array("me","hiragana/hiragana_letter_me.png","katakana/katakana_letter_me.png"),
			new Array("mo","hiragana/hiragana_letter_mo.png","katakana/katakana_letter_mo.png"),
			new Array("ya","hiragana/hiragana_letter_ya.png","katakana/katakana_letter_ya.png"),
			new Array("yu","hiragana/hiragana_letter_yu.png","katakana/katakana_letter_yu.png"),
			new Array("yo","hiragana/hiragana_letter_yo.png","katakana/katakana_letter_yo.png"),
			new Array("ra","hiragana/hiragana_letter_ra.png","katakana/katakana_letter_ra.png"),
			new Array("ri","hiragana/hiragana_letter_ri.png","katakana/katakana_letter_ri.png"),
			new Array("ru","hiragana/hiragana_letter_ru.png","katakana/katakana_letter_ru.png"),
			new Array("re","hiragana/hiragana_letter_re.png","katakana/katakana_letter_re.png"),
			new Array("ro","hiragana/hiragana_letter_ro.png","katakana/katakana_letter_ro.png"),
			new Array("wa","hiragana/hiragana_letter_wa.png","katakana/katakana_letter_wa.png"),
			new Array("wo","hiragana/hiragana_letter_wo.png","katakana/katakana_letter_wo.png"),
			new Array("nn","hiragana/hiragana_letter_n.png","katakana/katakana_letter_n.png"),
			new Array("ga","hiragana/hiragana_letter_ga.png","katakana/katakana_letter_ga.png"),
			new Array("gi","hiragana/hiragana_letter_gi.png","katakana/katakana_letter_gi.png"),
			new Array("gu","hiragana/hiragana_letter_gu.png","katakana/katakana_letter_gu.png"),
			new Array("ge","hiragana/hiragana_letter_ge.png","katakana/katakana_letter_ge.png"),
			new Array("go","hiragana/hiragana_letter_go.png","katakana/katakana_letter_go.png"),
			new Array("da","hiragana/hiragana_letter_da.png","katakana/katakana_letter_da.png"),
			new Array("di","hiragana/hiragana_letter_di.png","katakana/katakana_letter_di.png"),
			new Array("du","hiragana/hiragana_letter_du.png","katakana/katakana_letter_du.png"),
			new Array("de","hiragana/hiragana_letter_de.png","katakana/katakana_letter_de.png"),
			new Array("do","hiragana/hiragana_letter_do.png","katakana/katakana_letter_do.png"),
			new Array("za","hiragana/hiragana_letter_za.png","katakana/katakana_letter_za.png"),
			new Array("ji","hiragana/hiragana_letter_zi.png","katakana/katakana_letter_zi.png"),//+
			new Array("zi","hiragana/hiragana_letter_zi.png","katakana/katakana_letter_zi.png"),//+
			new Array("zu","hiragana/hiragana_letter_zu.png","katakana/katakana_letter_zu.png"),
			new Array("ze","hiragana/hiragana_letter_ze.png","katakana/katakana_letter_ze.png"),
			new Array("zo","hiragana/hiragana_letter_zo.png","katakana/katakana_letter_zo.png"),
			new Array("ba","hiragana/hiragana_letter_ba.png","katakana/katakana_letter_ba.png"),
			new Array("bi","hiragana/hiragana_letter_bi.png","katakana/katakana_letter_bi.png"),
			new Array("bu","hiragana/hiragana_letter_bu.png","katakana/katakana_letter_bu.png"),
			new Array("be","hiragana/hiragana_letter_be.png","katakana/katakana_letter_be.png"),
			new Array("bo","hiragana/hiragana_letter_bo.png","katakana/katakana_letter_bo.png"),
			new Array("pa","hiragana/hiragana_letter_pa.png","katakana/katakana_letter_pa.png"),
			new Array("pi","hiragana/hiragana_letter_pi.png","katakana/katakana_letter_pi.png"),
			new Array("pu","hiragana/hiragana_letter_pu.png","katakana/katakana_letter_pu.png"),
			new Array("pe","hiragana/hiragana_letter_pe.png","katakana/katakana_letter_pe.png"),
			new Array("po","hiragana/hiragana_letter_po.png","katakana/katakana_letter_po.png"),
			new Array("-","katakana/katakanahiragana_prolonged_sound_mark.png","katakana/katakanahiragana_prolonged_sound_mark.png"),
			new Array("vu","hiragana/hiragana_letter_vu.png","katakana/katakana_letter_vu.png")
	);
		
	specialCharacters = new Array(// small characters
		new Array("ya","hiragana/hiragana_letter_small_ya.png","katakana/katakana_letter_small_ya.png"),
		new Array("yu","hiragana/hiragana_letter_small_yu.png","katakana/katakana_letter_small_yu.png"),
		new Array("yo","hiragana/hiragana_letter_small_yo.png","katakana/katakana_letter_small_yo.png"),
		new Array("a","hiragana/hiragana_letter_small_a.png","katakana/katakana_letter_small_a.png"),
		new Array("i","hiragana/hiragana_letter_small_i.png","katakana/katakana_letter_small_i.png"),
		new Array("u","hiragana/hiragana_letter_small_u.png","katakana/katakana_letter_small_u.png"),
		new Array("e","hiragana/hiragana_letter_small_e.png","katakana/katakana_letter_small_e.png"),
		new Array("o","hiragana/hiragana_letter_small_o.png","katakana/katakana_letter_small_o.png"),
		new Array("tsu","hiragana/hiragana_letter_small_tu.png","katakana/katakana_letter_small_tu.png")
	);
};

var charTables_useUTF8 = function(){
	romajiTable = new Array(
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
		
	specialCharacters = new Array(// small characters
		new Array("ya","ゃ","ャ"),
		new Array("yu","ゅ","ュ"),
		new Array("yo","ょ","ョ"),
		new Array("a","ぁ","ァ"),
		new Array("i","ぃ","ィ"),
		new Array("u","ぅ","ゥ"),
		new Array("e","ぇ","ェ"),
		new Array("o","ぉ","ォ")
	);
};

charTables_useImages();