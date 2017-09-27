
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
/////////////////////////////////////////////////////////////////////////

function clearCtx(ctx) {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}
// function randomRange (min, max) {
// 	return Math.floor(Math.random() * (max + 1 - min)) + min;
// }


//// FIXES game speed across different computers and processors 
var startTime = Date.now();
var gameSpeed=40;  ////  + == slower game 
/////  KEEP IN MIND whatever that may SLOW GAME DOWN >>> keep game at slowest is seen performing
// so then it doesn't suddenly speed up (when in an Area were Edges almost don't take place)

var then = startTime;
/// I don't know, it seems to make it faster than having startTime down there
///  maybe it doesn't have to calculate Date.now() twice, but gets it from a closer set of memory

//////////////////////////////////////////////////////////////////////////////////////////////////////

// PLAYER
var players=[1,2];

  /// dependent on controller input
var playerChoosing="player1";////////

///  upon choosing from the list at introScreen, VAR [#] is set, to later create new Player
var playerTypes = ["warrior", "warlock"]


var playerFirstX=0;
var playerFirstY=0;

var playerShiftY =0;

var animCount = 0;
var animShootingCount = 0;

var tele=false;

var slowDown;
var slowDownDirection;


var dashCount=0;
var dash=false;

/// prevents moving right after Pause (from pressing while paused)
///	but brings it back so player can shoot without having to move first
var facingBeforePause=null;


///for diagonals
var latestKeys = []; 
///some dirty hack to fix something to do with direction, friction or something
// not quite sure, but keeping it just in case
var superLastKey=null;



//BULLETS
//// each weapon in its corresponding index  (rename to weaponBullets)
var bullets = [{current:50, max: 1000},{current:50, max: 1200},{current:0, max: 250}];  

/// active bullets (flying around and being updated)
var bulletsFired = []; 

/// porbably not necessary, but in case, keeping bullets separate and identifiable
var bulletID=0;



//// GAME MENU
var daMenu = new menu(700, 600, canvasBg.width, canvasBg.heigth, 0, 0);/// doesnt need any of this params

var menuHeight =100;

var menuAnimCount=0;

/// Position in Menu
var menuTrack=1;  // starts with 1 gun >> no item
var itemRow=0;
var gunRow=0;
////  >>>>  1 button for gun, another for item
///  while other item spermanently do/change something in the game/player 

/// All items before being picked (includes items, weapons, ammo and life)
var items = [];



///  PLAYER LOCATION
var currentRoom;
var currentLevel;

var currentArea;
var currentSubArea;

var nextRoom;
///when changing rooms, so you can't shoot while facing nowhere (frozen bullet on screen)
var blockInput = false;


////////////////////////////////////////////////////////////////////////////////////////////////////


///Playing || Paused
var isPlaying = false;

var paused = false;

var pauseType="gamePause";
var pausedRoomChangeLoop=false;
var pauseCount= 0;


///LOOP ENGINE
var requestAnimFrame =  window.requestAnimationFrame ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame ||
						window.oRequestAnimationFrame ||
						window.msRequestAnimationFrame ||

						function(callback) {
							window.setTimeout(callback, 1000 / 1);
						};

////////////////////////////////////////////////////////////////



/// WORLD essential tile-types
///doors, obstacles, areas..
var obstacles = [];
var areas= [];

// DOORS
var doorID;   

var doorOpening = [];
var doorsOpened = [];
var doorClosing = [];

var opening = false;
var doorBlock =false;
var blockedDoorIndex =[];

var inActive = [];

var inDoorCrash={crash:false, id:0};

var inArea={inIt:false, whatArea:currentArea};

var doorKeys = [{id:301, key:1}, {id:402, key:1}];

var key1;



/// WORLD TILES +
var mapObsL1;

var canvasWidth;
var canvasHeight;

var shiftX=0;
var shiftY=0;


///TILE SIZE
var tileDiameter; 

if(window.innerWidth>1000){
	tileDiameter = 48;  // >>>> cambiar segun tamanho de pantalla
}else{
	tileDiameter = 48; /// mmm, maybe not..
}


var flash=0;



/// ROOM TILE MAPS !!!\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

function whatRoomMap(map){
/// 010|020 translate to 1|2,  unless turned to strings
///  and using them as strings here makes the map less readable >>> 000 ommited


/////                                      					 r   o   o   m     1
	/// first: the basic layout and tile definition
	if(map=="room-1"){
		return  [222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,101,350,100,190,190,100,100,100,100,502,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,222,
				 100,100,222,100,100,227,100,100,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 503,100,227,227,100,222,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,222,
				 100,227,222,222,222,100,100,100,100,100,100,227,227,100,100,222,100,222,100,100,100,100,100,100,100,100,100,100,100,222,
				 100,222,222,100,100,100,227,227,100,100,100,227,227,227,227,100,100,100,227,227,227,227,227,227,227,227,227,227,227,222,
				 100,100,100,100,227,100,222,227,100,100,100,222,222,222,222,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,222,214,227,100,222,222,110,111,100,236,236,236,108,108,100,100,222,227,100,222,100,222,222,227,100,222,100,222,
				 100,100,222,214,222,708,218,222,100,114,100,227,227,227,450,450,100,100,227,222,227,222,227,222,227,222,227,222,227,222,
				 100,100,500,222,222,708,709,222,100,114,100,227,227,227,450,450,227,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,500,500,222,708,708,100,110,114,100,400,668,227,710,218,218,100,100,100,100,100,100,100,100,100,100,100,100,222,
				 100,100,100,100,222,222,222,100,112,113,100,400,710,401,710,218,218,100,100,100,100,100,100,100,100,100,100,100,100,222,
				 100,100,100,100,100,100,100,100,100,100,100,227,710,222,714,714,402,100,100,100,100,100,100,100,100,100,100,100,100,222,
				 100,100,100,100,100,100,100,100,227,100,100,222,222,222,301,301,222,100,227,227,227,227,227,227,227,227,227,227,227,222,
				 100,100,100,100,160,160,160,100,222,227,100,222,222,222,301,301,222,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,100,160,160,160,160,160,222,222,100,222,222,222,301,301,222,100,100,222,100,222,100,222,100,222,100,222,100,222,
				 100,100,100,160,160,160,160,160,100,100,100,100,222,222,100,100,100,100,227,222,227,222,227,222,227,222,227,222,227,222,
				 100,100,100,100,160,160,160,160,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222, 
				 100,171,100,105,100,160,160,160,227,100,100,222,222,222,720,222,101,100,227,227,227,227,227,227,227,227,227,227,227,222,
				 100,171,170,105,105,100,214,166,222,227,100,222,222,222,720,222,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,171,171,100,105,105,214,166,100,222,222,222,222,222,100,224,100,100,100,222,100,222,100,222,100,222,100,222,100,222,
				 100,100,100,100,100,105,222,166,166,160,160,100,222,222,100,100,100,100,227,222,227,222,227,222,227,222,227,222,227,222,
				 100,100,100,100,100,100,214,214,214,214,222,160,160,160,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222];

	/// second floor >>> swap after hitting "transition" area
	}else if(map=="room-1L2"){
		return  [100,190,190,190,190,190,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,101,350,100,190,100,100,100,100,100,502,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
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
				 100,100,100,100,160,160,160,100,222,227,100,222,222,222,301,301,222,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,100,100,160,166,160,160,222,222,100,222,222,222,301,301,222,100,100,222,100,222,100,222,100,222,100,222,100,222,
				 100,100,100,100,160,166,166,160,100,100,100,100,222,222,100,100,100,100,227,222,227,222,227,222,227,222,227,222,227,222,
				 100,100,100,100,160,166,166,160,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222, 
				 100,100,100,105,105,166,166,160,227,100,100,222,222,222,720,222,101,100,227,227,227,227,227,227,227,227,227,227,227,227,
				 100,100,100,105,105,166,214,166,222,227,100,222,222,222,720,222,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,100,100,105,105,214,166,100,222,222,222,222,222,100,224,100,100,100,222,100,222,100,222,100,222,100,222,100,222,
				 100,100,100,100,100,105,222,166,166,160,160,160,222,222,100,100,100,100,227,222,227,222,227,222,227,222,227,222,227,222,
				 100,100,100,100,100,100,214,214,214,214,222,160,160,160,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222];

 	/// then: what the tiles look like (independent of what they might be)
	}else if(map=="room-1Over"){
		return  [100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,350,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,214,100,100,214,110,114,111,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 503,100,214,214,100,222,114,114,114,111,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,214,222,222,222,114,114,114,114,114,100,214,214,100,100,222,100,222,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,222,222,100,100,112,214,214,114,114,100,214,214,214,214,100,100,100,214,214,214,214,214,214,214,214,214,214,214,214,
				 100,100,100,100,214,100,222,214,114,114,100,222,222,222,227,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,214,214,222,100,232,222,114,114,100,232,232,232,107,108,100,100,222,214,100,222,100,222,222,214,100,222,100,222,
				 100,100,222,214,222,708,218,222,114,114,100,218,218,218,450,450,100,100,214,222,214,222,214,222,214,222,214,222,214,222,
				 100,100,500,222,222,708,709,222,114,114,100,218,218,218,450,450,214,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,500,500,222,708,708,114,114,113,100,400,668,218,711,218,218,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,222,222,222,114,113,100,100,400,710,401,710,218,218,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,100,112,113,100,100,100,219,710,222,714,714,402,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,100,100,100,219,100,100,222,222,222,301,301,222,100,214,214,214,214,214,214,214,214,214,214,214,214,
				 100,100,100,162,160,160,160,161,222,219,100,222,222,222,301,301,222,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,100,160,160,160,160,160,222,222,100,222,222,222,301,301,222,100,100,222,100,222,100,222,100,222,100,222,100,222,
				 100,100,100,160,160,160,160,160,100,100,100,100,222,222,100,100,100,100,214,222,214,222,214,222,214,222,214,222,214,222,
				 100,100,100,164,160,160,160,160,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222, 
				 100,171,100,105,164,160,160,160,219,100,100,222,222,222,710,222,101,100,214,214,214,214,214,214,214,214,214,214,214,214,
				 100,171,170,105,105,100,214,166,222,219,100,222,222,222,710,222,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,171,171,100,105,105,214,166,167,222,214,222,222,222,100,218,100,100,100,222,100,222,100,222,100,222,100,222,100,222,
				 100,100,100,100,100,105,222,166,166,160,160,161,222,222,100,100,100,100,214,222,214,222,214,222,214,222,214,222,214,222,
				 100,100,100,100,100,100,214,214,214,214,214,160,160,160,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222];



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
				 100,100,100,100,100,161,160,162,227,100,100,222,222,222,714,222,101,100,227,227,227,227,227,227,227,227,227,227,227,227,
				 100,100,100,100,160,160,160,160,222,227,100,222,222,222,100,222,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,100,100,160,166,160,160,222,222,100,222,222,222,222,222,100,100,100,222,100,222,100,222,100,222,100,222,100,222,
				 100,100,100,100,163,166,160,162,100,100,100,100,222,222,100,100,100,100,227,222,227,222,227,222,227,222,227,222,227,222,
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
				 100,100,501,100,100,100,160,100,227,100,100,222,222,222,714,222,101,100,227,227,227,227,227,227,227,227,227,227,227,227,
				 100,100,100,100,160,160,160,100,222,227,100,222,222,222,714,222,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,100,100,160,166,160,160,222,222,100,222,222,222,301,222,100,100,100,222,100,222,100,222,100,222,100,222,100,222,
				 100,100,100,100,100,166,160,100,100,100,100,100,222,222,100,100,100,100,227,222,227,222,227,222,227,222,227,222,227,222,
				 100,100,500,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222, 
				 100,100,100,100,100,100,100,100,227,100,100,222,222,222,720,222,101,100,227,227,227,227,227,227,227,227,227,227,227,227,
				 100,100,100,100,105,105,105,100,222,227,100,222,222,222,720,222,100,100,222,222,222,222,222,222,222,222,222,222,222,222];
	}
}

/// this is kept here so you don't have to constantly define it  when you need it elsewhere 
////  (to calculate distances|width&height| in map for different room sizes) 
function checkTileNumbers(room){

	if(room=="room-1"){
		roomNumberTilesY = 23;
		roomNumberTilesX = 30;
	}else if(room=="room-2"){
		roomNumberTilesY = 20;
		roomNumberTilesX = 30;
	}
///with the maps right up there it's easy to adjust
}






///     ///
  //   //
  /////       ////// ///  //  ///////
  //////     ////     ////   ///
  //   //   ///       //    /////
///    //   /////    //  ///////


var keysPressed = []; 

var keyDown={isDown:false, whatKey:null};

///from Event Listener (at Init)
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

					player1.direction = "nowhere";
					player1.facing = "nowhere";

					if(menuTrack==0){
							//console.log(itemRow+ "HHH "+(player1.items.length-1));
						if(typeof player1.items[1]!="undefined"&&itemRow!=0){

							itemRow-=1;
							//console.log("row"+menuRow);
							menuItemAlreadyPainted=false;
				
						}else if(itemRow==0){

							itemRow=player1.items.length-2;
							menuItemAlreadyPainted=false;
								
						}

						selecto();

					}else if(menuTrack==1){
							
						if((gunRow-1)<0){
							gunRow=player1.guns.length-1;
						}else if((gunRow-1)<player1.guns.length){
							gunRow-=1;
						}
								
						menuGunAlreadyPainted=false;

						selecto();
					}
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

					player1.direction = "nowhere";
					player1.facing = "nowhere";

					menuCount=0;
					daMenu.draw();
					
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
					player1.direction = "nada";

					console.log(player1.direction);

				}// if paused  

			}// DOWN arrow



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
					player1.direction = "nowhere";
					player1.facing="nowhere";

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

					player1.direction = "nowhere";
					player1.facing="nowhere";

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


			//////////////////////////////////////////////////////////////////
			/// Player DASH
			if (keysPressed[16]) { 
				dashCount=0;

				dash=true;
				    

			}/// key: SHIFT


			if (keysPressed[18]) { 

				if(!paused){
					for(var n = 0; n < player1.nonSelectItems.length; n++ ){
						if(player1.nonSelectItems[n].itemNumber==3){
						   // console.log(player1.nonSelectItems[n].itemNumber);			
							tele=true;
						}
					}
				}
			}/// key: alt

			if (keysPressed[32]) {  /////////////////////////////// YES, WORKS

				console.log("FACING ?"+player1.facing);

				if(facingBeforePause==null){
					facingBeforePause=player1.facing;
				}
				

				player1.direction="nowhere"; /// leave or not... a matter of style
				player1.facing="nowhere";

				clearCtx(ctxMenu);
				clearCtx(ctxMenuOver);

				if(!paused){

					if(player1.items.length<=1){
						menuTrack=1;
					}
					paused=true;
					selecto();
					pause();

					////also : pause IS BEING SENT TO OUTSIDE FUNCTION SO AS TO RECOURSE IT WHILE notPlaying & WHILE STILL LISTENING TO KEYS 
					////                                                                            which trigger different parts of pause(function)
				   
				}else{
					paused=false;
					player1.facing=facingBeforePause;
					facingBeforePause=null;
					pause();
				}
			} /// key: SPACE

			// C
			if (keysPressed[67]) { 
				
				if(flash==0){
					flash=1;
				}else if(flash==1){
					flash=2;
				}else{
					flash=0;
				}
				
				
			}/// key: C



			if(keysPressed[50]){
				
				if(doorBlock){
					doorBlock=false;
				}

				if(player1.direction!="room-change"){
					player1.shooting=true;
				}
			} /// key: 2 >>> B button


			if(keysPressed[49]){

				if(player1.direction!="room-change"&&player1.items.length>1){
					if(itemDecrementCount==0){
						player1.usingItem=true;
					}
					
					//console.log("using Item");
				}
			} /// key: 1 >>> A button


			if(keysPressed[17]){
				
				console.log("START button")
			} /// key: crtl >>> START button

			e.preventDefault();

		}// IF !checkArrows
	}// IF !blockInput

}//END CheckKEYS







///    P   H   I   S  Y  C  S
function friction(){


	///this is kinda messes up  ///will need a definitive arrangement at some point. 
	///  because of the friction and 2 key diagonals+release, its hard to set the shooting direction
	//														and to pin point the definite angle player1 is facing
	if(releaseCounterCount>4){
		slowDownDirection=player1.direction;
		player1.facing=player1.direction;
	}else{
		slowDownDirection=player1.facing;	
	}/// but remember NES games didn't even go that far

	slowDownDirection=player1.facing;

	// diagonal friction
	if(latestKeys.length>0){

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
		//either this if for friction
		if(player1.speed>0){
			slowDown=true;
		}

		////or this for not-friction
		// player1.speed=0;
		// player1.direction="nada"; 
			
	} // else IF latestKeys.length>0
 
}/// FUNC friction

var releaseCounter=false;





///l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]
///
///             S  E  L  E  C  T      I  N  V  E  N  T  O  R  Y
///
///l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]|[]/l]


function selecto(){
	////  WHEN A GUNTYPE FIRSTPICK >> GOES AND SELECT IT AND DRAWS IT IN MENU AS CURRENT
console.log("IT R "+itemRow);
	if(menuTrack==0){

		//if not true already..
		menuH_items.isSelected=true;

		///loop row =>> loop player1.items...
		for(var i=0; i<player1.items.length-1; i++){
			if(itemRow==i){
				player1.itemSelected=player1.items[i+1].itemNumber;

				console.log("ITEMS?" +player1.itemSelected);
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


////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_///L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\|_-_////L]_^#@~~/\\\





									 ////   ////   ///   ////   ////////      
									 ////   /////  ///   ////       ///            
									 ////   ////// ///   ////       ///                          
 									 ////   //////////   ////       ///     
									 ////   /// //////   ////       ///           
									 ////   ///  /////   ////       ///       





window.addEventListener("load", initGame, false);

//should be in Funtion => GAME
function initGame() {

	//// better to keep display at hard pixels and change a few times depending ongeneral screen-size, maintaining aspect ratio and adding black

	///////  this mainly because canvas goes fckng slow when scales up, 
	///		and the speed variation at diff sizes is insane 

	/// CANVAS hardwired sizes  << possibly change, few diff options
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
	canvasOverOverlay.height = 720;
	canvasPause.width =900;
	canvasPause.height = 600;

	canvasMenu.width =900;
	canvasMenu.height = 100;

	/// FOR SOME REASON IT DOESNT DO THIS ONE.. (hardcoded on index.html)
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


	/// Key   Down|Up   LISTENERS!!                                       
	//																	K - D O W N
	document.addEventListener("keydown", function(e) {

		checkKey(e, true, false); 
		
		 if(checkKey(e, true, true)==37||checkKey(e, true, true)==38||checkKey(e, true, true)==39||checkKey(e, true, true)==40){
			
		 		/// NO PUEDE SER IMPAR por alguna razon
		   		player1.speed=8; //// = 12, = currentSpeed <<<   should vary throughout the game
		   		releaseCounter=false;

				slowDown=false;
				slowDownDirection=player1.direction;		
		}// IF Check for Arrows (D-pad) pressed	

	}, false);
	/// END KeyDown


	/// 																  K - U P	
	document.addEventListener("keyup", function(e) {	
		 
		for (var i = 0; i<latestKeys.length;i++) {
			//console.log(latestKeys[i]);
			if(checkKey(e, true, true)==latestKeys[i]){
				//console.log(latestKeys.length);
				latestKeys.splice(i,1);
				i=i-1; /// otherwise after splicing, the next i comes to take the current i's place and on the next iteration it won't be checked anymore (and too late to check on this one, so it passes)
			}
		}// FOR latest keys

		keysPressed = [];
		keyDown.isDown=false; 

		///ONLY IF ARROWS keyUp!!!
		if(checkKey(e, true, true)==37||checkKey(e, true, true)==38||checkKey(e, true, true)==39||checkKey(e, true, true)==40){

			releaseCounter=true;

			/// this should stop player when key up  << but with a little delay
			if(!dash){
				friction(); 
			}
			
		}// IF check Arrows Pressed



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
		}

		/// Shooting's UP (SpaceBar Release)
		if(checkKey(e, true, true)==50){
			player1.shooting=false;
		}

		/// Dash button (presumably A, as powered by item)
		if(checkKey(e, true, true)==16){
			player1.speed=8;/////////    this has to come from array.. diff speeds according to situations
			dashCount=0;
			dash=false;
			friction();
		}


		if(checkKey(e, true, true)==49){
			player1.usingItem=false;
			itemDecrementCount=0;
		}


	},false);
	/// END KeyUp


	///////////  S T A R T    G A M E  ///////////////
	begin();

}/// FUNC initGame





  ////////               ////////                        ///   ///
 //////////           /////             ////////         //   ///
//////   /////        ///            ///      ///       //   ///
/////     /////          ///       ///                  //   
/////     ////        ///         ///                   //
/////////////////    ///           ///                 //
//////      /////    ///            ///      ////     ///
////////////////     /////          /////     ////   ///
  /////////////       ///////////    //////////      ///



function begin() {

	currentRoom= "room-1";
	currentArea="default";
	currentLevel=1;

	roomDraw(currentRoom, currentArea, 0, tileDiameter, 0, 0, "first", currentLevel);


	// So, if it's not gonna start from corner 0, 0 >>>  Block screen with something (block input too)....
	//changeRoom("room-2", 669, shiftX, shiftY, "normal");
	// ... then release it, ad there you go


	if(playerChoosing=="player1"){
		
		player1 = new Player(playerTypes[0]); /////// [0] <<<< VAR depending on playerType chosen at introScreen
	}

	isPlaying = true;

	requestAnimFrame(loop);



	///// Initial GAME ITEMS  (unlike enemy drops which appear as the game goes)
	items.push( 

		new Item(0,176, 290,80, tileDiameter, tileDiameter,"item", 1, false, false, null, "room-1"), 

		new Item(96,128, 350,200, tileDiameter, tileDiameter,"item", 4, true, false, null, "room-1"), 
		new Item(96,176, 345, 100, tileDiameter, tileDiameter, "item", 2, true, false, null, "room-1"), 

		new Item(48,128, 430,160, tileDiameter, tileDiameter,"item", 3,false, false, null, "room-1"), 

		new Item(96,128, 200,100, tileDiameter, tileDiameter,"item", 4, true, false, null, "room-1")); 


	items.push( 
		new Item(144,176,  150,250, tileDiameter, tileDiameter,"gun", 0, false, false, null, "room-1"), 
		new Item(192,176, 200,250, tileDiameter, tileDiameter,"gun", 1, false, false, null, "room-1"), 
		new Item(192,176, 388,250, tileDiameter, tileDiameter, "gun", 1, false, false, null, "room-1"));


	items.push( 
		new Item(192,128,  550,110, tileDiameter, tileDiameter,"ammo", 1, false, false, null, "room-1"), 
		new Item(0,128,  480,150, tileDiameter, tileDiameter,"life", 1, false, false, null, "room-1"));


	menuH_items = new menuH(700, 600, 30, 30, 200, 100, "item", false);
	menuH_guns = new menuH(700, 600, 30, 30, 230, 100, "gun", false);


	player1.guns[0]={srcX:570, srcY:605, width:45, height:45, selec:true, itemType:"gun", itemNumber:0, lifeType:null,amount:0};
 
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////
////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
///////////////////////////////////////////////////////////////////////////////////////////////////////////////



















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

	roomDraw(currentRoom, currentArea, 0, tileDiameter, shiftX, shiftY, "not-first");
}





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







//TYUIH^*@()//TYUIH^*@(//TYUIH^*@()//TYUIH^*@()//TYUIH^*@(//TYUIH^*@()//TYUIH^*@(//TYUIH^*@()//TYUIH^*@()//TYUIH^*@(
//TYUIH^*@()//TYUIH^*@(//TYH^*@()//TYUIH^*@()//TYUIH^*@(//TYUIH^*@()//TYUIH^*@(//TYUIH^*@()//TYUIH^*@()//TYUIH^*@(
//TYUIH^*@()//TYUIH^*@(//TYH^*@()//TYUIH^*@()//TYUIH^*@(
//TYUIH^*@()//TYUIH^*@(//TYUIH^*@()//TYUIH^*@()//TYUIH^*@(//TYUIH^*@()//TYUIH^*@(//
//TYUIH^*@()//TYUIH^*@(//TYH^*@()//TYUIH^*@()//TYUIH^*@(


















															//\///\\//\  ///////    ///    //  /    ///
															///\\\\\\\\  ///       /////  //  /    ///
															///\\\\\\\\  /////    /// // //  /    ///
															//// \/ \\\  ///     ///  ////  /    ///
															///    \ \\  //////////   ///  ////////




var itemCounter = 0;
var gunCounter = 0;
///Menu items  >>> only updated on pause

function menu(srcX, srcY, w, h, x, y) {
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

	var itemX=0;

	for (var i =0; i<3; i++) { ///// 3 Tracks
			
		if(i==0){
			if(player1.items[1]!=null&&player1.items[1]!="undefined"){
								
				clearCtx(ctxMenu);
				clearCtx(ctxMenuOver);



						
				for (var j = 0;j<player1.items.length; j ++) {			 
								
							/// FOR  ROW>>> IT COULD BE INFINITE!    for player1.items  igual que en checkKey
					if(itemRow==j){
						if(typeof player1.items[j]!="undefined"){

							//console.log( " L"+player1.itemSelected);

							if(player1.itemSelected==1){
								itemX=0;
							}else if(player1.itemSelected==2){
								itemX=64;
							}else if(player1.itemSelected==3){
								itemX=128;
							}else if(player1.itemSelected==4){
								itemX=128;
							}

							///ONLY DRAW IF SELECTABLE!!!  and only apply effects if items-> thisRow <<<< MOR THAN ONE
							///// so duplicate this if elses and >> if player1.items 
									
	          	
	          				if(paused&&menuTrack==0&&pauseType=="gamePause"){
	          					repeat++;
	          					//console.log("RRR "+repeat);
	          					if(itemCounter<20){
	          						ctxMenuOver.drawImage(itemsMenu, itemX, 0, 64, 64, 80, 14,64, 64);

	          						itemCounter++;
	          						//console.log("I C " +itemCounter);
	          					}else if(itemCounter>=20&&itemCounter<27){
	          						itemCounter++;
	          						//console.log("I C " +itemCounter);
	          						clearCtx(ctxMenuOver);
	          					}else{
	          						itemCounter=0;
	          						//console.log("I C " +itemCounter);
	          					}
	          				}else{
	          					ctxMenuOver.drawImage(itemsMenu, itemX, 0, 64, 64, 80, 14, 64, 64);
	          				}

	          					
	          				//console.log("CUANTOS YA? "+player1.nonSelectItems.length);
	          				

						}    
					}
				};
							
				menuItemAlreadyPainted=true;
								///// should be this.ICON >> diff image in game and inventory
					
			} 
				
		}else if(i==1){
				
			//clearCtx(ctxMenuOverOver);
		
			
			

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
									
							//ctxMenuOver.clearRect(230,0, 64, 64);

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
		


	if(paused&&pauseType=="gamePause"){

		//clearCtx(ctxOverlay);
		ctxOverlay.fillStyle = "rgba(0, 0, 0, 0.28)";
		ctxOverlay.fillRect(0, 0, 900, 100);

		ctxOverlay.fillStyle = "rgba(3, 0, 6, 0.24)";
		ctxOverlay.fillRect(0, 100, 900, 100);

		ctxOverlay.fillStyle = "rgba(3, 0, 6, 0.21)";
		ctxOverlay.fillRect(0, 200, 900, 100);

		ctxOverlay.fillStyle = "rgba(3, 0, 6, 0.16)";
		ctxOverlay.fillRect(0, 300, 900, 100);

		ctxOverlay.fillStyle = "rgba(3, 0, 6, 0.12)";
		ctxOverlay.fillRect(0, 400, 900, 100);

		ctxOverlay.fillStyle = "rgba(3, 0, 6, 0.1)";
		ctxOverlay.fillRect(0, 500, 900, 100);


		/// maybe should be other canvas...   so comes from the side only when needed (Start vs Select)

		for (var i=0; i< player1.nonSelectItems.length; i++) {
			
			if(player1.nonSelectItems[i].itemNumber==1){
				
				ctxOverOverlay.drawImage(itemsMenu, 0, 64, 64, 64, 110, 214, 64, 64);
			}else if(player1.nonSelectItems[i].itemNumber==3){
				
				ctxOverOverlay.drawImage(itemsMenu, 128, 64, 64, 64, 410, 214, 64, 64);
			}		
		}
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

		
		
	// }
	var shifto=0;

	ctxMenuOver.clearRect(360,0, 400, 300);
	for (var i = 0; i<player1.life; i++) {

		ctxMenuOver.fillStyle = "red";					
		ctxMenuOver.fillRect(360+shifto, 20, 2, 20);

		shifto+=3;
	};



}/// END MenuDraw











//////^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+
//////^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+








//Menu Highlighter
function menuH(srcX, srcY, w, h, x, y, type, selec) {
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

	ctxMenuOverOver.font="20px Georgia";
	ctxMenuOverOver.fillStyle="blue";

	ctxMenuOverOver.fillText(bullets[player1.weaponSelected].current,170,40);

	for(var j=0; j<player1.items.length; j++){
		if(player1.items[j].itemNumber==player1.itemSelected){
			//console.log("ITEM SELECTED "+ player1.itemSelected);

			if(typeof player1.items[j] !="undefined"&&player1.items.length>1){
				ctxMenuOverOver.fillText(player1.items[j].amount ,70,40);
			}

		}
	}
	if(paused){

		
		if(menuTrack==0&&player1.items.length>1){

			////  SO THIS 2 HAVE TO GO ON A DIFF CANVAS >>> HIDE ON afterPAUSE

			

				/// HERE::  ANIMATION OVER itemInMenu >>> like a light reflection 	

				ctxMenuOverOver.drawImage(menuBorder, mBorderX, 0, 64, 64, 80, 14, 64, 64);
				

				mBorderCount++;

				if(mBorderCount>oldmBorderCount+3){
					oldmBorderCount=mBorderCount;
					mBorderX+=64;
				}
					            
			
		}else if(menuTrack==1){
					 
			
			  
			  							////   48 + counter to make anim
				ctxMenuOverOver.drawImage(menuBorder, mBorderX, 0, 64, 64, 210, 14, 64, 64);

				mBorderCount++;

				if(mBorderCount>oldmBorderCount+3){
					oldmBorderCount=mBorderCount;
					mBorderX+=64;
				}
				
			
		}
	}



}/// END Menu Highlighter Draw


//////^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+///^)*_+










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

		// canvasOverOverlay.style.background="rgba(0,0,0,0.8)";
		// canvasOverOverlay.style.zIndex=4000;

		player1.speed=0;
		isPlaying = false;

	//// pause IS BEING SENT TO OUTSIDE FUNCTION SO AS TO RECOURSE IT WHILE notPlaying WHILE STILL LISTENING TO KEYS 
		/// which trigger different parts of pause(function)
		requestAnimFrame(pause);
		
	}else{		 
		
		// canvasOverOverlay.style.background="transparent";
		// canvasOverOverlay.style.zIndex=6000;

		if(mBorderX>256){
			oldmBorderCount=0;
			mBorderCount=0;
			mBorderX=0;
		}
		isPlaying = true;

		// player1.direction = "nada";
		// player1.facing = "nada";
		//player1.direction =player1.facing;

		///erased nonSelect Items  from screen
		clearCtx(ctxOverOverlay);


		requestAnimFrame(loop);
	}
}/// pause











//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\
//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||\\||//||





						 ///              ///  ///////     ////////   //      /////
						  ///           ///   ///   ///   ///   ///  //      //  ///
						  ///  ///   ///    //      //  /////////  //       //   ///
						   ////  /////      ///   ///  ///   //   //       //  ///
							///  ///         //////   ///    //   /////// /////







////                                                                                      O B S T A C L E S
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


////                                                                                           A R E A S
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



///Global Sprites
var imgPlayer = new Image();
	imgPlayer.src = "images/playerSpriteBig.png";

var imgBullets = new Image();
	imgBullets.src = "images/bullets.png";   

var itemsMenu = new Image();
	itemsMenu.src = "images/itemsprite.png";

var weaponS = new Image();
	weaponS.src = "images/weaponsprites.png";

var menuBorder = new Image();
	menuBorder.src = "images/menuhighlight2.png";




function roomDraw(currentRoom, area, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, firstDraw, level){

	var img = new Image();
	img.src = "images/spritesBg2.png";

	anim = new Image();
	anim.src = "images/spritesAnim.png";

	doors = new Image();
	doors.src = "images/door-over-sprites.png";

	doorFrames = new Image();
	doorFrames.src = "images/door-over.png";

	edges = new Image();
	edges.src = "images/edges-sprites.png";


	// Uncaught SyntaxError: Duplicate parameter name not allowed in this context
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

		 tilesOverlayDraw(shiftX, shiftY, img, area, {mapOverDraw}, roomNumberTilesY, roomNumberTilesX, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, newTileIndexX, {t:100, areaTrigger:"all"}, {t:101, areaTrigger:"all"}, {t:110, areaTrigger:"all"},{t:105, areaTrigger:"all"},{t:108, areaTrigger:"all"},{t:107, areaTrigger:"all"},{t:110, areaTrigger:"all"},{t:111, areaTrigger:"all"},{t:112, areaTrigger:"all"},{t:113, areaTrigger:"all"},{t:114, areaTrigger:"all"},{t:160, areaTrigger:"all"}, {t:161, areaTrigger:"all"},{t:162, areaTrigger:"all"},{t:166, areaTrigger:"all"} ,{t:167, areaTrigger:"all"} ,{t:163, areaTrigger:"all"},{t:164, areaTrigger:"all"},{t:165, areaTrigger:"all"},{t:170, areaTrigger:"all"}, {t:171, areaTrigger:"all"} ,{t:222, areaTrigger:"all"}, {t:214, areaTrigger:"all"}, {t:218, areaTrigger:"all"}, {t:219, areaTrigger:"uno"}, {t:227, areaTrigger:"uno"}, {t:232, areaTrigger:"uno"}, {t:250, areaTrigger:"uno"}, {t:710, areaTrigger:"uno"}, {t:708, areaTrigger:"dos"}, {t:711, areaTrigger:"uno"}, {t:714, areaTrigger:"uno"}, {t:709, areaTrigger:"dos"}, {t:400, areaTrigger:"uno"}, {t:401, areaTrigger:"uno"},{t:402, areaTrigger:"uno"},{t:500, areaTrigger:"uno"}, {t:502, areaTrigger:"uno"},{t:503, areaTrigger:"uno"}, { t:668, areaTrigger:"uno"}, {t:350, areaTrigger:"all"}, {t:301, areaTrigger:"uno"}, {t:310, areaTrigger:"uno"}, {t:450, areaTrigger:"uno"} ); 
		 
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
		
	/// Aqui se llenan los arrays de areas[] y obstacles[]
	for(var i =0; i<roomNumberTilesY; i++){
		for(var e=0; e<roomNumberTilesX; e++){

			if(mapObsL1[tileMapIndex].toString().substring(0,1)==1){ ///////// area (default)

				if(mapObsL1[tileMapIndex]==190){ /////////  TRANSITION area
					areas.push(new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "transition"));
				}else if(mapObsL1[tileMapIndex]==160){ // & maybe many other >> diff types/colors of water
					areas.push(new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight,"default", null, null, null, null, null, null, null, "water"));

				/// end if tile 160
				}else if(mapObsL1[tileMapIndex]==166){ /////////  doorTOout

					areas.push(new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight,"default", null, null, null, null, null, null, null, "deep-water"));
					
					obstacles.push(new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL1[tileMapIndex], "active", 30, "closed"));

				/// end if tile 166
				}else if(mapObsL1[tileMapIndex]==170){ 
					areas.push(new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight,"default", null, null, null, null, null, null, null, "orange-lava"));

				/// end if tile 160
				}else if(mapObsL1[tileMapIndex]==171){ 

					areas.push(new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight,"default", null, null, null, null, null, null, null, "red-lava"));

				/// end if tile 170
				}else{
					areas.push(new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default"));
				}

			/// if mapObsL1[tileMapIndex] ==1...	 
			}else if(mapObsL1[tileMapIndex]>=200&&mapObsL1[tileMapIndex]<249){ ///////// obstacle out

				//NORMAL OBSACLES
				obstacles.push(new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "wall", mapObsL1[tileMapIndex], "active"));

			}else if(mapObsL1[tileMapIndex]>=250&&mapObsL1[tileMapIndex]<275){ ///////// obstacle in area
					 
				obstacles.push(new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "wall", mapObsL1[tileMapIndex], "active"));			

			//// AREAS	
			}else if(mapObsL1[tileMapIndex].toString().substring(0,1)==7&&mapObsL1[tileMapIndex]!=708&&mapObsL1[tileMapIndex]!=709){ ///////// area 1

				areas.push(new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "uno"));
			}else if(mapObsL1[tileMapIndex]==708){ ///////// area 1

					 
				areas.push(new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "dos"));
			}else if(mapObsL1[tileMapIndex]==709){ ///////// area 1

					 
				areas.push(new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "dos"));


					//// INSIDE DOORS
			}else if(mapObsL1[tileMapIndex].toString().substring(0,1)==4){ ///////// door in area
				areas.push(new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "uno"));
						
				if(inActive.length==0){
					obstacles.push(new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL1[tileMapIndex], "active", 30, "closed"));
				}else{
					///WHATS HAPPENING:
					/// inAct keeps track of whether this Tile's number has had any match within the inactive Obstacles.
					// if at any poin it did, then doesn't matter what happens, inAct is true and the obstacle is not (this way it waits for the whole inActive-obs Array to finish before deciding to draw or not)

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
						obstacles.push(new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL1[tileMapIndex], "inActive", 30, "closed"));	
					}else{
						obstacles.push(new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL1[tileMapIndex], "active", 30, "closed"));		
					}
				}// if 4 Active

				inAct=false;
						

					//// OUTSIDE DOORS	
			}else if(mapObsL1[tileMapIndex].toString().substring(0,1)==3){ ///////// door out

						/// has to also be an area >> when opened >> so changes from inside room to outside
				areas.push(new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default"));
					 
					  if(inActive.length==0){
							obstacles.push(new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL1[tileMapIndex], "active", 30, "closed"));

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
						obstacles.push(new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL1[tileMapIndex], "inActive", 30, "closed")//// ID has to be = to the tileNumber
						);			
					}else{
						obstacles.push(
						new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL1[tileMapIndex], "active", 30, "closed"));	
					}
				}// if 3  Active

				inAct=false;


			///////DOORS TO OTHER ROOMS
			}else if(mapObsL1[tileMapIndex]==668){ ///////// doorTO in area
					 
				areas.push(////////////////////////////////    //  IMPORTANT!!!  after "door"=.n >> 888 = id, 885, dooTo >>> door is going to
										/////// now here below, this room it is going to (888)>> 888 tile has to be given it's 885 id so dootTo here MATCHES!!
										///first is ID of this door, then ID doorItIsGoinggTo
				new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "uno", "door", 668, 501, tileIndexX, tileIndexY,"room-2"));
			}else if(mapObsL1[tileMapIndex]==669){ ///////// doorTO in area
					 
				areas.push(new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default", "door", 669, 668, tileIndexX, tileIndexY,"room-1"));
			}else if(mapObsL1[tileMapIndex]==503){ ///////// doorTO in area
					 
				areas.push(new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default", "door", 503, 503, tileIndexX, tileIndexY, "room-1"));
			}else if(mapObsL1[tileMapIndex]==500){ /////////  doorTOout
					 
				areas.push(new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default", "door", 500, 500,tileIndexX, tileIndexY,  "room-2",));
			}else if(mapObsL1[tileMapIndex]==501){ /////////  doorTOout
					 
				areas.push(new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default", "door", 501, 668,tileIndexX, tileIndexY,  "room-1",));
			}else if(mapObsL1[tileMapIndex]==502){ /////////  doorTOout
					 
				areas.push(new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default", "door", 502, 501,tileIndexX, tileIndexY,  "room-2",));
			}else if(mapObsL1[tileMapIndex]==708){ ///////// doorTO in area
				 
				areas.push(new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "dos"));
			}

			tileIndexX+= tileWidthHeight;

			tileMapIndex++;

		}//roomNumberTilesX

		tileIndexY+=tileWidthHeight;
		tileIndexX=newTileIndexX;

	}//roomNumberTilesY

} /////   tilesDefine  











var areaEdgeX=0;


/// for flashes and light effects
var yAnim=0;
var yyAnim=0;// animated tiles have a slightly diff sprite layout
/// for animation effects
var xAnim=0;
/// for animation effects
var xAnimCounter=0;

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


function tilesOverlayDraw(newShiftX, newShiftY, img, area, {mapOverDraw}, roomNumberTilesY, roomNumberTilesX, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, newTileIndexX){

	xAnimCounter++;  /// moves ANIM-frames for the animated tiles

	var doorX=0;

	var doorY=0;



	
	var tallerDoor=0;

	//// this will take the tiles sent by  tilesDefineOver after this standard parameters
	var defaultTiles = [];
	/// j =11>>  11 are the arguments we got in tilesOverlayDraw() - The tiles we want to get come after and we don't know how many they could be...
	for(var j=0; j < arguments.length; j++){
		if(j>11){
			///... after the arguments (11) we store this SpriteTile coordinate values in an array defaultTiles...
			defaultTiles.push(arguments[j]);
		}
	}////////////  



	var srcX;
	var srcY;

	var columnsPerRow=0;
	var countingColumns=0;
	var columnsPerRow2=0;
	var countingColumns2=0;

	var done=false;
	
	/// menuMap back-ground >> drawn only once, underneath  >> and probably make some for items/guns
	ctxMapOverMenu.fillStyle = "#000";					
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
							}else{
								srcX=getTileX(defaultTiles[j].t, "c");
							}

						}///  Tiles draws SET

						
					}// FOR doorGroupsTotal LENGTH

					done=false; // goes back to false to check next Tile (maybe a door, maybe not)
					


					//     	   TILE  
					//		   SRC
                    //\\      ///
				      //\\  ///   	
			           //////   
				       //\\\\    
			          ///  \\\     
				    ///     \\\\

					//  TILE srcX >> Area-PAIR COMBINATIONS
					function getTileX(tileID, tileArea){
	
						tileBgMap=[
						{n:100, a:48, b:0}, 
						{n:160, a:0, b:0},    ///anim sprites
						{n:161, a:0, b:0},    ///anim sprites
						{n:162, a:0, b:0},    ///anim sprites
						{n:163, a:0, b:0},    ///anim sprites
						{n:164, a:0, b:0},    ///anim sprites
						{n:165, a:0, b:0},    ///anim sprites
						{n:166, a:144, b:0},   ///anim sprites
						{n:167, a:144, b:0},   ///anim sprites
						{n:170, a:288, b:0},    ///anim sprites
						{n:171, a:432, b:0},   ///anim sprites

						{n:101, a:96, b:0},
						{n:105, a:48, b:0}, 
						{n:108, a:288, b:384},
						{n:107, a:288, b:384},

						{n:110, a:480, b:0},
						{n:111, a:528, b:0},
						{n:112, a:576, b:0},
						{n:113, a:614, b:0},
						{n:114, a:672, b:0},
					

						{n:214, a:288, b:432},
						{n:218, a:288, b:384},
						{n:219, a:288, b:0, c:0},
						{n:222, a:192, b:864},
						{n:227, a:192, b:432, c:0},
						{n:232, a:192, b:432, c:0},
						{n:250, a:48, b:0},
						{n:710, a:288, b:336, c:0},
						{n:708, a:288, b:336, c:0},
						{n:709, a:288, b:336, c:0},
						{n:711, a:288, b:336, c:0},
						{n:714, a:192, b:336, c:0},
						{n:400, a:288, b:336, c:0},
						{n:401, a:288, b:336, c:0},
						{n:402, a:288, b:336, c:0},
						{n:403, a:288, b:336, c:0},
						{n:450, a:288, b:48, c:0, top:48, bottom:240},
						{n:301, a:336, b:288, top:144, bottom:96},
						{n:310, a:336, b:288, top:144, bottom:96},
						{n:350, a:48, b:0, c:0}, 
						{n:500, a:720, b:0, c:0}, 
						{n:668, a:288, b:768, c:0},
						{n:503, a:672, b:0, c:0}
						]


						for(var i = 0; i <tileBgMap.length; i++){
							if(tileID==tileBgMap[i].n){
								if(tileArea =="a"){
									return tileBgMap[i].a;
								}else if(tileArea =="b"){
									return tileBgMap[i].b;
								}else if(tileArea =="c"){
									return tileBgMap[i].c;
								}else if(tileArea =="door-top"){
									return tileBgMap[i].top;
								}else if(tileArea =="door-bottom"){
									return tileBgMap[i].bottom;
								}
							}
						}/// FOR tileBgMap.length
						
					}// FUNC getTileX


					//     TILE  
					//		SRC
					//	    \\
					 ///   \\
					  ///// 
					  ///
					///  

					// TILE src Y  SAME TO ALL <<<<<  this is what is manipulated to control "flashes" and such
					srcY= 0;
					yyAnim=0;
					yAnim=0;
					if(flash==1){
						//console.log("FLASH "+flash);
						yAnim=48;
						yyAnim=336;
					}else if(flash==2){
						//console.log("FLASH "+flash);
						yAnim=96;
						yyAnim=672;
					}


					//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\	 \\\\\	\\\\	 \\\\\	\\\\	 \\\\\	\\\\	 \\\\\	\\\\	 \\\\\	\\\\	 \\\\\	\\  ////
					//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


					//\///\\//\  ///////    ///    //  /    ///         //\///\\//\   	 ///\      //////// 
					///\\\\\\\\  ///       /////  //  /    ///          ///\\\\\\\\     /\\\ \     //   //
					///\\\\\\\\  /////    /// // //  /    ///           ///\\\\\\\\    ////\ \\    //////
					//// \/ \\\  ///     ///  ////  /    ///            //// \/ \\\   ////  \\ \   //
					///    \ \\  //////////   ///  ////////             ///    \ \\  ////    \ \\  //

					// Menu Map here so Tiles have been Defined already (as dependent on them)

					//////  gameCounter Global, or else, if placed within here, the dot flickers faster in other Rooms

					///flicker FX
					if(gameCounter<22){
						//console.log(gameCounter);
						ctxMapOverMenu.fillStyle = "rgba(255, 120, 160, 1)";
					}else if(gameCounter>=22&&gameCounter<30){
						ctxMapOverMenu.fillStyle = "black";
					}else if(gameCounter>=30){
						gameCounter=0; /// rinse & repeat	
					}

					////////////  	THIS BELOW IF TILEDIAMTER ==  48......
					ctxMapOverMenu.fillRect(10+newDrawX/12, 20+newDrawY/12, 4.8, 4.8);

					if(defaultTiles[j].t.toString().substring(0,1)==1){
						ctxMapOverMenu.fillStyle = "#0b0020";
						ctxMapOverMenu.fillRect(8+e*4+shiftX/12, 20+i*4+shiftY/12, 4.8, 4.8);
					}else if(defaultTiles[j].t.toString().substring(0,1)==2){
						ctxMapOverMenu.fillStyle = "#aa001f";
						ctxMapOverMenu.fillRect(8+e*4+shiftX/12, 20+i*4+shiftY/12, 4.8, 4.8);
					}

					/////////// OR THIS IF == 64
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










					    ///////   ||||  |||  ||  //|    ||     ///   /////////  ///////  ///////  
					   ///    |  ||||| |||  ||  // |   ||/    // //     ///    //       //   ///    
					  ///     | |  ||||||  ||  //  |  ||//   //  //    ///    ///      //  ///      
					 /// ANIM tiles       ||  //   ||||///  //   //   ///    //////   //////       
				    /// 


					if(defaultTiles[j].t>=160&&defaultTiles[j].t<190){

						if(xAnimCounter>=0&&xAnimCounter<5){
							xAnim=0;
							areaEdgeX=0;
						}else if(xAnimCounter>=5&&xAnimCounter<10){
							xAnim=48;
							areaEdgeX=48;
						}else if(xAnimCounter>=10&&xAnimCounter<15){
							xAnim=96;
							areaEdgeX=96;
						}else if(xAnimCounter>=15){
							xAnim=0;
							xAnimCounter=0;
							areaEdgeX=0;
							/// xAnimCounter++ >> so the anim-frame doesn't move until ALL tiles have been set
							/// (otherwise it animates like waterfall, pretty cool too)
						
						/// TRy to keep a limited amount of tiles being animated!! (or check speed on avg computer)
						}

					}else{
						xAnim=0; ///// back to ZERO so the other tiles, which aren't this animated one, don't shift
					}

					/// wrap all this in a function, and call with parameter(CURRENTAREA) to which it loads x or xx...

		   			//ex: 101   0,1 = 1|   0,2 = 10 |   1,3 = 01=1   |  1,2 = 0
					if(mapOverDraw[tileMapIndex].toString().substring(0,1)==1){

						///     this number:  /6 <<< will depend largely on the size of the map...
						///     so needs to be adjustable >> var (or keep a few giant maps(same size) with all rooms)
						
					

						   ////  + xAnim >>>  ANIMATION

						   /// this is just to prove that you can differentiate within tiles that have same first substring, but different second... so you can pass different images pointing to the SAME SPRITE starting X for all 1s... (ex: diff types of defaultTiles), here you can plus it or whatever to suit more specific differences
						if(!inArea.inIt){   



							if(mapOverDraw[tileMapIndex].toString().substring(0,2)>=10&&mapOverDraw[tileMapIndex].toString().substring(0,2)<16){

								ctxBg.drawImage(img, srcX, srcY+yAnim, 48, 48, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);

								//ctxBg.drawImage(anim, srcX+xAnim, srcY+yAnim, 48, 48, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);

								if(mapOverDraw[tileMapIndex+1]>=400&&mapOverDraw[tileMapIndex+1]<450||mapOverDraw[tileMapIndex-1]>=400&&mapOverDraw[tileMapIndex-1]<450){

									if(doorOpening.length>0){


										for (var q = 0; q< doorOpening.length; q++) {
										   
										   if(doorOpening[q].id==mapOverDraw[tileMapIndex+1]){

												doorY=0;

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
							}else if(mapOverDraw[tileMapIndex].toString().substring(0,2)>=16&&mapOverDraw[tileMapIndex].toString().substring(0,2)<19){

								if(mapOverDraw[tileMapIndex]==161){
									srcY=48;
								}else if(mapOverDraw[tileMapIndex]==162){
									srcY=96;
								}else if(mapOverDraw[tileMapIndex]==163){
									srcY=144;
								}else if(mapOverDraw[tileMapIndex]==164){
									srcY=192;
								}else if(mapOverDraw[tileMapIndex]==167){
									srcY=240;
								}

								ctxBg.drawImage(anim, srcX+xAnim, srcY+yyAnim, 48, 48, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);

							}

						}else{//// else if  inArea



							///HERE GOES INNER ANIMATIONS!!!!!!!!!!!!!
							// this right here below is an animation going when inside Area... no probs
							///ctxBg.drawImage(img, srcX+xAnim, srcY+yAnim, 48, 48, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);

							
							ctxBg.drawImage(img, srcX, srcY, 48, 48, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
						}






					}else if(mapOverDraw[tileMapIndex].toString().substring(0,1)==4||mapOverDraw[tileMapIndex].toString().substring(0,1)==3){

						//// Door tiles, but first, we draw what would go underneath. What tiles these would be were they not doors

						var doorCount=0;


						getDoor(mapOverDraw[tileMapIndex]);


						// ctxBg.drawImage(img, srcX+xAnim, srcY+yAnim, 48, 48, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);


					/// how do I separate this so it draws the right srcX for each part of the door............
					// ..............................................................................


								
						ctxBg.drawImage(img, srcX+xAnim, srcY+yAnim, 48, 48, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
						
						
					

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








					 ///////   ||||||  ||||||  ||////   /////                ///////  |||  || || //|  ||
					 //   ///  ||||||  ||||||  ||  //  ///                  ///    | |||| || || // | ||/
					 //  ///   ||||||  ||||||  ||///   //////              ///     ||  |||| || //  |||//
					 //////    ||||||  ||||||  ||  \\     ///             //       |          //   |  //
					 ////                              /////             //                           //

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

									///2,4,6,7(8)
									//   vs
									/// 3,6,9,11(12)

						/////  MAKE VAR =0 >> that adds +2 or 3 depending if door multiples of 2 or 3 (6,4 vs 9,12)
							///  and =var to put on this left-hand side

						//otherwise looks weird as it either skips on square or jumps before doing all 3
									
									if(doorOpening[q].animC>0&&doorOpening[q].animC<=2){

									
										doorOpening[q].animX=0;
									}else if(doorOpening[q].animC>2&&doorOpening[q].animC<=4){
										
										doorOpening[q].animX=40;
									}else if(doorOpening[q].animC>4&&doorOpening[q].animC<=6){
										
										doorOpening[q].animX=80;
											
									}else if(doorOpening[q].animC>6&&doorOpening[q].animC<=7){
										
										doorOpening[q].animX=120;
											
									}else if(doorOpening[q].animC>7){

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
									
										if(!inArea.inIt){
											ctxOverlay.drawImage(doors, doorX+doorOpening[q].animX, doorY, 40,40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
										}

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
													doorY+=40;
													calculateDoors("static");
													/// AND ALSO CHANGE  Y   
												}
											}else if(doorOpening[q].lap==1){
												if(calculateDoors("opening")=="top"){ 
													doorY+=40;
													calculateDoors("static");
													/// AND ALSO CHANGE  Y   
													/// so as to first repeat a slide, but not showing bg yet

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
										

									if(!inArea.inIt){
										ctxBg.drawImage(doors, doorX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
									}


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

								if(!inArea.inIt){
									ctxBg.drawImage(doors, doorX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
								}
								

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

						ctxBg.drawImage(img, srcX+xAnim, srcY+yAnim, 48, 48, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
		  
					}/// else... everything else


					if(doorClosing.length>0){
							 

						for (var q = 0; q< doorClosing.length; q++){

							if(doorClosing[q].id==mapOverDraw[tileMapIndex]){

									//console.log(doorClosing.length);
									//alert(doorClosing[q].animC);
							if(doorClosing[q].lap<=4){	
								if(doorClosing[q].animC>0&&doorClosing[q].animC<=4){
								
									doorXanimClose=120;

								}else if(doorClosing[q].animC>4&&doorClosing[q].animC<=8){
									doorXanimClose=80;
									//console.log("DOS" );
								}else if(doorClosing[q].animC>8&&doorClosing[q].animC<=12){
									doorXanimClose=40;
									//console.log("TRES" +doorClosing[q].lap);
								}else if(doorClosing[q].animC>12){
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

										if(!inArea.inIt){
											ctxBg.drawImage(doors, doorX+doorXAnim, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
											
										}
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
														doorY+=40;
													calculateDoors("static");
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
														doorY+=40;
													calculateDoors("static");
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
														doorY+=40;
													calculateDoors("static");
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
														doorY+=40;
													calculateDoors("static");
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
														doorY+=40;
													calculateDoors("static");
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
							ctxOverlay.drawImage(img, srcX, srcY, 48, 48, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
							}
								
						}  




						////  this ones always over player
						if(mapOverDraw[tileMapIndex]==108||mapOverDraw[tileMapIndex]==107||mapOverDraw[tileMapIndex]==227){   /// y menos de la mitad
					   
							/// 33 is the width of the portion to be drawn from the sprite (actual width in the sprite)
							ctxOverlay.drawImage(img, srcX, srcY+yAnim, 48, 48, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
								
						}    
						/// 301 when inside and notOpen


						if(mapOverDraw[tileMapIndex]>=210&&mapOverDraw[tileMapIndex]<=220){  
			   /// have to leave == 250, ,  fixed, or else there's no way to add && <3 in this multiple if/else

				//img, srcX, srcY  and get 250 right in sprite 

							if(!inArea.inIt){
							/// 40 is the width of the portion to be drawn from the sprite (actual width in the sprite)
							ctxOverlay.drawImage(img, srcX,srcY, 48, 48, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
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
							ctxOverlay.drawImage(img, defaultTiles[8].x, defaultTiles[8].y, 48, 48, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
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


						if(mapOverDraw[tileMapIndex].toString().substring(0,1)==1&&mapOverDraw[tileMapIndex+roomNumberTilesX].toString().substring(0,1)==2||mapOverDraw[tileMapIndex+roomNumberTilesX]==108||mapOverDraw[tileMapIndex].toString().substring(0,1)==3&&mapOverDraw[tileMapIndex+roomNumberTilesX].toString().substring(0,1)==2||mapOverDraw[tileMapIndex+roomNumberTilesX]==108){
							
							tilesToCheck=[100, 101, 110, 111, 112, 113, 114,  105, 160, 166,167, 710, 711, 714];

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




						if(mapOverDraw[tileMapIndex].toString().substring(0,1)==2){
							if(!inArea.inIt){
								tilesToCheck=[107, 167,222, 214, 218, 219, 227, 232, 710, 714, 709, 301, 400, 401, 402, 403];

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

								if(mapOverDraw[tileMapIndex-roomNumberTilesX]==tilesToCheck[i]&&mapOverDraw[tileMapIndex+1]==tilesToCheck[i]||mapOverDraw[tileMapIndex-roomNumberTilesX]==tilesToCheck[i]&&mapOverDraw[tileMapIndex+1]==166){  
									
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

	/// has to be at the End... because.. 




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

	for (var i=0; i< doorKeys.length; i++) {
		if(id==doorKeys[i].id){
			var haveKey =false;
			for (var h=0; h<player1.nonSelectItems.length; h++) {
				
				//return;
				if(player1.nonSelectItems[h].itemNumber==doorKeys[i].key){
					haveKey=true;
					//ctxOverOverlay.drawImage(itemsMenu, 0, 0, 64, 64, 210, 214, 64, 64);
				}


				
			}

			if(!haveKey){
				return;
			}
			
			
		}
	}


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

		//reset, since bullets left in other room won't be needed ever again
		bulletID=0;

		// buttons blocked so can't pause and go through door at the same time!!!!!!!!!!!!!
		blockInput=true;

		// game stopped
		isPlaying = false;

		
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


		dash=false;

		roomChangeLoop();

}




/// This is a bit messed up, it works but only if both rooms keep the same amount of Y tiles (or X I supposed, when X is implemented)...   but thats fine >>> the same room[tileMap] can be used for many different "mini" rooms


var roomLooping=false;

function roomChangeLoop() {
			  
	
	if(typeof player1 !="undefined"){

		// no Shoting while changing room >> Avoid that frozen bullet if you happen to shoot before you move
	//////																					after changing rooms
		player1.shooting=false;

		////    SOMEHOW
//// 		this here fixes the RoomChange, when player gets to the door with last of momentum/friction/slowDown 
/////																	( & therefore presumably speed 0)


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

			/// DIFFERENT CONDITIONS for each type of Transition
			if(pauseType=="normal"){//
				if(pauseCount<(Math.round(canvasOverOverlay.height/2))){
					roomLooping=true;
				}else{
					roomLooping=false;
				}

			}else if(pauseType=="teleport"){
				if(pauseCount<100){
					roomLooping=true;
				}else{
					roomLooping=false;
				}
			}


			 ///if still paused, then this inside
			if(roomLooping){   ///<(canvasHeight/2)

				// if opening screen(var).. do this real QUICK!

				//console.log(canvasOverOverlay.height/2);
				if(pauseType=="normal"){//
					ctxOverOverlay.fillStyle = "#000000";
					ctxOverOverlay.fillRect(0, 0, canvasWidth-50, 40+pauseCount);   

					// var pauseCountIncrease=Math.round(window.innerHeight)/(Math.round(window.innerHeight)/10);
					var pauseCountIncrease=Math.round(window.innerHeight)/(Math.round(window.innerHeight)/10);
					pauseCount+=4;

				}else if(pauseType=="teleport"){
					if(flash==0){
						flash=1;
					}else if(flash==1){
						flash=2;
					}else{
						flash=0;
					}
					tileDiameter+=1;

					shiftY-=10;
					shiftX-=14;

					for (var g=0; g<items.length; g++) {
						console.log(items[g].drawX);
						items[g].drawX-=14;
						items[g].drawY-=10;
						items[g].centerX-=14;
						items[g].centerY-=10;
					}
			

					//ctxOverOverlay.fillStyle = "#ff0000";
					// ctxOverOverlay.fillRect(0, 0, canvasWidth-50, 40+pauseCount);   

					// var pauseCountIncrease=Math.round(window.innerHeight)/(Math.round(window.innerHeight)/10);
					var pauseCountIncrease=Math.round(window.innerHeight)/(Math.round(window.innerHeight)/10);
					pauseCount+=4.3;
				}



				///roomChangeLoop();   // for gameCounter purposes

				requestAnimFrame(roomChangeLoop);

			}else{
				tileDiameter =48;
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


				if(doorIndexY>=canvasBg.clientHeight/2&&doorIndexY< mapHeight-(canvasBg.clientHeight/2)){

					shiftY=(doorIndexY- canvasBg.clientHeight/2)*-1;

				}else if(doorIndexY>= mapHeight-(canvasBg.clientHeight/2)){
					shiftY= (mapHeight- canvasBg.clientHeight)*-1;
				}else if(doorIndexY<=canvasBg.clientHeight/2){
					shiftY=0;
				}



				if(doorIndexX>=canvasBg.clientWidth/2&&doorIndexX< mapWidth-(canvasBg.clientWidth/2)){

					shiftX=(doorIndexX- canvasBg.clientWidth/2)*-1;

				}else if(doorIndexX>= mapWidth-(canvasBg.clientWidth/2)){
					shiftX= (mapWidth- canvasBg.clientWidth)*-1;

				}else if(doorIndexX<=canvasBg.clientWidth/2){
					shiftX=0;

				}

		/// console.log(mapWidth-(window.outerWidth/2));

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

						items[k].drawY -=Math.abs(shiftY)-Math.abs(memberShiftY);
						items[k].centerY -=Math.abs(shiftY)-Math.abs(memberShiftY); 

						items[k].drawX -=Math.abs(shiftX)-Math.abs(memberShiftX);
						items[k].centerX -=Math.abs(shiftX)-Math.abs(memberShiftX); 
				  
												 
				}// for ITEMS






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




var itemDecrementCount=0;

var releaseCounterCount=0;


function Player(type) {
	//where in sprite
	this.srcX = 640;
	this.srcY = 256;

	this.upperSrcX = 1664;
	this.upperSrcY=256;


	//where in tileMap
	this.drawX = 220;
	this.drawY = 200;

	//in sprite with & height	
	this.width = 112;  
	this.height = 112; 


	//starting moving values & speed
	this.speed = 0;
	this.moving = true; //can it move?

	this.direction = "nowhere";  // for moving mechanics purposes
	this.facing="nowhere";  /// diff from direction, for shooting Animation/sprite-purposes

	//animation
	this.isDead = false;

	this.animRatePlayer; 

	this.animRateShooting; 


	//special player characteristics  if/elses
	this.playerType = type;

	this.weapons = []; /////////////// every weapon keeps count of its own ammo, 
	this.weaponSelected = 0;
	this.itemSelected=0;

	this.items = [];
	this.guns = [];

	this.nonSelectItems = [];

	this.shooting=false;
	this.shootingDirection="down";

	this.usingItem=false;
//this.shootingDirection="down";


	this.outtaBullets=false;

	this.shootCounter = 0;
	this.oldShootCounter = 0;

	/// this should probably be another dimension in array bullets[], since it depends on weapon Selected
	this.weaponSpeedRate;/// > = slower,  0 =  contraLaser  


	this.life=20; //also inside playerType if/elses
	this.lifeTotal=100;
	////  this(all) starts with 0,  then each diff type gets + more or less.. like Diablo, 

	///////
	///
	//   DIFFERENT QUALITIES LIKE speed, power, strength, intelligence.. hp, mp,  etc.....

}/// FUNC Player



//Shit happens
Player.prototype.update = function () {

	if(currentSubArea=="water"){
		if(!slowDown){
			if(this.speed>0){
				this.speed=4;
			}
		}
	}

	doorBlock=false;
	

	clearCtx(ctxMenuOverOver);

	///on Update as it changes
	this.centerX = (this.drawX + (this.width / 2));
	this.centerY = (this.drawY + (this.height / 2));
	
/////////////////////////////////////////////////////////////////   H O W   M A N Y   I T E M S
	ctxMenuOverOver.font="20px Georgia";
	ctxMenuOverOver.fillStyle="blue";

	ctxMenuOverOver.fillText(bullets[player1.weaponSelected].current,170,40);

	for(var j=0; j<this.items.length; j++){
		if(this.items[j].itemNumber==this.itemSelected){
			//console.log("ITEM SELECTED "+ this.itemSelected);
			if(typeof this.items[j] !="undefined"&&player1.items.length>1){
				ctxMenuOverOver.fillText(this.items[j].amount ,70,40);
			}
		}
	}
////////////////////////////////////////////////////////////////////////////////////////////////////////

	this.checkMoving(this.direction, this.moving);//  a bit faster when called right after keyPress

	this.animationState(this.dead, this.direction, this.animRatePlayer, this.animRateShooting, this.moving);
	this.checkArea();


	///////////     RELATIVE TO PLAYER.SPEED!
	this.animRatePlayer = 0.6;  


	if(this.weaponSelected==0){
		this.animRateShooting = 0.6;
		this.weaponSpeedRate=7;
	}else if(this.weaponSelected==1){
		this.animRateShooting = 0.2;
		this.weaponSpeedRate=30;
	}



	if(this.direction!="nowhere"){
		this.shootingDirection=this.direction;
	}else{
		this.shootingDirection=this.facing;
	}

	
	if(dash){
		dashCount++;
	}else{
		dashCount=0;
	}

	//console.log("DASH C "+ dashCount);
	//console.log(dashCount);

	if(dash&&dashCount<14){
		player1.speed=16;	
		player1.animRatePlayer=0.8;		   	
	}else if(dashCount>14){
		friction();// or else it will never stop
		dash=false;
	}


	this.shootCounter++;
		

	if(this.shooting){     
						
		if(this.oldShootCounter<this.shootCounter-this.weaponSpeedRate){

			for(var i = 0; i<player1.guns.length; i++){
				if(this.weaponSelected==i){
					bullets[i].current-=1;
						
					this.oldShootCounter=this.shootCounter;
					if(bullets[i].current<=0){
						bullets[i].current=0;
						this.outtaBullets=true;
					}else{
						this.outtaBullets=false;
					}
				}
			}

			var weaponX=0;
			var weaponY=0;
			var bulletType;
				
			if(!this.outtaBullets){

				if(typeof this.shootingDirection == "undefined"){
					this.shootingDirection="down";
				}
				//console.log("first shot  " +this.shootingDirection);

				/// this IF help with the "frozen-bullet" problem.. although not seen lately
				if(player1.facing != "nowhere"){

					////this.centerX HAS TO VARY (+ || -) DEPENDING ON WHERE PLAYER1 IS FACING
					///									& even depending on weapon

				
					if(player1.facing=="down"){
						weaponY=4;
					}else if(player1.facing=="up"){
						weaponY=-4;
					}else if(player1.facing=="right"){
						weaponX=4;
					}else if(player1.facing=="left"){
						weaponX=-4;
					}else if(player1.facing=="right-up"){
						weaponX=4;
						weaponY=-4;
					}else if(player1.facing=="right-down"){
						weaponX=4;
						weaponY=4;
					}else if(player1.facing=="left-up"){
						weaponX=-4;
						weaponY=-4;
					}else if(player1.facing=="left-down"){
						weaponX=-4;
						weaponY=4;
					}
					
					if(player1.weaponSelected==0){ 
						bulletType="normal";
					}else{
						bulletType="weird";
					}

					/// maybe NOT all weapons >> BOMBS >>> place ExplosionPoint first >> then micro bullets func..
					if(!doorBlock){
						bulletsFired.push( new activeBullet(bulletID, undefined, undefined,this.drawX+weaponX+30,this.drawY+weaponY+30, [],[], 48, 48, this.weaponSelected, this.playerType, this.shootingDirection, true, undefined, bulletType, 0));
											
						bulletID++;
					}
				}
			}// if(!this.outtaBullets)
				
		}// if weapon speed rate allows

	}/// if shooting

	
	if(this.usingItem){
		itemDecrementCount++;
		// console.log(itemDecrementCount);
		// console.log("USINGgggg "+this.itemSelected);	
		for(var i=0; i < this.items.length; i++){
			//console.log(this.items[i].itemNumber);
			if(this.items[i].itemNumber==this.itemSelected){
				if(itemDecrementCount==1){

					if(this.items[i].amount>1){

						if(this.itemSelected==4){
							this.life+=10;
						}


						this.items[i].amount--;
						
						
					}else if(this.items[i].amount==1){

						//console.log("USING "+this.itemSelected);
						if(this.itemSelected==4){
							this.life+=10;
						}

						this.items.splice(i,1);
						// send back VAR so this.usingItem is flase >>> force to press again 
						if(itemRow==this.items.length-1&&this.items.length>1){
							itemRow-=1;
						}
						
						selecto();
						this.usingItem=false;

					}else{


						this.items.splice(i,1);
						// send back VAR so this.usingItem is flase >>> force to press again 
						if(itemRow==this.items.length-1&&this.items.length>1){
							itemRow-=1;
						}
						
						selecto();
						this.usingItem=false;


						/// Or else, could leave them on (faded) w ammount=0. (like in zelda>> bombs)
						/// in that case comment out this else and >> this.items[i].amount>1  --->    >0
					}
					
				}else if(itemDecrementCount>1&&itemDecrementCount<30){

					itemDecrementCount

				}else if(itemDecrementCount>=30){
					if(this.items[i].amount>1){

						if(this.itemSelected==4){
							this.life+=10;
						}


						this.items[i].amount--;
						
						
					}else if(this.items[i].amount==1){


						if(this.itemSelected==4){
							this.life+=10;
						}

						

						this.items.splice(i,1);
						// send back VAR so this.usingItem is flase >>> force to press again 
						if(itemRow==this.items.length-1&&this.items.length>1){
							itemRow-=1;
						}
						
						selecto();
						this.usingItem=false;

					}else{
						this.items.splice(i,1);
						// send back VAR so this.usingItem is flase >>> force to press again 
						if(itemRow==this.items.length-1&&this.items.length>1){
							itemRow-=1;
						}
						
						selecto();
						this.usingItem=false;


						/// Or else, could leave them on (faded) w ammount=0. (like in zelda>> bombs)
						/// in that case comment out this else and >> this.items[i].amount>1  --->    >0
					}

					
					itemDecrementCount=2;

				}



			}
		}
	}



	//for friction purposes
	if(releaseCounter){ 
		releaseCounterCount++;
	}
	
	////EXPERIMENT TO SEE THAT YOU CAN CHANGE ROOM ON COMMAND (and not only upon hitting a door-area)
	if(tele==true){
		blockInput=true;  
		this.direction="nowhere";
		this.speed=1;// por alguna razon resuelve el bug de caer en otra "area"						
		changeRoom("room-1", 668, shiftX, shiftY, "teleport"); // "teleporting" type of roomChange
		tele=false;
	}



};// END Player UPDATE








/////////         \\
//|\\/////        \\\\
//|\\//////       ////\     ///////   ////   
//|\\//////       ///  \   ///  //   /////   //// \\\\  
//|\//////        //|  /  ///////   //////   \\\   \\\
////////          /////  ///   /   /// ///   \\\\ ////
////              ////  ///    /  ///  ///   
///               //
///           


var lavaDamageCount=0;
var damageCount=0;/// different as it blockes damage for longer

//Shit is shown
Player.prototype.draw = function () {

///// srcX, Y >> lower body
	
//console.log("GUN SEL"+this.gunSelected); ///  ACCORDING TO THIS WE GO DOWN Y AXIS  inSpritethis.srcY+50, 50, 50, 50
		//////////////////////  then in the future OTHER SPRITES for the suits/armor you find
	
	/// WEAPON SELECTS!!!


	if(currentSubArea == "red-lava"||currentSubArea == "orange-lava"){
		if(lavaDamageCount==0){
			player1.life--;
			lavaDamageCount++;
		}

		if(lavaDamageCount>0&&lavaDamageCount<4){// other DAMAGE can take longer (for flicker-invulnerability to go away)
			lavaDamageCount++;
		}else{
			lavaDamageCount=0;	
		}
	}

	if(lavaDamageCount>0&&lavaDamageCount<20){// flicker takes longer to go away when coming out of lava
		lavaDamageCount++;
	}else{
		lavaDamageCount=0;	
	}
	

	if((lavaDamageCount*100)%40==0||lavaDamageCount==0){/// add || NORMALdamagCount
		/// LEGS
		if(currentSubArea != "water"&&currentSubArea != "deep-water"&&currentSubArea != "red-lava"&&currentSubArea != "orange-lava"){
			ctxPlayer.drawImage(imgPlayer, this.srcX, this.srcY, 128, 128, this.drawX, this.drawY, this.width, this.height);
		}
		//console.log(" L D C " +lavaDamageCount);
	
		/// BODY
		if(currentSubArea != "deep-water"){

			if(this.shooting){      ///// changing upperSrc Anim according to shooting
				ctxPlayer.drawImage(imgPlayer, this.upperSrcX, this.upperSrcY, 128, 128, this.drawX, this.drawY, this.width, this.height);
			}else{                     //// shifted sprite (srcX, Y) for upperBody parts
				ctxPlayer.drawImage(imgPlayer, this.upperSrcX, this.srcY, 128, 128, this.drawX, this.drawY, this.width, this.height);                 //// take off +3, that just to show its been drawn on top
										////            +3 actually + length of sprite (legs/upperbody)
			}

		}/// if  != "deep-water"  << draw Body

	}/// IF DAMAGE COUNTS

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




Player.prototype.animationState = function (dead, direction, animRatePlayer, animRateShooting, moving) {

	// //DIFFERENT ANIMATIONS WITH DIFF WEAPON
	// 	//// keep track of what weapon is selected and move whole srcY of the sprite one down (where player is holding corresponging gun

	//console.log("SDSD" +this.direction)
	if(this.direction!="nowhere"&&this.direction!="room-change"){
		animCount += animRatePlayer; //// OTHER ANIM RATE@!!!!!! (not bound to weapon)

		if(animCount>0&&animCount<1){
			this.srcY=256;
		}else if(animCount>=1&&animCount<2){
			this.srcY=384;
		}else if(animCount>=2&&animCount<3){
			this.srcY=512;
		}else if(animCount>=3&&animCount<4){
			this.srcY=384;
		}else if(animCount>=4&&animCount<5){
			this.srcY=256;
		}else if(animCount>=5&&animCount<6){
			this.srcY=128;
		}else if(animCount>=6&&animCount<7){
			this.srcY=0;
		}else{
			animCount=0;
		}
	}

	/// just  W A L KI N G
	if(this.direction=="up"&&!this.shooting){
		this.upperSrcX = 128;
		this.srcX = 1152;
	}else if(this.direction=="down"&&!this.shooting){
		this.upperSrcX = 640;
		this.srcX = 1664;						
	}else if(this.direction=="right"&&!this.shooting){
		this.upperSrcX = 384;
		this.srcX = 1408;							
	}else if(this.direction=="left"&&!this.shooting){
		this.upperSrcX = 894;
		this.srcX = 1920;							
	}else if(this.direction=="right-up"&&!this.shooting){
		this.upperSrcX = 256;
		this.srcX = 1280;	
	}else if(this.direction=="right-down"&&!this.shooting){
		this.upperSrcX = 512;
		this.srcX = 1536;								
	}else if(this.direction=="left-up"&&!this.shooting){
		this.upperSrcX = 1024;
		this.srcX = 2048;								
	}else if(this.direction=="left-down"&&!this.shooting){
		this.upperSrcX = 768;
		this.srcX = 1792;								
	}else if(this.direction=="nowhere"){

		this.srcY=256;

		if(this.facing=="down"){
			this.upperSrcX = 640;
			this.srcX = 1664;	
		}else if(this.facing=="up"){
			this.upperSrcX = 128;	
			this.srcX = 1152;	
		}else if(this.facing=="right"){
			this.upperSrcX = 384;
			this.srcX = 1408;							
		}else if(this.facing=="left"){
			this.upperSrcX = 894;
			this.srcX = 1920;							
		}else if(this.facing=="right-up"){
			this.upperSrcX = 256;
			this.srcX = 1280;
		}else if(this.facing=="right-down"){
			this.upperSrcX = 512;
			this.srcX = 1536;
		}else if(this.facing=="left-up"){
			this.upperSrcX = 1024;	
			this.srcX = 2048;					
		}else if(this.facing=="left-down"){
			this.upperSrcX = 768;
			this.srcX = 1792;							
		}	

	}// else if not moving


	/// S H O T I N G  (upper body)
	if(this.shooting && this.direction!="room-change"){

		animShootingCount += animRateShooting;
		   
		   if(animShootingCount>0&&animShootingCount<2){
				  this.upperSrcY = 256;
			}else if(animShootingCount>=2&&animShootingCount<4){
				this.upperSrcY = 384;
			}else if(animShootingCount>=4&&animShootingCount<5){
				this.upperSrcY = 512;
				
			}else{
				animShootingCount =0;
			}


		
		if(this.direction=="nowhere"){


			if(this.facing=="down"){
				this.srcX = 3712;
				this.upperSrcX = 2688;
			}else if(this.facing=="up"){
				this.srcX = 3200;
				this.upperSrcX = 2176;
			}else if(this.facing=="right"){
				this.srcX = 3456;
				this.upperSrcX = 2432;
			}else if(this.facing=="left"){
				this.srcX = 3968;
				this.upperSrcX = 2944;
			}else if(this.facing=="right-up"){
				this.srcX = 3328;
				this.upperSrcX = 2304;
			}else if(this.facing=="right-down"){
				this.srcX = 3584;
				this.upperSrcX = 2560;
			}else if(this.facing=="left-up"){
				this.srcX = 4096;	
				this.upperSrcX = 3072;					
			}else if(this.facing=="left-down"){
				this.srcX = 3712;	
				this.upperSrcX = 2816;						
			}

		}else{
			if(this.direction=="down"){
				this.srcX = 1664;	
				this.upperSrcX = 2688;
			}else if(this.direction=="up"){	
				this.srcX = 1152;	
				this.upperSrcX = 2176;
			}else if(this.direction=="right"){
				this.srcX = 1408;	
				this.upperSrcX = 2432;						
			}else if(this.direction=="left"){
				this.srcX = 1920;	
				this.upperSrcX = 2944;						
			}else if(this.direction=="right-up"){
				this.srcX = 1280;
				this.upperSrcX = 2304;
			}else if(this.direction=="right-down"){
				this.srcX = 1536;
				this.upperSrcX = 2560;
			}else if(this.direction=="left-up"){
				this.srcX = 2048;	
				this.upperSrcX = 3072;						
			}else if(this.direction=="left-down"){
				this.srcX = 1792;	
				this.upperSrcX = 2816;									
			}
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
				   if(player1.speed>0){
				   	 this.speed-=2;
				   }    
				  
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

				for(var l =0; l<bulletsFired.length; l++){
					bulletsFired[l].drawY += this.speed;
					bulletsFired[l].centerY += this.speed;    

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

				for(var l =0; l<bulletsFired.length; l++){
					bulletsFired[l].drawY -= this.speed;
					bulletsFired[l].centerY -= this.speed;    

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

				for(var l =0; l<bulletsFired.length; l++){
					bulletsFired[l].drawX -= this.speed;
					bulletsFired[l].centerX -= this.speed;    

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

				for(var l =0; l<bulletsFired.length; l++){
					bulletsFired[l].drawX += this.speed;
					bulletsFired[l].centerX += this.speed;    

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

					for(var l =0; l<bulletsFired.length; l++){
					bulletsFired[l].drawY -= this.speed;
					bulletsFired[l].centerY -= this.speed;    

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

					for(var l =0; l<bulletsFired.length; l++){
					bulletsFired[l].drawX -= this.speed;
					bulletsFired[l].centerX -= this.speed;    

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

					for(var l =0; l<bulletsFired.length; l++){
					bulletsFired[l].drawX -= this.speed;
					bulletsFired[l].centerX -= this.speed;    

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

					for(var l =0; l<bulletsFired.length; l++){
					bulletsFired[l].drawY -= this.speed;
					bulletsFired[l].centerY -= this.speed;    

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

					for(var l =0; l<bulletsFired.length; l++){
					bulletsFired[l].drawY -= this.speed;
					bulletsFired[l].centerY -= this.speed;    

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

					for(var l =0; l<bulletsFired.length; l++){
					bulletsFired[l].drawX += this.speed;
					bulletsFired[l].centerX += this.speed;    

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

					for(var l =0; l<bulletsFired.length; l++){
					bulletsFired[l].drawX += this.speed;
					bulletsFired[l].centerX += this.speed;    

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

					for(var l =0; l<bulletsFired.length; l++){
					bulletsFired[l].drawY -= this.speed;
					bulletsFired[l].centerY -= this.speed;    

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

					for(var l =0; l<bulletsFired.length; l++){
					bulletsFired[l].drawY += this.speed;
					bulletsFired[l].centerY += this.speed;    

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
					for(var l =0; l<bulletsFired.length; l++){
					bulletsFired[l].drawX += this.speed;
					bulletsFired[l].centerX += this.speed;    

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
					for(var l =0; l<bulletsFired.length; l++){
					bulletsFired[l].drawX += this.speed;
					bulletsFired[l].centerX += this.speed;    

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

					for(var l =0; l<bulletsFired.length; l++){
					bulletsFired[l].drawY += this.speed;
					bulletsFired[l].centerY += this.speed;    

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

					for(var l =0; l<bulletsFired.length; l++){
					bulletsFired[l].drawY += this.speed;
					bulletsFired[l].centerY += this.speed;    

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

					for(var l =0; l<bulletsFired.length; l++){
					bulletsFired[l].drawX -= this.speed;
					bulletsFired[l].centerX -= this.speed;    

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

					for(var l =0; l<bulletsFired.length; l++){
					bulletsFired[l].drawX -= this.speed;
					bulletsFired[l].centerX -= this.speed;    

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

					for(var l =0; l<bulletsFired.length; l++){
					bulletsFired[l].drawY += this.speed;
					bulletsFired[l].centerY += this.speed;    

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

			if(obstacles[obstacleIndex].doorID!=166){		
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



};











//////////////////////////////////////||
 /////		    ////                //||    //     ///////\
 /////		   ///  //             // ||   //|   ////
 /////		  ///  //             //  ||  //||    ////
 /////		 //// ////////		 //   || // ||     ////////\
 /////		//// ///		    //    ||//  ||          \/// 
 /////     ///// ///           //           ||          //// 
 /////    ///// ////\         //            ||       //////
//////// ////// ///////////////             ||///////////






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

	tileIndexX=0;
	tileIndexY=0;

	this.pickUp();
	
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
					ctxEntities.drawImage(itemsMenu, this.srcX, this.srcY, 48, 48, this.drawX, this.drawY, tileDiameter, tileDiameter);
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
									ctxEntities.drawImage(itemsMenu, this.srcX, this.srcY, 48, 48, this.drawX, this.drawY, this.width, this.height);
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
var itemToIncrement;

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
							console.log("number "+ player1.items[j].itemNumber + "  amount "+ player1.items[j].amount);
						}else if(player1.items.length>1){
						  
							if(this.itemNumber!=player1.items[j].itemNumber&&j!=0){
							   itemAdd=true;
								console.log("number "+ player1.items[j].itemNumber + "  amount "+ player1.items[j].amount);

							}else if(this.itemNumber==player1.items[j].itemNumber&&j!=0) {
							
								console.log("ITEM #!! "+this.itemNumber);

							  	noItemAdd=true;   
								itemToIncrement=player1.items[j].itemNumber;  
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
	 	
	 	
					bullets[this.itemNumber].current+=300;

					if(bullets[this.itemNumber].current>bullets[this.itemNumber].max){
						bullets[this.itemNumber].current=bullets[this.itemNumber].max;
					}

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

					if(this.select==true){
						// itemRow=0;
						if(player1.items.length<=1){
							player1.items[0]={srcX:this.srcX, srcY:this.srcY, width:this.width, height:this.height, selec:this.selec, rowSelec:null, trackSelec:null, itemType:this.itemType, itemNumber:this.itemNumber, amount:1};   
			
						}

			//// ADD PARAM >>>>    SELECTABLE/NON-SELECTABLE


						player1.items.push({srcX:this.srcX, srcY:this.srcY, width:this.width, height:this.height, selec:this.selec, rowSelec:null, trackSelec:null, itemType:this.itemType, itemNumber:this.itemNumber, amount:1});   

						selecto();

  					}else{
  						player1.nonSelectItems.push({srcX:this.srcX, srcY:this.srcY, width:this.width, height:this.height, selec:this.selec, rowSelec:null, trackSelec:null, itemType:this.itemType, itemNumber:this.itemNumber, amount:1}); 
  					}

				}else if(noItemAdd&&itemToIncrement!="undefined"){

					    ////////////  maybe set a limit to this amount (like secret of Mana's magic 4....)
					

				
					for(var j=0; j<player1.items.length; j++){
						if(player1.items[j].itemNumber==this.itemNumber){
							player1.items[j].amount++;
						}

					}
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
					
			
	
							if(bullets[this.itemNumber].current>bullets[this.itemNumber].max){
								bullets[this.itemNumber].current=bullets[this.itemNumber].max;
							}
								// console.log("BULL "+player1.guns[i+1].bullets);
								// depending on weapon, first pick could come with a few bullets...
							
						

					if((gunRow+1)<player1.guns.length){
						gunRow+=1;
					}
					//console.log(gunRow);
      
				}

				noGunAdd=false;
				gunAdd=false;
       


		    }//// IF this caught
	    }/// if this in room

		//console.log("DE ESTE "+player1.items[1].itemType+"HAY " +player1.items[1].amount); 

	}/// IF  newCenterX == itemCoordinates
   
};











               // ///////////////////                     // ///////////////////
              //  //              //////                 //  /               //////
              // /////////////////  //////               // /////////////////  //////
              // ///////////////// /  /////              // ///////////////// /  ///// 
              // //////||//   \/////  //////             // //////||//   \/////  //////
              // ////         /////////////              // ////         /////////////
              // ////        /////////////               // ////        /////////////
              // //////////////////////                  // //////////////////////   
               /////////////////////                      /////////////////////





							         

function activeBullet(id, x,y, xx, yy, allX, allY, w,h, weapon, player, direction, active, speed, type, distance) {   

								//// player => whoever shot the bullet, in case this ever supports multiplayer
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

	this.weapon = weapon; 
	this.owner = player;  
	this.direction = direction;  
	this.active=active;

	///dependent on type
	this.speed=speed;

	this.type=type;

	this.distanceCounter=distance;

	this.allX=allX;
	this.allY=allY;
}


activeBullet.prototype.update = function () {




	for (var i=0; i< bulletsFired.length; i++) {

		if(bulletsFired[i].weapon==0){

			// if(bulletsFired[i].length>=5){
			// 	bulletsFired.splice(0,1);
			// }

			bulletsFired[i].allX.push(bulletsFired[i].drawX);
			bulletsFired[i].allY.push(bulletsFired[i].drawY);

		}

		if(bulletsFired[i].weapon==0){
			bulletsFired[i].speed = 44;
			bulletsFired[i].srcY=0;
		}else{
			bulletsFired[i].srcY=48;
			bulletsFired[i].speed = 20;
		}
	}

	this.centerX = (this.drawX + (this.width / 2));
	this.centerY = (this.drawY + (this.height / 2));

	
	/// PARAM on bullet << TYPE <<< DIFF BEHAVIOUR below, for different type
	/// if this type...
	///			 other types will keep drawX|Y the same, but increase height|width parallel to Player (contraLaser)
	//																		      or perpendicular (ondas)
	//											and down on ctxBullet will have their own .fillRect instead
	//
	//				maybe  drawX|Y == player drawX|Y and adjusts itelf while holding B button (ultimateLaser)
	///
	//              other types will replicate itself in several (slightly tilted) directions (contraSpread)
	///
	///     other types release a series of mini bullets (short distance, full circle) around its crash point
	//												(based on distance of original bullet, or actual crash point)
	//											of course these mini bullets have their "minu-bullet" type
	//	
	//  some type of bullet have distance limits!!! 
	//							  >> flame thrower:  if this.type == (flameT type)
	//													this.distCounter++
	//												if distCounter >= X 
	//											bullet height|width doesn't exceed this point
	//													or if (shotgun type)
	//									   bullet inactive(like crash) >> Func(mini-loop) release minu-bullets 	

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
	}/// if this.checkcrash().crashB
	
};



var animBullet=0;
var animBulletX=0;

activeBullet.prototype.draw = function () {

	/// for loop all bullets...
	//console.log(this.weapon);  //// according to this where to point the Sprite

	animBullet++;


	for (var i=0; i< bulletsFired.length; i++) {
		

		if(animBullet>0&&animBullet<=2){

			
			if(bulletsFired[i].id==bulletsFired[i].id){
				if(bulletsFired[i].weapon==0){
					if(bulletsFired[i].direction=="down"||bulletsFired[i].direction=="up"){
						bulletsFired[i].srcX=0;
					}else if(bulletsFired[i].direction=="left"||bulletsFired[i].direction=="right"){
						bulletsFired[i].srcX=144;
					}else if(bulletsFired[i].direction=="right-down"||bulletsFired[i].direction=="left-up"){
						bulletsFired[i].srcX=288;
					}else if(bulletsFired[i].direction=="left-down"||bulletsFired[i].direction=="right-up"){
						bulletsFired[i].srcX=432;
					}
				}else{
					
						bulletsFired[i].srcX=0;
					
				}
			}

		}else if(animBullet>2&&animBullet<=4){
			if(bulletsFired[i].id==bulletsFired[i].id){
				if(bulletsFired[i].weapon==0){
					if(bulletsFired[i].direction=="down"||bulletsFired[i].direction=="up"){
						bulletsFired[i].srcX=48;
					}else if(bulletsFired[i].direction=="left"||bulletsFired[i].direction=="right"){
						bulletsFired[i].srcX=192;
					}else if(bulletsFired[i].direction=="right-down"||bulletsFired[i].direction=="left-up"){
						bulletsFired[i].srcX=336;
					}else if(bulletsFired[i].direction=="left-down"||bulletsFired[i].direction=="right-up"){
						bulletsFired[i].srcX=480;
					}
				}else{
					
						bulletsFired[i].srcX=48;
					
				}
			}	
		}else if(animBullet>4&&animBullet<=6){
			if(bulletsFired[i].id==bulletsFired[i].id){
				if(bulletsFired[i].weapon==0){
					if(bulletsFired[i].direction=="down"||bulletsFired[i].direction=="up"){
						bulletsFired[i].srcX=96;
					}else if(bulletsFired[i].direction=="left"||bulletsFired[i].direction=="right"){
						bulletsFired[i].srcX=240;
					}
				}else{
					
						bulletsFired[i].srcX=96;
					
				}
			}
		}else if(animBullet>6){
			animBullet=0;
		}
		//console.log("LASTX" +bulletsFired[i].allX[bulletsFired[i].allX.length-1]);
		// for(var j=0; j<bulletsFired[i].allX.length; j++){
		// 	ctxBullets.drawImage(imgBullets, this.srcX, this.srcY, this.width, this.height, bulletsFired[i].allX[j], bulletsFired[i].drawY, bulletsFired[i].width, bulletsFired[i].height);
		// }

		
		//ctxBullets.globalAlpha = 0.1;
		// ctxBullets.drawImage(imgBullets, bulletsFired[i].srcX, bulletsFired[i].srcY, bulletsFired[i].width, bulletsFired[i].height, bulletsFired[i].allX[bulletsFired[i].allX.length-4], bulletsFired[i].allY[bulletsFired[i].allY.length-4], bulletsFired[i].width, bulletsFired[i].height);

		// //ctxBullets.globalAlpha = 0.2;		
		// ctxBullets.drawImage(imgBullets, bulletsFired[i].srcX, bulletsFired[i].srcY, bulletsFired[i].width, bulletsFired[i].height, bulletsFired[i].allX[bulletsFired[i].allX.length-3], bulletsFired[i].allY[bulletsFired[i].allY.length-3], bulletsFired[i].width, bulletsFired[i].height);
			
		// //ctxBullets.globalAlpha = 0.3;
		// ctxBullets.drawImage(imgBullets, bulletsFired[i].srcX, bulletsFired[i].srcY, bulletsFired[i].width, bulletsFired[i].height, bulletsFired[i].allX[bulletsFired[i].allX.length-2],bulletsFired[i].allY[bulletsFired[i].allY.length-2], bulletsFired[i].width, bulletsFired[i].height);
			
		// //ctxBullets.globalAlpha = 0.6;
		// ctxBullets.drawImage(imgBullets, bulletsFired[i].srcX, bulletsFired[i].srcY, bulletsFired[i].width, bulletsFired[i].height, bulletsFired[i].allX[bulletsFired[i].allX.length-1], bulletsFired[i].allY[bulletsFired[i].allY.length-1], bulletsFired[i].width, bulletsFired[i].height);
			

		//ctxBullets.globalAlpha = 1;
		ctxBullets.drawImage(imgBullets, bulletsFired[i].srcX, bulletsFired[i].srcY, bulletsFired[i].width, bulletsFired[i].height, bulletsFired[i].drawX, bulletsFired[i].drawY, bulletsFired[i].width, bulletsFired[i].height);

		///SO if it seems to get thicker, is because bullet never leaves and it keeps being drawn on top (0.1 + 0.1 +0.1 until it looks perfectly solid....)
		// actually it is (0.6, first, then 0.6+0.3, then 0.6+0.3+0.2 , etc.... )

		/// or I could do the effect using yet more sprites..



	}// FOR bulletsFired.length
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

				//// repeat this if/else on enemies centerX|Y -+

				///in other words: as long as bullet in the block before the one you would be at if going right
				if(this.centerY>=obstacles[i].topY&&this.centerY<obstacles[i].bottomY&&this.centerX<=obstacles[i].leftX&&this.centerX>obstacles[i].leftX-tileDiameter) { ///// 10 => bullet diameter

					//but don't stop me just yet, only if not doing so would put me on the other side 
					if(this.centerX+this.speed>=obstacles[i].leftX-(this.speed+1)){

						crashB = true; 
						id=this.id;
						//console.log(this.id);
						//if it's a door, you may open it   
						//doorcrashB(i);  //////    REPLACE THIS FOR BREAKABLE OBSTACLE >>>  obstacleBreak(i)
					}
				}
			}  /// dir


			if(this.direction=="left"){

				if(this.centerY<=obstacles[i].bottomY&&this.centerY>obstacles[i].topY&&this.centerX>=obstacles[i].rightX&&this.centerX<obstacles[i].rightX+tileDiameter){
					
					if(this.centerX-this.speed<=obstacles[i].rightX+(this.speed+1)){

						    crashB = true;
							id=this.id;
					}
				}
			} 


			if(this.direction=="up"){

				if(this.centerX>=obstacles[i].leftX&&this.centerX<obstacles[i].rightX&&this.centerY>=obstacles[i].bottomY&&this.centerY<obstacles[i].bottomY+tileDiameter) {

					if(this.centerY-this.speed<=obstacles[i].bottomY+(this.speed+1)){
							crashB = true; 
							id=this.id;
					}         
				}
			}   
			if(this.direction=="down"){

				if(this.centerX>obstacles[i].leftX&&this.centerX<=obstacles[i].rightX&&this.centerY<=obstacles[i].topY&&this.centerY>obstacles[i].topY-tileDiameter) {

					if(this.centerY+this.speed>=obstacles[i].topY-(this.speed+1)){
							crashB = true;  
							id=this.id;
					}
				}
			}   


		////////////////////////////////////////
		//////////////////////////////	         d   I   A   G   O   N   A   L    S
		//////////////////////////////////


			if(this.direction=="right-down"){ 


				if(this.centerY>=obstacles[i].topY&&this.centerY<obstacles[i].bottomY&&this.centerX<=obstacles[i].leftX&&this.centerX>obstacles[i].leftX-tileDiameter) {

					//but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
					if(this.centerX+this.speed>=obstacles[i].leftX-(this.speed+1)){
						// crashB = true;  
						// doorcrashB(i);
						
							crashB = true;
							id=this.id;
						
					}
				}


				if(this.centerX>obstacles[i].leftX&&this.centerX<=obstacles[i].rightX&&this.centerY<=obstacles[i].topY&&this.centerY>obstacles[i].topY-tileDiameter) {

					if(this.centerY+this.speed>=obstacles[i].topY-(this.speed+1)){
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

				if(this.centerY<=obstacles[i].topY&&this.centerX<=obstacles[i].leftX) {

					//but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
					//console.log("WHAT"+player1.direction);
					if(this.centerX+this.speed>=obstacles[i].leftX-(this.speed+1)&&this.centerY+this.speed>=obstacles[i].topY-(this.speed+1)){
						
							crashB = true;
							id=this.id;
						

					}
				}

			} /////  if(this.direction=="right-down"){  



		/////
		///////
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			if(this.direction=="left-down"){ 

				 if(this.centerY<=obstacles[i].bottomY&&this.centerY>obstacles[i].topY&&this.centerX>=obstacles[i].rightX&&this.centerX<obstacles[i].rightX+tileDiameter) {
					
					if(this.centerX-this.speed<=obstacles[i].rightX+(this.speed+1)){
					
							crashB = true;
							id=this.id;
						
					}
				}

				if(this.centerX>obstacles[i].leftX&&this.centerX<=obstacles[i].rightX&&this.centerY<=obstacles[i].topY&&this.centerY>obstacles[i].topY-tileDiameter) {

					if(this.centerY+this.speed>=obstacles[i].topY-(this.speed+1)){
					
							crashB = true;
							id=this.id;
						
					}
				}



				if(this.centerY<=obstacles[i].topY&&this.centerX>=obstacles[i].rightX) {

					//but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
					//console.log(crashBDir);
					if(this.centerX-this.speed<=obstacles[i].rightX+(this.speed+1)&&this.centerY+this.speed>=obstacles[i].topY-(this.speed+1)){
						
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

				if(this.centerY<=obstacles[i].bottomY&&this.centerY>obstacles[i].topY&&this.centerX>=obstacles[i].rightX&&this.centerX<obstacles[i].rightX+8) {
					
					if(this.centerX-this.speed<=obstacles[i].rightX+(this.speed+1)){
						
							crashB = true;
							id=this.id;
						
					}
				}

				if(this.centerX>=obstacles[i].leftX&&this.centerX<obstacles[i].rightX&&this.centerY>=obstacles[i].bottomY&&this.centerY<obstacles[i].bottomY+8) {

					if(this.centerY-this.speed<=obstacles[i].bottomY+(this.speed+1)){
						
							crashB = true;
							id=this.id;
						
					}         
				}


				if(this.centerY>=obstacles[i].bottomY&&this.centerX>=obstacles[i].rightX) {

					//but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
					//console.log(crashBDir);
					if(this.centerX-this.speed<=obstacles[i].rightX+(this.speed+1)&&this.centerY-this.speed<=obstacles[i].bottomY+(this.speed+1)){
					
							crashB = true;
							id=this.id;
							//crashBDir="right-down";
						

						// crashBDir="right";
					}
				}


			}


	if(this.direction=="right-up"){ 

				if(this.centerX>=obstacles[i].leftX&&this.centerX<obstacles[i].rightX&&this.centerY>=obstacles[i].bottomY&&this.centerY<obstacles[i].bottomY+tileDiameter) {

					if(this.centerY-this.speed<=obstacles[i].bottomY+(this.speed+1)){
				
							crashB = true;
							id=this.id;
						
					}         
				}

					///in other words: as long as you are standing in the block before what would be the next one when going right
				if(this.centerY>=obstacles[i].topY&&this.centerY<obstacles[i].bottomY&&this.centerX<=obstacles[i].leftX&&this.centerX>obstacles[i].leftX-tileDiameter) {

						//but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
						if(this.centerX+this.speed>=obstacles[i].leftX-(this.speed+1)){
						
								crashB = true;
								id=this.id;
							
						
						}
					}
				

				if(this.centerY>=obstacles[i].bottomY&&this.centerX<=obstacles[i].leftX) {

					//but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
					//console.log(crashBDir);
					if(this.centerX+this.speed>=obstacles[i].leftX-(this.speed+1)&&this.centerY-this.speed<=obstacles[i].bottomY+(this.speed+1)){
				
							crashB = true;
							id=this.id;

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
}// END Bullet-Check-Crash
