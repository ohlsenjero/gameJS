
var canvasBg = document.getElementById("canvasBg"),
	ctxBg = canvasBg.getContext("2d"),
	canvasBgTop = document.getElementById("canvasBgTop"),
	ctxBgTop = canvasBgTop.getContext("2d"),
	canvasPlayer = document.getElementById("canvasPlayer"),
	ctxPlayer = canvasPlayer.getContext("2d"),
	canvasBullets = document.getElementById("canvasBullets"),
	ctxBullets = canvasBullets.getContext("2d"),
	canvasOverlay = document.getElementById("canvasOverlay"),
	ctxOverlay = canvasOverlay.getContext("2d"),
	canvasEntities = document.getElementById("canvasEntities"),
	ctxEntities = canvasEntities.getContext("2d"),
	canvasPause = document.getElementById("canvasPause"),
	ctxPause = canvasPause.getContext("2d"),
	canvasMenu = document.getElementById("canvasMenu"),
	ctxMenu = canvasMenu.getContext("2d"),
	canvasMenuOver = document.getElementById("canvasMenuOver"),
	ctxMenuOver = canvasMenuOver.getContext("2d"),
	canvasMenuOver = document.getElementById("canvasMenuOverOver"),
	ctxMenuOverOver = canvasMenuOverOver.getContext("2d"),
	canvasMapOverMenu = document.getElementById("canvasMapOverMenu"),
	ctxMapOverMenu = canvasMapOverMenu.getContext("2d"),

	canvasOverOverlay = document.getElementById("canvasOverOverlay"),
	ctxOverOverlay = canvasOverOverlay.getContext("2d");




var blockInput = false;


///// esto aca arriba HA de ser reducido
var daMenu = new menu(itemSprite, 700, 600, canvasBg.width, canvasBg.heigth, 0, 0);/// doesnt need any of this params
var dashCount=0;
var dash=false;

var menuBorder = new Image();
	menuBorder.src = "images/menuhighlight2.png";

var weaponS = new Image();
	weaponS.src = "images/weaponsprites.png";

var menuHeight =100;

var playerFirstX=0;
var playerFirstY=0;

var playerShiftY =0;

var opening = false;

var rReleased=false;

var superLastKey=null;

//  G L O B A L   V A R S 

var slowDown;
var slowDownDirection;

var mapObsL1;

var mapObsL2;

var canvasWidth = 0;
var canvasHeight = 0;


var shiftX=0;
var shiftY=0;


var keysPressed = []; 
var latestKeys = []; 

var keyDown={isDown:false, whatKey:null};




var imgBullets = new Image();
	imgBullets.src = "images/bullets.png";    //////   HERO.PNG


var imgPlayer = new Image();
	imgPlayer.src = "images/hero.png";    //////   HERO.PNG


var itemSprite = new Image();
	itemSprite.src = "images/sprite2.png";
	
var imgSpriteTile0 = new Image();
	imgSpriteTile0.src = "images/spritesBg.png";

var menuSprite = new Image();
	menuSprite.src = "images/sprite3.png";

var edge = new Image();
	edge.src = "images/edge.png";


var tileDiameter; 

if(window.innerWidth>1000){
	tileDiameter = 48;  // window.innerWidth/40; || 30;     >>>> cambiar segun tamanho de pantalla
}else{
	tileDiameter = 48; /// this has to change also the player size and EVERYTHING>>>>>>............
}

var obstacles = [];
var areas= [];



var animScroll=35;
///
// AREA SCROLL
// PAUSE SCROLL
var animCount = 0;


///  PLAYER COORDINATES
var currentRoom;
var currentArea;

var currentSubArea;

var currentLevel;

var nextRoom;


// DOORS
var doorID;   

var doorOpening = [];
var doorsOpened = [];
var doorClosing = [];

var inActive = [];

var blockedDoorIndex =[];

var inDoorCrash={crash:false, id:0};

var  inArea={inIt:false, whatArea:currentArea};



var    isPlaying = false;



var    requestAnimFrame =  window.requestAnimationFrame ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame ||
						window.oRequestAnimationFrame ||
						window.msRequestAnimationFrame ||

						function(callback) {
							window.setTimeout(callback, 1000 / 1);
						};

// window.cancelAnimFrame = (function () {
//     return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || function (callback) {
//         window.clearTimeout(callback);
//     };
// })();

var paused = false;

var pauseType="gamePause";
var pausedRoomChangeLoop=false;
var pauseCount= 0;



var players=[];
var playerChosen;


var playerTypes = new Array();
///// what controller triggered the playerCreation
	playerTypes[0] = "warrior"; 
///////  what value was in what that controller pressed
	playerTypes[1] = "warlock";

players = [1,2];

var items = [];

var itemSelectPressed=false;
var itemSelectPressedCounter=0;


var menuCursor="nada";

var menuTrack=1;
var itemRow=0;
var gunRow=0;

var menuAnimCount=0;
 

var bullets = [50,0,0,0,0,0,0,0,0,0];  //// each weapon in its corresponding index






var bulletsFired = []; /// = active bullets





















var firsty =false;

function whatRoomMap(map){
/// 010, 020 translte to 1, 2 before they can be turned to strings
///        and using them as strings here makes the map less readable >>> 000 ommited

	if(map=="room-1"){
		return  [222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,101,350,100,150,150,100,100,100,100,502,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,222,100,100,227,100,100,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 503,100,227,227,100,222,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,227,222,222,222,100,100,100,100,100,100,227,227,100,100,222,100,222,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,222,222,100,100,100,227,227,100,100,100,227,227,227,227,100,100,100,227,227,227,227,227,227,227,227,227,227,227,227,
				 100,100,100,100,227,100,222,227,100,100,100,222,222,222,222,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,222,214,227,100,222,222,100,100,100,236,236,236,100,108,100,100,222,227,100,222,100,222,222,227,100,222,100,222,
				 100,100,222,214,222,708,218,222,100,100,100,227,227,227,450,450,100,100,227,222,227,222,227,222,227,222,227,222,227,222,
				 100,100,500,222,222,708,709,222,100,100,100,227,227,227,450,450,227,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,500,500,222,708,708,110,100,100,100,400,668,227,710,218,218,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,222,222,222,100,100,100,100,400,710,401,710,218,218,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,100,100,100,100,100,100,227,710,222,714,714,402,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,100,100,100,227,100,100,222,222,222,301,301,222,100,227,227,227,227,227,227,227,227,227,227,227,227,
				 100,100,100,100,120,120,120,100,222,227,100,222,222,222,301,301,222,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,100,100,120,130,120,120,222,222,100,222,222,222,301,301,222,100,100,222,100,222,100,222,100,222,100,222,100,222,
				 100,100,100,100,120,130,130,120,100,100,100,100,222,222,100,100,100,100,227,222,227,222,227,222,227,222,227,222,227,222,
				 100,100,100,100,120,130,130,120,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222, 
				 100,100,100,105,105,130,130,120,227,100,100,222,222,222,720,222,101,100,227,227,227,227,227,227,227,227,227,227,227,227,
				 100,100,100,105,105,130,214,130,222,227,100,222,222,222,720,222,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,100,100,105,105,214,130,100,222,222,222,222,222,100,224,100,100,100,222,100,222,100,222,100,222,100,222,100,222,
				 100,100,100,100,100,105,222,130,130,120,120,120,222,222,100,100,100,100,227,222,227,222,227,222,227,222,227,222,227,222,
				 100,100,100,100,100,100,214,214,214,214,222,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222];

}else if(map=="room-1L2"){
		return  [100,150,150,150,150,150,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,101,350,100,150,100,100,100,100,100,502,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,222,100,100,227,100,100,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 503,100,227,227,100,222,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,227,222,222,222,100,100,100,100,100,100,227,227,100,100,222,100,222,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,222,222,100,100,100,227,227,100,100,100,227,227,227,227,100,100,100,227,227,227,227,227,227,227,227,227,227,227,227,
				 100,100,100,100,227,100,222,227,100,100,100,222,222,222,222,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,222,214,227,100,222,222,100,100,100,236,236,236,100,108,100,100,222,227,100,222,100,222,222,227,100,222,100,222,
				 100,100,222,214,222,708,218,222,100,100,100,227,227,227,450,450,100,100,227,222,227,222,227,222,227,222,227,222,227,222,
				 100,100,500,222,222,708,709,222,100,100,100,227,227,227,450,450,227,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,500,500,222,708,708,110,100,100,100,400,668,227,710,218,218,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,222,222,222,100,100,100,100,400,710,401,710,218,218,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,100,100,100,100,100,100,227,710,222,714,714,402,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,100,100,100,227,100,100,222,222,222,714,714,222,100,227,227,227,227,227,227,227,227,227,227,227,227,
				 100,100,100,100,120,120,120,100,222,227,100,222,222,222,301,301,222,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,100,100,120,130,120,120,222,222,100,222,222,222,301,301,222,100,100,222,100,222,100,222,100,222,100,222,100,222,
				 100,100,100,100,120,130,130,120,100,100,100,100,222,222,100,100,100,100,227,222,227,222,227,222,227,222,227,222,227,222,
				 100,100,100,100,120,130,130,120,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222, 
				 100,100,100,105,105,130,130,120,227,100,100,222,222,222,720,222,101,100,227,227,227,227,227,227,227,227,227,227,227,227,
				 100,100,100,105,105,130,214,130,222,227,100,222,222,222,720,222,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,100,100,105,105,214,130,100,222,222,222,222,222,100,224,100,100,100,222,100,222,100,222,100,222,100,222,100,222,
				 100,100,100,100,100,105,222,130,130,120,120,120,222,222,100,100,100,100,227,222,227,222,227,222,227,222,227,222,227,222,
				 100,100,100,100,100,100,214,214,214,214,222,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222];

				 ///Same as before, but difference in obstacles when in level 2
}else if(map=="room-1Over"){
		return  [100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,350,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,214,100,100,214,100,100,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 503,100,214,214,100,222,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,214,222,222,222,100,100,100,100,100,100,214,214,100,100,222,100,222,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,222,222,100,100,100,214,214,100,100,100,214,214,214,214,100,100,100,214,214,214,214,214,214,214,214,214,214,214,214,
				 100,100,100,100,214,100,222,214,100,100,100,222,222,222,222,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,214,214,222,100,232,222,100,100,100,232,232,232,108,108,100,100,222,214,100,222,100,222,222,214,100,222,100,222,
				 100,100,222,214,222,708,218,222,100,100,100,218,218,218,450,450,100,100,214,222,214,222,214,222,214,222,214,222,214,222,
				 100,100,500,222,222,708,709,222,100,100,100,218,218,218,450,450,214,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,500,500,222,708,708,110,100,100,100,400,668,218,711,218,218,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,222,222,222,100,100,100,100,400,710,401,710,218,218,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,100,100,100,100,100,100,219,710,222,714,714,402,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,100,100,100,219,100,100,222,222,222,301,301,222,100,214,214,214,214,214,214,214,214,214,214,214,214,
				 100,100,100,100,120,120,120,100,222,219,100,222,222,222,301,301,222,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,100,120,120,130,120,120,222,222,100,222,222,222,301,301,222,100,100,222,100,222,100,222,100,222,100,222,100,222,
				 100,100,100,120,120,130,130,120,100,100,100,100,222,222,100,100,100,100,214,222,214,222,214,222,214,222,214,222,214,222,
				 100,100,105,105,120,130,130,120,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222, 
				 100,100,105,105,105,130,130,120,219,100,100,222,222,222,720,222,101,100,214,214,214,214,214,214,214,214,214,214,214,214,
				 100,100,105,105,105,130,214,130,222,219,100,222,222,222,720,222,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,100,100,105,105,214,130,100,222,214,222,222,222,100,224,100,100,100,222,100,222,100,222,100,222,100,222,100,222,
				 100,100,100,100,100,105,222,130,130,120,120,120,222,222,100,100,100,100,214,222,214,222,214,222,214,222,214,222,214,222,
				 100,100,100,100,100,100,214,214,214,214,214,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222];







/////                                       r   o   o   m     2


}else if(map=="room-2"){
		return  [222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,
				 503,101,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,222,100,100,227,100,100,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,227,227,100,222,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,227,222,222,100,100,100,100,100,100,100,227,227,100,100,222,100,222,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,222,222,100,100,100,227,227,100,100,100,227,227,227,227,100,100,100,227,227,227,227,227,227,227,227,227,227,227,227,
				 100,100,100,100,227,100,222,227,100,100,100,222,222,222,222,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,222,250,227,100,222,222,100,100,100,236,236,236,100,100,227,100,222,227,100,222,100,222,222,227,100,222,100,222,
				 100,100,668,250,222,710,236,222,100,100,100,227,227,227,108,227,227,100,227,222,227,222,227,222,227,222,227,222,227,222,
				 100,100,100,222,222,710,714,222,100,100,100,227,227,227,668,227,227,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,100,100,222,710,710,110,100,100,100,227,227,227,710,218,218,100,100,100,100,669,100,100,100,100,100,100,100,100,
				 100,100,100,100,222,222,222,100,100,100,100,403,710,222,710,218,218,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,501,100,100,100,100,100,100,227,710,222,714,710,222,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,100,120,100,227,100,100,222,222,222,714,222,101,100,227,227,227,227,227,227,227,227,227,227,227,227,
				 100,100,100,100,120,120,120,100,222,227,100,222,222,222,100,222,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,100,100,120,130,120,120,222,222,100,222,222,222,222,222,100,100,100,222,100,222,100,222,100,222,100,222,100,222,
				 100,100,100,100,100,130,120,100,100,100,100,100,222,222,100,100,100,100,227,222,227,222,227,222,227,222,227,222,227,222,
				 100,100,500,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222, 
				 100,100,100,100,100,100,100,100,227,100,100,222,222,222,720,222,101,100,227,227,227,227,227,227,227,227,227,227,227,227,
				 100,100,100,100,105,105,105,100,222,100,100,222,222,222,720,222,100,100,222,222,222,222,222,222,222,222,222,222,222,222];

}else if(map== "room-2Over"){
		return  [222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,
				 503,101,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,222,100,100,227,100,100,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,227,227,100,222,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,227,222,222,100,100,100,100,100,100,100,227,227,100,100,222,100,222,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,222,222,100,100,100,227,227,100,100,100,227,227,227,227,100,100,100,227,227,227,227,227,227,227,227,227,227,227,227,
				 100,100,100,100,227,100,222,227,100,100,100,222,222,222,222,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,222,250,227,100,222,222,100,100,100,236,236,236,100,100,227,100,222,227,100,222,100,222,222,227,100,222,100,222,
				 100,100,668,250,222,710,236,222,100,668,100,227,227,227,108,227,227,100,227,222,227,222,227,222,227,222,227,222,227,222,
				 100,100,500,222,222,710,714,222,100,100,100,227,227,227,450,227,227,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,500,500,222,710,710,110,100,100,100,227,227,227,710,218,218,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,222,222,222,100,100,100,100,403,710,401,710,218,218,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,100,100,100,100,100,100,227,710,222,714,710,402,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,501,100,100,100,120,100,227,100,100,222,222,222,714,222,101,100,227,227,227,227,227,227,227,227,227,227,227,227,
				 100,100,100,100,120,120,120,100,222,227,100,222,222,222,714,222,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,100,100,120,130,120,120,222,222,100,222,222,222,301,222,100,100,100,222,100,222,100,222,100,222,100,222,100,222,
				 100,100,100,100,100,130,120,100,100,100,100,100,222,222,100,100,100,100,227,222,227,222,227,222,227,222,227,222,227,222,
				 100,100,500,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222, 
				 100,100,100,100,100,100,100,100,227,100,100,222,222,222,720,222,101,100,227,227,227,227,227,227,227,227,227,227,227,227,
				 100,100,100,100,105,105,105,100,222,227,100,222,222,222,720,222,100,100,222,222,222,222,222,222,222,222,222,222,222,222];
	}
}



/// this is kept here so you don't have to constantly define it  when you need it elsewhere, 
/// and with the maps right up there it's easy to adjust

// needed to calculate width and height of MAP
function checkTileNumbers(room){

	if(room=="room-1"){
		roomNumberTilesY = 23;
		roomNumberTilesX = 30;
	}else if(room=="room-2"){
		roomNumberTilesY = 20;
		roomNumberTilesX = 30;
	}

}




var doorBlock =false;

///     ///
  //   //
  /////       ////// ///  //  ///////
  //////     ////     ////   ///
  //   //   ///       //    /////
///    //   /////    //  ///////


///from Event Listener
function checkKey(e, value, checkArrows) {

if(!blockInput){

	if(checkArrows){
		return e.keyCode;
	}else{

		keyDown.isDown=true;
		// e = e || event; 
		keysPressed[e.keyCode] = e.type;

		if(e.keyCode==38||e.keyCode==39||e.keyCode==40||e.keyCode==37){
			latestKeys.push(e.keyCode);/////    IGNORE  ANY OTHER KEY BUT ARROWS!!!!
		}
	

		// YEAH!! it remembers last keysPressed so can go from 1 diagonal to another!!

		if (keysPressed[38]) { 
			
			superLastKey=38;		
			//player1 should change to "Da player"
			if(keysPressed[39]||latestKeys[0]==39){
				player1.direction = "right-up";  /// to know it can do another one..
				player1.facing = "right-up";
			}else if(keysPressed[37]||latestKeys[0]==37){
				player1.direction = "left-up";  /// to know it can do another one..
				player1.facing = "left-up";
			}else{
				player1.direction = "up";
				player1.facing = "up";
			}

			if(paused){
				player1.direction = "nada";

				menuCursor = "up";

			
			}                 
		}


		if (keysPressed[40]) {  /////////////////////////////// YES, WORKS 


			superLastKey=40;



			if(keysPressed[39]||latestKeys[0]==39){
				player1.direction = "right-down";  /// to know it can do another one..
				player1.facing = "right-down";
			}else if(keysPressed[37]||latestKeys[0]==37){
				//console.log("YEAH!");
				player1.direction = "left-down";  /// to know it can do another one..
				player1.facing = "left-down";
			}else {      
				player1.direction = "down";  /// to know it can do another one.. 
				player1.facing = "down";
			}
			
			 
			

			if(paused){
				//clearCtx(ctxMenu);
				
				
				console.log("watch OUT");
				menuCount=0;
				daMenu.draw();
				
				
				player1.direction = "nada";

				menuCursor = "down";



		/// this could be other buttons>> like R-L   
		
		if(menuTrack==0){
				
				if(typeof player1.items[1]!="undefined"&&itemRow!=player1.items.length-2){

					itemRow+=1;
					//console.log("row"+menuRow);
					menuItemAlreadyPainted=false;
		  
					  
					
				}else if(itemRow==player1.items.length-2){

					 itemRow=0;
					menuItemAlreadyPainted=false;
					
				}
				 selecto();
		}else if(menuTrack==1){
				
				
					//alert(menuRow);
				
					console.log("LLLL "+player1.guns.length);

					
					
					if((gunRow+1)==player1.guns.length){
						gunRow=0;
					}else if((gunRow+1)<player1.guns.length){
						gunRow+=1;
					}
					
					console.log("GRR"+gunRow);
					//console.log("row"+menuRow);
					menuGunAlreadyPainted=false;

					  
					
				
				 selecto();
		}

		menuH_items.draw();

		clearCtx(ctxEntities);

		for(var i=0; i< items.length; i++){
		   items[i].draw();
		}
		/////////
		///////////////////////////////////////////////////////


			}  
		}

		if (keysPressed[39]) {  
		if(mBorderX>256){
					oldmBorderCount=0;
					mBorderCount=0;
					mBorderX=0;
				}
			superLastKey=39;	
		
			if(keysPressed[40]||latestKeys[0]==40){
				//console.log("DOWN");
				player1.direction = "right-down";  /// to know it can do another one..
				player1.facing = "right-down";
			}else if(keysPressed[38]||latestKeys[0]==38){
				player1.direction = "right-up";  /// to know it can do another one..
				player1.facing = "right-up";
			}else{
				player1.direction = "right";  /// to know it can do another one..
				player1.facing = "right";
			}
		   
			if(paused){
				player1.direction = "nada";

				menuCursor = "right";

				if(menuTrack==0){
					menuTrack=1;
					 selecto();
					menuH_guns.draw();
				}else if(menuTrack==1){
					menuTrack=0;
					 selecto();
					menuH_items.draw();
				}
			}
		}
		if (keysPressed[37]) {  /////////////////////////////// YES, WORKS
		if(mBorderX>256){
					oldmBorderCount=0;
					mBorderCount=0;
					mBorderX=0;
				}
			/// this is the problem, for some reason Last Key 39 goes back to 37
			superLastKey=37;

			if(keysPressed[40]||latestKeys[0]==40){
				player1.direction = "left-down";  /// to know it can do another one..
				player1.facing = "left-down";
			}else if(keysPressed[38]||latestKeys[0]==38){
				player1.direction = "left-up";  /// to know it can do another one..
				player1.facing = "left-up";
			}else{
				player1.direction = "left";  /// to know it can do another one..   
				player1.facing = "left";
			}
			if(paused){

				player1.direction = "nada";

				menuCursor = "left";

				if(menuTrack==0){
					menuTrack=1;
					 selecto();
					menuH_guns.draw();
				}else if(menuTrack==1){
					menuTrack=0;
					 selecto();
					menuH_items.draw();
				}
			}       
		}/// key pressed 37

		///////////////////////////////////////////////////////////////////////////
		//// probando, check, check, 1, 2, lifebar
		if (keysPressed[71]) {  /////////////////////////////// YES, WORKS
			player1.life-=3;
			if(player1.life<=0){
				alert("MUERTE");
			}
		}

		////////////////////////////////////////////////////////////////////////////

		if (keysPressed[16]) {  /////////////////////////////// YES, WORKS
			
			dash=true;
				/// have to repeat here, or else it only happens after let go of arrows and press again
			//console.log(dashCount);
			if(dashCount<3){
				player1.speed=16;			   	
			}else{
			   	dash=false;	   	
			}
		}

		if (keysPressed[32]) {  /////////////////////////////// YES, WORKS
			player1.direction="nowhere"; /// leave or not... a matter of style

			clearCtx(ctxMenu);
			clearCtx(ctxMenuOver);

			if(!paused){

				paused=true;
				selecto();
				pause();

				////also : pause IS BEING SENT TO OUTSIDE FUNCTION SO AS TO RECOURSE IT WHILE notPlaying & WHILE STILL LISTENING TO KEYS 
				////                                                                            which trigger different parts of pause(function)
			   
			}else{
				paused=false;
				pause();
			}
		}


		//openDoor
		if(keysPressed[49]){
			///when item selected and button-press >>>
			/// loop through obstacles & open the ones ready to be opened with that item....
			doorOpen(obstacles[obstacleIndex].doorID);
	
		}


		if(keysPressed[50]){
			
			if(doorBlock){
				doorBlock=false;
			}

			if(player1.direction!="room-change"){
				player1.shooting=true;
			}
		
				
			
			
		}

		e.preventDefault();

	}

}

}//END check KEYS







function clearCtx(ctx) {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function randomRange (min, max) {
	return Math.floor(Math.random() * (max + 1 - min)) + min;
}







///      P   H   I   S  Y  C  S

var lastDir;

function friction(){


	///this is kinda messes up  ///will need a definitive arrangement at some point. 
	///  because of the friction and 2 key diagonals+release, its hard to set the shooting direction
	//														and to pin point the definite angle player1 is facing
	if(releaseCounterCount>4){
		slowDownDirection=player1.direction;
		lastDir=player1.direction;
		player1.facing=player1.direction;
	}else{
		slowDownDirection=player1.facing;
		lastDir=player1.facing;
	}

	slowDownDirection=player1.facing;


		if(latestKeys.length>0){

				
		///  this is almost working, but needs to work outside keyUP or something.. even though now at least keeps the previous direction, when taking 1 input of diagonal out, it still won't then add a new input to go for the other diagonal (in a row)... got it, it sbecause the diagonals arent chekcing for latestKeys yet


			//console.log("LENGTH "+latestKeys[0]);
			if(latestKeys[0]==39){
				player1.direction="right"; 
			}else if(latestKeys[0]==37){
				player1.direction="left"; 
			}else if(latestKeys[0]==40){
				player1.direction="down"; 
			}else if(latestKeys[0]==38){
				player1.direction="up"; 
			}

			
			
		}else{
			//// stright to ZERO  or try actual PHISYCHS         

			//either this if for friction
			if(player1.speed>0){
				slowDown=true;

			}

			//or this for not-firciton
			// player1.speed=0;
			// player1.direction="nada"; 
			
		

		}



}/// friction








////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_///L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\











													 ////   ////   ///   ////   ////////      
													 ////   /////  ///   ////       ///            
													 ////   ////// ///   ////       ///                          
 													 ////   //////////   ////       ///     
													 ////   /// //////   ////       ///           
													 ////   ///  /////   ////       ///       







var releaseCounter=false;

window.addEventListener("load", initGame, false);

//should be in Funtion => GAME
function initGame() {


	/////  for stupid display types (ex, when the hegth's bigger than the width) use:
	/// window.innerWidth; >>>> window.innerHeight / 6  o lo que sea   <<<   matiene aspect ratio

	//// better to keep display at hard pixels and change a few times depending ongeneral screen-size, maintaining aspect ratio and adding black
///////          this mainly because canvas goes fckng slow when on bigger-than screen, and the speed variation at diff sizes is insane 
	//////                                                                                                  (still need to adjust to it)

	canvasBg.width =900;
	canvasBg.height = 600;
	canvasBgTop.width =900;
	canvasBgTop.height = 600;
	canvasEntities.width =900;
	canvasEntities.height = 600;
	canvasPlayer.width =900;
	canvasPlayer.height = 600;
	canvasBullets.width =900;
	canvasBullets.height = 600;
	canvasOverlay.width =900;
	canvasOverlay.height = 600;
	canvasOverOverlay.width =900;
	canvasOverOverlay.height = 600;
	canvasPause.width =900;
	canvasPause.height = 600;

	canvasMenu.width =900;
	canvasMenu.height = 100;
	canvasMenuOver.width =900;
	canvasMenuOver.height = 600;

	canvasMapOverMenu.width =100;
	canvasMapOverMenu.height = 80;

	canvasMenuOverOver.width =900;
	canvasMenuOverOver.height = 100;


	if(canvasBg.width<window.innerWidth){
		document.getElementById("container").style.margin= "0 "+(window.innerWidth-canvasBg.width)/2+"px";
	}else{
		document.getElementById("container").style.margin= "0";
	}
	// CSS margin won't work





	document.addEventListener("keydown", function(e) {

		
		player1.speed=8;

		checkKey(e, true, false); 
		
		 if(checkKey(e, true, true)==37||checkKey(e, true, true)==38||checkKey(e, true, true)==39||checkKey(e, true, true)==40){
			
		   		player1.speed=12;
		   		releaseCounter=false;
				
			
				slowDown=false;
				slowDownDirection=player1.direction;

			////////  currentSpeed <<<   should vary throughout the game
		}

		
	}, false);


	document.addEventListener("keyup", function(e) {
		 


		for (var i = 0; i<latestKeys.length;i++) {
			//console.log(latestKeys[i]);
			if(checkKey(e, true, true)==latestKeys[i]){
				//console.log(latestKeys.length);
				latestKeys.splice(i,1);
				i=i-1; /// otherwise after splicing, the next i comes to take the current i's place and on the next iteration it won't be checked anymore (and too late to check on this one, so it passes)
			}
		}
		keysPressed = [];
		keyDown.isDown=false; 

		//player1.direction = "nowhere"; ///  ALGO ME TIENE QUE DETENER, NO EL LEVANTAR UNA TECLA, si no no puedo correr y disparar al mismo tiempo
				///ONLY IF ARROWS keyUp!!!
		if(checkKey(e, true, true)==37||checkKey(e, true, true)==38||checkKey(e, true, true)==39||checkKey(e, true, true)==40){


			//console.log(checkKey(e, true, true));
			releaseCounter=true;

			friction(); /// this should stop player when key up

		}



	//// ignore and delete this mess when moving to controller-input.......
		if(checkKey(e, true, true)==38){ //up

			//console.log("DFDFDSFD"+player1.direction);
		}
		if(checkKey(e, true, true)==40){ //down

			//console.log("DFDFDSFD"+player1.direction);
		}

		if(checkKey(e, true, true)==37){ //left

			// console.log("LAST K"+latestKeys[1]);
			// console.log("SUPER"+superLastKey);

			if(latestKeys[1]==39||latestKeys[1]==37){
				superLastKey=39;
			}else if(latestKeys[1]==38){
				superLastKey=38;
			}else if(latestKeys[1]==40){
				superLastKey=40;
			}

			if(player1.direction=="down"&&superLastKey==39){
				player1.direction="right-down";
				
			}else if(player1.direction=="up"&&superLastKey==39){
				player1.direction="right-up";
			}else if(player1.direction=="up"&&superLastKey!=39){
				player1.direction="up";
			}else if(player1.direction=="down"&&superLastKey!=39){
				player1.direction="down";
			}


			/// SAME PROBLEM AGAIN, now SuperLastKey takes too long to get back....
			/////// ... at least there is just this one to fix now..
			//// and this side seems to be the end for it.

		}

		if(checkKey(e, true, true)==39){//right

			//console.log("DFDFDSFD"+player1.direction);
			// player1.direction="down";
			if(player1.direction=="down"&&superLastKey==37){
				player1.direction="left-down";
				
			}else if(player1.direction=="up"&&superLastKey==37){
				player1.direction="left-up";
			}else if(player1.direction=="up"&&superLastKey!=37){
				player1.direction="up";
			}else if(player1.direction=="down"&&superLastKey!=37){
				player1.direction="down";
			}
			////
			///////////////// SOMETHING LIKE THIS SHOULD BYPASS THAT DELAYED-RETARDED latestKeys[0] check

			

		}



		if(checkKey(e, true, true)==50){

			player1.shooting=false;
		}

		if(checkKey(e, true, true)==16){
			player1.speed=8;/////////    this has to come from array.. diff speeds according to situations
			dashCount=0;
		}

	},false);



	begin();

}




















  ////////////        ///////////
 //////////          /////    ////
//////               ///       ///
/////                ///       ///
/////                ///       ///  
/////      //////    ///       ///
//////      /////    ///       ///
////////////////     /////    ////
  /////////////       ///////////



var playerChoosing="player1";
	playerChosen="warrior";

function begin() {
	///


	currentRoom= "room-1";
	currentArea="default";
	currentLevel=1;

	roomDraw(currentRoom, currentArea, 0, tileDiameter, 0, 0, "first", currentLevel);


	// So, if it's not gonna start from corner 0, 0 >>>  Block screen with something (block input too)....
	//changeRoom("room-2", 669, shiftX, shiftY, "normal");
	// ... then release it, ad there you go



	isPlaying = true;
	requestAnimFrame(loop);


	
	if(playerChoosing=="player1"){
		if(playerChosen=="warrior"){
			for (var i = 0; i < players.length; i++) {
				player1 = new Player(playerTypes[0]);
			}
		}else if(playerChosen=="warlock"){
			for (var i = 0; i < players.length; i++) {
				player1 = new Player(playerTypes[1]);
			}
		}
	}
	  


	//CAN BE DONE PROGRAMATICALLY TOO

  //player1 = new Player(); /////////////  if (hitPlayer){  hitPlayer||player1 =  new Player(player1)
	// doors.push(
	//     new Door(325, 325, 25, 25, "inDoor")
	// );


	//should be in room  object?


	///(srcX, y, drawX, yy, w, h, item, gun, ammo, life, selec,caught, branch)


	items.push( new Item(580,605,  0,tileDiameter*3, tileDiameter, tileDiameter, "item", 1, false, false, null, "room-1"), new Item(580,405, 200,200, tileDiameter, tileDiameter,"item", 3, false, false, null, "room-1"), new Item(580,605, 250,900, tileDiameter, tileDiameter,"item", 1, false, false, null, "room-2"), new Item(596,605, 330,160, tileDiameter, tileDiameter,"item", 4, false, false, null, "room-1"), new Item(610,605, 350,200, tileDiameter, tileDiameter,"item", 2, false, false, null, "room-1") );

	items.push( new Item(570,605,  150,250, tileDiameter, tileDiameter,"gun", 0, false, false, null, "room-1"), new Item(570,605, 200,250, tileDiameter, tileDiameter,"gun", 0, false, false, null, "room-1"), new Item(600,605, 350,250, tileDiameter, tileDiameter, "gun", 1, false, false, null, "room-1"));


	items.push( new Item(700,605,  550,150, tileDiameter, tileDiameter,"ammo", 1, false, false, null, "room-1"), new Item(650,605,  580,150, tileDiameter, tileDiameter,"life", 1, false, false, null, "room-1"));


	menuH_items = new menuH(itemSprite, 700, 600, 30, 30, 200, 100, "item", false);
	menuH_guns = new menuH(itemSprite, 700, 600, 30, 30, 230, 100, "gun", false);


	player1.guns[0]={srcX:570, srcY:605, width:45, height:45, selec:true, itemType:"gun", itemNumber:0, lifeType:null,amount:0};
	selecto();

				////also : pause IS BEING SENT TO OUTSIDE FUNCTION SO AS TO RECOURSE IT WHILE notPlaying & WHILE STILL LISTENING TO KEYS 
				////                                                                            which trigger different parts of pause(function)
			   
}








  ////////////        ///////////
 ///////             /////    ////
/////      //////    ///       ///
//////      /////    ///       ///
////////////////     /////    ////
  /////////////       ///////////


var gameCounter =0;

//UPDATE everything
function update() {

	gameCounter++;

	

	clearCtx(ctxBg);
	clearCtx(ctxPlayer);
	clearCtx(ctxBullets);
	clearCtx(ctxOverlay);
	
	clearCtx(ctxEntities);
	clearCtx(ctxBgTop);
	clearCtx(ctxMenu);
	clearCtx(ctxMenuOver);

	//DONDE SEA QUE HALLA player1 >>> CAMBIAR POR 
	//for (var i = 0; i < players.length; i++) {
	  
	 //   if(players[i][0 == 1
	for (var i = 0; i < players.length; i++) {
		if(players[i]== 1){
			player1.update();
			
		}else{
			//player2.update();
		}
	}
   // player1.update();
	/// if ==2                            (if only) not exclusive
	/// player2.update()
	
	////  Sample of being pushed unvoluntarily and still having walls stop you, yay! (enemy power weapon) >>>  for STUN FX simply block key-listening
		// if(player1.moving){
		//    player1.drawX +=player1.speed;
		//    player1.direction ="right";
		// }

	for(var i=0; i< items.length; i++){
		items[i].update();
	}


	for(var i=0; i< bulletsFired.length; i++){
		if(bulletsFired[i].active){//// diff var, if inactive >>> debris anim >>> if(!debrisOver 
			bulletsFired[i].update();
		}else{												/// then ELSE if debrisOver
			/// NOW splice
			bulletsFired.splice(i,1);
		}
		
	}

	roomDraw(currentRoom, currentArea, 0, tileDiameter, shiftX, shiftY, "not-first");

}





// & Re-DRAW
function draw() {
	for (var i = 0; i < players.length; i++) {
		if(players[i] == 1){
			player1.draw();
		}else{
			//player2.draw();
		}
	}
	for(var i=0; i< items.length; i++){
		items[i].draw();
	}
 	
	for(var i=0; i< bulletsFired.length; i++){
		bulletsFired[i].draw();
	}


}

var startTime = Date.now();
var gameSpeed=40;  ////  + == slower game >>> KEEP IN MIND EDGES SLOW GAME DOWN, so keep this at the slowest the game is seen performing, so then it doesn't suddenly speed up (when in an Area were Edges almost don't take place)

var then = startTime;/// I don't know, it seems to make it faster than having startTime down there
///            >> maybe it doesn't have to calculate Date.now() twice, but gets it from a closer set of memory



//???????\\\\?//]]]]]]]]]]]]]!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function loop() {

		if(isPlaying){

			/// Do_Stuff  >>> at a constant rate, no matter what hardware
			if(Date.now()>then+gameSpeed){
				then=Date.now();

		//???\\\//GAME HAPPENS HERE!!!!! 
				update();
				draw();

			}
			/// Enable loop (so stuff can be done)
			requestAnimFrame(loop);

		}
}









//TYUIH^*@()//TYUIH^*@(//TYUIH^*@()//TYUIH^*@()//TYUIH^*@(
//TYUIH^*@()//TYUIH^*@(//TYH^*@()//TYUIH^*@()//TYUIH^*@(






															//\///\\//\  ///////    ///    //  /    ///
															///\\\\\\\\  ///       /////  //  /    ///
															///\\\\\\\\  /////    /// // //  /    ///
															//// \/ \\\  ///     ///  ////  /    ///
															///    \ \\  //////////   ///  ////////




var itemCounter = 0;
var gunCounter = 0;
///Menu items  >>> only updated on pause

function menu(img, srcX, srcY, w, h, x, y) {
	this.image=img;
	this.srcX=srcX;
	this.srcY=srcY;
	this.width = w;
	this.height = h;
	this.drawX = x;
	this.drawY = y;
}

var menuCount=0;
var srccX=0;

var repeat=0;
/// PARAMS to distinguish if draw.ITEM or draw.GUN  (from pause-press or first-pick)  ||  BOTH (not-paused)
menu.prototype.draw = function () {
/////  no FLASH, OR RESET ANIMCOUNTER >>> IF ITS NOT YOUR MENUTRACK (no flashing gun-item when scrolling item-item)
	//// in pause mode you can scroll and select other ones with the arrows)
	for (var i =0; i<3; i++) { ///// 3 Tracks
			
		if(i==0){
			if(player1.items[1]!=null&&player1.items[1]!="undefined"){
								
				clearCtx(ctxMenu);
				clearCtx(ctxMenuOver);
						
				for (var j = 0;j<player1.items.length; j ++) {			 
								
							/// FOR  ROW>>> IT COULD BE INFINITE!    for player1.items  igual que en checkKey
					if(itemRow==j){
						if(typeof player1.items[j+1]!="undefined"){

							///ONLY DRAW IF SELECTABLE!!!  and only apply effects if items-> thisRow <<<< MOR THAN ONE
							///// so duplicate this if elses and >> if player1.items 
									// if(j>0){

									// 	/// DONT DO THIS SHIFT IF FIRST-PRESS\\\\\\
									// 	ctxMenuOver.drawImage(itemSprite, player1.items[j+1].srcX, player1.items[j+1].srcY, 30, 30, 170, 40, player1.items[j+1].width, player1.items[j+1].height);


	        //   							ctxMenuOver.drawImage(itemSprite, player1.items[j].srcX, player1.items[j].srcY, 30, 30, 170, 100, player1.items[j].width, player1.items[j].height);
	        //   						}else{

	        //   							if(player1.items.length<=1){

	          								
		       //    							ctxMenuOver.drawImage(itemSprite, player1.items[j+1].srcX, player1.items[j+1].srcY, 30, 30, 170, 0, player1.items[j+1].width, player1.items[j+1].height);
		       //    						///then when there's more it can swap them with animations !!!!!!!!!!
	        //   							}else{
	        //   								ctxMenuOver.drawImage(itemSprite, player1.items[j+1].srcX, player1.items[j+1].srcY, 30, 30, 170, 0, player1.items[j+1].width, player1.items[j+1].height);
	        //   								ctxMenuOver.drawImage(itemSprite, player1.items[player1.items.length-1].srcX, player1.items[player1.items.length-1].srcY, 30, 30, 170, 0, player1.items[player1.items.length-1].width, player1.items[player1.items.length-1].height);
	        //   							}
	        //   						}

	          					/// or do it the simple way:  comment out  if(j>0){ above, and uncomment this one
	          				if(paused&&menuTrack==0&&pauseType=="gamePause"){
	          					repeat++;
	          					console.log("RRR "+repeat);
	          					if(itemCounter<20){
	          						ctxMenuOver.drawImage(itemSprite, player1.items[j+1].srcX, player1.items[j+1].srcY, 30, 30, 80, 14,64, 64);

	          						itemCounter++;
	          						console.log("I C " +itemCounter);
	          					}else if(itemCounter>=20&&itemCounter<27){
	          						itemCounter++;
	          						console.log("I C " +itemCounter);
	          						clearCtx(ctxMenuOver);
	          					}else{
	          						itemCounter=0;
	          						console.log("I C " +itemCounter);
	          					}
	          				}else{
	          					ctxMenuOver.drawImage(itemSprite, player1.items[j+1].srcX, player1.items[j+1].srcY, 30, 30, 80, 14, 64, 64);
	          				}

	          					



						}    
					}
				};
							
				menuItemAlreadyPainted=true;
								///// should be this.ICON >> diff image in game and inventory
					
			} 
				
		}else if(i==1){
				
			if(player1.guns[0]!=null&&player1.guns[0]!="undefined"){


				for (var j = 0;j<player1.guns.length; j ++) {
						  	//console.log(gunRow);
					if(gunRow==j){
								
						if(typeof player1.guns[j]!="undefined"){


							//console.log(player1.guns[j].itemNumber);
							if(player1.guns[j].itemNumber==0){
								srccX=0;
								//console.log("une");
							}else if(player1.guns[j].itemNumber==1){
								srccX=64;
								//console.log("duw");
							}
									
							ctxMenuOver.clearRect(230,0, 64, 64);

															//// not gun width but custom width
							if(paused&&menuTrack==1&&pauseType=="gamePause"){
			          			if(gunCounter<20){
			          				ctxMenuOver.drawImage(weaponS, srccX, 0, 64, 64, 210, 14, 64, 64);

			          				gunCounter++;
			          			}else if(gunCounter>=20&&gunCounter<27){
			          				gunCounter++;
			          						
			          			}else{
			          				gunCounter=0;
			          			}
			          		}else{
			          			ctxMenuOver.drawImage(weaponS, srccX, 0, 64, 64, 210, 14, 64, 64);
			          		}

						}
					}
				};

					
			}
		}// if i = 1>> menuTrack

	   	// ctxMenu.clearRect(170,140,46, 46);   /// this blocks the bottom ITEM in the "sliding-trick"
	}/// FOR  menuTrack
		

	if(paused){

		// ctxMenu.clearRect(170,30,46, 46);
		
		if(menuCount<20){
			menuCount++;
			if (menuCount%7 == 0){
				clearCtx(ctxMenu);  /// this should be clearRECT  when I have the right position for menu>>
											////   only erase (or move) one side(track) of the Menu

			}
		}else{
			menuCount=20;

		}
			
	}


	
	///make this a canvas-large bg continuous drawing
	for(var i=0; i<roomNumberTilesX; i++){


		ctxMenu.drawImage(itemSprite, 100, 400,4, 4, 0+(i*tileDiameter), 0, tileDiameter, tileDiameter);	
		
		
	}
			var shifto=0;
	
	ctxMenuOverOver.clearRect(360,0, 400, 300);
	for (var i = 0; i<player1.life; i++) {
		/// tal vez window.innerHeight... no se ve cuando achicas
		ctxMenuOverOver.drawImage(itemSprite,650,605, 4, 20, 360+shifto,0, 4, 30); ///////////// ctx player so it gets updated
		shifto+=7;
	};
}






//Menu Highlighter
function menuH(img, srcX, srcY, w, h, x, y, type, selec) {
	this.image=img;
	this.srcX=srcX;
	this.srcY=srcY;
	this.width = w;
	this.height = h;
	this.drawX = x;
	this.drawY = y;
	this.is = type;
	this.isSelected= selec;
}


var mBorderX = 0;
var mBorderCount = 0;
var oldmBorderCount = 0;

menuH.prototype.draw = function(){

	clearCtx(ctxMenuOver);
	clearCtx(ctxMenuOverOver);
	
	//clearCtx(ctxMenu);


	if(paused){

		

		if(menuTrack==0){

			////  SO THIS 2 HAVE TO GO ON A DIFF CANVAS >>> HIDE ON afterPAUSE

			

				/// HERE::  ANIMATION OVER itemInMenu >>> like a light reflection 	

				ctxMenuOverOver.drawImage(menuBorder, mBorderX, 0, 64, 64, 80, 14, 64, 64);
				

				mBorderCount++;

				if(mBorderCount>oldmBorderCount+3){
					oldmBorderCount=mBorderCount;
					mBorderX+=64;
				}
					            
			
		}else if(menuTrack==1){
					 
			
			  
			  							////   64 + counter to make anim
				ctxMenuOverOver.drawImage(menuBorder, mBorderX, 0, 64, 64, 210, 14, 64, 64);

				mBorderCount++;

				if(mBorderCount>oldmBorderCount+3){
					oldmBorderCount=mBorderCount;
					mBorderX+=64;
				}
				
			
		}
	}



	////  HEALTH BAR !!

///////////////////////////////////////////////////////////////////////////////
	//same with this, even though it is part of Player, it belongs in the menu
	var shifto=0;

	for (var i = 0; i<player1.life; i++) {
		/// tal vez window.innerHeight... no se ve cuando achicas
		ctxMenuOverOver.drawImage(itemSprite,650,605, 4, 20, 360+shifto,0, 4, 30); ///////////// ctx player so it gets updated
		shifto+=7;
	};


}/// Menu Draw





///////   ////    ////////   //////
//   //  /////    ////     ////
// //// //  //    / ////// /////
//     //   //   //     // ////
//    //    /////// /////   /////




function pause(){
	menuH_items.draw();
	menuH_guns.draw();
	//console.log(paused);
	daMenu.draw();

	if(paused){
		
		isPlaying = false;

		requestAnimFrame(pause);
		
	}else{		 
		// if(!itemSelectPressed){ 		
		// }
		if(mBorderX>256){
					oldmBorderCount=0;
					mBorderCount=0;
					mBorderX=0;
				}
		isPlaying = true;

		//player1.direction =player1.facing;
		requestAnimFrame(loop);
	}
}/// pause




///l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]
///
///             S  E  L  E  C  T      I  N  V  E  N  T  O  R  Y
///
///l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]


function selecto(){
	////  MAKE SO WHEN A GUNTYPE FIRSTPICK >> GOES AND SELECT IT AND DRAWS IT IN MENU AS CURRENT
	if(menuTrack==0){

		//if not true already..
		menuH_items.isSelected=true;


		///loop row =>> loop player1.items...
		for(var i=0; i<player1.items.length-1; i++){
			if(itemRow==i){
				player1.itemSelected=i+1;
				//console.log(player1.items[i+1].itemNumber);
				menuH_items.rowSelec=i;
			}
		}

		menuH_items.draw();

	/// ELSE if .... gunSelectPressed
	}else if(menuTrack==1){

		/// IF menuTrack==0

		//if not true already..
		menuH_guns.isSelected=true;
		//console.log("GGeeee"+player1.guns.length);
		for(var i=0; i<player1.guns.length; i++){
					
			if(gunRow==i){	
				//console.log("A VER A VER "+player1.guns[i+1].itemNumber);
				//player1.gunSelected=player1.guns[i+1].itemNumber;
				player1.weaponSelected=player1.guns[i].itemNumber;
				menuH_guns.rowSelec=i;
			}
		}
		/// ELSE if menuTrack ==1 .... gunSelectPressed
		menuH_guns.draw();
	}
}/// selecto





//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\
//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||









						 ///              ///  ///////     ////////   //      /////
						  ///           ///   ///   ///   ///   ///  //      //  ///
						  ///  ///   ///    //      //  /////////  //       //   ///
						   ////  /////      ///   ///  ///   //   //       //  ///
							///  ///         //////   ///    //   /////// /////







function Obstacle(x, y, w, h, type, id, active, timer, openClosed) {
	this.drawX = x;
	this.drawY = y;
	this.width = w;
	this.height = h;
	this.leftX = this.drawX;
	this.rightX = this.drawX + this.width;
	this.topY = this.drawY;
	this.bottomY = this.drawY + this.height;
	this.timeToClose = timer;
	this.isOpen=openClosed;

	this.isDoor = type;
	this.doorID = id;
	this.isActive = active;
}

////  Area type door?
function Area(x, y, w, h, n, type, id, doorTo, column, row, roomTo,  blocked, n2) {
	this.drawX = x;
	this.drawY = y;
	this.width = w;
	this.height = h;
	this.leftX = this.drawX;
	this.rightX = this.drawX + this.width;
	this.topY = this.drawY;
	this.bottomY = this.drawY + this.height;
	this.n = n; /////////////////////////////// area type
	this.n2 = n2;

	this.isDoor=type;
	this.doorID=id;
	this.isBlocked=blocked;
	this.doorTO=doorTo;
	this.roomTo= roomTo;
	this.column = column;
	this.row = row;
}

	




	
   
///////   |||||\\\\  |||||\\\\  ||\ |\ /\         //////    ///////    ////   |||||\\\\
//   //   |||||\\\\  |||||\\\\  |||||\\\\         //   //   ///  //   /////   |||||\\\\  
//////    |||||\\\\  |||||\\\\  |||||\\\\         ///  //  ///////   //////   |||||\\\\
///  //   |||||\\\\  |||||\\\\  |||/  \\\         /////   ///  //   ///////   |||||\\\\
///  ///  |||||\\\\  |||||\\\\  ||/    \\         ///    ///   //  ////////   |||||\\\\







function roomDraw(currentRoom, area, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, firstDraw, level){

	var img;





	img = new Image();
	img.src = "images/spritesBg.png";

	doors = new Image();
	doors.src = "images/door-over-sprites.png";

	doorFrames = new Image();
	doorFrames.src = "images/door-over.png";

	edges = new Image();
	edges.src = "images/edges-sprites.png";

	animEdges = new Image();
	animEdges.src = "images/anim-edges-sprites.png";


	imgSpriteTile1 = new Image();
	imgSpriteTile1.src = "images/bg.png";    ///spritesBg


	imgSpriteTile4 = new Image();
	imgSpriteTile4.src = "images/sprite.png";

	imgSpriteTile5 = new Image();
	imgSpriteTile5.src = "images/sprite2.png";

	imgSpriteTile6 = new Image();
	imgSpriteTile6.src = "images/sprite.png";




	imgSpriteTile3 = new Image();
	imgSpriteTile3.src = "images/bg.png";


	

	var newTileIndexX = tileIndexX;
		


	if(currentRoom == "room-1"){


		checkTileNumbers("room-1");


		roomLengthY= roomNumberTilesY * tileWidthHeight;
		roomLengthX= roomNumberTilesX * tileWidthHeight;

		canvasWidth = roomLengthX;
		canvasHeight = roomLengthY;

		//console.log("WHAT LEVEL ?"+currentLevel);

		if(currentLevel==1){
			var mapObsL1 =  whatRoomMap("room-1");
		}else if(currentLevel==2){
			var mapObsL1 =  whatRoomMap("room-1L2");
		}


		var mapOverDraw=whatRoomMap("room-1Over");


		}else if(currentRoom == "room-2"){


		///seems to be fine having different NumberTiles per room
		checkTileNumbers("room-2");

		roomLengthY= roomNumberTilesY * tileWidthHeight;
		roomLengthX= roomNumberTilesX * tileWidthHeight;

		canvasWidth = roomLengthX;
		canvasHeight = roomLengthY;
		////////////   VAR get current room
		////////       REMEMBER THIS ROOM  >>> CURRENT ROOM = "room-1"

		var mapObsL1 =  whatRoomMap("room-2");


		var mapOverDraw=whatRoomMap("room-2Over");

	}/// if WHAT ROOM


	if(firstDraw=="first"){
		//// this means first pass over the tiles >> only grab what they are, regardless of what they are supposed to look like

		obstacles =[];
		areas = [];



			tilesDefine(shiftX, shiftY, img, area, {mapObsL1}, roomNumberTilesY, roomNumberTilesX, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, newTileIndexX);

			//   cuando pisa zona 150 (area transision), roomDraw(transition, level2)  [transition se ve igual que default, pero tiene que seguir siendo eso, asi no vuelve a nivel 1..mientras siga en transition]  
			//////////////////
			//////////                         Level 2 se ve exactamente igual, con la diferencia que los blockes que te impedian entrar en level 2 desde abajo, ahora son area3(transition) caminable, y en cambio se corrieron y no te dejan bajar [un ajuste en firstDraw]... Lo demas todo igual

	}else{

		////then on second pass over Tiles is time to actually DRAW them

		/// 		  t: the tile number (same as in Map >> hooks to proper image in sprite)
		/// areaTrigger: the inside-area they belong to (at which area they will show their second sprite-hook)
		///	   those that say: "all" never show a "second sprite-hook" and simply go black when at any of these areas


		 tilesOverlayDraw(shiftX, shiftY, img, area, {mapOverDraw}, roomNumberTilesY, roomNumberTilesX, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, newTileIndexX, {t:100, areaTrigger:"all"}, {t:101, areaTrigger:"all"}, {t:110, areaTrigger:"all"} ,{t:105, areaTrigger:"all"} ,{t:108, areaTrigger:"all"},{t:120, areaTrigger:"all"}, {t:130, areaTrigger:"all"} ,{t:222, areaTrigger:"all"}, {t:214, areaTrigger:"all"}, {t:218, areaTrigger:"all"}, {t:219, areaTrigger:"uno"}, {t:227, areaTrigger:"uno"}, {t:232, areaTrigger:"uno"}, {t:250, areaTrigger:"uno"}, {t:710, areaTrigger:"uno"}, {t:708, areaTrigger:"dos"}, {t:711, areaTrigger:"uno"}, {t:714, areaTrigger:"uno"}, {t:709, areaTrigger:"dos"}, {t:400, areaTrigger:"uno"}, {t:401, areaTrigger:"uno"},{t:402, areaTrigger:"uno"},{t:500, areaTrigger:"uno"}, {t:502, areaTrigger:"uno"},{t:503, areaTrigger:"uno"}, { t:668, areaTrigger:"uno"}, {t:350, areaTrigger:"uno"}, {t:301, areaTrigger:"uno"}, {t:310, areaTrigger:"uno"}, {t:450, areaTrigger:"uno"} ); 
		 
	}/// if first pass (define) or second+ (draw)
	
}/// roomDraw










			   /////////  //   ///      ///////         ///////  //////   ////// ||  ||| ||  //////  
				   ///    //    //      //              ///  //  ///     ////    ||  ||\\||  ///     
				   ///    //    //      ///             //   //  ////    //      ||  || \\|  ////      
				   ///    //    //////  ///////         /////    //////  //      ||  || \\   //////   





var inAct=false;

/// tilesDefine - level2  >>> this 2 defineLevel 1-2 functions >> they define what is what>>>  later, tilesOverlayDraw actually DRAWS the tiles you see on the screen

function tilesDefine(newShiftX, newShiftY, img, area, {mapObsL1}, roomNumberTilesY, roomNumberTilesX, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, newTileIndexX){



	inAct=false;
//// cuidado con los ID de las puertas... si son iguales puede haber problemas
			
		for(var i =0; i<roomNumberTilesY; i++){
			for(var e=0; e<roomNumberTilesX; e++){


					if(mapObsL1[tileMapIndex].toString().substring(0,1)==1){ ///////// area (default)

						if(mapObsL1[tileMapIndex]==150){ /////////  doorTOout

							areas.push(
								new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "transition")
								/////////////////////////////           PLUS:  TO WHAT DOOR IN WHAT ROOM
							);
						}else if(mapObsL1[tileMapIndex]>=120&&mapObsL1[tileMapIndex]<130){ /////////  doorTOout

							areas.push(
								new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight,"default", null, null, null, null, null, null, null, "water")
								/////////////////////////////           PLUS:  TO WHAT DOOR IN WHAT ROOM
							);
						
							
						}else if(mapObsL1[tileMapIndex]>=130&&mapObsL1[tileMapIndex]<150){ /////////  doorTOout

							areas.push(
								new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight,"default", null, null, null, null, null, null, null, "deep-water")
								/////////////////////////////           PLUS:  TO WHAT DOOR IN WHAT ROOM
							);

							

							obstacles.push(
								new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL1[tileMapIndex], "active", 30, "closed")
							);

						
						}else{
							areas.push(
								new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default")
							);


						}

					   
					}else if(mapObsL1[tileMapIndex]>=200&&mapObsL1[tileMapIndex]<249){ ///////// obstacle out

						
						obstacles.push(
							new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "wall", mapObsL1[tileMapIndex], "active")
						);
					}else if(mapObsL1[tileMapIndex].toString().substring(0,1)==7&&mapObsL1[tileMapIndex]!=708&&mapObsL1[tileMapIndex]!=709){ ///////// area 1

					 
						areas.push(
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "uno")
						);
					}else if(mapObsL1[tileMapIndex]==708){ ///////// area 1

					 
						areas.push(
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "dos")
						);
					}else if(mapObsL1[tileMapIndex]==709){ ///////// area 1

					 
						areas.push(
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "dos")
						);
					}else if(mapObsL1[tileMapIndex].toString().substring(0,1)==4){ ///////// door in area
						areas.push(
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "uno")
						);
						
						if(inActive.length==0){
							obstacles.push(
								new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL1[tileMapIndex], "active", 30, "closed")//// ID has to be = to the tileNumber
								);
						}else{

							///WHATS HAPPENING:
							/// inAct keeps track of whether this Tile's number has had any match within the inactive Obstacles.
							// if at any poin it did, then doesn't matter what happens, inAct is true and the obstacle is not (this way it waits for the whole inActive-obs Array to finish befire deciding to draw or not)

							// repeat same for breakableObstacles
							console.log(inAct);

							for (var a = 0; a < inActive.length; a++) {
								if(inActive[a]==mapObsL1[tileMapIndex]){
									inAct=true;
									
								}else if(inActive[a]!=mapObsL1[tileMapIndex]){
									if(!inAct){
										inAct=false;
									}
									 
								}
							}

							if(inAct){
								obstacles.push(
									new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL1[tileMapIndex], "inActive", 30, "closed")//// ID has to be = to the tileNumber
									);
									
							}else{
								obstacles.push(
									new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL1[tileMapIndex], "active", 30, "closed")//// ID has to be = to the tileNumber
									);
									
							}

						}

						inAct=false;
						
					}else if(mapObsL1[tileMapIndex].toString().substring(0,1)==3){ ///////// door out

						/// has to also be an area >> when opened >> so changes from inside room to outside
						areas.push(
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default")
						);
					 
					    if(inActive.length==0){
							obstacles.push(
								new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL1[tileMapIndex], "active", 30, "closed")//// ID has to be = to the tileNumber
								);

						}else{

							for (var a = 0; a < inActive.length; a++) {
								if(inActive[a]==mapObsL1[tileMapIndex]){
									inAct=true;
									
								}else if(inActive[a]!=mapObsL1[tileMapIndex]){
									if(!inAct){
										inAct=false;
									}
									 
								}
							}

							if(inAct){
								obstacles.push(
									new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL1[tileMapIndex], "inActive", 30, "closed")//// ID has to be = to the tileNumber
									);
									
							}else{
								obstacles.push(
									new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL1[tileMapIndex], "active", 30, "closed")//// ID has to be = to the tileNumber
									);
									
							}

						}

						inAct=false;





					}else if(mapObsL1[tileMapIndex]>=250&&mapObsL1[tileMapIndex]<275){ ///////// obstacle in area

					 
						obstacles.push(
							new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "wall", mapObsL1[tileMapIndex], "active")
						);
					}else if(mapObsL1[tileMapIndex]==668){ ///////// doorTO in area

					 
						areas.push(////////////////////////////////    //  IMPORTANT!!!  after "door"=.n >> 888 = id, 885, dooTo >>> door is going to
										/////// now here below, this room it is going to (888)>> 888 tile has to be given it's 885 id so dootTo here MATCHES!!
										///first is ID of this door, then ID doorItIsGoinggTo
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "uno", "door", 668, 501, tileIndexX, tileIndexY,"room-2")
						);
					}else if(mapObsL1[tileMapIndex]==669){ ///////// doorTO in area

					 
						areas.push(////////////////////////////////    //  IMPORTANT!!!  after "door"=.n >> 888 = id, 885, dooTo >>> door is going to
										/////// now here below, this room it is going to (888)>> 888 tile has to be given it's 885 id so dootTo here MATCHES!!
										///first is ID of this door, then ID doorItIsGoinggTo
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default", "door", 669, 668, tileIndexX, tileIndexY,"room-1")
						);
					}else if(mapObsL1[tileMapIndex]==503){ ///////// doorTO in area

					 
						areas.push(
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default", "door", 503, 503, tileIndexX, tileIndexY, "room-1")
						);
					}else if(mapObsL1[tileMapIndex]==500){ /////////  doorTOout

					 
						areas.push(
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default", "door", 500, 500,tileIndexX, tileIndexY,  "room-2",)
							/////////////////////////////           PLUS:  TO WHAT DOOR IN WHAT ROOM
						);
					}else if(mapObsL1[tileMapIndex]==501){ /////////  doorTOout

					 
						areas.push(
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default", "door", 501, 668,tileIndexX, tileIndexY,  "room-1",)
							/////////////////////////////           PLUS:  TO WHAT DOOR IN WHAT ROOM
						);
					}else if(mapObsL1[tileMapIndex]==502){ /////////  doorTOout

					 
						areas.push(
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default", "door", 502, 501,tileIndexX, tileIndexY,  "room-2",)
							/////////////////////////////           PLUS:  TO WHAT DOOR IN WHAT ROOM
						);
					}else if(mapObsL1[tileMapIndex]==708){ ///////// doorTO in area

					 
						areas.push(
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "dos")
						);
					}
					/////////////    ALSO THERES GOTTA BE OBSTACLES IN/OUT  THAT LOOK LIKE SOMETHING ELSE (SO DIFF NUMBER)
					///////                                         OR SOMETHING ELSES (IN/OUT) THAT LOK LIKE OBSTACLES

					////
					//                      NUMBERS ARE TOO FEW, need to RE-MAP  with LETTERS!!!! 
					///


				 ///// IF OTHER NUMBER >>>>  AREA type DOOR-to-other room (inArea)  >> sprite: area/roof vs door

				///// IF OTHER NUMBER >>>>  AREA type DOOR-to-other room (outArea)  >>  door vs blackened (or whatever outside of area looks like)


			tileIndexX+= tileWidthHeight;

			tileMapIndex++;

			}
		tileIndexY+=tileWidthHeight;
		tileIndexX=newTileIndexX;


		///////// 3d FX
		// variance++;
		// tileWidthHeight+=1;
		/// not worth the efforst in map translation + calculating diagonals for smoth against the wall moving

		}

} /////   tilesDefine  









var areaEdgeX=0;

var areaY=0;
var areaX=0;

var animX=0;

var doorsOpened=[];
var animC=0;

var closeIt;

var doorAnimX = 0;

var doorXanimClose= 0;

var doorAnimCount = 0;

var doorOpened=false;


var doorOpenCounter=30;

var doorClosingRememberIndex;

var doorClosingRememberId;


var doorGroups=[];

var doorsChecked=[];

var doorGroupsTotal=[];

var checkDoorGroups=false;

var dontDraw=false;

var doorAlreadyDrawn=[];

var doorsFound = [];

var doorCounter=0;

var doorCounter2=0;

var doorsReFound=[];

var doorXAnim=0;	

var doorLaps =0;

var manyDoors=0;
var aver = false;





														 //\               
														 ///\\				   //\ 
			     ///////  //    //      ////|            //////     ///////   // \    |||||\
				   ///    //    //      //               //   //   ///  //   //  \   |/   \\
				   ///    //    //      //|              //  ///  ///////   //   \   |/   \\
				   ///    //    //////  ////|            /////   //  //    //____\   \||||\
				   										 ///			  //     \

var tileC=0;

menuDotCount=0
menuDotOld=0;

function tilesOverlayDraw(newShiftX, newShiftY, img, area, {mapOverDraw}, roomNumberTilesY, roomNumberTilesX, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, newTileIndexX){

	//console.log(currentArea);

	


	var doorX=0;
	var doorY=0;

	var tallerDoor=0;

	//// this will take the tiles sent by  tilesDefineOver after this standard parameters
	var defaultTiles = [];

	var doorOpenClose;
	/// j =11>>  11 are the arguments we got in tilesOverlayDraw(). The tiles we want to get come after and we don't know how many they could be.
	for(var j=0; j < arguments.length; j++){
		if(j>11){
			/// after that number (11) we store this SpriteTile coordinate values in an array defaultTiles...
			defaultTiles.push(arguments[j]);
		}
	}////////////  

	


// function drawTiles(){ 
// since currentArea is being updated every time along with this, a funciton(parameter) is not needed

	var srcX;
	var srcY;

	var columnsPerRow=0;

	var countingColumns=0;


	var columnsPerRow2=0;

	var countingColumns2=0;


	var done=false;

	/// menuMap back-ground >> drawn only once, under
	ctxMapOverMenu.fillStyle = "#000";					
	//ctxMapOverMenu.fillRect(1140, 0, 4, 4);
	ctxMapOverMenu.fillRect(0, 10, 130, 100);

	for(var i =0; i<roomNumberTilesY; i++){

		for(var e=0; e<roomNumberTilesX; e++){



			for(var j=0; j < defaultTiles.length; j++){	




				if(mapOverDraw[tileMapIndex]==defaultTiles[j].t){ 



					doorCounter=0;

					for (var u = 0; u < doorGroupsTotal.length; u++){
		
						if(mapOverDraw[tileMapIndex]==doorGroupsTotal[u].id){

								doorsFound.push(doorGroupsTotal[u].id);



								if(doorGroupsTotal[u].n==4||doorGroupsTotal[u].n==8){
									columnsPerRow=doorGroupsTotal[u].n/2;



									for (var b = 0; b < doorsFound.length; b++){

										if(doorsFound[b]==doorGroupsTotal[u].id){
											if(doorCounter<doorGroupsTotal[u].n){
												doorCounter++;
											}else{
												doorCounter=0;
											}
											
										}
									}
								//console.log(doorCounter);

									if(inArea.inIt){
										if(doorCounter<=columnsPerRow){
											srcX=getTileX(defaultTiles[j].t, "door-top");
											//console.log(doorCounter);
										}else{
											srcX=getTileX(defaultTiles[j].t, "door-bottom");
											//console.log(doorCounter);
										}
									}else if(mapOverDraw[tileMapIndex]<450&&!inArea.inIt){

										if(doorCounter<=columnsPerRow){
											srcX=getTileX(defaultTiles[j].t, "door-top");
											//console.log(doorCounter);
										}else{
											srcX=getTileX(defaultTiles[j].t, "door-bottom");
											//console.log(doorCounter);
										}
									}
									
									/// IF doorGroupsTotal  4 ||8
								}else if(doorGroupsTotal[u].n==6||doorGroupsTotal[u].n==9){
									columnsPerRow=doorGroupsTotal[u].n/3;



									for (var b = 0; b < doorsFound.length; b++){

										if(doorsFound[b]==doorGroupsTotal[u].id){
											if(doorCounter<doorGroupsTotal[u].n){
												doorCounter++;
											}else{
												doorCounter=0;
											}
											
										}
									}
									//console.log(doorCounter);

							
									if(inArea.inIt&&mapOverDraw[tileMapIndex]>=450){
										if(doorCounter<=columnsPerRow*2){
											srcX=getTileX(defaultTiles[j].t, "door-top");
											//console.log(doorCounter);
										}else{
											srcX=getTileX(defaultTiles[j].t, "door-bottom");
											//console.log(doorCounter);
										}
									}else if(!inArea.inIt&&mapOverDraw[tileMapIndex]<450){

										if(doorCounter<=columnsPerRow*2){
											srcX=getTileX(defaultTiles[j].t, "door-top");
											//console.log(doorCounter);
										}else{
											srcX=getTileX(defaultTiles[j].t, "door-bottom");
											//console.log(doorCounter);
										}
									}else if(mapOverDraw[tileMapIndex]<450&&inArea.inIt){

										if(doorCounter<=columnsPerRow*2){
											srcX=getTileX(defaultTiles[j].t, "a");
											//console.log(doorCounter);
										}else{
											srcX=getTileX(defaultTiles[j].t, "b");
											//console.log(doorCounter);
										}
									}
									
									
								}/// IF doorGroupsTotal 6||9

								
								done=true;
								
							} // IF mapOverDraw[tileMapIndex] == door ID


						if(!done){
							// IF tiles != DOORS:
							if(area=="default"||area=="transition"&&defaultTiles[j].t!=doorGroupsTotal[u].id){ 
								///+ other outside areas

								/// tiles OUTside areas
								srcX=getTileX(defaultTiles[j].t, "a");

							}else if(area==defaultTiles[j].areaTrigger||defaultTiles[j].areaTrigger=="all"&&defaultTiles[j].t!=doorGroupsTotal[u].id){
								//////  SPECIFY ALL NUMBR OF AREAS + FLASH STATES.....

								/// tiles INside areas
								srcX=getTileX(defaultTiles[j].t, "b");
							}

						}///  Tiles draws SET

						
					}// FOR doorGroupsTotal LENGTH

					done=false; // goes back to false to check next Tile (maybe a door, maybe not)
					
					

					//  TILE srcX >> Area-PAIR COMBINATIONS
					function getTileX(tileID, tileArea){
	
						tileBgMap=[
						{n:100, a:64, b:0}, 
						{n:120, a:1472, b:0}, 
						{n:130, a:1662, b:0},
						{n:101, a:128, b:0},
						{n:105, a:64, b:0}, 
						{n:108, a:384, b:512},
						{n:110, a:64, b:64},
						{n:214, a:384, b:576},
						{n:218, a:384, b:512},
						{n:219, a:384, b:0},
						{n:222, a:256, b:0},
						{n:227, a:384, b:576},
						{n:232, a:256, b:576},
						{n:250, a:64, b:0},
						{n:710, a:384, b:448},
						{n:708, a:384, b:448},
						{n:709, a:384, b:448},
						{n:711, a:384, b:448},
						{n:714, a:256, b:448},
						{n:400, a:384, b:448},
						{n:401, a:384, b:448},
						{n:402, a:384, b:448},
						{n:403, a:384, b:448},
						{n:450, a:384, b:64, top:200, bottom:448},
						{n:301, a:448, b:512, top:192, bottom:128},
						{n:310, a:448, b:512, top:192, bottom:128},
						{n:350, a:64, b:64}, 
						{n:500, a:896, b:0}, 
						{n:668, a:384, b:1024},
						{n:503, a:896, b:0}]


						for(var i = 0; i <tileBgMap.length; i++){
							if(tileID==tileBgMap[i].n){
								if(tileArea =="a"){
									return tileBgMap[i].a;
								}else if(tileArea =="b"){
									return tileBgMap[i].b;
								}else if(tileArea =="door-top"){
									return tileBgMap[i].top;
								}else if(tileArea =="door-bottom"){
									return tileBgMap[i].bottom;
								}
							}
						}/// FOR tileBgMap.length
						
					}// FUNC getTileX

			
					/// TILE src Y  SAME TO ALL <<<<<  this is what is manipulated to control "flashes" and such
					srcY= 0;




//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


			//\///\\//\  ///////    ///    //  /    ///         //\///\\//\   	 ///\      //////// 
			///\\\\\\\\  ///       /////  //  /    ///          ///\\\\\\\\     /\\\ \     //   //
			///\\\\\\\\  /////    /// // //  /    ///           ///\\\\\\\\    ////\ \\    //////
			//// \/ \\\  ///     ///  ////  /    ///            //// \/ \\\   ////  \\ \   //
			///    \ \\  //////////   ///  ////////             ///    \ \\  ////    \ \\  //

		

			//////  THE PROBLEM OF THE DOT(counter) GOING FASTER on other Rooms
			//////						SOLVED BY USING A (universal) COUNTER AT UPDATE!! (gameCounter)
			   ////	                                                           rather than one on this function

					if(gameCounter<22){
						//console.log(gameCounter);
						ctxMapOverMenu.fillStyle = "rgba(255, 120, 160, 1)";
					
					}else if(gameCounter>=22&&gameCounter<30){
						
						ctxMapOverMenu.fillStyle = "black";
					}else if(gameCounter>=30){
						gameCounter=0; /// rinse & repeat	
					}

					

					////////////  	THIS BELOW IF TILEDIAMTER ==  40......

					ctxMapOverMenu.fillRect(8+newDrawX/12, 20+newDrawY/12, 4, 4);

					if(defaultTiles[j].t.toString().substring(0,1)==1){
						ctxMapOverMenu.fillStyle = "#0b0020";
						ctxMapOverMenu.fillRect(8+e*4+shiftX/12, 20+i*4+shiftY/12, 4, 4);
					}else if(defaultTiles[j].t.toString().substring(0,1)==2){
						ctxMapOverMenu.fillStyle = "#aa001f";
						ctxMapOverMenu.fillRect(8+e*4+shiftX/12, 20+i*4+shiftY/12, 4, 4);
					}


					/////////// or this if == 64

					//ctxMapOverMenu.fillRect(25+newDrawX/16, 25+newDrawY/16, 4, 4);

					// if(defaultTiles[j].t.toString().substring(0,1)==1){
					// 	ctxMapOverMenu.fillStyle = "#0b0020";
					// 	ctxMapOverMenu.fillRect(25+e*4+shiftX/16, 25+i*4+shiftY/16, 4, 4);
					// }else if(defaultTiles[j].t.toString().substring(0,1)==2){
					// 	ctxMapOverMenu.fillStyle = "#ff001f";
					// 	ctxMapOverMenu.fillRect(25+e*4+shiftX/16, 25+i*4+shiftY/16, 4, 4);
					// }

					///"rgba example
					//ctxMapOverMenu.fillStyle = "rgba(255, 120, 0, 1)";

//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



					




					 






					    ///////   ||||  |||  ||  //|    ||     ///   /////////  ///////  ///////  
					   ///    |  ||||| |||  ||  // |   ||/    // //     ///    //       //   ///    
					  ///     | |  ||||||  ||  //  |  ||//   //  //    ///    ///      //  ///      
					 /// ANIM tiles       ||  //   ||||///  //   //   ///    //////   //////       
				    /// 



					if(defaultTiles[j].t>=120&&defaultTiles[j].t<150){

						if(animX>=0&&animX<5){
							areaX=0;
							areaEdgeX=0;
						}else if(animX>=5&&animX<10){
							areaX=64;
							areaEdgeX=64;
						}else if(animX>=10&&animX<15){
							areaX=128;
							areaEdgeX=128;
						}else if(animX>=15){
							areaX=0;
							animX=0;
							areaEdgeX=0;
							/// animX lies at the bottom of this whole function, so the anim-frame doesn't move until ALL tiles have been set
							/// (otherwise it animates like waterfall, pretty cool too)

							/// TRy to keep a limited amount of tiles being animated!! (or check speed on avg computer)
						}

					}else{
						areaX=0; ///// back to ZERO so the other tiles, which aren't this animated one, don't shift
					}

					/// wrap all this in a function, and call with parameter(CURRENTAREA) to which it loads x or xx...

		   			//ex: 101   0,1 = 1|   0,2 = 10 |   1,3 = 01=1   |  1,2 = 0
					if(mapOverDraw[tileMapIndex].toString().substring(0,1)==1){

						///     this number:  /6 <<< will depend largely on the size of the map...
						///     so needs to be adjustable >> var (or keep a few giant maps(same size) with all rooms)
						
					

						   ////  + AreaX >>>  ANIMATION

						   /// this is just to prove that you can differentiate within tiles that have same first substring, but different second... so you can pass different images pointing to the SAME SPRITE starting X for all 1s... (ex: diff types of defaultTiles), here you can plus it or whatever to suit more specific differences
						if(!inArea.inIt){   



							if(mapOverDraw[tileMapIndex].toString().substring(0,2)>=10&&mapOverDraw[tileMapIndex].toString().substring(0,2)<15){

								ctxBg.drawImage(img, srcX+areaX, srcY+areaY, 64, 64, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);



								if(mapOverDraw[tileMapIndex+1]>=400&&mapOverDraw[tileMapIndex+1]<450||mapOverDraw[tileMapIndex-1]>=400&&mapOverDraw[tileMapIndex-1]<450){

									if(doorOpening.length>0){


										for (var q = 0; q< doorOpening.length; q++) {
										   
										   if(doorOpening[q].id==mapOverDraw[tileMapIndex+1]){

												doorY=0;714

										    }else {
											 	doorY=60;   
										    }
										    	doorX=0;

											///first we check if one of the doorsCurrentlyOpening === the currentTile
											if(doorOpening[q].id==mapOverDraw[tileMapIndex+1]||doorOpening[q].id==mapOverDraw[tileMapIndex-1]){
											   


												tallerDoor=20;

												if(doorOpening[q].id==mapOverDraw[tileMapIndex+1]||doorOpening[q].id==mapOverDraw[tileMapIndex-1]){
													  if(mapOverDraw[tileMapIndex-1]>=400&&mapOverDraw[tileMapIndex-1]<450){
														ctxOverlay.drawImage(doors, 0+doorOpening[q].animX, 60, 40, 60, tileIndexX, tileIndexY-20, tileWidthHeight, tileWidthHeight+20);
															// ctxOverlay.drawImage(doors, 0+doorOpening[q].animX, 60, 40, 60, tileIndexX, tileIndexY-20, tileWidthHeight, tileWidthHeight+20);
													}else{
														ctxOverlay.drawImage(doors, 0+doorOpening[q].animX, 0, 40, 60, tileIndexX, tileIndexY-20, tileWidthHeight, tileWidthHeight+20);
															// ctxOverlay.drawImage(doors, 0+doorOpening[q].animX, 0, 40, 60, tileIndexX, tileIndexY-20, tileWidthHeight, tileWidthHeight+20);
													}  
												}


												tallerDoor=0;
											}else{
												if(!doorOpened){
													doorOpened=false;
												}
											}
									   

											if(!doorOpened){

										 		tallerDoor=20;
												   ////  NOT THAT SAME SPRITE but a different one >> ROUNDED
												if(doorOpening[q].id==mapOverDraw[tileMapIndex+1]||doorOpening[q].id==mapOverDraw[tileMapIndex-1]){
													
													if(mapOverDraw[tileMapIndex-1]>=400&&mapOverDraw[tileMapIndex-1]<450){
														ctxOverlay.drawImage(doors, 0+doorOpening[q].animX, 60, 40, 60, tileIndexX, tileIndexY-20, tileWidthHeight, tileWidthHeight+20);
													}else{
														ctxOverlay.drawImage(doors, 0+doorOpening[q].animX, 0, 40, 60, tileIndexX, tileIndexY-20, tileWidthHeight, tileWidthHeight+20);
													}  
												}

											}else{
												/// without this it could never draw another door
												doorOpened=false;    
											}
										}/// FOR doorOpening.length


									//// IF DOORS NOT OPENED 
									}/////////////////////////// Same with doorClosing!!!!!!!!!!!!!!



									if(doorClosing.length>0){

										for(var k=0; k<obstacles.length; k++){

										
											for (var q = 0; q< doorClosing.length; q++) {
											   
											   if(obstacles[k].isDoor=="door"&&obstacles[k].doorID==doorClosing[q].id&&obstacles[k].isActive=="active"){

											   if(doorClosing[q].id==mapOverDraw[tileMapIndex+1]){

													doorY=0;

											    }else {
												 	doorY=60;   
											    }
											    	doorX=0;

												///first we check if one of the doorsCurrentlyOpening === the currentTile
												if(doorClosing[q].id==mapOverDraw[tileMapIndex+1]||doorClosing[q].id==mapOverDraw[tileMapIndex-1]){
											   


												tallerDoor=20;

												if(doorClosing[q].id==mapOverDraw[tileMapIndex+1]||doorClosing[q].id==mapOverDraw[tileMapIndex-1]){
													  if(mapOverDraw[tileMapIndex-1]>=400&&mapOverDraw[tileMapIndex-1]<450){
														ctxOverlay.drawImage(doors, 0+doorXanimClose, 60, 40, 60, tileIndexX, tileIndexY-20, tileWidthHeight, tileWidthHeight+20);
															// ctxOverlay.drawImage(doors, 0+doorOpening[q].animX, 60, 40, 60, tileIndexX, tileIndexY-20, tileWidthHeight, tileWidthHeight+20);
													}else{
														ctxOverlay.drawImage(doors, 0+doorXanimClose, 0, 40, 60, tileIndexX, tileIndexY-20, tileWidthHeight, tileWidthHeight+20);
															// ctxOverlay.drawImage(doors, 0+doorOpening[q].animX, 0, 40, 60, tileIndexX, tileIndexY-20, tileWidthHeight, tileWidthHeight+20);
													}  
												}


												tallerDoor=0;
											}else{
												if(!doorOpened){
													doorOpened=false;
												}
											}
			
										}/// FOR doorOpening.length


									//// IF DOORS NOT OPENED 
									}/////////////////////////// Same with doorClosing!!!!!!!!!!!!!!



								}
							}





									var opened=false;
									/// if a door(s) is (are) opening
									if(typeof doorOpening[0] !="undefined"){
									
										for (var q = 0; q< doorOpening.length; q++) {
												
											if(doorOpening[q].id==mapOverDraw[tileMapIndex+1]||doorOpening[q].id==mapOverDraw[tileMapIndex-1]){
													   

												opened=true; 
														
											}
												
										}       
										

									/// if NO doors are currently opening
									}else{

										///// WHEN NOTHING OPENED
										if(mapOverDraw[tileMapIndex-1]>=400&&mapOverDraw[tileMapIndex-1]<450){

											///  NOT OVERLAY OVER PLAYER but needs to be OVER EDGES...
											//// >>>>>> another Canvas >> Z-INDEX just in between
											ctxOverlay.drawImage(doors, 0, 60, 40, 60, tileIndexX, tileIndexY-20, tileWidthHeight, tileWidthHeight+20);
											
										}else{
											ctxOverlay.drawImage(doors, 0, 0, 40, 60, tileIndexX, tileIndexY-20, tileWidthHeight, tileWidthHeight+20);
											
										}    
									}

									///// AFTER SOMETHING HAS BEEN OPENED >>> opened  remembers a door was opened
									if(!opened){
										tallerDoor=20;
										if(mapOverDraw[tileMapIndex-1]>=400&&mapOverDraw[tileMapIndex-1]<450){
											ctxOverlay.drawImage(doors, 0, 60, 40, 60, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
											// THIS JUST SO AS TO HAVE A slight layer of Door OVER player..
									//  ... diff point in sprite, like a force field player goes into (round door )

										}else{
											ctxBgTop.drawImage(doors, 0, 0, 40, 60, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
										}       
									}

								}//If >400<450 


							// END if >=10<15    
							}else if(mapOverDraw[tileMapIndex].toString().substring(0,2)==15){
								ctxBg.drawImage(img, srcX+areaX, srcY+areaY, 64, 64, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);
							}else if(mapOverDraw[tileMapIndex].toString().substring(1,3)==90){ /////  Numeros reservados para Overlays



								ctxBg.drawImage(img, srcX+areaX, srcY+areaY, 64, 64, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);  
								
									  
							/// >>>>  HERE could go  EDGES -UNDER - PLAYER 

							} 

						}else{//// else if  inArea



							///HERE GOES INNER ANIMATIONS!!!!!!!!!!!!!
							// this right here below is an animation going when inside Area... no probs
							///ctxBg.drawImage(img, srcX+areaX, srcY+areaY, 64, 64, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);

							
							ctxBg.drawImage(img, srcX, srcY, 64, 64, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
						}






					}else if(mapOverDraw[tileMapIndex].toString().substring(0,1)==4||mapOverDraw[tileMapIndex].toString().substring(0,1)==3){

						//// Door tiles, but first, we draw what would go underneath. What tiles these would be were they not doors

						var doorCount=0;


						getDoor(mapOverDraw[tileMapIndex]);


						// ctxBg.drawImage(img, srcX+areaX, srcY+areaY, 64, 64, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);


					/// how do I separate this so it draws the right srcX for each part of the door............
					// ..............................................................................


								
						ctxBg.drawImage(img, srcX+areaX, srcY+areaY, 64, 64, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
						
						
					

						function getDoor(id){

							var dontCheck=false;

							for (var j = 0; j < doorsChecked.length; j++){
								
								if(id==doorsChecked[j]){
									dontCheck=true;
								}
									
							}
							
							if(!dontCheck){
								for (var i = 0; i < obstacles.length; i++){

									if(obstacles[i].doorID==id){

										doorCount++;

										doorGroups.push({id:obstacles[i].doorID, n:doorCount});	
									}
								}

								// console.log("DC"+doorCount);

								// console.log("total"+doorGroups[doorGroups.length-1].id);
							}

							doorsChecked.push(id);	


						}/// getDoor FUNC








					 ///////   ||||||  ||||||  ||////   /////        //           ///////  |||  || || //|  ||
					 //   ///  ||||||  ||||||  ||  //  ///           //          ///    | |||| || || // | ||/
					 //  ///   ||||||  ||||||  ||///   //////     ////////      ///     ||  |||| || //  |||//
					 //////    ||||||  ||||||  ||  \\     ///        //        //       |          //   |  //
					 ////                              /////         //       //                           //

							///  doorOpening needs to keep track of its own doorAnimC and X...
							//                     so can open 2+ at the same time >> independent anim				


						if(doorOpening.length>0){

							//console.log(mapOverDraw[tileMapIndex]);
							/// SO basically FOR THIS TO WORK, DOOR# MUST have been assigned a Sprite

							for (var q = 0; q< doorOpening.length; q++) {
									
								   
									///first we check if one of the doorsCurrentlyOpening === the currentTile
								if(doorOpening[q].id==mapOverDraw[tileMapIndex]){

								

									doorOpened=true;

							

									doorOpening[q].animC+=1; 

										

									if(doorOpening[q].timer==0&&doorOpening[q].closeDone==false){
										doorClose(doorOpening[q].id, doorOpening[q].animC, doorOpening[q].animX);
										doorClosingRememberId=doorOpening[q].id;
											
										doorOpening[q].closeDone=true;

										//alert(doorOpening[q].animC);
									}	

									
									
									if(doorOpening[q].animC>0&&doorOpening[q].animC<=3){

									
										doorOpening[q].animX=0;
									}else if(doorOpening[q].animC>3&&doorOpening[q].animC<=6){
										
										doorOpening[q].animX=40;
									}else if(doorOpening[q].animC>6&&doorOpening[q].animC<=9){
										
										doorOpening[q].animX=80;
											
									}else if(doorOpening[q].animC>9&&doorOpening[q].animC<=11){
										
										doorOpening[q].animX=120;
											
									}else if(doorOpening[q].animC>11){

										if(calculateDoors("howmany")==4||calculateDoors("howmany")==8){		
											if(doorOpening[q].lap==0){

												doorOpening[q].lap=1; 	

											}else if(doorOpening[q].lap==1){
												doorOpening[q].lap=2;
													

											}
											doorOpening[q].animC=0;
										}else if(calculateDoors("howmany")==6||calculateDoors("howmany")==9){
											if(doorOpening[q].lap==0){

												doorOpening[q].lap=1; 	

											}else if(doorOpening[q].lap==1){
												doorOpening[q].lap=2;
													

											}else if(doorOpening[q].lap==2){
												doorOpening[q].lap=3;
												  										
											}else if(doorOpening[q].lap==2){
												doorOpening[q].lap=3;
												  										
											}
											doorOpening[q].animC=0;

										}
									}   
									
																	
									
									//doorOpenCounter++;
									//console.log(doorOpenCounter);
									if(mapOverDraw[tileMapIndex]>=350&&mapOverDraw[tileMapIndex]<400){
										//// first ever pass (no doorsOpen) /// or else already in doorOpening[0,1,2,3..
										doorX=0;
										doorY=120;
										tallerDoor=20;

										ctxOverlay.drawImage(doors, doorX+doorOpening[q].animX, doorY, 40,40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);

									} else if(mapOverDraw[tileMapIndex]>=400&&mapOverDraw[tileMapIndex]<450){
											

											
										doorX=200;
										doorY=120;
										tallerDoor=20;

										if(inArea.inIt){
											ctxOverlay.drawImage(doors, doorX+doorOpening[q].animX, doorY, 40,40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
										}

									}else if(mapOverDraw[tileMapIndex]>=450&&mapOverDraw[tileMapIndex]<499){

										doorY=180;

										tallerDoor=0;

										calculateDoors("static");

										
										if(calculateDoors("howmany")==4||calculateDoors("howmany")==8){
											//alert(calculateDoors("howmany"));

											if(doorOpening[q].lap==0){
												if(calculateDoors("opening")=="top"){ 
													doorOpening[q].animX = 0;
												}
											}else if(doorOpening[q].lap==1){
												if(calculateDoors("opening")=="bottom"){ 
													doorOpening[q].animX = 120;
												}
											}else if(doorOpening[q].lap==2){
											
													doorOpening[q].animX = 120;
													
											} 
										}else if(calculateDoors("howmany")==9||calculateDoors("howmany")==6){
											

											if(doorOpening[q].lap==0){
												if(calculateDoors("opening")=="top"||calculateDoors("opening")=="mid"){ 
													doorOpening[q].animX = 0;
												}
											}else if(doorOpening[q].lap==1){
												if(calculateDoors("opening")=="top"){ 
													doorOpening[q].animX = 0;
												}else if(calculateDoors("opening")=="bottom"){ 
													doorOpening[q].animX = 120;
												}
											}else if(doorOpening[q].lap==2){
												if(calculateDoors("opening")=="bottom"||calculateDoors("opening")=="mid"){ 
													doorOpening[q].animX = 120;
												}

											}else if(doorOpening[q].lap==3){
											
													doorOpening[q].animX = 120;
												
											} 
										}/// howmany == 9||6
												
												
										ctxOverlay.drawImage(doors, doorX+doorOpening[q].animX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);

									}else if(mapOverDraw[tileMapIndex]>=300&&mapOverDraw[tileMapIndex]<350){

										doorY=180;

										tallerDoor=0;
										// if doors on top, =+this, then those done, if middle =+this...

										/// IF NOT THE TILE then don't add to X(yet) >> doorXAnim = 0;
										calculateDoors("static");

										
										if(calculateDoors("howmany")==4||calculateDoors("howmany")==8){
											//alert(calculateDoors("howmany"));

											if(doorOpening[q].lap==0){
												if(calculateDoors("opening")=="top"){ 
													doorOpening[q].animX = 0;
												}
											}else if(doorOpening[q].lap==1){
												if(calculateDoors("opening")=="bottom"){ 
													doorOpening[q].animX = 120;
												}
											}else if(doorOpening[q].lap==2){
											
													doorOpening[q].animX = 120;
													
											} 
										}else if(calculateDoors("howmany")==9||calculateDoors("howmany")==6){
											//console.log("nueve "+calculateDoors("howmany"));
											if(doorOpening[q].lap==0){
												if(calculateDoors("opening")=="top"||calculateDoors("opening")=="mid"){ 
													doorOpening[q].animX = 0;
												}
											}else if(doorOpening[q].lap==1){
												if(calculateDoors("opening")=="top"){ 
													doorOpening[q].animX = 0;
												}else if(calculateDoors("opening")=="bottom"){ 
													doorOpening[q].animX = 120;
												}
											}else if(doorOpening[q].lap==2){
												if(calculateDoors("opening")=="bottom"||calculateDoors("opening")=="mid"){ 
													doorOpening[q].animX = 120;
												}

											}else if(doorOpening[q].lap==3){
											
													doorOpening[q].animX = 120;
												
											} 
										}/// howmany == 9||6
												
										if(inArea.inIt){
											ctxOverlay.drawImage(doors, doorX+doorOpening[q].animX+200, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
										}else{

											ctxOverlay.drawImage(doors, doorX+doorOpening[q].animX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
											
										}
									}

										


									
								}else{
									if(!doorOpened){
										doorOpened=false;
									}
								}



									
								/// the door.id is only one so once this happens, we ignore the rest and allow the For loop to finish before drawing (or else would have conflicting values)
							}//FOR 


					

								// doorX=0;
								// doorY=0;
							if(!doorOpened){

								/// we need to keep this down here (as opposed to the openingDoor)
								/// or else when there is a doorOpening, it either will not be able to draw the other ones (since doorOpened=true) or else (taking that if !doorOpened) will, but on top of another door already opened (since a dif doorOpening[q].id would result on doorOpening[q].id==mapOverDraw[tileMapIndex] being false and would immediately draw on top of every other door opened or not)
							
								if(mapOverDraw[tileMapIndex]>=350&&mapOverDraw[tileMapIndex]<400){
										//// first ever pass (no doorsOpen) /// or else already in doorOpening[0,1,2,3..
										doorX=0;
										doorY=120;
										tallerDoor=20;
										ctxOverlay.drawImage(doors, doorX, doorY, 40,40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);	

									} else if(mapOverDraw[tileMapIndex]>=400&&mapOverDraw[tileMapIndex]<450){
											

											
										doorX=200;
										doorY=120;
										tallerDoor=20;

										if(inArea.inIt){
											ctxOverlay.drawImage(doors, doorX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
										}

									}else if(mapOverDraw[tileMapIndex]>=450&&mapOverDraw[tileMapIndex]<499){
										doorX=200;
										doorY=180;
										tallerDoor=0;
										ctxBg.drawImage(doors, doorX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
											
									}else if(mapOverDraw[tileMapIndex]>=300&&mapOverDraw[tileMapIndex]<350){
										//// first ever pass (no doorsOpen) /// or else already in doorOpening[

										tallerDoor=0;

										calculateDoors("static");

										doorY=180;
										if(inArea.inIt){
											ctxOverlay.drawImage(doors, doorX+200, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
										}else{
											ctxBg.drawImage(doors, doorX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
										}
									}


							}else{


								/// without this it could never draw another door
								doorOpened=false;    
							}

							////
///////			 SO WHY ON EARTH DOES THIS TAKE SO MUCH LONGER WHEN ON  ROOM-2 !!!??!?!?@?@#?@@@@$^%*&!!!!!!!!!!

											
								 

						}else{// NO DoorOpening YET


						

							if(mapOverDraw[tileMapIndex]>=350&&mapOverDraw[tileMapIndex]<400){
										//// first ever pass (no doorsOpen) /// or else already in doorOpening[0,1,2,3..
								doorX=0;
								doorY=120;
								tallerDoor=20;

								ctxBg.drawImage(doors, doorX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);

							} else if(mapOverDraw[tileMapIndex]>=400&&mapOverDraw[tileMapIndex]<450){
											
										
								doorX=200;
								doorY=120;
								tallerDoor=20;

								if(inArea.inIt){
									ctxOverlay.drawImage(doors, doorX, doorY, 40,40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
								}

							}else if(mapOverDraw[tileMapIndex]>=450&&mapOverDraw[tileMapIndex]<499){
								doorX=200;
								doorY=180;
								tallerDoor=0;
								ctxBg.drawImage(doors, doorX, doorY, 40,40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
											
							}else if(mapOverDraw[tileMapIndex]>=300&&mapOverDraw[tileMapIndex]<350){
								
								tallerDoor=0;

								calculateDoors("static");				
								//console.log("DD"+doorX);
								doorY=180;
								if(inArea.inIt){
									ctxOverlay.drawImage(doors, doorX+200, doorY, 40,40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
								}else{
									ctxBg.drawImage(doors, doorX, doorY, 40,40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
								}
							}

						
									
									
						}/// if doorOpening

				//// REMEMBER THIS IS ALL INSIDE 300 & 400 TILES >>> OGO BACK REPEAT ON 100 TILES >> Function Out
		/////   and it is there.. so check it out proper <<< only openDoor implemented up there, not closeDoor

					}else{ /// other tiles

						ctxBg.drawImage(img, srcX+areaX, srcY+areaY, 64, 64, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
		  
					}/// else... everything else


					if(doorClosing.length>0){
							 

						for (var q = 0; q< doorClosing.length; q++){

							if(doorClosing[q].id==mapOverDraw[tileMapIndex]){

									//console.log(doorClosing.length);
									//alert(doorClosing[q].animC);
							if(doorClosing[q].lap<=3){	
								if(doorClosing[q].animC>0&&doorClosing[q].animC<=3){
								
									doorXanimClose=120;

								}else if(doorClosing[q].animC>3&&doorClosing[q].animC<=6){
									doorXanimClose=80;
									//console.log("DOS" );
								}else if(doorClosing[q].animC>6&&doorClosing[q].animC<=9){
									doorXanimClose=40;
									//console.log("TRES" +doorClosing[q].lap);
								}else if(doorClosing[q].animC>9){
									doorXanimClose=0;
									

									if(calculateDoors("howmany")==4||calculateDoors("howmany")==8){		
										if(doorClosing[q].lap==0){

											doorClosing[q].lap=1; 	

										}else if(doorClosing[q].lap==1){
											doorClosing[q].lap=2;	
										}

										doorClosing[q].animC=0;

									}else if(calculateDoors("howmany")==6||calculateDoors("howmany")==9){
										if(doorClosing[q].lap==0){

											doorClosing[q].lap=1; 	
											//console.log("111" +doorClosing[q].lap);
										}else if(doorClosing[q].lap==1){
											doorClosing[q].lap=2;
												//console.log("222" +doorClosing[q].lap);	

										}else if(doorClosing[q].lap==2){
											doorClosing[q].lap=3;
												//console.log("333" +doorClosing[q].lap);	  											
										}

										doorClosing[q].animC=0;

									}																		
								}    

							}


								for(var k=0; k<obstacles.length; k++){

									if(obstacles[k].isDoor=="door"&&obstacles[k].doorID==doorClosing[q].id&&obstacles[k].isActive=="active"){

										//console.log("CUANTEAS ABRIMOS ?  " + doorClosing.length);

										if(mapOverDraw[tileMapIndex]>=350&&mapOverDraw[tileMapIndex]<400){
												//// first ever pass (no doorsOpen) /// or else already in doorOpening[0,1,2,3..
											doorX=0;
											doorY=120;
											tallerDoor=20;

											ctxBg.drawImage(doors, doorX+doorXAnim, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
											tallerDoor=0;
										}else if(mapOverDraw[tileMapIndex]>=400&&mapOverDraw[tileMapIndex]<450){

											doorX=200;
											doorY=120;
											tallerDoor=20;

											if(inArea.inIt){
												ctxOverlay.drawImage(doors, doorX+doorXAnim, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
												
											}

										}else if(mapOverDraw[tileMapIndex]>=450&&mapOverDraw[tileMapIndex]<499){
											
											doorY=180;
											tallerDoor=0;	

											calculateDoors("static");

									
											if(calculateDoors("howmany")==4||calculateDoors("howmany")==8){
													//alert(calculateDoors("howmany"));

												if(doorClosing[q].lap==0){
													if(calculateDoors("opening")=="bottom"){ 
														doorXanimClose = 120;
													}
												}else if(doorClosing[q].lap==1){
													if(calculateDoors("opening")=="top"){ 
														doorXanimClose = 0;
													}
												}else if(doorClosing[q].lap==2){
													
													doorXanimClose = 0;					
												} 

											}else if(calculateDoors("howmany")==9||calculateDoors("howmany")==6){

												//console.log("WAAA: " + doorClosing[q].lap);
												if(doorClosing[q].lap==0){

													if(calculateDoors("opening")=="bottom"||calculateDoors("opening")=="mid"){ 
														doorXanimClose = 120;
													}
													//console.log("why 0");
												}else if(doorClosing[q].lap==1){
													if(calculateDoors("opening")=="top"){ 
														doorXanimClose = 0;
													}if(calculateDoors("opening")=="mid"){ 
														if(!aver){
															doorXanimClose = 120;
															aver=true;
														}
														
													}else if(calculateDoors("opening")=="bottom"){ 
														doorXanimClose = 120;
													}
													//console.log("PUTAL LAWE");
												}else if(doorClosing[q].lap==2){
													if(calculateDoors("opening")=="top"||calculateDoors("opening")=="mid"){ 
														doorXanimClose = 0;
														//console.log("PUTAL LAWE");

													}

												}else if(doorClosing[q].lap==3){
													
													doorXanimClose = 0;
														aver=false;
												} 
											}/// howmany == 9||6


											ctxBg.drawImage(doors, doorX+doorXanimClose, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
											
										}else if(mapOverDraw[tileMapIndex]>=300&&mapOverDraw[tileMapIndex]<350){

											doorY=180;

										   	tallerDoor=0;		


											calculateDoors("static");

									
											if(calculateDoors("howmany")==4||calculateDoors("howmany")==8){
													//alert(calculateDoors("howmany"));

												if(doorClosing[q].lap==0){
													if(calculateDoors("opening")=="bottom"){ 
														doorXanimClose = 120;
													}
												}else if(doorClosing[q].lap==1){
													if(calculateDoors("opening")=="top"){ 
														doorXanimClose = 0;
													}
												}else if(doorClosing[q].lap==2){
													
													doorXanimClose = 0;					
												} 

											}else if(calculateDoors("howmany")==9||calculateDoors("howmany")==6){

												//console.log("WAAA: " + doorClosing[q].lap);
												if(doorClosing[q].lap==0){

													if(calculateDoors("opening")=="bottom"||calculateDoors("opening")=="mid"){ 
														doorXanimClose = 120;
													}
													//console.log("why 0");
												}else if(doorClosing[q].lap==1){
													if(calculateDoors("opening")=="top"){ 
														doorXanimClose = 0;
													}if(calculateDoors("opening")=="mid"){ 
														if(!aver){
															doorXanimClose = 120;
															aver=true;
														}
														
													}else if(calculateDoors("opening")=="bottom"){ 
														doorXanimClose = 120;
													}
													//console.log("PUTAL LAWE");
												}else if(doorClosing[q].lap==2){
													if(calculateDoors("opening")=="top"||calculateDoors("opening")=="mid"){ 
														doorXanimClose = 0;
														//console.log("PUTAL LAWE");

													}

												}else if(doorClosing[q].lap==3){
													
													doorXanimClose = 0;
														aver=false;
												} 
											}/// howmany == 9||6


											ctxBg.drawImage(doors, doorX+doorXanimClose, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);

										}/// 301 - tiles
									}/// if door active
								}/// for obstacles

									
								// if(doorClosing[q].isOpen!="closed"){
								
								// 	console.log("open id "+doorClosing[q].id);
								// 	console.log("open MIERDA "+doorClosing[q].isOpen);
								// }


								if(doorClosing[q].id==doorClosingRememberId&&doorClosing[q].isOpen=="open"){
													
									if(doorClosing[q].animC>=0){

										doorClosing[q].animC+=1;

									}else{
										
										console.log("FUUUCK "+doorClosing[q].animC);

										doorClosing[q].isOpen="closed";
										//doorXAnim=120;
				
									}
								}////////////
								
			
							}/// if doorClosing[q].id==mapOverDraw[tileMapIndex]

						}//FOR doorClosing
	

					}/// if doorClosing.length>0		

																													
													








																								 
						///////   //    //  //////    ////////      /////////          
						//   //   //   //  //        //    //          ///          
						//   //   //  //   ///      ///////            ///    ///
						//   //   /////    //      //    //            ///  ///
						//////    ////     ////// ///   //             ///    //      
																		   ///                 
					// and then these down here on top of everything else    
					/// down here draws again on top those tiles that need to be OVER Player
					function overPlayer(){
					
						 /// Areas roof when outside
						if(mapOverDraw[tileMapIndex].toString().substring(0,1)==7||mapOverDraw[tileMapIndex].toString().substring(0,1)==6||mapOverDraw[tileMapIndex].toString().substring(0,1)==4){  
			   /// have to leave == 250, ,  fixed, or else there's no way to add && <3 in this multiple if/else

				//img, srcX, srcY  and get 250 right in sprite 

							if(!inArea.inIt){
							/// 40 is the width of the portion to be drawn from the sprite (actual width in the sprite)
							ctxOverlay.drawImage(img, srcX, srcY, 64, 64, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
							}
								
						}  




						////  this ones always over player
						if(mapOverDraw[tileMapIndex]==108){   /// y menos de la mitad
					   
							/// 33 is the width of the portion to be drawn from the sprite (actual width in the sprite)
							ctxOverlay.drawImage(img, srcX, srcY+areaY, 64, 64, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
								
						}    
						/// 301 when inside and notOpen


						if(mapOverDraw[tileMapIndex]>=210&&mapOverDraw[tileMapIndex]<=220){  
			   /// have to leave == 250, ,  fixed, or else there's no way to add && <3 in this multiple if/else

				//img, srcX, srcY  and get 250 right in sprite 

							if(!inArea.inIt){
							/// 40 is the width of the portion to be drawn from the sprite (actual width in the sprite)
							ctxOverlay.drawImage(img, 1152,0, 64, 64, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
							}
								
						} /// 251 culd be something else like roof


						if(mapOverDraw[tileMapIndex]>=400&&mapOverDraw[tileMapIndex]<499){  
			  
							if(inArea.inIt){
							/// 40 is the width of the portion to be drawn from the sprite (actual width in the sprite)
								if(mapOverDraw[tileMapIndex]>=400&&mapOverDraw[tileMapIndex]<450){
										doorX=40;
										doorY=120;
										tallerDoor=20;

								}
																									/// meaning IS out
								if(mapOverDraw[tileMapIndex]>=400&&mapOverDraw[tileMapIndex]<450&&mapOverDraw[tileMapIndex-1].toString().substring(0,1)==1){
										doorX=40;
										doorY=0;
										tallerDoor=20;
								}

								if(typeof mapOverDraw[tileMapIndex+1] != "undefined"){
									
									if(mapOverDraw[tileMapIndex]>=400&&mapOverDraw[tileMapIndex]<450&&mapOverDraw[tileMapIndex+1].toString().substring(0,1)==1){
											doorX=40;
											doorY=60;
											tallerDoor=20;

									}
								}

							   


									ctxOverlay.drawImage(doorFrames, doorX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
									tallerDoor=0;
							}
								
						}

						if(mapOverDraw[tileMapIndex].toString().substring(0,1)==7){
							if(inArea.inIt){
				   

								if(typeof mapOverDraw[tileMapIndex+roomNumberTilesX] != "undefined"){
									
									if(mapOverDraw[tileMapIndex+roomNumberTilesX].toString().substring(0,1)==4||mapOverDraw[tileMapIndex+roomNumberTilesX].toString().substring(0,1)==3){
										//alert(tileIndexX);
											doorX=40;
											doorY=180;
										ctxOverlay.drawImage(doorFrames, doorX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
									tallerDoor=0;
									}
								}


									
							}
						}

						if(mapOverDraw[tileMapIndex].toString().substring(0,1)==8){   /// y menos de la mitad


							if(!inArea.inIt){
							/// 33 is the width of the portion to be drawn from the sprite (actual width in the sprite)
							ctxOverlay.drawImage(img, defaultTiles[8].x, defaultTiles[8].y, 64, 64, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
							}
								
						}    

					}

					overPlayer();










	/////   ///////   ///////   /////     /////               
	//      //   ///  //        //       ///                  
	///     //  ///   //   //   ///      //////       
	//      //////    //   ///  //          ///     
	//////  ////      ///////   //////  /////   


						/////   ///////   ///////   /////     /////               
						//      //   ///  //        //       ///                  
						///     //  ///   //   //   ///      //////       
						//      //////    //   ///  //          ///     
						//////  ////      ///////   //////  /////    



					var tilesToCheck=[];
				///////   SO.... redo edges more tidy!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

					if(typeof mapOverDraw[tileMapIndex+roomNumberTilesX+1]!= "undefined"){


						if(mapOverDraw[tileMapIndex].toString().substring(0,1)==1&&mapOverDraw[tileMapIndex+roomNumberTilesX].toString().substring(0,1)==2||mapOverDraw[tileMapIndex].toString().substring(0,1)==3&&mapOverDraw[tileMapIndex+roomNumberTilesX].toString().substring(0,1)==2){
							
							tilesToCheck=[100, 101, 105, 108, 120, 130];

							if(addEdges("roof-lower-left")){
								if(!inArea.inIt){
									ctxOverlay.drawImage(edges, 0 ,80, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);
								}
								
							}

							if(addEdges("roof-left")){
								if(!inArea.inIt){
									ctxOverlay.drawImage(edges, 240 ,80, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);
								}
								
							}

							if(addEdges("roof-lower-right")){
								if(!inArea.inIt){
									ctxOverlay.drawImage(edges, 40 ,80, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);
								}
								
							}

							if(addEdges("roof-right")){
								if(!inArea.inIt){
									ctxOverlay.drawImage(edges, 280 ,80, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);
								}
								
							}


							
				

						}

						if(mapOverDraw[tileMapIndex].toString().substring(0,1)==7&&mapOverDraw[tileMapIndex+roomNumberTilesX].toString().substring(0,1)==2||mapOverDraw[tileMapIndex+roomNumberTilesX]==101||mapOverDraw[tileMapIndex].toString().substring(0,1)==4&&mapOverDraw[tileMapIndex+roomNumberTilesX].toString().substring(0,1)==2||mapOverDraw[tileMapIndex+roomNumberTilesX]==101){
							///
							//// like, this kinda shit should be in tilesToEXCLUDE [array]
			

							tilesToCheck=[710, 714, 709,  400, 401, 402];

							if(addEdges("roof-lower-left")){
								if(inArea.inIt){
									ctxOverlay.drawImage(edges, 0 ,80, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);
								}
								
							}

							if(addEdges("roof-left")){
								if(inArea.inIt){
									ctxOverlay.drawImage(edges, 240 ,80, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);
								}
								
							}

							if(addEdges("roof-lower-right")){
								if(inArea.inIt){
									ctxOverlay.drawImage(edges, 40 ,80, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);
								}
								
							}

							if(addEdges("roof-right")){
								if(inArea.inIt){
									ctxOverlay.drawImage(edges, 280 ,80, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);
								}
								
							}
				
							tilesToCheck=[214, 219, 401, 668, 232, 101, 710];
							if(!inArea.inIt){
								if(addEdges("floor-lower-right")){
									
										ctxOverlay.drawImage(edges, 40, 40, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 		
								}

								if(addEdges("floor-lower-left")){
									
										ctxOverlay.drawImage(edges, 0, 40, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 		
								}
							}
						
						}


						// if(mapOverDraw[tileMapIndex]>=120&&mapOverDraw[tileMapIndex]<150){
							
						// 	tilesToCheck=[120, 130, 214];

						// 	if(addEdges("floor-lower-left")){
						// 		if(!inArea.inIt){
						// 			ctxBg.drawImage(edges, 0, 0, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 
						// 		}
								
						// 	}
						// 	if(addEdges("floor-lower-right")){
						// 		if(!inArea.inIt){
						// 			ctxBg.drawImage(edges, 40, 0, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 
						// 		}
								
						// 	}
						// 	if(addEdges("floor-upper-left")){
						// 		if(!inArea.inIt){
						// 			ctxBg.drawImage(edges, 80, 0, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 
						// 		}
								
						// 	}
						// 	if(addEdges("floor-upper-right")){
						// 		if(!inArea.inIt){
						// 			ctxBg.drawImage(edges, 120, 0, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 
						// 		}
								
						// 	}
						// }



						if(mapOverDraw[tileMapIndex].toString().substring(0,1)==2){
							if(!inArea.inIt){
								tilesToCheck=[222, 214, 218, 219, 227, 232, 710, 714, 709, 301, 400, 401, 402, 403];

								if(addEdges("floor-lower-left")){
									
										ctxBg.drawImage(edges, 0, 0, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 		
									
								}
								
								if(addEdges("floor-lower-right")){
									
										ctxBg.drawImage(edges, 40, 0, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 		
								}

								
								




							}else if(inArea.inIt&&mapOverDraw[tileMapIndex]!=222){
								tilesToCheck=[222, 214, 218, 219, 227, 232, 301, 100, 101, 108];
								if(addEdges("floor-lower-left")){
									
										ctxBg.drawImage(edges, 0, 120, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 									
								} 

								tilesToCheck=[222, 214, 218, 219, 227, 232, 301, 100, 101, 108];
								if(addEdges("floor-lower-right")){
									
									ctxBg.drawImage(edges, 40, 120, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);	
								}
							}

						}



						/// ANIM edges  (over outsider sharp corners)

						if(mapOverDraw[tileMapIndex].toString().substring(0,1)==2||mapOverDraw[tileMapIndex].toString().substring(0,1)==1){

							if(!inArea.inIt){

								tilesToCheck=[120, 130];

								if(mapOverDraw[tileMapIndex-roomNumberTilesX]!=120){
									if(addEdges("anim-lower-left")){
										
											ctxBg.drawImage(animEdges, 0+areaEdgeX, 0, 64, 64, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 		
										
									}
								}
								if(mapOverDraw[tileMapIndex-roomNumberTilesX]!=120&&mapOverDraw[tileMapIndex-1]!=120){
									if(addEdges("anim-lower-right")){
										
											ctxBg.drawImage(animEdges, 192+areaEdgeX, 0, 64, 64, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 		
									}
								}
								if(mapOverDraw[tileMapIndex]!=130&&mapOverDraw[tileMapIndex].toString().substring(0,1)!=2){
									if(addEdges("anim-upper-left")){
											
										ctxBg.drawImage(animEdges, 380+areaEdgeX, 0, 64, 64, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 		
											
									}
								}
								if(mapOverDraw[tileMapIndex]!=130&&mapOverDraw[tileMapIndex].toString().substring(0,1)!=2){
									if(addEdges("anim-upper-right")){
											
										ctxBg.drawImage(animEdges, 576+areaEdgeX, 0, 64, 64, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 		
											
									}
								}

								tilesToCheck=[130];

								if(addEdges("anim-lower-left")){
									
										//console.log(areaEdgeX);
										ctxBg.drawImage(animEdges, 768+areaEdgeX, 0, 64, 64, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 		
									
								}
								
								if(addEdges("anim-lower-right")){
									
										ctxBg.drawImage(animEdges, 960+areaEdgeX, 0, 64, 64, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 		
								}
							}
						}






						if(mapOverDraw[tileMapIndex]==232){
								//alert("HERE");
							tilesToCheck=[232];
							if(!inArea.inIt){
								if(addEdges("floor-upper-right")){
										
									ctxOverlay.drawImage(edges, 40, 160, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 		
								}

								if(addEdges("floor-upper-left")){
										
									ctxOverlay.drawImage(edges, 0, 160, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 		
								}
							}else{
								if(addEdges("floor-upper-right")){
										
									ctxOverlay.drawImage(edges, 40, 160, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 		
								}

								if(addEdges("floor-upper-left")){
										
									ctxOverlay.drawImage(edges, 0, 160, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 		
								}
							}
						}else if(mapOverDraw[tileMapIndex]==214){
								
							tilesToCheck=[214, 710, 714,709,  711];
							if(!inArea.inIt){
								if(addEdges("floor-lower-right")){
										
									ctxOverlay.drawImage(edges, 40, 40, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 		
								}

								if(addEdges("floor-lower-left")){
										
									ctxOverlay.drawImage(edges, 0, 40, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 		
								}
							}else{
								tilesToCheck=[214];
								if(addEdges("floor-lower-right")){
										
									ctxOverlay.drawImage(edges, 40, 160, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 		
								}

								if(addEdges("floor-lower-left")){
										
									ctxOverlay.drawImage(edges, 0, 160, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 		
								}
							}
						}


						
						if(mapOverDraw[tileMapIndex]==219){

							/// rather than &&mapOverDraw[tileMapIndex]!=400, should have:
															//// tilesToCheck & tilesToExclude

							tilesToCheck=[710, 714, 709, 214];

							if(!inArea.inIt){
								if(addEdges("floor-upper-right")){
									
										ctxOverlay.drawImage(edges, 40, 40, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 		
								}

								if(addEdges("floor-upper-left")){
									
										ctxOverlay.drawImage(edges, 0, 40, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 		
								}
							}
						}
						if(mapOverDraw[tileMapIndex]==668){

							/// rather than &&mapOverDraw[tileMapIndex]!=400, should have:
															//// tilesToCheck & tilesToExclude

							tilesToCheck=[222, 214];

							if(!inArea.inIt){
								if(addEdges("floor-lower-right")){
									
										ctxOverlay.drawImage(edges, 40, 40, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 		
								}

								if(addEdges("floor-lower-left")){
									
										ctxOverlay.drawImage(edges, 0, 40, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 		
								}
							}
						}

					}
					
					
					function addEdges(where){

						var edgeCheck=true;

						if(where=="floor-lower-left"){

							for (var i = 0; i< tilesToCheck.length ; i++){
								if(mapOverDraw[tileMapIndex+roomNumberTilesX-1]!=tilesToCheck[i]&&mapOverDraw[tileMapIndex-1]!=tilesToCheck[i]&&mapOverDraw[tileMapIndex+roomNumberTilesX]!=tilesToCheck[i]){  
									if(edgeCheck!=false){
										edgeCheck=true;
									}

									
									//console.log(mapOverDraw[tileMapIndex+roomNumberTilesX-1]);
									
								}else{
									//console.log(mapOverDraw[tileMapIndex+roomNumberTilesX-1]);
									edgeCheck=false;
								}

								//console.log(edgeCheck);
							}		
						}

						if(where=="floor-lower-right"){

							for (var i = 0; i< tilesToCheck.length ; i++){
								if(mapOverDraw[tileMapIndex+roomNumberTilesX+1]!=tilesToCheck[i]&&mapOverDraw[tileMapIndex+1]!=tilesToCheck[i]&&mapOverDraw[tileMapIndex+roomNumberTilesX]!=tilesToCheck[i]){  
									if(edgeCheck!=false){
										edgeCheck=true;
									}

									
									//console.log(mapOverDraw[tileMapIndex+roomNumberTilesX-1]);
									
								}else{
									//console.log(mapOverDraw[tileMapIndex+roomNumberTilesX-1]);
									edgeCheck=false;
								}

								//console.log(edgeCheck);
							}		
						}

						if(where=="anim-lower-left"){
							edgeCheck=false;
							for (var i = 0; i< tilesToCheck.length ; i++){
								if(mapOverDraw[tileMapIndex+roomNumberTilesX]==tilesToCheck[i]&&mapOverDraw[tileMapIndex-1]==tilesToCheck[i]&&mapOverDraw[tileMapIndex-roomNumberTilesX-1]==120||mapOverDraw[tileMapIndex+roomNumberTilesX]==tilesToCheck[i]&&mapOverDraw[tileMapIndex-1]==tilesToCheck[i]){  
									
										edgeCheck=true;

								}

							}		
						}

						if(where=="anim-upper-left"){
							edgeCheck=false;
							for (var i = 0; i< tilesToCheck.length ; i++){
								if(mapOverDraw[tileMapIndex-roomNumberTilesX]==tilesToCheck[i]&&mapOverDraw[tileMapIndex-1]==tilesToCheck[i]&&mapOverDraw[tileMapIndex-roomNumberTilesX-1]==tilesToCheck[i]){  
									
										edgeCheck=true;

								}

							}		
						}

						if(where=="anim-lower-right"){
							edgeCheck=false;
							for (var i = 0; i< tilesToCheck.length ; i++){
								if(mapOverDraw[tileMapIndex+roomNumberTilesX]==tilesToCheck[i]&&mapOverDraw[tileMapIndex+1]==tilesToCheck[i]&&mapOverDraw[tileMapIndex-roomNumberTilesX+1]==120||mapOverDraw[tileMapIndex+roomNumberTilesX]==tilesToCheck[i]&&mapOverDraw[tileMapIndex+1]==tilesToCheck[i]){  
									
										edgeCheck=true;

								}

							}		
						}

						if(where=="anim-upper-right"){
							edgeCheck=false;


							for (var i = 0; i< tilesToCheck.length ; i++){
							//console.log("CHECKING" +tilesToCheck[i]);

								if(mapOverDraw[tileMapIndex-roomNumberTilesX]==tilesToCheck[i]&&mapOverDraw[tileMapIndex+1]==tilesToCheck[i]||mapOverDraw[tileMapIndex-roomNumberTilesX]==tilesToCheck[i]&&mapOverDraw[tileMapIndex+1]==130){  
									
										edgeCheck=true;

								}

							}		
						}






						if(where=="floor-upper-left"){

							for (var i = 0; i< tilesToCheck.length ; i++){
								if(mapOverDraw[tileMapIndex-roomNumberTilesX-1]!=tilesToCheck[i]&&mapOverDraw[tileMapIndex-1]!=tilesToCheck[i]&&mapOverDraw[tileMapIndex-roomNumberTilesX]!=tilesToCheck[i]){  
									if(edgeCheck!=false){
										edgeCheck=true;
									}

									
									//console.log(mapOverDraw[tileMapIndex+roomNumberTilesX-1]);
									
								}else{
									//console.log(mapOverDraw[tileMapIndex+roomNumberTilesX-1]);
									edgeCheck=false;
								}

								//console.log(edgeCheck);
							}		
						}

						if(where=="floor-upper-right"){

							for (var i = 0; i< tilesToCheck.length ; i++){
								if(mapOverDraw[tileMapIndex-roomNumberTilesX+1]!=tilesToCheck[i]&&mapOverDraw[tileMapIndex+1]!=tilesToCheck[i]&&mapOverDraw[tileMapIndex-roomNumberTilesX]!=tilesToCheck[i]){  
									if(edgeCheck!=false){
										edgeCheck=true;
									}

									
									//console.log(mapOverDraw[tileMapIndex+roomNumberTilesX-1]);
									
								}else{
									//console.log(mapOverDraw[tileMapIndex+roomNumberTilesX-1]);
									edgeCheck=false;
								}

								//console.log(edgeCheck);
							}		
						}






						if(where=="roof-left"){

							edgeCheck=false;

							for (var i = 0; i< tilesToCheck.length ; i++){
								if(mapOverDraw[tileMapIndex-1]!=tilesToCheck[i]){  
									//console.log(mapOverDraw[tileMapIndex+roomNumberTilesX-1]);	
										edgeCheck=true;			
								}

							}	

						}

						if(where=="roof-right"){

							edgeCheck=false;

							for (var i = 0; i< tilesToCheck.length; i++){
								if(mapOverDraw[tileMapIndex+1]!=tilesToCheck[i]){
									//console.log(mapOverDraw[tileMapIndex+roomNumberTilesX-1]);	
										edgeCheck=true;			
								}

							}	

						}



						if(where=="roof-lower-left"){

							for (var i = 0; i< tilesToCheck.length ; i++){
								if(mapOverDraw[tileMapIndex+roomNumberTilesX-1]!=tilesToCheck[i]){  
									//console.log(mapOverDraw[tileMapIndex+roomNumberTilesX-1]);	
									if(edgeCheck!=false){
										edgeCheck=true;
									}

									
									//console.log(mapOverDraw[tileMapIndex+roomNumberTilesX-1]);
									
								}else{
									//console.log(mapOverDraw[tileMapIndex+roomNumberTilesX-1]);
									edgeCheck=false;
								}
							}	
						}
						
						if(where=="roof-lower-right"){
							
							for (var i = 0; i< tilesToCheck.length ; i++){

								if(mapOverDraw[tileMapIndex+roomNumberTilesX+1]!=tilesToCheck[i]&&mapOverDraw[tileMapIndex+roomNumberTilesX+1]!=100){ 

									if(edgeCheck!=false){
										edgeCheck=true;
									}	
									
								}else{

									edgeCheck=false;
								}
							}	
						}


						if(edgeCheck){
							return true;
						}


						
					}







				}///   if(mapOverDraw[tileMapIndex]==defaultTiles[j].t){

			}/////  FOR defaultTiles



			tileIndexX+= tileWidthHeight;
			tileMapIndex++;

		}// For roomTiles X


		tileIndexY+=tileWidthHeight;
		tileIndexX=newTileIndexX;

		/// menuMap edges <<<  here in outer loop so they don't overload CPU
		ctxMapOverMenu.clearRect(130,0, 50,120);
		ctxMapOverMenu.clearRect(0,0, 130,10);
	}// For roomTiles Y


	animX++;  /// moves to the next ANIM-frame for the animated tiles

	doorsFound=[];
	doorsReFound=[];


/////
////  BIen conchadetumadre BIEN!!!!! /////////////////////////////////////////////
//////                            /////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

	for (var q = 0; q< doorOpening.length; q++) {
										
		doorOpening[q].timer--;
		//console.log("SDSDSDSDSDDDSD "+doorOpening[q].timer);

		if(doorOpening[q].timer<=0){
			doorOpening[q].timer=0;
	
			//doorOpening[q].isOpen=="closed";
		}
	}
		

	if(!checkDoorGroups){

		var thisID=null;
		var currentTotal=0;
		
		for (var o = 0; o < doorGroups.length; o++){

			if(thisID==null){
				thisID=doorGroups[o].id;
				currentTotal=1;
			}

			if(thisID==doorGroups[o].id){
				currentTotal=doorGroups[o].n;

					
			}else{
				doorGroupsTotal.push({id:thisID, n:currentTotal});
					thisID=doorGroups[o].id;
					currentTotal=1;
			}

			if(o==doorGroups.length-1){
				doorGroupsTotal.push({id:thisID, n:currentTotal});
			}


			// console.log("id " +doorGroups[o].id);
			// console.log("# " +currentTotal);	
		}
		checkDoorGroups=true;
	}



	function calculateDoors(state){

		var doorCounter2=0;

		for (var u = 0; u < doorGroupsTotal.length; u++){
	
			if(mapOverDraw[tileMapIndex]==doorGroupsTotal[u].id){

				// doorsReFound.push(doorGroupsTotal[u].id);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

				if(doorGroupsTotal[u].n==4||doorGroupsTotal[u].n==8){
					
					columnsPerRow2=doorGroupsTotal[u].n/2;

					for (var b = 0; b < doorsFound.length; b++){

						if(doorsFound[b]==doorGroupsTotal[u].id){
							if(doorCounter2<doorGroupsTotal[u].n){
								doorCounter2++;
							}else{
								doorCounter2=0;
							}						
						}
					}

					if(state=="howmany"){
						return doorGroupsTotal[u].n;							
					}

					if(state=="static"){
				
						if(inArea.inIt){
							if(doorCounter2<=columnsPerRow2){
																
								doorX=200;
							}else{
								doorX=200;
							}
							//// 450< door lower wall |||| 450>  Door upper wall
						}else if(!inArea.inIt){

							if(doorCounter2<=columnsPerRow2){
								doorX=200;
							}else{
								doorX=200;
							}
						}
					}else if(state=="opening"){

						if(doorCounter2<=columnsPerRow2){
											
							return "top";

						}else if(doorCounter2>columnsPerRow2){

							return "bottom";
						}
					}/// IF State

//////////////////////////////////////////////////////////////////////////////////////////////////////////////


				}else if(doorGroupsTotal[u].n==6||doorGroupsTotal[u].n==9){
					
					columnsPerRow2=doorGroupsTotal[u].n/3;


					for (var b = 0; b < doorsFound.length; b++){

						if(doorsFound[b]==doorGroupsTotal[u].id){
							if(doorCounter2<doorGroupsTotal[u].n){
								doorCounter2++;
							}else{
								doorCounter2=0;
							}							
						}
					}
													
					
					if(state=="howmany"){
						return doorGroupsTotal[u].n;
							
					}
										
					if(state=="static"){
				
						if(inArea.inIt){
							if(doorCounter2<=columnsPerRow2*2){
																
								doorX=200;
							}else{
								doorX=200;
							}
							//// 450< door lower wall |||| 450>  Door upper wall
						}else if(mapOverDraw[tileMapIndex]<450&&!inArea.inIt){

							if(doorCounter2<=columnsPerRow2*2){
								doorX=200;
							}else{
								doorX=200;
							}
						}
					}else if(state=="opening"){

						//console.log(doorGroupsTotal[u].n);

						if(doorCounter2<=columnsPerRow2){
											
							return "top";

						}else if(doorCounter2>columnsPerRow2&&doorCounter2<=columnsPerRow2*2){
											
							return "mid";

						}else if(doorCounter2>columnsPerRow2*2){

							return "bottom";
						}
					}/// IF State
				}// if 6||9
			} // IF mapOverDraw[tileMapIndex] == door ID
		}// FOR doorGroupsTotal
							//console.log("LENGHT "+doorsReFound.length);
	}/// calculate Doors
} /////   tilesOverDraw  



















//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={


//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^

//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"h}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^//()={}"ht:^












					 ///////   ||||||  ||||||  ||////          /////   ////// /////   //    //
					 //   ///  ||||||  ||||||  ||  //         //  // //   // //      ////  //
					 //  ///   ||||||  ||||||  ||///          ///// //////  ////    // /////
					 //////    ||||||  ||||||  ||  \\              //       ////// //   ///
																  //  



var doorOpeningExists=false;
var memberII;

function doorOpen(id, timer){

	////>>>  Obstacle Breaking...

	//doorLaps=0;

	console.log("L now wwwwwwwwwwwwwwwwwwwwwwwwwwwww" +doorOpening.length);

	for(var i=0; i <doorOpening.length; i++){

		if(doorOpening[i].id==id){
			
			doorOpeningExists=true;
			memberII=i;
		}
		
	}

	if(doorOpeningExists){
		doorOpening[memberII].closeDone=false;
		doorOpening[memberII].animC=0;
		doorOpening[memberII].animX=0;
		doorOpening[memberII].timer=30;
		doorOpening[memberII].lap=0;
		doorOpening[memberII].isOpen="closed";

		doorOpeningExists=false;

		console.log("seocond+ "+id);///now thats right

	}else{
		console.log("first "+id);
		doorOpening.push({id:id, animC:0, animX:0, timer:timer, lap: 0, closeDone:false, isOpen:"closed"}); 
		doorOpeningExists=false;
	}

	inActive.push(id);

   
	inDoorCrash.crash=false;


	for(var i=0; i < obstacles.length; i++){
		if(i>0){
			/// id -> doorOpen(argument)
			if(id==obstacles[i].doorID){
				 //// KEEP TRACK OF THE id >> bring obstacle back to "active"
				//console.log(obstacles[i].doorID);		
				obstacles[i].isActive="inActive"; ////animC:0, animX:0, timer:timer, closeDone:false, isOpen:"closed"}); 


			}
		}///if i   
	}// for obst length

	player1.direction="nowhere";

	// this feels a lot better>>  watch out though, sometimes you have to press direction again to go back

}/// doorOpen





var doorClosingExists=false;
var memberI;


function doorClose(id, animC, animX){


	// ok, so its getting the length right..
	//console.log(doorClosing.length);

	for(var i=0; i < obstacles.length; i++){

			/// id -> doorOpen(argument)
			if(id==obstacles[i].doorID&&id!=401){////////////   ladies & gentlemen, an exception.
					////															        401 doesn't close
				 //// KEEP TRACK OF THE id >> bring obstacle back to "active"	
				obstacles[i].isActive="active"; 

				for (var o=0; o< inActive.length; o++) {

			/// now look for all doors that where marked "inActive", and release them
	/// so when coming back from another room it doesn't remember them as opened (after they have been re-closed)
					if(inActive[o]==id){
						inActive.splice(o,1);/// it isn't inActive aymore if it closed again
					}
				}
			}


	}// for obst i

	//console.log("door l "+doorClosing.length);
	for(var i=0; i <doorOpening.length; i++){
		if(doorOpening[i].id==id){
			doorClosingExists=true;
		
			memberI=i;

			/// also only doing it first doorClose........
			console.log("dddddddddddddddddddddddoor Closing "+ doorOpening[i].id);
		}
	
	}	
	if(!doorClosing[memberI]){
		doorClosing.push({id:id, animC:animC, animX:animX, isOpen:"open"});
	}

	if(doorClosingExists){
		console.log("RER rrrrrrrrrrrrrrrrrrrrrERERER  "+ doorClosing[memberI].id);
		doorClosing[memberI].animC=animC;
		doorClosing[memberI].animX=animX;
		doorClosing[memberI].lap=0;					
		doorClosing[memberI].isOpen="open";

		doorClosingExists=false;

	}

}/// doorClose








///////   |||||\\\\  |||||\\\\  ||\ |\ /\         ////////    //  //
//   //   |||||\\\\  |||||\\\\  |||||\\\\         ///    //   //  //
//////    |||||\\\\  |||||\\\\  |||||\\\\         //          //////
///  //   |||||\\\\  |||||\\\\  |||/  \\\         //          //  //
///  ///  |||||\\\\  |||||\\\\  ||/    \\         ///    //   //  //
												  ////////

function changeRoom(whatRoom, whatDoorId, newShiftX, newShiftY, type){ ///////////////////   WHAT AREA!

		clearCtx(ctxPlayer);


		//block buttons so can't pause and go through door at the same time!!!!!!!!!!!!!
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		isPlaying = false;

		//////////// this 2-4 doen here will dpend on what door(to other room, diff from obstacle door -> Array) you went through
		nextRoom =whatRoom;
		doorID=whatDoorId;


		//// only do this  IF player1.drawY > window.innerWidth/2){}
		shiftX=newShiftX;

		shiftY=newShiftY;   //////////  now, this shift has to be dependent on where this  PARTICULAR tile is located!!!

		//////////   
	   // console.log("ahora "+shiftY);


	   /// IF .... diff conditions for different type of doors.. (teleport vs)
		paused=true;
		pauseType=type;
		 ///// this should be a PARAMETER!!!  <<<<<<<<<<<
									////////////   so it can be change depending on when you call it!


		roomChangeLoop();

}




/// This is a bit messed up, it works but only if both rooms keep the same amount of Y tiles (or X I supposed, when X is implemented)...   but thats fine >>> the same room[tileMap] can be used for many different "mini" rooms




function roomChangeLoop() {
			  
	
	if(typeof player1 !="undefined"){

		// no Shoting while changing room >> Avoid that frozen bullet if you happen to shoot before you move
	//////																					after changing rooms
		player1.shooting=false;

		////    SOMEHOW
//// 		this here fixes the RoomChange, when player gets to the door with last of momentum/friction/slowDown 
/////																	( & therefore presumably speed 0)
		if(player1.speed==0){
			player1.speed=1;
		}

	}
	

	

	pausedRoomChangeLoop=true;    

	if (paused) {
		
		
		//////////////////////////////////////////////////////////////////////////////////

			//clearCtx(ctxPlayer);

			// player1.drawY=newerY;
			// player1.drawX=newerX;
			// console.log("N Y "+newerY);

			var firstCol= false;
			var roomToMap;
			var memberShiftY;


			/// HERE, before areas = []; gets emptied out,  we set  -300VAR according to how far from the top of the screen the door is
			for (var k = 0; k < areas.length; k++) {
					
				//console.log("GOING TO "+doorID);
				if(areas[k].doorID==doorID){
					/// first grab this door
					if(!firstCol){

						if(nextRoom=="room-1"){
							roomToMap = whatRoomMap("room-1");
						}else if(nextRoom=="room-2"){
							roomToMap = whatRoomMap("room-2");;
						}

						for(var e = 0; e<roomToMap.length; e++){ /////////  room-2 >>> 1map, 3 map >>> SEGUN DONDE VAYA
							if(roomToMap[e]==doorID){
								//console.log("row kinda like  .."+((e/roomNumberTilesX)*tileDiameter));
								//console.log("WHERE "+(e/roomNumberTilesX)*tileDiameter);
							

							}/// if room-N-map == doorID

						}///for room-N-map

						//console.log("DVAR "+daVar);
						firstCol=true;// so gets only first
					}
						
				}/// if areas == doorID

			}///for areas


			 ///if still paused, then this inside
			if(pauseCount<(Math.round(canvasOverOverlay.height/2))){   ///<(canvasHeight/2)

				// if opening screen(var).. do this real QUICK!

				//console.log(canvasOverOverlay.height/2);
				if(pauseType=="normal"){//
					ctxOverOverlay.fillStyle = "#000000";
					ctxOverOverlay.fillRect(0, 0, canvasWidth-50, 40+pauseCount);   

					// var pauseCountIncrease=Math.round(window.innerHeight)/(Math.round(window.innerHeight)/10);
					var pauseCountIncrease=Math.round(window.innerHeight)/(Math.round(window.innerHeight)/10);
					pauseCount+=4;

				}else if(pauseType=="teleport"){
					ctxOverOverlay.fillStyle = "#ff0000";
					ctxOverOverlay.fillRect(0, 0, canvasWidth-50, 40+pauseCount);   

					// var pauseCountIncrease=Math.round(window.innerHeight)/(Math.round(window.innerHeight)/10);
					var pauseCountIncrease=Math.round(window.innerHeight)/(Math.round(window.innerHeight)/10);
					pauseCount+=4.3;
				}




				blockInput=true;


				///roomChangeLoop();   // for gameCounter purposes

				requestAnimFrame(roomChangeLoop);

			}else{

				clearCtx(ctxOverOverlay);

				// cool roomChange graphics are over, 
				///	now resolve the values at hand before resuming the game

				paused=false;
				isPlaying=true;
				pauseCount=0;
				//currentArea="default";

				obstacles = [];
				areas = [];
				doors = [];

				clearCtx(ctxBg);
				clearCtx(ctxOverlay);

				memberShiftY = Math.abs(shiftY);
				memberShiftX = Math.abs(shiftX);


///////////////////////////////////////////////////////////////////////////////////////
////// a continuacion..

/////////////////////// FIX SCREEN & Player position RELATIVE TO WHERE doorTo is


				// first remember the limits for PlayerMoves vs EverythingElseDoesInstead Box
				if(canvasBg.width<window.innerWidth){
					var boxLimit_XL = canvasBg.width/8*3.3,   
						boxLimit_XR = canvasBg.width/8*4.7,
						boxLimit_YT = canvasBg.height/8*3.3,
						boxLimit_YB = canvasBg.height/8*4.7; 
				}else{
					var boxLimit_XL = (window.innerWidth/16)*7,    
						boxLimit_XR = (window.innerWidth/16)*9,
						boxLimit_YT = (window.innerHeight/8)*3,
						boxLimit_YB = (window.innerHeight/8)*5;
				}
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

				/// check how many tiles per X/Y axis on the roomMap you are going to
									/// (so as to then calculate the doorID location)
				checkTileNumbers(nextRoom);

				/// get doorTo Index in map Array
				var doorIndex=	whatRoomMap(nextRoom).indexOf(doorID);

				/// Y axis:                                               \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

				/// divide this index by the amount of tiles per X axis,
				///	and round it to trim out the extra tiles (if not the first in the row)
				/// and now with the amount of rows from the top, we multiply by tileDiameter to get our location
				var doorIndexY = Math.round(doorIndex/roomNumberTilesX)*tileDiameter;
				
				var doorIndexX =(doorIndex%roomNumberTilesX)*tileDiameter;
				/// location which is to be compared against the current room Mpa's height
				var mapHeight = roomNumberTilesY * tileDiameter;
				var mapWidth = roomNumberTilesX * tileDiameter;


				if(doorIndexY>=canvasBg.offsetHeight/2&&doorIndexY< mapHeight-(canvasBg.offsetHeight/2)){

					shiftY=(doorIndexY- canvasBg.offsetHeight/2)*-1-menuHeight;

				}else if(doorIndexY>= mapHeight-(canvasBg.offsetHeight/2)){
					shiftY= (mapHeight- canvasBg.offsetHeight)*-1-menuHeight;
				}else if(doorIndexY<=canvasBg.offsetHeight/2){
					shiftY=0;
				}



				if(doorIndexX>=canvasBg.offsetWidth/2&&doorIndexX< mapWidth-(canvasBg.offsetWidth/2)){

					shiftX=(doorIndexX- canvasBg.offsetWidth/2)*-1;

				}else if(doorIndexX>= mapWidth-(canvasBg.offsetWidth/2)){
					shiftX= (mapWidth- canvasBg.offsetWidth)*-1;

				}else if(doorIndexX<=canvasBg.offsetWidth/2){
					shiftX=0;

				}

		/// console.log(mapWidth-(canvasBg.offsetWidth/2));

		  ////////////////////////////////////////////////////////////////////////////////////////
			/////////////
				///// 		DRAW NEW ROOM 
	
				

						

				roomDraw(nextRoom, currentArea, 0, tileDiameter, 0,0,"first", currentLevel); 

				currentRoom=nextRoom;

				for (var k = 0; k < areas.length; k++) {
					if( areas[k].doorID==doorID){

						
						currentArea=areas[k].n;

					}
				}


				

/////////////	
	////////////
		///////	   and adjust both Player and items position (post-shift)
				
				var lastShiftY;
				var lastShiftX;
				///WHRER TO RE-DRAW PLAYER?
				var colRow=false;

				for (var k = 0; k < areas.length; k++) {
					  
					if(areas[k].doorID==doorID){//// AREAS hv to keep track of what ROW/COLUMN they are in, to calculate new shiftX,Y
						   						
						///set player position when new room is Drawn    
						player1.drawX=areas[k].column-10;  
						player1.drawY=areas[k].row-10;

						//I don't know what the fuck is going on here anymore...  but it works
						if(typeof lastShiftY!="undefined"){
							player1.drawY-=Math.abs(lastShiftY);
							
						}else{
							player1.drawY-=Math.abs(shiftY);
						
						}

						if(typeof lastShiftX!="undefined"){
						
							player1.drawX-=Math.abs(lastShiftX);
						}else{
			
							player1.drawX-=Math.abs(shiftX);
						}
						//console.log(lastShiftY);
						//console.log(shiftY);
						lastShiftY =shiftY;
						lastShiftX =shiftX;

						blockedDoorIndex.push(k);
						areas[k].isBlocked="blocked"
							   
					}//// areas[k].doorID==doorID
				}/// for areas
	


				/// I don't even remember hpw this works, but it does
				/// KEEPS ITEMS IN PLACE AFTER MOVING AROUND FROM ONE ROOM TO THE NEXT

			  	for(var k =0; k<items.length; k++){
					  ///// OJO WHAT ROOM!! currentRoom

				  ///ok, so that shiftY is being reset to zero, because of something to do with FirstDraw.. or whatever
				  // point is, need to remember it before it goes to zero, to minus it to the items...

				  if(!firsty){
						items[k].drawY -=Math.abs(shiftY);
						items[k].centerY -=Math.abs(shiftY);  
							
						items[k].drawX -=Math.abs(shiftX);
						items[k].centerX -=Math.abs(shiftX); 

						firsty=true;
				  }else{
						items[k].drawY -=Math.abs(shiftY)-Math.abs(memberShiftY);
						items[k].centerY -=Math.abs(shiftY)-Math.abs(memberShiftY); 

						items[k].drawX -=Math.abs(shiftX)-Math.abs(memberShiftX);
						items[k].centerX -=Math.abs(shiftX)-Math.abs(memberShiftX); 
				  }
												 
				}// for items






				/// and we are done, loop finished, room Changed, now back to the game
				pausedRoomChangeLoop=false;

				// player1.speed=1;
				player1.direction="room-change";
				player1.checkArea();
				

				blockInput=false;
				latestKeys=[];
				superLastKey=null;

				pauseType="gamePause";

				doorBlock=false;

				bulletsFired=[];


			}// end IF pauseCount>(window.innerHeight/2)


		   isPlaying = true;

		   //console.log("player position Y" +player1.drawY);

		   clearCtx(ctxMenuOverOver);	/// gotta clear it, activates with the Pause
		/////////////////////////////////////////////////////////////////////////////////////////

	}

}
		
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
///^%*(\\\\~H><<///^%*(\\\\~H><<///^%*(\\\\~H><<///^%*(\\\\~H><<///^%*(\\\\~H><<///^%*(\\\\~H><<///^%*(\\\\~H><<///^%*(\\\\~H><<///^%*(\\\\~H><<///^%*(\\\\~H><<///^%*(\\\\~H><<///^%*(\\\\~H><<///^%*(\\\\~H><<///^%*(\\












////////////\\	    [] 				 	 []]   []          		[]	    ////
////|\\\||///\\\ 	[] 					[[]]   []         	    []    //
////|\\\|||////\\ 	[]				   [[[]]   []       /|||  	[]  //
////|\\\|||/////\   []				  [[[]]]   []     //	    []//
////|\\\|||//////   []			     [[[[]]]   []   //        	[]/
////|\\||||/////    []		        [[[[]]]]   []  //          	[]
////||||||/////     [] 		  	   [[[[[]]]]   []//         	[]
/////////////       []			  [[[[[]]]]]   []/           	[]
//////              []		     [[[[[[]]]]]   []   /\\\\\\     []
/////               []		    [[[[[[[]]]]]   []           	[]
////			 	[]    	   [[[[[[[]]]]]]   []   	        []
////			    []  	  [[[[[[[]]]]]]]   []           	[]
////                [][][][][[[[[[[[[]]]]]]]   []    \\\\\\\    []






var releaseCounterCount=0;


function Player(type) {
	//where in sprite
	this.srcX = 0;
	this.srcY = 0;

	this.upperSrcX= 1680;
	this.upperSrcY=0;


	//where in tileMap
	this.drawX = 220;
	this.drawY = 200;
	//in sprite with & height/// Math.round it
	// this.width = tileDiameter+(tileDiameter/4);
	// this.height = tileDiameter+tileDiameter/1.6;
	
	this.width = 70; /// this only needs to be 64 (real tight), its 82 now because the Psprite is not using its whole size
	this.height = 70; /// this only needs to be 64 (real tight), its 82 now because the sprite is not using its whole size
	//center
	this.centerX = this.drawX + (this.width / 2);
	this.centerY = this.drawY + (this.height / 2);
	//starting moving values & speed
	this.speed = 0;
	this.moving = true; //can it move?

	this.direction = "nowhere";  // for moving mechanics purposes
	this.facing="nowhere";  /// diff from direction, for shooting Animation/sprite- purposes

	//animation
	this.isDead = false;
	this.animRate = 1;  //  ??

	//special player characteristics  if/elses
	this.playerType = type;

	this.weapons = []; /////////////// every weapon keeps count of its own ammo, 
	this.weaponSelected = 0;
	this.itemSelected=0;

	this.items = [];
	this.guns = [];

	this.shooting=false;
	this.shootingDirection="down";

	this.life=20; //also inside playerType if/elses
	this.lifeTotal=100;
	////  this(all) starts with 0,  then each diff type gets + more or less.. like Diablo, 

	///////
	///
	//   DIFFERENT QUALITIES LIKE speed, power, strength, intelligence.. hp, mp,  etc.....

}


var outtaBullets=false;

var shootCounter = 0;
var oldShootCounter = 0;

/// this should probably be another dimension in array bullets[]
var weaponSpeedRate=1;/// > = slower,  0 =  contraLaser  

var id=0;
//Shit happens
Player.prototype.update = function () {

	this.checkMoving(this.direction, this.moving);//  a bit faster when called right after keyPress
	this.animRate = this.speed/16;   //// like so
	this.animationState(this.dead, this.direction, this.animRate, this.moving);
	this.checkArea();

	if(this.direction!="nowhere"){
		//console.log(this.direction);
		this.shootingDirection=this.direction;
	}else{
		//console.log(lastDir);
		this.shootingDirection=this.facing;
	}

		

	// /////////////   checking items
	// for (var i = 0; i< player1.items.length; i++) {

	// 	if(player1.items[i].itemType=="item"&&player1.items[i].itemNumber==1){
	// 		console.log(player1.items[i].amount);
	// 		///cool, so it succesfully keeps track of the amount of items of a certain "number"
	// 		//// remember >>>  itemType=> item/gun/ammo/life <<>>>  itemNumber => different types of each of those
	// 	}
		
	// }


		if(dash){
			dashCount++;
		}

		shootCounter++;
			
		if(this.shooting){     
			
			

			if(oldShootCounter<shootCounter-weaponSpeedRate){

				for(var i = 0; i<player1.guns.length; i++){
					if(this.weaponSelected==i){
						bullets[i]-=1;
						
						oldShootCounter=shootCounter;
						if(bullets[i]<=0){
							bullets[i]=0;
							outtaBullets=true;
						}else{
							outtaBullets=false;
						}
					}
				}

				
				if(!outtaBullets){

					if(typeof this.shootingDirection == "undefined"){
						this.shootingDirection="down";
					}
					//console.log("first shot  " +this.shootingDirection);

					/// this IF help with the "frozen-bullet" problem.. although not seen lately
					if(player1.facing != "nowhere"){

						if(!doorBlock){
							bulletsFired.push( new activeBullet(id, 0,0,this.drawX,this.drawY+10, 10, 10, this.weaponSelected, this.playerType, this.shootingDirection, true));
							///// sprite needs to be smaller
							id++;
						}

					}
				}// if(!outtaBullets)
				
			}// if weapon speed rate allows

		}/// if shooting




////  DEPENDING ON SELECT WHAT MENU-ITEM PLAYER IS USING  >>>>  1 button for gun, another for life item
///  while other item spermanently do/change something in the game/player  (like activating this dash ability up here)

	if(releaseCounter){
		releaseCounterCount++;
	}
	
	//console.log(("Y " +this.drawY)+("  X "+this.drawX));
	if(this.drawX>800){
		blockInput=true;  /// por que no
		//this.speed=0;
		this.direction="nowhere";
		changeRoom("room-1", 668, shiftX, shiftY, "teleport");
	}
};








/////////     
//|\\/////    
//|\\//////     ////\     ///////   ////   |||||\\\\
//|\\//////     ///  \   ///  //   /////   |||||\\\\  
//|\//////      //   /  ///////   //////   ||||	\\\\
////////        /////  ///   /   /// ///   |||||\\\\
////            ///   ///    /  ///  ///   |||||\\\\
///           
///           



//Shit is shown
Player.prototype.draw = function () {

////////////////////////////////////////   35, 50  ==>> this.width, this.height  ACTUAL W/H IN SPRITE

									///// srcX, Y >> lower body
	
//console.log("GUN SEL"+this.gunSelected); ///  ACCORDING TO THIS WE GO DOWN Y AXIS  inSpritethis.srcY+50, 50, 50, 50
		//////////////////////  then in the future another dimension inSprite for the suits/armor you find
	if(this.weaponSelected==1){
		this.srcY=50;
		this.upperSrcY=50;
	}else if(this.weaponSelected==0){
		this.srcY=100;
		this.upperSrcY=100;
	}else{
		this.srcY=0;
		this.upperSrcY=0;
	}

	//console.log("C Area " +currentSubArea);

	if(currentSubArea != "water"&&currentSubArea != "deep-water"){
		ctxPlayer.drawImage(imgPlayer, this.srcX, this.srcY, 35, 50, this.drawX, this.drawY, this.width, this.height);
	}

	
/////////////////////////////            OK NOW DRAW SPRITE PROPERLY AND THE ANIMATION RIGHT WHEN SHOOTING
////////////
//////////                      moving changes srcX, Y... so should shooting (change upperSrcX, Y)
														  /// upperXrcX + + + as in the if(this.shooting) below

			///////////////   Y AXIS should have a + VAR >>>  + 350..==> all weapons.. if got suit, or + 0  
		///// (at that point all weapon cicles are repeated, but wearing this mega-cool suit)
		  /////
			//////////////////  try same with certain items, such as the goggles or the belt... can be seen
	if(currentSubArea != "deep-water"){

		if(this.shooting){      ///// changing upperSrc Anim according to shooting
			ctxPlayer.drawImage(imgPlayer, this.upperSrcX, this.upperSrcY, 35, 50, this.drawX, this.drawY, this.width, this.height);
		}else{                     //// shifted sprite (srcX, Y) for upperBody parts
			ctxPlayer.drawImage(imgPlayer, this.srcX+840, this.srcY, 35, 50, this.drawX, this.drawY, this.width, this.height);                 //// take off +3, that just to show its been drawn on top
								////            +3 actually + length of sprite (legs/upperbody)
		}

	}

};










/////////
//|\\/////
//|\\//////      /////// ///////   ||||||||  ///   ///   //////  
//|\\//////     ///  /////  ///   ||||||||   ||    //   //      
//|\//////     ///         ///   ////////    ||   //   /////   
////////      ///         ///   ////////     || //    //    
////         ///         ///   ////////      |/      ////////
///
///    




///Player(movement-related)  glob vars

var newDrawX, 
	newDrawY;

var crash = false;
var areasCrash = false;

var crashDir;



Player.prototype.checkMoving = function (direction, moving) {

	// this.direction="up";
	// console.log("alo?" + this.direction);
	////////////////IF SCREEN BIGGER THAN CANVAS
	if(canvasBg.width<window.innerWidth){
		var boxLimit_XL = canvasBg.width/8*3.3,    /// window.inner... or canvas.with depending on what the canvas size is
			boxLimit_XR = canvasBg.width/8*4.7,
			boxLimit_YT = canvasBg.height/8*3.3,
			boxLimit_YB = canvasBg.height/8*4.7; // canvasBg or any other canvas >> should all be the same

	}else{
		//// ELSE
		var boxLimit_XL = (window.innerWidth/16)*7,    /// window.inner... or canvas.with depending on what the canvas size is
			boxLimit_XR = (window.innerWidth/16)*9,
			boxLimit_YT = (window.innerHeight/8)*3,
			boxLimit_YB = (window.innerHeight/8)*5;
	}

	var    sprtLimit_XL = 100, 
	sprtLimit_XR = canvasWidth-100,
	sprtLimit_YT = 100,
	sprtLimit_YB = canvasHeight-100;


	////////////////////////////////
	////
	//     if not too close to room boundaries || not in center-screen-moving-areas >> you move, but the draw X,Y changes for everything else instead
	//console.log(crash);
	if(!this.checkCrash()){ 

		this.moving=true;



	}else {

		//////if direction same as crash -> false. 
		this.moving=false;
		crash=false;
		//console.log("choamo");
	}

	///// denuevo  ACORDARSE ESTO TIENE QUE SER SEGUN PLAYERDRAWX, Y Y AFUERA DE ESTE CHECKEO DE MOVIMIENTO  (sino constante todo el rato hermano)

			if(slowDown){

				if(player1.direction!="room-change"){
				   this.direction=slowDownDirection;     
				   this.speed-=2;
				}
				   //onsole.log(player1.direction)   
				if(paused){
					player1.direction="nowhere";
					//console.log("PAUSED");
				}
			}
				
			

			if(this.speed==0||player1.checkCrash()){
				this.direction="nowhere";

				slowDownDirection="noSlowDown";
				releaseCounterCount=0;
				slowDown=false;
			}



	if(this.moving){



	var newCenterX = Math.round(newDrawX + (this.width / 2)),
		newCenterY = Math.round(newDrawY + (this.height / 2));
		///
		///// if within limits >, <=, >, <=


		newDrawX = this.drawX;
		newDrawY = this.drawY;




		
//////////////      ///      ///////////////////
//////////////      ///  //  ///////////////////
//////////////      ///     ////////////////////
//////////////      ///  ///////////////////////
///////////////    ////  ///////////////////////
///////////////////////  ///////////////////////
////////////////////////////////////////////////

//console.log(latestKeys[0]);


		if(this.direction=="up"){

			if(newCenterY<boxLimit_YT&&canvasHeight+shiftY<canvasHeight-this.speed){
				shiftY+=this.speed;
				clearCtx(ctxMapOverMenu);
				////////////////////////////////   DRAG SHIT

				for(var i =0; i<obstacles.length; i++){
					obstacles[i].topY += this.speed;
					obstacles[i].bottomY += this.speed;
				}


				for(var j =0; j<areas.length; j++){
					areas[j].topY += this.speed;
					areas[j].bottomY += this.speed;
				}
				
				//////  Items have center instead of bottom because thaat's  the point from which they get picked up
				for(var k =0; k<items.length; k++){
					items[k].drawY += this.speed;
					items[k].centerY += this.speed;    

				} 

			}else{
				this.drawY = this.drawY-this.speed;
			}

/////////    //////   /////    ////  ////  /////
/////////     ////    /////    ////  ///   /////
/////////     ////    /////    ////  //    /////
/////////     ////    /////    ////  /  /  /////
/////////    /////   //////    ////    //  /////
////////////////////////////////////////////////


		}else if(this.direction=="down"){



			//console.log(canvasHeight+shiftY);
			if(newCenterY>boxLimit_YB&&canvasHeight-canvasBg.height>=Math.abs(shiftY)+this.speed){
				shiftY-=this.speed;
 				clearCtx(ctxMapOverMenu);
				for(var i =0; i<obstacles.length; i++){
					obstacles[i].topY -= this.speed;
					obstacles[i].bottomY -= this.speed;
				}

				for(var j =0; j<areas.length; j++){
					areas[j].topY -= this.speed;
					areas[j].bottomY -= this.speed;

				}  

				for(var k =0; k<items.length; k++){
					items[k].drawY -= this.speed;
					items[k].centerY -= this.speed;    

				}  
				//console.log(areas[0].topY);         

			}else{
				this.drawY = this.drawY+this.speed;
			}

///				GO ON WITH THE ITEMS RE-DRAW.....................................................................
//////
		}else if(this.direction=="right"){

			/// yep yep 
			if(newCenterX>boxLimit_XR&&canvasWidth>((shiftX*-1)+canvasBg.width+this.speed)){
				shiftX-=this.speed;
				clearCtx(ctxMapOverMenu);
				for(var i =0; i<obstacles.length; i++){
					obstacles[i].leftX -= this.speed;
					obstacles[i].rightX -= this.speed;
				}

				for(var j =0; j<areas.length; j++){
					areas[j].leftX -= this.speed;
					areas[j].rightX -= this.speed;
				}
			  //alert(newObs[0].leftX);
			  	for(var k =0; k<items.length; k++){
					items[k].drawX -= this.speed;
					items[k].centerX -= this.speed;    

				} 

			}else{

				this.drawX = this.drawX+this.speed;

			}            

		}else if(this.direction=="left"){

			if(newCenterX<boxLimit_XL&&canvasWidth+shiftX<canvasWidth-this.speed){
				shiftX+=this.speed;
				clearCtx(ctxMapOverMenu);
				for(var i =0; i<obstacles.length; i++){
					obstacles[i].leftX += this.speed;
					obstacles[i].rightX += this.speed;
				}

				for(var j =0; j<areas.length; j++){
					areas[j].leftX += this.speed;
					areas[j].rightX += this.speed;
				}

				for(var k =0; k<items.length; k++){
					items[k].drawX += this.speed;
					items[k].centerX += this.speed;    

				} 

			}else{
				this.drawX = this.drawX-this.speed;
			}














		}else if(this.direction=="right-down"){


			if(crashDir=="right"){
				/// GOING DOWN!!
				if(newCenterY>boxLimit_YB&&canvasHeight-canvasBg.height>=Math.abs(shiftY)+this.speed){
					shiftY-=this.speed;
 					clearCtx(ctxMapOverMenu);
					for(var i =0; i<obstacles.length; i++){
						obstacles[i].topY -= this.speed;
						obstacles[i].bottomY -= this.speed;
					}

					for(var j =0; j<areas.length; j++){
						areas[j].topY -= this.speed;
						areas[j].bottomY -= this.speed;

					}  

					for(var k =0; k<items.length; k++){
						items[k].drawY -= this.speed;
						items[k].centerY -= this.speed;    

					}  
				//console.log(areas[0].topY);         

				}else{
					this.drawY = this.drawY+this.speed;
				}
			}else if(crashDir=="down"){
				/// GOING RIGHT!!

				if(newCenterX>boxLimit_XR&&canvasWidth>((shiftX*-1)+canvasBg.width+this.speed)){
				shiftX-=this.speed;
				clearCtx(ctxMapOverMenu);
					for(var i =0; i<obstacles.length; i++){
						obstacles[i].leftX -= this.speed;
						obstacles[i].rightX -= this.speed;
					}

					for(var j =0; j<areas.length; j++){
						areas[j].leftX -= this.speed;
						areas[j].rightX -= this.speed;
					}
				  //alert(newObs[0].leftX);
				  	for(var k =0; k<items.length; k++){
						items[k].drawX -= this.speed;
						items[k].centerX -= this.speed;    

					} 

				}else{

					this.drawX = this.drawX+this.speed;

				} 

				// FINALLY>> GOING RIGHT-DOWN
			}else {
				if(newCenterX>boxLimit_XR&&canvasWidth>((shiftX*-1)+canvasBg.width+this.speed)){
					shiftX-=this.speed;
					clearCtx(ctxMapOverMenu);
					for(var i =0; i<obstacles.length; i++){
						obstacles[i].leftX -= this.speed;
						obstacles[i].rightX -= this.speed;
					}

					for(var j =0; j<areas.length; j++){
						areas[j].leftX -= this.speed;
						areas[j].rightX -= this.speed;
					}


					for(var k =0; k<items.length; k++){
						items[k].drawX -= this.speed;
						items[k].centerX -= this.speed;    

					} 



				}else{

					this.drawX = this.drawX+this.speed;

				}

				if(newCenterY>boxLimit_YB&&canvasHeight-canvasBg.height>=Math.abs(shiftY)+this.speed){
					shiftY-=this.speed;
	 				clearCtx(ctxMapOverMenu);
					for(var i =0; i<obstacles.length; i++){
						obstacles[i].topY -= this.speed;
						obstacles[i].bottomY -= this.speed;
					}

					for(var j =0; j<areas.length; j++){
						areas[j].topY -= this.speed;
						areas[j].bottomY -= this.speed;

					}
					for(var k =0; k<items.length; k++){
						items[k].drawY -= this.speed;
						items[k].centerY -= this.speed;    

					}  

				}else{
					this.drawY = this.drawY+this.speed;
				}

			}







///////////////////////////////////////////////////////////////////////////////////////////////////////////////


		} else if(this.direction=="left-down"){




			if(crashDir=="left"){
				/// GOING DOWN!!
				if(newCenterY>boxLimit_YB&&canvasHeight-canvasBg.height>=Math.abs(shiftY)+this.speed){
					shiftY-=this.speed;
	 				clearCtx(ctxMapOverMenu);
					for(var i =0; i<obstacles.length; i++){
						obstacles[i].topY -= this.speed;
						obstacles[i].bottomY -= this.speed;
					}

					for(var j =0; j<areas.length; j++){
						areas[j].topY -= this.speed;
						areas[j].bottomY -= this.speed;

					}
					for(var k =0; k<items.length; k++){
						items[k].drawY -= this.speed;
						items[k].centerY -= this.speed;    

					}

				}else{
					this.drawY = this.drawY+this.speed;
				}
			}else if(crashDir=="down"){
				/// GOING RIGHT!!

				if(newCenterX<boxLimit_XL&&canvasWidth+shiftX<canvasWidth-this.speed){
					shiftX+=this.speed;
					clearCtx(ctxMapOverMenu);		
					for(var i =0; i<obstacles.length; i++){
						obstacles[i].leftX += this.speed;
						obstacles[i].rightX += this.speed;
					}

					for(var j =0; j<areas.length; j++){
						areas[j].leftX += this.speed;
						areas[j].rightX += this.speed;
					}

					for(var k =0; k<items.length; k++){
						items[k].drawX += this.speed;
						items[k].centerX += this.speed;    

					} 
				}else{
					this.drawX = this.drawX-this.speed;
				}

				// FINALLY>> GOING RIGHT-DOWN
			}else {
				
				if(newCenterX<boxLimit_XL&&canvasWidth+shiftX<canvasWidth-this.speed){
					shiftX+=this.speed;
					clearCtx(ctxMapOverMenu);	
					for(var i =0; i<obstacles.length; i++){
						obstacles[i].leftX += this.speed;
						obstacles[i].rightX += this.speed;
					}

					for(var j =0; j<areas.length; j++){
						areas[j].leftX += this.speed;
						areas[j].rightX += this.speed;
					}

					for(var k =0; k<items.length; k++){
						items[k].drawX += this.speed;
						items[k].centerX += this.speed;    

					} 
				}else{
					this.drawX = this.drawX-this.speed;
				}

				if(newCenterY>boxLimit_YB&&canvasHeight-canvasBg.height>=Math.abs(shiftY)+this.speed){
					shiftY-=this.speed;
	 				clearCtx(ctxMapOverMenu);
					for(var i =0; i<obstacles.length; i++){
						obstacles[i].topY -= this.speed;
						obstacles[i].bottomY -= this.speed;
					}

					for(var j =0; j<areas.length; j++){
						areas[j].topY -= this.speed;
						areas[j].bottomY -= this.speed;

					}
					for(var k =0; k<items.length; k++){
						items[k].drawY -= this.speed;
						items[k].centerY -= this.speed;    

					}

				}else{
					this.drawY = this.drawY+this.speed;
				}

			}

			//////////////////////////////////////////////////////////////////////////////////////////////////////









		}else if(this.direction=="left-up"){



			if(crashDir=="left"){
				/// GOING DOWN!!
				if(newCenterY<boxLimit_YT&&canvasHeight+shiftY<canvasHeight-this.speed){
					shiftY+=this.speed;
					clearCtx(ctxMapOverMenu);
					////////////////////////////////   DRAG SHIT

					for(var i =0; i<obstacles.length; i++){
						obstacles[i].topY += this.speed;
						obstacles[i].bottomY += this.speed;
					}


					for(var j =0; j<areas.length; j++){
						areas[j].topY += this.speed;
						areas[j].bottomY += this.speed;
					}
					
					//////  Items have center instead of bottom because thaat's  the point from which they get picked up
					for(var k =0; k<items.length; k++){
						items[k].drawY += this.speed;
						items[k].centerY += this.speed;    

					}

				}else{
					this.drawY = this.drawY-this.speed;
				}
			}else if(crashDir=="up"){
				/// GOING RIGHT!!

				if(newCenterX<boxLimit_XL&&canvasWidth+shiftX<canvasWidth-this.speed){
					shiftX+=this.speed;
					clearCtx(ctxMapOverMenu);
					for(var i =0; i<obstacles.length; i++){
						obstacles[i].leftX += this.speed;
						obstacles[i].rightX += this.speed;
					}

					for(var j =0; j<areas.length; j++){
						areas[j].leftX += this.speed;
						areas[j].rightX += this.speed;
					}
					for(var k =0; k<items.length; k++){
						items[k].drawX += this.speed;
						items[k].centerX += this.speed;    

					} 
				}else{
					this.drawX = this.drawX-this.speed;
				}


				// FINALLY>> GOING RIGHT-DOWN
			}else {
				if(newCenterX<boxLimit_XL&&canvasWidth+shiftX<canvasWidth-this.speed){
					shiftX+=this.speed;
					clearCtx(ctxMapOverMenu);
					for(var i =0; i<obstacles.length; i++){
						obstacles[i].leftX += this.speed;
						obstacles[i].rightX += this.speed;
					}

					for(var j =0; j<areas.length; j++){
						areas[j].leftX += this.speed;
						areas[j].rightX += this.speed;
					}
					for(var k =0; k<items.length; k++){
						items[k].drawX += this.speed;
						items[k].centerX += this.speed;    

					} 
				}else{
					this.drawX = this.drawX-this.speed;
				}


				if(newCenterY<boxLimit_YT&&canvasHeight+shiftY<canvasHeight-this.speed){
					shiftY+=this.speed;
					clearCtx(ctxMapOverMenu);
					////////////////////////////////   DRAG SHIT

					for(var i =0; i<obstacles.length; i++){
						obstacles[i].topY += this.speed;
						obstacles[i].bottomY += this.speed;
					}


					for(var j =0; j<areas.length; j++){
						areas[j].topY += this.speed;
						areas[j].bottomY += this.speed;
					}
					
					//////  Items have center instead of bottom because thaat's  the point from which they get picked up
					for(var k =0; k<items.length; k++){
						items[k].drawY += this.speed;
						items[k].centerY += this.speed;    

					}

				}else{
					this.drawY = this.drawY-this.speed;
				}

			}










		}else if(this.direction=="right-up"){




			if(crashDir=="right"){
				/// GOING DOWN!!
				if(newCenterY<boxLimit_YT&&canvasHeight+shiftY<canvasHeight-this.speed){
					shiftY+=this.speed;
					clearCtx(ctxMapOverMenu);
					////////////////////////////////   DRAG SHIT

					for(var i =0; i<obstacles.length; i++){
						obstacles[i].topY += this.speed;
						obstacles[i].bottomY += this.speed;
					}


					for(var j =0; j<areas.length; j++){
						areas[j].topY += this.speed;
						areas[j].bottomY += this.speed;
					}
					
					//////  Items have center instead of bottom because thaat's  the point from which they get picked up
					for(var k =0; k<items.length; k++){
						items[k].drawY += this.speed;
						items[k].centerY += this.speed;    

					} 

				}else{
					this.drawY = this.drawY-this.speed;
				}
			}else if(crashDir=="up"){
				/// GOING RIGHT!!

				if(newCenterX>boxLimit_XR&&canvasWidth>((shiftX*-1)+canvasBg.width+this.speed)){
					shiftX-=this.speed;
					clearCtx(ctxMapOverMenu);
					for(var i =0; i<obstacles.length; i++){
						obstacles[i].leftX -= this.speed;
						obstacles[i].rightX -= this.speed;
					}

					for(var j =0; j<areas.length; j++){
						areas[j].leftX -= this.speed;
						areas[j].rightX -= this.speed;
					}
				  //alert(newObs[0].leftX);
				  	for(var k =0; k<items.length; k++){
						items[k].drawX -= this.speed;
						items[k].centerX -= this.speed;    

					} 

				}else{

					this.drawX = this.drawX+this.speed;

				}   


				// FINALLY>> GOING RIGHT-DOWN
			}else {
				if(newCenterX>boxLimit_XR&&canvasWidth>((shiftX*-1)+canvasBg.width+this.speed)){
					shiftX-=this.speed;
					clearCtx(ctxMapOverMenu);
					for(var i =0; i<obstacles.length; i++){
						obstacles[i].leftX -= this.speed;
						obstacles[i].rightX -= this.speed;
					}

					for(var j =0; j<areas.length; j++){
						areas[j].leftX -= this.speed;
						areas[j].rightX -= this.speed;
					}
				  //alert(newObs[0].leftX);
				  	for(var k =0; k<items.length; k++){
						items[k].drawX -= this.speed;
						items[k].centerX -= this.speed;    

					} 

				}else{

					this.drawX = this.drawX+this.speed;

				}   

				if(newCenterY<boxLimit_YT&&canvasHeight+shiftY<canvasHeight-this.speed){
					shiftY+=this.speed;
					clearCtx(ctxMapOverMenu);
					////////////////////////////////   DRAG SHIT

					for(var i =0; i<obstacles.length; i++){
						obstacles[i].topY += this.speed;
						obstacles[i].bottomY += this.speed;
					}


					for(var j =0; j<areas.length; j++){
						areas[j].topY += this.speed;
						areas[j].bottomY += this.speed;
					}
					
					//////  Items have center instead of bottom because thaat's  the point from which they get picked up
					for(var k =0; k<items.length; k++){
						items[k].drawY += this.speed;
						items[k].centerY += this.speed;    

					} 

				}else{
					this.drawY = this.drawY-this.speed;
				}

			}








		}

		// RESET after moving Player, so if  there isn't an obstacle its diagonal-way anymore
		//                                                   	     it should allow to move diagonal again
		crashDir="mmm"; /// any random value will do

	}

		///////////  DELETE/REDO LATER
		// ctxOverlay.strokeStyle = "#FF0000";
		// ctxOverlay.strokeRect(boxLimit_XL, boxLimit_YT, boxLimit_XR-boxLimit_XL, boxLimit_YB-boxLimit_YT);



}




/////////
//|\\/////
//|\\//////     ///////   ||||||||||  ///|      //////  //   //
//|\\//////    ///       ||||| ||||  //  |     //      //   //
//|\//////    ///       |||||||||| ///||||    /////   // ////
////////     ///       |      ||  //     |     ////  //   //
////        ///////////       |  ||      ||///////  //   //
///
///     




Player.prototype.checkCrash = function () {   


	var newCenterX = Math.round(newDrawX + (this.width / 2)),
		newCenterY = Math.round(newDrawY + (this.height / 2));


	function doorCrash(obstacleIndex){
		
		if(obstacles[obstacleIndex].isDoor=="door"){        
			doorBlock=true;
		   //console.log(obstacles[obstacleIndex].doorID);
		     /// if player's got Right KEY for THIS DOOR >> obstacles[obstacleIndex].key#
/// add parameter on obstacles >>> "LOCKED" - "notLOCKED"  && "KEY#"  <<< if locked, only open when carrying that key
										/////////////////   or when broken, if breakable

			if(obstacles[obstacleIndex].doorID!=130){		
			///////
			///    UNLESS    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>     you got Deep-water Item <<<<   snorkel or smthing
			///													
								///            id   |   timer
		    	doorOpen(obstacles[obstacleIndex].doorID, obstacles[obstacleIndex].timeToClose);
		    }	

		}

	}

	///Loop through Obstacles
	for (var i = 0; i < obstacles.length; i++) {

		if( obstacles[i].isActive=="active"){ 

			if(this.direction=="right"){
			
				///in other words: as long as you are standing in the block before the one you would be at if going right
				if(newCenterY>=obstacles[i].topY&&newCenterY<obstacles[i].bottomY&&newCenterX<=obstacles[i].leftX&&newCenterX>obstacles[i].leftX-tileDiameter) {

					//but don't stop me just yet, only if not doing so would put me on the other side 
					if(newCenterX+this.speed>=obstacles[i].leftX-(this.speed+1)){

						crash = true; 
						//if it's a door, you may open it   
						doorCrash(i);
					}
				}
			}  
			if(this.direction=="left"){

				if(newCenterY<=obstacles[i].bottomY&&newCenterY>obstacles[i].topY&&newCenterX>=obstacles[i].rightX&&newCenterX<obstacles[i].rightX+tileDiameter) {
					
					if(newCenterX-this.speed<=obstacles[i].rightX+(this.speed+1)){

						    crash = true;
							doorCrash(i);
					}
				}
			}   
			if(this.direction=="up"){

				if(newCenterX>=obstacles[i].leftX&&newCenterX<obstacles[i].rightX&&newCenterY>=obstacles[i].bottomY&&newCenterY<obstacles[i].bottomY+tileDiameter) {

					if(newCenterY-this.speed<=obstacles[i].bottomY+(this.speed+1)){
							crash = true; 
							doorCrash(i);
					}         
				}
			}   
			if(this.direction=="down"){

				if(newCenterX>obstacles[i].leftX&&newCenterX<=obstacles[i].rightX&&newCenterY<=obstacles[i].topY&&newCenterY>obstacles[i].topY-tileDiameter) {

					if(newCenterY+this.speed>=obstacles[i].topY-(this.speed+1)){
							crash = true;  
							doorCrash(i);
					}
				}
			}   


////////////////////////////////////////
//////////////////////////////	         d   I   A   G   O   N   A   L    S
//////////////////////////////////


			if(this.direction=="right-down"){ 


				if(newCenterY>=obstacles[i].topY&&newCenterY<obstacles[i].bottomY&&newCenterX<=obstacles[i].leftX&&newCenterX>obstacles[i].leftX-tileDiameter) {

					//but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
					if(newCenterX+this.speed>=obstacles[i].leftX-(this.speed+1)){
						// crash = true;  
						// doorCrash(i);
						if(crashDir!="down"){
							crashDir="right";
						}else{
							crash = true;
							doorCrash(i);
						}
					}
				}


				if(newCenterX>obstacles[i].leftX&&newCenterX<=obstacles[i].rightX&&newCenterY<=obstacles[i].topY&&newCenterY>obstacles[i].topY-tileDiameter) {

					if(newCenterY+this.speed>=obstacles[i].topY-(this.speed+1)){
						// crash = true;
						// doorCrash(i);
						if(crashDir!="right"){
							crashDir="down";
						}else{
							crash = true;
							doorCrash(i);
						}
						
					}
				}
				//////   ADD AN EXPLICITELY diagonal check.....
				////  AND only on this one >>> 
						// crash = true;
						// doorCrash(i);

				if(newCenterY<=obstacles[i].topY&&newCenterX<=obstacles[i].leftX) {

					//but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
					//console.log("WHAT"+player1.direction);
					if(newCenterX+this.speed>=obstacles[i].leftX-(this.speed+1)&&newCenterY+this.speed>=obstacles[i].topY-(this.speed+1)){
						if(crashDir!="right"&&crashDir!="down"){
							crash = true;
							doorCrash(i);
						}

					}
				}

			} /////  if(this.direction=="right-down"){  



/////
///////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			if(this.direction=="left-down"){ 

				 if(newCenterY<=obstacles[i].bottomY&&newCenterY>obstacles[i].topY&&newCenterX>=obstacles[i].rightX&&newCenterX<obstacles[i].rightX+tileDiameter) {
					
					if(newCenterX-this.speed<=obstacles[i].rightX+(this.speed+1)){
						if(crashDir!="down"){
							crashDir="left";
						}else{
							crash = true;
							doorCrash(i);
						}
					}
				}

				if(newCenterX>obstacles[i].leftX&&newCenterX<=obstacles[i].rightX&&newCenterY<=obstacles[i].topY&&newCenterY>obstacles[i].topY-tileDiameter) {

					if(newCenterY+this.speed>=obstacles[i].topY-(this.speed+1)){
						if(crashDir!="left"){
							crashDir="down";
						}else{
							crash = true;
							doorCrash(i);
						}
					}
				}



				if(newCenterY<=obstacles[i].topY&&newCenterX>=obstacles[i].rightX) {

					//but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
					//console.log(crashDir);
					if(newCenterX-this.speed<=obstacles[i].rightX+(this.speed+1)&&newCenterY+this.speed>=obstacles[i].topY-(this.speed+1)){
						if(crashDir!="left"&&crashDir!="down"){
							crash = true;
							doorCrash(i);
							//crashDir="right-down";
						}

						// crashDir="right";
					}
				}

			}


/////
///////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


			if(this.direction=="left-up"){ 

				if(newCenterY<=obstacles[i].bottomY&&newCenterY>obstacles[i].topY&&newCenterX>=obstacles[i].rightX&&newCenterX<obstacles[i].rightX+tileDiameter) {
					
					if(newCenterX-this.speed<=obstacles[i].rightX+(this.speed+1)){
						if(crashDir!="up"){
							crashDir="left";
						}else{
							crash = true;
							doorCrash(i);
						}
					}
				}

				if(newCenterX>=obstacles[i].leftX&&newCenterX<obstacles[i].rightX&&newCenterY>=obstacles[i].bottomY&&newCenterY<obstacles[i].bottomY+tileDiameter) {

					if(newCenterY-this.speed<=obstacles[i].bottomY+(this.speed+1)){
						if(crashDir!="left"){
							crashDir="up";
						}else{
							crash = true;
							doorCrash(i);
						}
					}         
				}


				if(newCenterY>=obstacles[i].bottomY&&newCenterX>=obstacles[i].rightX) {

					//but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
					//console.log(crashDir);
					if(newCenterX-this.speed<=obstacles[i].rightX+(this.speed+1)&&newCenterY-this.speed<=obstacles[i].bottomY+(this.speed+1)){
						if(crashDir!="left"&&crashDir!="up"){
							crash = true;
							doorCrash(i);
							//crashDir="right-down";
						}

						// crashDir="right";
					}
				}


			}



/////
///////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



			if(this.direction=="right-up"){ 

				if(newCenterX>=obstacles[i].leftX&&newCenterX<obstacles[i].rightX&&newCenterY>=obstacles[i].bottomY&&newCenterY<obstacles[i].bottomY+tileDiameter) {

					if(newCenterY-this.speed<=obstacles[i].bottomY+(this.speed+1)){
						if(crashDir!="right"){
							crashDir="up";
						}else{
							crash = true;
							doorCrash(i);
						}
					}         
				}

					///in other words: as long as you are standing in the block before what would be the next one when going right
					if(newCenterY>=obstacles[i].topY&&newCenterY<obstacles[i].bottomY&&newCenterX<=obstacles[i].leftX&&newCenterX>obstacles[i].leftX-tileDiameter) {

						//but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
						if(newCenterX+this.speed>=obstacles[i].leftX-(this.speed+1)){
							if(crashDir!="up"){
								crashDir="right";
							}else{
								crash = true;
								doorCrash(i);
							}
						
						}
					}
				

				if(newCenterY>=obstacles[i].bottomY&&newCenterX<=obstacles[i].leftX) {

					//but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
					//console.log(crashDir);
					if(newCenterX+this.speed>=obstacles[i].leftX-(this.speed+1)&&newCenterY-this.speed<=obstacles[i].bottomY+(this.speed+1)){
						if(crashDir!="right"&&crashDir!="up"){
							crash = true;
							doorCrash(i);
							//crashDir="right-down";
						}

						// crashDir="right";
					}
				}

			}


/////
///////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		}/// IF OBSTACLE ACTIVE

	}/// for loop Obstacles


	if (crash) {
		return true;
	} else {
		return false;
	}

};







/////////
//|\\/////
//|\\//////       ///////   ||||||||||  //|||  ///
//|\\//////      ///    |  ||||| ||||  //     ////
//|\//////      ///     | |||||||||| ///|||  ///// 
////////       ///      ||      ||  //      //////
////          ///       |      ||  ||||||| ///////
///
///          
				   
				   

////   IF AREA   DOOR-to-other-room >>>>>>>>>>>>>>>>  changeRoom(CORRESPONDING ROOM TO THIS DOOR)


Player.prototype.checkArea = function (){
//console.log("PLAYER S " +player1.speed);

	function doorTo(areasIndex){


//// ROOM TO !!!!
		if(areas[areasIndex].isDoor=="door"){

			if(areas[areasIndex].isBlocked!="blocked"){

			blockInput=true;

			
			player1.facing="nowhere";
			player1.direction="nowhere";


				changeRoom(areas[i].roomTo, areas[i].doorTO, shiftX, shiftY, "normal");/////  room-2 >> determined by door"To" (9[2]11), then ID (92[11])
				///room-2 =>>> roomTO
				

			}    


		}else{
		   
			for(var h=0; h<blockedDoorIndex.length; h++){

				 if(typeof areas[blockedDoorIndex[h]]!="undefined"&& typeof areas[blockedDoorIndex[h]]!=null){  ///// typeof?
						   areas[blockedDoorIndex[h]].isBlocked="unblocked";
						   //console.log("BLOCK "+blockedDoorIndex[h]);
				}
			}
		}

		

		//console.log("player position Ynow" +(parseInt(newDrawY)-parseInt(shiftY)));
	}


	function transitionArea(){
		if(currentArea=="transition"&&currentLevel!=2){
			
			currentLevel=2;
			//alert("miercale!! CARAMBA");
			roomDraw(currentRoom, currentArea, 0, tileDiameter, 0, 0, "first", currentLevel);

		}else if(currentArea!="transition"&&currentLevel!=1){
			 //console.log(currentArea);
			currentLevel=1;

			roomDraw(currentRoom, currentArea, 0, tileDiameter, 0, 0, "first", currentLevel);
		}
	}


	var newCenterX = Math.round(newDrawX + (this.width / 2)),
		newCenterY = Math.round(newDrawY + (this.height / 2));


	for (var i = 0; i < areas.length; i++) {

		if(this.direction=="right"){
		
			if(newCenterX<areas[i].rightX&&newCenterX>=areas[i].leftX&&newCenterY<=areas[i].bottomY&&newCenterY>areas[i].topY) {
				
				currentArea=areas[i].n; 
				currentSubArea=areas[i].n2;
				///Door to other room (& blocking mechanism)
				doorTo(i);
				//console.log(areas[i].roomTo);

				if(areas[i].n!="default"&&areas[i].n!="transition"&&areas[i].n!="water"&&areas[i].n!="deep-water"){
					inArea.inIt=true;
					//alert("area");
					inArea.whatArea=areas[i].n;
				 }else{
				   
					inArea.inIt=false;
					inArea.whatArea=areas[i].n;
				}
				///second level on same room
				transitionArea();
			}
		}  
		
		if(this.direction=="left"){

			if(newCenterX<=areas[i].rightX&&newCenterX>areas[i].leftX&&newCenterY<areas[i].bottomY&&newCenterY>=areas[i].topY) {
				
				currentArea=areas[i].n;
				currentSubArea=areas[i].n2;
				///Door to other room (& blocking mechanism)
				doorTo(i);

				if(areas[i].n!="default"&&areas[i].n!="transition"&&areas[i].n!="water"&&areas[i].n!="deep-water"){
					inArea.inIt=true;
					// alert("area");
					 inArea.whatArea=areas[i].n;
				 }else{
					inArea.inIt=false;
					 inArea.whatArea=areas[i].n;
				}

				///second level on same room
				transitionArea();
			}
		}   

		if(this.direction=="up"){
			//console.log(areasCrash);      


			if(newCenterY<=areas[i].bottomY&&newCenterY>areas[i].topY&&newCenterX>=areas[i].leftX&&newCenterX<areas[i].rightX) {

					currentArea=areas[i].n;
					currentSubArea=areas[i].n2;
					///Door to other room (& blocking mechanism)
					doorTo(i);

					if(areas[i].n!="default"&&areas[i].n!="transition"&&areas[i].n!="water"&&areas[i].n!="deep-water"){
						inArea.inIt=true;
						// alert("area");
						 inArea.whatArea=areas[i].n;
					}else{
						inArea.inIt=false;
						 inArea.whatArea=areas[i].n;
					}
				///second level on same room
				transitionArea();
			}
		}   
		if(this.direction=="down"){

			if(newCenterY<areas[i].bottomY&&newCenterY>=areas[i].topY&&newCenterX>areas[i].leftX&&newCenterX<=areas[i].rightX) {
					currentArea=areas[i].n;
					currentSubArea=areas[i].n2;
					///Door to other room (& blocking mechanism)
					doorTo(i);

				if(areas[i].n!="default"&&areas[i].n!="transition"&&areas[i].n!="water"&&areas[i].n!="deep-water"){
					inArea.inIt=true;
					// alert("area");
					 inArea.whatArea=areas[i].n;
				}else{
					inArea.inIt=false;
					 inArea.whatArea=areas[i].n;
				}
				///second level on same room
				transitionArea();
			}

		}   

		if(this.direction=="right-down"){

			if(newCenterX<areas[i].rightX&&newCenterX>=areas[i].leftX&&newCenterY<=areas[i].bottomY&&newCenterY>areas[i].topY||newCenterY<areas[i].bottomY&&newCenterY>=areas[i].topY&&newCenterX>areas[i].leftX&&newCenterX<=areas[i].rightX) {

					currentArea=areas[i].n;
					currentSubArea=areas[i].n2;
					///Door to other room (& blocking mechanism)
					doorTo(i);

				if(areas[i].n!="default"&&areas[i].n!="transition"&&areas[i].n!="water"&&areas[i].n!="deep-water"){
					inArea.inIt=true;
					 inArea.whatArea=areas[i].n;
				}else{
					inArea.inIt=false;
					 inArea.whatArea=areas[i].n;
				}
				///second level on same room
				transitionArea();
			}

		} 

		if(this.direction=="left-down"){

			if(newCenterX<=areas[i].rightX&&newCenterX>areas[i].leftX&&newCenterY<areas[i].bottomY&&newCenterY>=areas[i].topY||newCenterY<areas[i].bottomY&&newCenterY>=areas[i].topY&&newCenterX>areas[i].leftX&&newCenterX<=areas[i].rightX) {
					currentArea=areas[i].n;
					currentSubArea=areas[i].n2;
					///Door to other room (& blocking mechanism)
					doorTo(i);

				if(areas[i].n!="default"&&areas[i].n!="transition"&&areas[i].n!="water"&&areas[i].n!="deep-water"){
					inArea.inIt=true;
					 inArea.whatArea=areas[i].n;
				}else{
					inArea.inIt=false;
					 inArea.whatArea=areas[i].n;
				}
				///second level on same room
				transitionArea();
			}

		}

		if(this.direction=="left-up"){

			if(newCenterX<=areas[i].rightX&&newCenterX>areas[i].leftX&&newCenterY<areas[i].bottomY&&newCenterY>=areas[i].topY||newCenterY<=areas[i].bottomY&&newCenterY>areas[i].topY&&newCenterX>=areas[i].leftX&&newCenterX<areas[i].rightX) {

					currentArea=areas[i].n;
					currentSubArea=areas[i].n2;
					///Door to other room (& blocking mechanism)
					doorTo(i);

				if(areas[i].n!="default"&&areas[i].n!="transition"&&areas[i].n!="water"&&areas[i].n!="deep-water"){
					inArea.inIt=true;
					 inArea.whatArea=areas[i].n;
				}else{
					inArea.inIt=false;
					 inArea.whatArea=areas[i].n;
				}
				///second level on same room
				transitionArea();
			}

		}
		if(this.direction=="right-up"){

			if(newCenterX<areas[i].rightX&&newCenterX>=areas[i].leftX&&newCenterY<=areas[i].bottomY&&newCenterY>areas[i].topY||newCenterY<=areas[i].bottomY&&newCenterY>areas[i].topY&&newCenterX>=areas[i].leftX&&newCenterX<areas[i].rightX) {
				
					currentArea=areas[i].n;
					currentSubArea=areas[i].n2;
					///Door to other room (& blocking mechanism)
					doorTo(i);

				if(areas[i].n!="default"&&areas[i].n!="transition"&&areas[i].n!="water"&&areas[i].n!="deep-water"){
					inArea.inIt=true;
					 inArea.whatArea=areas[i].n;
				}else{
					inArea.inIt=false;
					 inArea.whatArea=areas[i].n;
				}
				///second level on same room
				transitionArea();
			}

		}/// dir right




		/// and t think this took me a day to figure out...
		/// forcing movement to detect area would fuck things up, but not forcing it would have the wonrg drawing intead....  and this solves it. Checks without any (moving)direction set
		if(this.direction=="room-change"){
		
			//console.log("VAMOS!")
			if(newCenterX<areas[i].rightX&&newCenterX>=areas[i].leftX&&newCenterY<=areas[i].bottomY&&newCenterY>areas[i].topY) {
				
				currentArea=areas[i].n; 
				currentSubArea=areas[i].n2;
				///Door to other room (& blocking mechanism)

				//console.log(areas[i].roomTo);

				if(areas[i].n!="default"&&areas[i].n!="transition"&&areas[i].n!="water"&&areas[i].n!="deep-water"){
					inArea.inIt=true;
					//alert("area");
					inArea.whatArea=areas[i].n;
				 }else{
				   
					inArea.inIt=false;
					inArea.whatArea=areas[i].n;
				}
				///second level on same room
				transitionArea();
			}

			//this.speed=1;
		} /// dir room-change

	}// for Areas



	//// THIS HERE
	//		 is essentially a little hack to get the right area, after changing doors which are in different ones.

		//  in roomChangellop I have to force the player to move one step, for this checkArea to detect the right area and draw everything right. I didn't find another way to do it. 
		/// Without this (and the player1.speed=1/direction.. at the end of roomChangeLoop) it does like one extra pass, over the player, and without edges......
		/// ... but it also works as a stopper for the player, which had to be done two. So.. turns out to be semi-organic after all

		// the < 0 fixes a little nasty bug, that, and having pauseCountIncrement as an exact division from the surface that it is checked against (window.height/2), thus dividing by this conditional surface, rather than picking a cold number for it (when checking the end of roomChangeLoop)

	// if(this.speed==1){
	// 	this.direction="nowhere";
	// 	blockInput=false;

	// }else if(this.speed<0){
	// 	this.speed=0; ////// !!!!!!!!!!!!!!!!!!!!!!!
	// 	this.direction="nowhere";
	// 	player1.drawY=100;
	// }

	


};





/////////
//|\\/////
//|\\//////      /////           
//|\\//////     ///  |  |||  ||  ||  //|   |
//|\//////     ///   | |  ||||  ||  // |  ||
////////      ///    ||    ||  ||  //  ||||/
////         ///     |     |  ||  //      //
///
///   




Player.prototype.animationState = function (dead, direction, animRate, moving) {

	//DIFFERENT ANIMATIONS WITH DIFF WEAPON
		//// keep track of what weapon is selected and move whole srcY of the sprite one down (where player is holding corresponging gun


	if(this.direction=="up"){
		this.srcX = 420;
		this.srcY = 0;

	}else if(this.direction=="down"){

		this.srcX = 0;
		animCount += animRate;
		if(animCount<2){
				
		}else if(animCount>0&&animCount<3){
			this.srcX=35;
		}else if(animCount>3&&animCount<6){
			this.srcX=70;
		}else if(animCount>6){
			this.srcX=0;
			animCount =0;
		}
			
	}

	if(this.shooting){
		animCount += animRate;
		   

		if(this.facing=="down"){
			this.upperSrcX = 1680;

			if(animCount<2){
					
			}else if(animCount>0&&animCount<3){
				  this.upperSrcX = 1715;
			}else if(animCount>3&&animCount<6){
				this.upperSrcX = 1740;
			}else if(animCount>6){
				this.upperSrcX = 1680;
				animCount =0;
			}

		}else{
			this.upperSrcX = 1715;
		}
			
	}else{
		if(this.facing=="down"){
			this.upperSrcX = 840;
		}else{
			this.upperSrcX = 840;
		}
	}




};
























////////
////////
 /////
 /////
 /////
 /////
 /////
 /////
////////
////////





//////////////////////////////////////  have another arguemtn for big and small, which applies when ammo != null
///////////////
function Item(x,y, xx, yy, w,h, itemType, itemNumber, selec, caught, branch, room) {   
															//// CURRENTROOM!!!!!! for drawing purposes

	/// itemType=> item/gun/ammo/life <<>>>  itemNumber => different types of each of those

	//where in sprite
	this.srcX = x;
	this.srcY = y;
	//where in tileMap
	this.drawX = xx;
	this.drawY = yy;
	//in sprite with & height
	this.width = w;
	this.height =  h;
	this.centerX = this.drawX + (this.width / 2);
	this.centerY = this.drawY + (this.height / 2);

	this.itemType = itemType;
	this.itemNumber  =itemNumber;   //// 0 to 9 (+10 = special)     branch 0 = weak, branch 1, stronger.. etc.
								///         if selec (use) >> if ammoType == 1 >> (loop gunsMenu, if gunMenuType[i] == 1) >> gunsMenu.bullets += X
								 //                            if ammoType == 10 >>  all gunMenu.bullets + X.... (or some mmore than others)    

	//this.lifeType = life; //// NOT NEEDED... LIFE CAN BE ITEMS THAT DO LIFE.... (very special)  >> the rest like Marathon
	//////////////                      special  stations scattered around the place which increase your life (method)

	this.select=selec;
	this.isCaught=caught;

	this.inRoom=room;
}


Item.prototype.update = function () {
	// img = new Image();
	// img.src = "images/spritesBg.png";

	// tileWidthHeight=tileDiameter;

	tileIndexX=0;
	tileIndexY=0;

	this.pickUp();

	// for(var i =0; i<roomNumberTilesY; i++){
	// 	for(var e=0; e<roomNumberTilesX; e++){
	// 		ctxMenuOverOver.drawImage(img, 0, 0, 2, 2, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);
	// 		tileIndexX+=2;
	// 	}
	// 	tileIndexY+=2;
	// }

};







var menuItemAlreadyPainted=false;
var menuGunAlreadyPainted=false;




Item.prototype.draw = function () {


daMenu.draw();
	var newCenterX = Math.round(this.drawX  + (this.width / 2)), /// this.drawX will have to be changed to (newItemDrawX when I start moving it.. maybe
	newCenterY = Math.round(this.drawY + (this.height / 2));
																													  
	if(!this.isCaught){

	//alert(this.inRoom);
		
			///  draw only the ones in that area
			if(!inArea.inIt||currentArea=="transition"){  
			 ///////   unles there's also areas in level2
				//// then transition-areas, and area-areas  would have to be separated..


				if(currentRoom==this.inRoom){
			////////////////////////////////////////                   30, 30 ==>>  tileDiameter changes >> this is  ACTUAL W/H IN SPRITE
					ctxEntities.drawImage(itemSprite, this.srcX, this.srcY, 30, 30, this.drawX, this.drawY, tileDiameter, tileDiameter);
				}
			}else{

				for (var i = 0; i<areas.length; i++) {

					if(newCenterX<areas[i].rightX&&newCenterX>=areas[i].leftX&&newCenterY<=areas[i].bottomY&&newCenterY>areas[i].topY){
						if(areas[i].n!="default"&&areas[i].n!="transition"){

							// if areas[i].n == inArea.THE-EXACT-AREA 

							/// DRAW  this only
							//alert(inArea.whatArea);

							if(inArea.whatArea == areas[i].n){
								if(currentRoom==this.inRoom){
									ctxEntities.drawImage(itemSprite, this.srcX, this.srcY, 30, 30, this.drawX, this.drawY, this.width, this.height);
								}
							}

						}///  if(areas[i].n!="default"&&areas[i].n!="transition"){	
					}/// if YOU in this Area
				}// FOR Areas

			}//// if/ELSE  YOU NOT inArea

		}// IF   not-Caught

};



Item.prototype.pickUp = function(){

	//console.log(player1.items.length);
	var newCenterX = Math.round(newDrawX + (player1.width / 2)),
		newCenterY = Math.round(newDrawY + (player1.height / 2));
 

var itemAdd=false;
var noItemAdd=false;
var memberJ;

var gunAdd=false;
var noGunAdd=false;

player1.items[0]={srcX:this.srcX, srcY:this.srcY, width:this.width, height:this.height, selec:this.selec, itemType:null, itemNumber:0,lifeType:null,amount:0};


player1.guns[0]={srcX:570, srcY:605, width:45, height:45, selec:true, itemType:"gun", itemNumber:0, lifeType:null,amount:0};



/////////////////
////  for some reason that I forgot, I need to set the first mnenu-items/weapon's  values here. 

///  it doesn't mattter since the first weapon in the game will always be 0. The problem comes when that's not the case.
//console.log("GUNS "+player1.guns.length);
if(newCenterX>this.centerX-this.width/2&&newCenterX<this.centerX+this.width/2&&newCenterY>this.centerY-this.height/2&&newCenterY<this.centerY+this.height/2){

	if(player1.items.length<3){
		menuCount=20;
		daMenu.draw();
	}


	if(currentRoom==this.inRoom){
		if(!this.isCaught){

			this.isCaught=true;

			/// here sort whether player1.items has already got one item of this type...
				if(this.itemType=="item"){



					for(var j=0; j<player1.items.length; j++){
						if(player1.items.length==1){
							itemAdd=true;

						}else if(player1.items.length>1){
						  
							if(this.itemNumber!=player1.items[j].itemNumber&&j!=0){
							   itemAdd=true;
								
							}else if(this.itemNumber==player1.items[j].itemNumber&&j!=0) {
							
							  	noItemAdd=true;   
								memberJ=j;  
							}
						}
						
					}

					menuTrack=0;
						 
				  
					//console.log(this.itemType.toUpperCase());

					///diff stuff happens when grabbing diff category of "iTEMS"
					 
				}else if(this.itemType=="gun"){
					menuTrack=1;
			  
					//console.log("GUN");
					 
				}else if(this.itemType=="ammo"){
					menuTrack=1;
	 
					//console.log("AMMO");

				}else if(this.itemType=="life"){
					//menuTrack=1;
	 
					console.log(player1.life);
					if(player1.life+20<=player1.lifeTotal){
						player1.life+=20;
					}
					console.log(player1.life);
					
				}
				////  ... if not, push into a newly sortted array to tidily show items in menu
				/////  .. if yes, then 


				if(itemAdd&&!noItemAdd){  
					// itemRow=0;
					if(player1.items.length<=1){
						player1.items[0]={srcX:this.srcX, srcY:this.srcY, width:this.width, height:this.height, selec:this.selec, rowSelec:null, trackSelec:null, itemType:this.itemType, itemNumber:this.itemNumber, amount:1};   
					}

		//// ADD PARAM >>>>    SELECTABLE/NON-SELECTABLE


					player1.items.push({srcX:this.srcX, srcY:this.srcY, width:this.width, height:this.height, selec:this.selec, rowSelec:null, trackSelec:null, itemType:this.itemType, itemNumber:this.itemNumber, amount:1});   
  
				}else if(noItemAdd&&memberJ!="undefined"){

					player1.items[memberJ].amount++;    ////////////  maybe set a limit to this amount (like secret of Mana's magic 4....)

				}

				noItemAdd=false;
				itemAdd=false;
			   



			///////////   GUN PICK-UP    
				//////
				if(this.itemType=="gun"&&this.inRoom==currentRoom){
					for(var j=0; j<player1.guns.length; j++){

						if(this.itemType=="gun"){

							
							  
								if(this.itemNumber!=player1.guns[j].itemNumber){
								    gunAdd=true;
									
								}else if(this.itemNumber==player1.guns[j].itemNumber) {
									noGunAdd=true;  
								}
							
						}
					}
				}                
				////  ... if not, push into a newly sortted array to tidily show items in menu
				/////  .. if yes, then remember the player1.items.INDEX so as to increment its amount

				if(gunAdd&&!noGunAdd){
					
					if(player1.guns.length<=1){
						//console.log("TYPE "+player1.guns[0].gunType);
					   player1.guns[0]={srcX:this.srcX, srcY:this.srcY, width:this.width, height:this.height, selec:this.selec, rowSelec:null, trackSelec:null,itemType:this.itemType, itemNumber:this.itemNumber, lifeType:this.lifeType, bullets:0};
					   //console.log("TYPE "+player1.guns[0].gunType);
					}

					////  according to item number  >>srcX:____ gunSprite
					player1.guns.push({srcX:this.srcX, srcY:this.srcY, width:this.width, height:this.height, selec:this.selec, rowSelec:null, trackSelec:null, itemType:this.itemType, itemNumber:this.itemNumber, lifeType:this.lifeType, bullets:0}); 
					selecto();
					
					//// FORCE select on new weapon
					
			
							
							bullets[this.itemNumber]+=5000;
								// console.log("BULL "+player1.guns[i+1].bullets);
								// depending on weapon, first pick could come with a few bullets...
							
						

					if((gunRow+1)<player1.guns.length){
						gunRow+=1;
					}
					console.log(gunRow);
					///console.log("GR "+gunRow);
      
				}

				noGunAdd=false;
				gunAdd=false;



				if(this.itemType=="ammo"&&this.inRoom==currentRoom){


					for (var i = 0; i<bullets.length; i++) {
						if(this.itemNumber==i){
							bullets[i]+=10;
							//alert(bullets[i]);
						}
					}//for

				}           
///////////////////////////////////////////////////////////////////////////////////////////////////////

		}//// IF this caught
	
	   }/// if this in room

		//console.log("DE ESTE "+player1.items[1].itemType+"HAY " +player1.items[1].amount); 

	}/// IF  newCenterX == itemCoordinates
   
}




        // ///////////////////       //  /               //////       // /////////////////  //////       // ///////////////// /  /////        // //////  //    /////  //////       // ////         ////////////        // ////        ////////////        // //////////////////////           /////////////////////



                    // ///////////////////
                   //  /               //////
                   // /////////////////  //////
                   // ///////////////// /  ///// 
                   // //////  //    /////  //////
                   // ////         /////////////
                   // ////        /////////////
                   // //////////////////////   
                    /////////////////////



//
//   FOR BULLETS, essentially, copy Player >> draw, direction, check crash (if some gunSelected), animate
//
//                  they are created (new Bullet) when shooting (take direction..etc, from player shooting)




							//// player => whoever shot the bullet, in case this ever supports multiplayer
function activeBullet(id, x,y, xx, yy, w,h, weapon, player, direction, active) {   




	//where in sprite
	this.id=id;
	this.srcX = x;
	this.srcY = y;
	//where in tileMap
	this.drawX = xx;
	this.drawY = yy;
	//in sprite with & height
	this.width = w;
	this.height =  h;
	this.centerX = this.drawX + (this.width / 2);
	this.centerY = this.drawY + (this.height / 2);

	this.weapon = weapon; 
	this.owner = player;  
	this.direction = direction;  
	this.active=active;

	///dependent on type
	this.speed = 10;
}


activeBullet.prototype.update = function () {

	//this.checkBulletDirection();

	//  diff weapons have diff limits!!!   >> flame thrower: remember original drawX|Y and how far its gone <<< cut
	/// send var down as thou it had crashBed
	if(this.active){
	if(this.direction=="down"){
		this.drawY+=this.speed;
	}else if(this.direction=="up"){
		this.drawY-=this.speed;
	}else if(this.direction=="left"){
		this.drawX-=this.speed;
	}else if(this.direction=="right"){
		this.drawX+=this.speed;
	}else if(this.direction=="right-up"){
		this.drawX+=this.speed;
		this.drawY-=this.speed;
	}else if(this.direction=="left-up"){
		this.drawX-=this.speed;
		this.drawY-=this.speed;
	}else if(this.direction=="right-down"){
		this.drawX+=this.speed;
		this.drawY+=this.speed;
	}else if(this.direction=="left-down"){
		this.drawX-=this.speed;
		this.drawY+=this.speed;
	}

}

	if(this.checkcrash().crashB){
		//console.log(this.checkcrashB().id);
		if(this.id==this.checkcrash().id){
			this.active=false;
		}
		
		////////////////////// so basically, because I'm splicing up there and the bullet won't exist anymore
	}






//console.log(this.checkcrashB());
	
};





activeBullet.prototype.draw = function () {

	/// for loop all bullets...
	//console.log(this.weapon);  //// according to this where to point the Sprite
	

	if(this.direction!="nowhere"){
	
			ctxBullets.drawImage(imgBullets, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
		
					         //// point to debrisAnim +     // this.speed so debris is drawn on same place of crashB...
			//else
			//ctxBullets.drawImage(imgBullets, this.srcX+20, this.srcY, this.width, this.height, this.drawX-this.speed, this.drawY, this.width, this.height);


			/// here push X to debrisAnim frames
			////   if srcX >  end of debrisAnim

			//// debrisOver = true; >>>> AND THIS IS THE VAR THAT WILL ACTUALLY CUT THE BULLETS
			/// so from active (bulletAnim) to inactive (debrisAnim) to debrisOver = dead/splice/recycle


			/// bullets are 10 pixels, but debris can be a lot bigger <<< so not this.width but a number, depending on what debri for what weapon (pistol;tiny, bomb:huge (and probably source of new damage, etc...))

			/// IF WEAPON SELECTED = BOMB >> from this.drawX/centerX >>> calculate damage radius
				///////////////  how????  >> CREATE A  new activeBOMB >> static draxX
				  //////					       only lasts a few secs, width A LOT bigger than 10
		

		
	}
	//console.log(this.owner);
};






/// bullet checkcrashB!!
activeBullet.prototype.checkcrash = function () {
	var crashB= false;
//  diff weapons have diff limits!!!!!!   >> flame thrower: crashB against air
	var id;
	for (var i = 0; i < obstacles.length; i++) {

		if( obstacles[i].isActive=="active"){ 

			if(this.direction=="right"){

				//// repeat this if/else on enemies drawX|Y -+

				///in other words: as long as bullet in the block before the one you would be at if going right
				if(this.drawY>=obstacles[i].topY&&this.drawY<obstacles[i].bottomY&&this.drawX<=obstacles[i].leftX&&this.drawX>obstacles[i].leftX-8) { ///// 10 => bullet diameter

					//but don't stop me just yet, only if not doing so would put me on the other side 
					if(this.drawX+this.speed>=obstacles[i].leftX-(this.speed+1)){

						crashB = true; 
						id=this.id;
						//console.log(this.id);
						//if it's a door, you may open it   
						//doorcrashB(i);  //////    REPLACE THIS FOR BREAKABLE OBSTACLE >>>  obstacleBreak(i)
					}
				}
			}  /// dir


			if(this.direction=="left"){

				if(this.drawY<=obstacles[i].bottomY&&this.drawY>obstacles[i].topY&&this.drawX>=obstacles[i].rightX&&this.drawX<obstacles[i].rightX+8){
					
					if(this.drawX-this.speed<=obstacles[i].rightX+(this.speed+1)){

						    crashB = true;
							id=this.id;
					}
				}
			} 


			if(this.direction=="up"){

				if(this.drawX>=obstacles[i].leftX&&this.drawX<obstacles[i].rightX&&this.drawY>=obstacles[i].bottomY&&this.drawY<obstacles[i].bottomY+8) {

					if(this.drawY-this.speed<=obstacles[i].bottomY+(this.speed+1)){
							crashB = true; 
							id=this.id;
					}         
				}
			}   
			if(this.direction=="down"){

				if(this.drawX>obstacles[i].leftX&&this.drawX<=obstacles[i].rightX&&this.drawY<=obstacles[i].topY&&this.drawY>obstacles[i].topY-8) {

					if(this.drawY+this.speed>=obstacles[i].topY-(this.speed+1)){
							crashB = true;  
							id=this.id;
					}
				}
			}   


////////////////////////////////////////
//////////////////////////////	         d   I   A   G   O   N   A   L    S
//////////////////////////////////


			if(this.direction=="right-down"){ 


				if(this.drawY>=obstacles[i].topY&&this.drawY<obstacles[i].bottomY&&this.drawX<=obstacles[i].leftX&&this.drawX>obstacles[i].leftX-8) {

					//but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
					if(this.drawX+this.speed>=obstacles[i].leftX-(this.speed+1)){
						// crashB = true;  
						// doorcrashB(i);
						
							crashB = true;
							id=this.id;
						
					}
				}


				if(this.drawX>obstacles[i].leftX&&this.drawX<=obstacles[i].rightX&&this.drawY<=obstacles[i].topY&&this.drawY>obstacles[i].topY-8) {

					if(this.drawY+this.speed>=obstacles[i].topY-(this.speed+1)){
						// crashB = true;
						// doorcrashB(i);
				
							crashB = true;
							id=this.id;
						
						
					}
				}
				//////   ADD AN EXPLICITELY diagonal check.....
				////  AND only on this one >>> 
						// crashB = true;
						// doorcrashB(i);

				if(this.drawY<=obstacles[i].topY&&this.drawX<=obstacles[i].leftX) {

					//but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
					//console.log("WHAT"+player1.direction);
					if(this.drawX+this.speed>=obstacles[i].leftX-(this.speed+1)&&this.drawY+this.speed>=obstacles[i].topY-(this.speed+1)){
						
							crashB = true;
							id=this.id;
						

					}
				}

			} /////  if(this.direction=="right-down"){  



/////
///////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			if(this.direction=="left-down"){ 

				 if(this.drawY<=obstacles[i].bottomY&&this.drawY>obstacles[i].topY&&this.drawX>=obstacles[i].rightX&&this.drawX<obstacles[i].rightX+8) {
					
					if(this.drawX-this.speed<=obstacles[i].rightX+(this.speed+1)){
					
							crashB = true;
							id=this.id;
						
					}
				}

				if(this.drawX>obstacles[i].leftX&&this.drawX<=obstacles[i].rightX&&this.drawY<=obstacles[i].topY&&this.drawY>obstacles[i].topY-8) {

					if(this.drawY+this.speed>=obstacles[i].topY-(this.speed+1)){
					
							crashB = true;
							id=this.id;
						
					}
				}



				if(this.drawY<=obstacles[i].topY&&this.drawX>=obstacles[i].rightX) {

					//but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
					//console.log(crashBDir);
					if(this.drawX-this.speed<=obstacles[i].rightX+(this.speed+1)&&this.drawY+this.speed>=obstacles[i].topY-(this.speed+1)){
						
							crashB = true;
							id=this.id;
							//crashBDir="right-down";
			

						// crashBDir="right";
					}
				}

			}


/////
///////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


			if(this.direction=="left-up"){ 

				if(this.drawY<=obstacles[i].bottomY&&this.drawY>obstacles[i].topY&&this.drawX>=obstacles[i].rightX&&this.drawX<obstacles[i].rightX+8) {
					
					if(this.drawX-this.speed<=obstacles[i].rightX+(this.speed+1)){
						
							crashB = true;
							id=this.id;
						
					}
				}

				if(this.drawX>=obstacles[i].leftX&&this.drawX<obstacles[i].rightX&&this.drawY>=obstacles[i].bottomY&&this.drawY<obstacles[i].bottomY+8) {

					if(this.drawY-this.speed<=obstacles[i].bottomY+(this.speed+1)){
						
							crashB = true;
							id=this.id;
						
					}         
				}


				if(this.drawY>=obstacles[i].bottomY&&this.drawX>=obstacles[i].rightX) {

					//but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
					//console.log(crashBDir);
					if(this.drawX-this.speed<=obstacles[i].rightX+(this.speed+1)&&this.drawY-this.speed<=obstacles[i].bottomY+(this.speed+1)){
					
							crashB = true;
							id=this.id;
							//crashBDir="right-down";
						

						// crashBDir="right";
					}
				}


			}


	if(this.direction=="right-up"){ 

				if(this.drawX>=obstacles[i].leftX&&this.drawX<obstacles[i].rightX&&this.drawY>=obstacles[i].bottomY&&this.drawY<obstacles[i].bottomY+8) {

					if(this.drawY-this.speed<=obstacles[i].bottomY+(this.speed+1)){
				
							crashB = true;
							id=this.id;
						
					}         
				}

					///in other words: as long as you are standing in the block before what would be the next one when going right
				if(this.drawY>=obstacles[i].topY&&this.drawY<obstacles[i].bottomY&&this.drawX<=obstacles[i].leftX&&this.drawX>obstacles[i].leftX-8) {

						//but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
						if(this.drawX+this.speed>=obstacles[i].leftX-(this.speed+1)){
						
								crashB = true;
								id=this.id;
							
						
						}
					}
				

				if(this.drawY>=obstacles[i].bottomY&&this.drawX<=obstacles[i].leftX) {

					//but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
					//console.log(crashBDir);
					if(this.drawX+this.speed>=obstacles[i].leftX-(this.speed+1)&&this.drawY-this.speed<=obstacles[i].bottomY+(this.speed+1)){
				
							crashB = true;
							id=this.id;
							//crashBDir="right-down";
						

						// crashBDir="right";
					}
				}

			}

		}/// if active
	}/// for Obst


	if (crashB) {
		return {crashB:true, id:id};
	} else {
		return {crashB:false, id:id};
	}	
}
