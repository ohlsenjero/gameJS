
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

///// esto aca arriba HA de ser reducido
var daMenu = new menu(itemSprite, 700, 600, canvasBg.width, canvasBg.heigth, 0, 0);/// doesnt need any of this params
var dashCount=0;
var dash=false;

var menuBorder = new Image();
	menuBorder.src = "images/menuhighlight.png";

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
	tileDiameter = 64;  // window.innerWidth/40; || 30;     >>>> cambiar segun tamanho de pantalla
}else{
	tileDiameter = 64; 
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

var pauseType;
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

	if(map=="room1map"){
		return  [222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,
				 666,101,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,210,100,100,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,210,210,210,222,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,210,222,222,222,100,100,100,100,100,100,210,210,100,100,222,100,222,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,222,222,100,100,100,210,210,100,100,100,210,210,210,210,100,100,100,210,210,210,210,210,210,210,210,210,210,210,210,
				 100,100,100,100,210,100,222,210,100,100,100,222,222,222,222,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,222,250,210,100,222,222,100,100,100,221,221,221,100,100,214,100,222,220,100,222,100,222,222,220,100,222,100,222,
				 100,100,668,250,222,710,221,222,100,668,100,220,220,211,110,214,214,100,210,222,210,222,210,222,210,222,210,222,210,222,
				 100,100,500,222,222,710,711,222,100,100,100,211,211,211,450,214,214,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,500,500,222,710,710,100,100,100,100,211,211,211,710,211,211,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,222,222,222,100,100,100,100,400,710,401,710,211,211,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,100,100,100,100,100,100,210,710,222,720,710,402,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,100,100,100,210,100,100,222,222,222,720,222,101,100,210,210,210,210,210,210,210,210,210,210,210,210,
				 100,100,100,100,105,105,105,100,222,210,100,222,222,222,720,222,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,100,100,105,105,105,105,222,222,100,222,222,222,301,224,100,100,100,222,100,222,100,222,100,222,100,222,100,222,
				 100,100,100,100,100,105,105,105,100,100,100,100,222,222,100,100,100,100,210,222,210,222,210,222,210,222,210,222,210,222,
				 100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222, 
				 100,100,100,100,100,100,100,100,210,100,100,222,222,222,720,222,101,100,210,210,210,210,210,210,210,210,210,210,210,210,
				 100,100,100,100,105,105,105,100,222,210,100,222,222,222,720,222,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,100,100,105,105,105,105,222,222,100,222,222,222,301,224,100,100,100,222,100,222,100,222,100,222,100,222,100,222,
				 100,100,100,100,100,105,105,105,100,100,100,100,222,222,100,100,100,100,210,222,210,222,210,222,210,222,210,222,210,222,
				 100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222];

}else if(map=="room1mapL2"){
		return  [222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,
				 666,222,222,222,222,222,222,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,100,100,100,222,222,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,222,222,222,222,100,100,100,100,100,100,222,222,222,222,100,100,300,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,222,222,222,100,100,100,100,222,222,100,222,222,222,100,100,100,300,222,222,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,400,400,400,100,100,400,222,100,100,100,400,400,400,100,100,400,222,210,210,210,210,210,210,210,210,210,210,
				 100,100,100,100,100,100,100,100,400,100,100,100,100,100,100,100,100,100,400,100,222,222,222,222,222,222,222,222,222,222,
				 100,100,222,250,222,222,222,100,400,100,100,100,222,250,222,222,222,100,400,100,100,222,100,222,222,220,100,222,100,222,
				 100,100,668,250,700,700,700,700,400,668,100,100,668,250,700,700,700,700,400,668,210,222,210,222,210,222,210,222,210,222,
				 100,100,500,222,222,700,700,100,100,100,100,100,500,222,222,700,700,300,300,100,222,222,222,222,222,222,222,222,222,222,
				 100,100,500,500,222,700,700,100,100,100,100,100,500,500,222,700,700,100,300,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,222,222,222,100,100,100,100,100,100,100,222,222,222,100,300,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,210,210,210,210,210,210,210,210,210,210,
				 100,100,100,100,100,100,100,100,222,222,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222, 
				 100,100,100,100,100,100,100,100,222,222,100,100,100,100,100,100,100,100,222,222,100,222,100,222,100,222,100,222,100,222, 
				 100,100,100,100,100,100,100,100,222,222,100,100,100,100,100,100,100,100,222,222,210,222,210,222,210,222,210,222,210,222, 
				 100,100,100,100,100,100,100,100,222,222,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222, 
				 100,100,100,100,100,100,100,100,210,100,100,222,222,222,720,222,101,100,210,210,210,210,210,210,210,210,210,210,210,210,
				 100,100,100,100,105,105,105,100,222,210,100,222,222,222,720,222,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,100,100,105,105,105,105,222,222,100,222,222,222,301,224,100,100,100,222,100,222,100,222,100,222,100,222,100,222,
				 100,100,100,100,100,105,105,105,100,100,100,100,222,222,100,100,100,100,210,222,210,222,210,222,210,222,210,222,210,222,
				 100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222];

				 ///Same as before, but difference in obstacles when in level 2
}else if(map=="room1mapOver"){
		return  [100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 666,101,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,210,100,100,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,210,210,210,222,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,210,222,222,222,100,100,100,100,100,100,210,210,100,100,222,100,222,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,222,222,100,100,100,210,210,100,100,100,210,210,210,210,100,100,100,210,210,210,210,210,210,210,210,210,210,210,210,
				 100,100,100,100,210,100,222,210,100,100,100,222,222,222,222,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,222,250,222,100,222,222,100,100,100,221,221,221,100,100,214,100,222,220,100,222,100,222,222,220,100,222,100,222,
				 100,100,668,250,222,710,221,222,100,668,100,220,220,211,110,214,214,100,210,222,210,222,210,222,210,222,210,222,210,222,
				 100,100,500,222,222,710,711,222,100,100,100,211,211,211,450,214,214,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,500,500,222,710,710,100,100,100,100,211,211,211,710,211,211,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,222,222,222,100,100,100,100,400,710,401,710,211,211,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,100,100,100,100,100,100,210,710,222,720,710,402,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,100,100,100,210,100,100,222,222,222,720,222,101,100,210,210,210,210,210,210,210,210,210,210,210,210,
				 100,100,100,100,105,105,105,100,222,210,100,222,222,222,720,222,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,100,100,105,105,105,105,222,222,100,222,222,222,301,224,100,100,100,222,100,222,100,222,100,222,100,222,100,222,
				 100,100,100,100,100,105,105,105,100,100,100,100,222,222,100,100,100,100,210,222,210,222,210,222,210,222,210,222,210,222,
				 100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222, 
				 100,100,100,100,100,100,100,100,210,100,100,222,222,222,720,222,101,100,210,210,210,210,210,210,210,210,210,210,210,210,
				 100,100,100,100,105,105,105,100,222,210,100,222,222,222,720,222,100,100,222,222,222,222,222,222,222,222,222,222,222,222,
				 100,100,100,100,105,105,105,105,222,222,100,222,222,222,301,224,100,100,100,222,100,222,100,222,100,222,100,222,100,222,
				 100,100,100,100,100,105,105,105,100,100,100,100,222,222,100,100,100,100,210,222,210,222,210,222,210,222,210,222,210,222,
				 100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,222,222,222,222,222,222];







/////                                       r   o   o   m     2


}else if(map=="room2map"){
		return  [222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,
				 666,101,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,210,100,100,100,100,100,100,100,100,150,150,100,100,222,222,222,222,222,222,
				 100,100,210,210,210,222,100,100,100,100,100,100,100,100,100,100,100,300,100,100,100,100,100,100,
				 100,210,222,222,222,100,100,100,100,100,100,210,210,100,100,222,100,300,100,100,100,100,100,100,
				 100,222,222,100,100,100,210,100,100,100,100,210,210,210,210,100,100,100,210,210,210,210,210,210,
				 100,100,100,100,222,100,222,100,100,100,100,222,221,221,222,100,100,100,222,222,222,222,222,222,
				 100,100,222,250,222,100,222,100,100,100,100,221,221,221,100,100,210,100,100,222,100,222,100,222,
				 100,100,668,250,222,710,221,710,100,669,100,220,220,211,110,214,214,100,210,222,210,222,210,222,
				 100,100,500,222,222,710,710,222,100,100,100,211,211,211,100,214,214,100,222,222,222,222,222,222,
				 100,100,500,500,222,710,710,100,100,100,100,211,211,211,710,211,211,100,100,100,100,100,100,100,
				 100,100,100,100,222,222,222,100,100,100,100,403,710,100,710,211,211,100,100,100,100,100,100,100,
				 100,100,100,100,100,100,100,100,100,100,100,210,710,222,720,710,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,100,100,100,210,100,100,222,222,222,720,222,101,100,210,210,210,210,210,210,
				 100,100,100,100,100,100,100,100,222,210,100,222,222,222,720,222,100,100,222,222,222,222,222,222,
				 100,100,100,100,100,100,100,100,222,222,100,222,222,222,100,224,100,100,100,222,100,222,100,222,
				 100,100,100,100,100,100,100,100,100,100,100,100,222,222,100,100,100,100,210,222,210,222,210,222,
				 100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222];

}else if(map== "room2mapOver"){
		return  [222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,222,
				 666,101,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,210,100,100,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222,
				 100,100,210,210,210,222,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,
				 100,210,222,222,222,100,100,100,100,100,100,210,210,100,100,222,100,222,100,100,100,100,100,100,
				 100,222,222,100,100,100,210,100,100,100,100,210,210,210,210,100,100,100,210,210,210,210,210,210,
				 100,100,100,100,222,100,222,100,100,100,100,222,222,222,222,100,100,100,222,222,222,222,222,222,
				 100,100,222,250,222,100,222,100,100,100,100,221,221,221,100,100,214,100,222,220,100,222,100,222,
				 100,100,668,250,222,710,221,710,100,668,100,220,220,211,110,214,214,100,210,222,210,222,210,222,
				 100,100,500,222,222,710,711,222,100,100,100,211,211,211,100,214,214,100,222,222,222,222,222,222,
				 100,100,500,500,222,710,710,100,100,100,100,211,211,211,710,211,211,100,100,100,100,100,100,100,
				 100,100,100,100,222,222,222,100,100,100,100,403,710,100,710,211,211,100,100,100,100,100,100,100,
				 100,100,100,100,100,100,100,100,100,100,100,210,710,222,720,710,100,100,100,100,100,100,100,100,
				 100,100,100,100,100,100,100,100,210,100,100,222,222,222,720,222,101,100,210,210,210,210,210,210,
				 100,100,100,100,105,105,105,100,222,210,100,222,222,222,720,222,100,100,222,222,222,222,222,222,
				 100,100,100,100,105,105,105,105,222,222,100,222,222,222,100,224,100,100,100,222,100,222,100,222,
				 100,100,100,100,100,105,105,105,100,100,100,100,222,222,100,100,100,100,210,222,210,222,210,222,
				 100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,222,222,222,222,222,222];
	}
}








///     ///
  //   //
  /////       ////// ///  //  ///////
  //////     ////     ////   ///
  //   //   ///       //    /////
///    //   /////    //  ///////


///from Event Listener
function checkKey(e, value, checkArrows) {


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
			player1.shooting=true;
		}

		e.preventDefault();

	}

}//END check spacebar



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



}








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
	canvasMenu.height = 600;
	canvasMenuOver.width =900;
	canvasMenuOver.height = 600;

	canvasMapOverMenu.width =900;
	canvasMapOverMenu.height = 600;

	canvasMenuOverOver.width =900;
	canvasMenuOverOver.height = 600;


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
			
		   		player1.speed=8;
		   		releaseCounter=false;
				
			
				slowDown=false;
				slowDownDirection=player1.direction;

			////////  currentSpeed <<<   should vary throughout the game
		}

		
	}, false);


	document.addEventListener("keyup", function(e) {
		 
		
		

		//player1.shooting=false;
		 /// REINFORCE PLAYER last DIRECTION
		// if(latestKeys[1]==40){
		// 	player1.direction = "down"; 
		// 	player1.facing = "down";
		// }
		// if(latestKeys[1]==38){
		// 	player1.direction = "up"; 
		// 	player1.facing = "up";
		// }
		// if(latestKeys[1]==39){
		// 	player1.direction = "right"; 
		// 	player1.facing = "right";
		// }
		// if(latestKeys[1]==37){
		// 	player1.direction = "left"; 
		// 	player1.facing = "left";
		// }

		 // if(player1.direction=="left-down"){
			// slowDownDirection="left-down";
		 // }else if(player1.direction=="right-down"){
			// slowDownDirection="right-down";
		 // }else if(player1.direction=="left-up"){
			// slowDownDirection="left-up";
		 // }else if(player1.direction=="right-up"){
			// slowDownDirection="right-up";
		 // }
		 ////
		 ///   GOTTA REMEMBER THIS! when slowing down


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





//UPDATE everything
function update() {

	clearCtx(ctxBg);
	clearCtx(ctxPlayer);
	clearCtx(ctxBullets);
	clearCtx(ctxOverlay);
	clearCtx(ctxOverOverlay);
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
	          						ctxMenuOver.drawImage(itemSprite, player1.items[j+1].srcX, player1.items[j+1].srcY, 30, 30, 170, 0, player1.items[j+1].width, player1.items[j+1].height);

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
									ctxMenuOver.drawImage(weaponS, srccX, 0, 64, 64, 230, 0, 64, 64);

								}
							}
						};

					
				}
			}
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


			ctxMenu.drawImage(itemSprite, 100, 400,40, 40, 0+(i*tileDiameter), 0, tileDiameter, tileDiameter);	
		
		
		
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



menuH.prototype.draw = function(){

	clearCtx(ctxMenuOver);
	clearCtx(ctxMenuOverOver);
	
	//clearCtx(ctxMenu);


	if(paused){

		if(menuTrack==0){

			////  SO THIS 2 HAVE TO GO ON A DIFF CANVAS >>> HIDE ON afterPAUSE

			if(player1.items[1]!=null&&player1.items[1]!="undefined"){

				/// HERE::  ANIMATION OVER FRAME >>> like a light reflection every few seconds...(rather than simply on/off>>> looks a lot cooler and gives the animation a better use)
				ctxMenuOverOver.drawImage(menuBorder, 0, 0, 64, 64, 170, 0, 64, 64);            
			}
		}else if(menuTrack==1){
					 
			if(player1.guns[1]!=null&&player1.guns[1]!="undefined"){
			  
			  							////   64 + counter to make anim
				ctxMenuOverOver.drawImage(menuBorder, 64, 0, 64, 64, 230, 0, 64, 64);
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
		isPlaying = true;
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
function Area(x, y, w, h, n, type, id, doorTo, column, row, roomTo,  blocked) {
	this.drawX = x;
	this.drawY = y;
	this.width = w;
	this.height = h;
	this.leftX = this.drawX;
	this.rightX = this.drawX + this.width;
	this.topY = this.drawY;
	this.bottomY = this.drawY + this.height;
	this.n = n; /////////////////////////////// area type

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


var roomStartX= 0;
var roomStartY= 0;
var roomLengthX= 0;
var roomLengthY= 0;


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




	if(currentRoom == "room-1"){

		var newTileIndexX = tileIndexX;

		roomNumberTilesY = 23;
		roomNumberTilesX = 30;

		roomLengthY= roomNumberTilesY * tileWidthHeight;
		roomLengthX= roomNumberTilesX * tileWidthHeight;

		canvasWidth = roomLengthX;
		canvasHeight = roomLengthY;


		var mapObsL1 =  whatRoomMap("room1map");


		var mapObsL2 =  whatRoomMap("room1mapL2");


		var mapOverDraw=whatRoomMap("room1mapOver");




		if(firstDraw=="first"){

	///           siendo que estan siendo reseteados los obstaculos.. asi es como se resetea el dibujo. 
	///////                   entra a la piesa de nuevo y vuelve a aparecer la puerta cerrada (o despues de abrir, timer)
	////


			obstacles =[];
			areas = [];


			if(currentLevel==1){

				////// Tile

				tilesDefine(shiftX, shiftY, img, area, {mapObsL1}, roomNumberTilesY, roomNumberTilesX, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, newTileIndexX);



			}else{
				tilesDefineLevel2(shiftX, shiftY, img, area, {mapObsL2}, roomNumberTilesY, roomNumberTilesX, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, newTileIndexX);
			}

			//                                   cuando pisa zona 150 (area transision), roomDraw(transition, level2)  [transition se ve igual que default, pero tiene que seguir siendo eso, asi no vuelve a nivel 1..mientras siga en transition]  
			//////////////////
			//////////                              Level 2 se ve exactamente igual, con la diferencia que los blockes que te impedian entrar en level 2 desde abajo, ahora son area3(transition) caminable, y en cambio se corrieron y no te dejan bajar [un ajuste en firstDraw]... Lo demas todo igual


		}else{


			 tilesOverlayDraw(shiftX, shiftY, img, area, {mapOverDraw}, roomNumberTilesY, roomNumberTilesX, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, newTileIndexX, {x:0, y:0, t:100, xx:0, yy:40}, {x:40, y:0, t:101, xx:40, yy:40}, {x:40, y:0, t:105, xx:40, yy:40},{x:200, y:0, t:110, xx:200, yy:40}, {x:480, y:0, t:220, xx:480, yy:40},{x:680, y:0, t:221, xx:680, yy:40}, {x:280, y:0, t:222, xx:280, yy:40},{x:320, y:0, t:224, xx:320, yy:40},{x:360, y:0, t:225, xx:360, yy:40},{x:440, y:0, t:210, xx:440, yy:40},{x:480, y:0, t:211, xx:480, yy:40},{x:600, y:0, t:214, xx:600, yy:40},{x:80, y:0, t:301, xx:80, yy:40},{x:1480, y:0, t:400, xx:1480, yy:40},{x:1480, y:0, t:401, xx:1480, yy:40},{x:1480, y:0, t:402, xx:1480, yy:40},{x:1480, y:0, t:403, xx:1480, yy:40},{x:1640, y:0, t:450, xx:1640, yy:40},{x:1480, y:0, t:710, xx:1480, yy:40},{x:1480, y:0, t:711, xx:1480, yy:40},{x:1560, y:0, t:720, xx:1560, yy:40},{x:0, y:0, t:150, xx:0, yy:40}, {x:120, y:0, t:222, xx:120, yy:40}, {x:160, y:0, t:700, xx:160, yy:40}, {x:0, y:0, t:250, xx:0, yy:40}, {x:160, y:0, t:400, xx:160, yy:40}, {x:0, y:0, t:500, xx:0, yy:40}, {x:0, y:0, t:190, xx:0, yy:40}, {x:160, y:0, t:666, xx:160, yy:40}, {x:160, y:0, t:668, xx:160, yy:40}, {x:0, y:0, t:300, xx:0, yy:40}); 
						///   t: 666, 668.... should implement function>> between 600 & 620 >> return 600
																   ///  >> between 620 & 640 >> return 620
																   ///  500, 510, 520, 530 
						/// 600, 620 are the only differences when drawing
						//     all numbers in between are for doorID's or Angles purposes
				//// no need to pass an object parameter for each different ID (with the same drawing coordinates)
		}
	}

	if(currentRoom == "room-2"){

		//player1.speed=0;
		var newTileIndexX = tileIndexX;

		// roomNumberTilesY = 18;
		// roomNumberTilesX = 10;

		///seems to be fine having different NumberTiles per room
		roomNumberTilesY = 18;
		roomNumberTilesX = 24;

		roomLengthY= roomNumberTilesY * tileWidthHeight;
		roomLengthX= roomNumberTilesX * tileWidthHeight;

		canvasWidth = roomLengthX;
		canvasHeight = roomLengthY;

		////////////   VAR get current room
		////////       REMEMBER THIS ROOM  >>> CURRENT ROOM = "room-1"

		var mapObsL1 =  whatRoomMap("room2map");


		var mapOverDraw=whatRoomMap("room2mapOver");


		if(firstDraw=="first"){
		  
			tilesDefine(shiftX, shiftY, img, area, {mapObsL1}, roomNumberTilesY, roomNumberTilesX, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, newTileIndexX);



			}else{
				tilesOverlayDraw(shiftX, shiftY, img, area, {mapOverDraw}, roomNumberTilesY, roomNumberTilesX, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, newTileIndexX, {x:0, y:0, t:100, xx:0, yy:40}, {x:40, y:0, t:101, xx:40, yy:40}, {x:40, y:0, t:105, xx:40, yy:40},{x:200, y:0, t:110, xx:200, yy:40}, {x:480, y:0, t:220, xx:480, yy:40},{x:680, y:0, t:221, xx:680, yy:40}, {x:280, y:0, t:222, xx:280, yy:40},{x:320, y:0, t:224, xx:320, yy:40},{x:360, y:0, t:225, xx:360, yy:40},{x:440, y:0, t:210, xx:440, yy:40},{x:480, y:0, t:211, xx:480, yy:40},{x:600, y:0, t:214, xx:600, yy:40},{x:80, y:0, t:301, xx:80, yy:40},{x:1480, y:0, t:400, xx:1480, yy:40},{x:1480, y:0, t:401, xx:1480, yy:40},{x:1480, y:0, t:402, xx:1480, yy:40},{x:1480, y:0, t:403, xx:1480, yy:40},{x:1640, y:0, t:450, xx:1640, yy:40},{x:1480, y:0, t:710, xx:1480, yy:40},{x:1480, y:0, t:711, xx:1480, yy:40},{x:1560, y:0, t:720, xx:1560, yy:40},{x:0, y:0, t:150, xx:0, yy:40}, {x:120, y:0, t:222, xx:120, yy:40}, {x:160, y:0, t:700, xx:160, yy:40}, {x:0, y:0, t:250, xx:0, yy:40}, {x:160, y:0, t:400, xx:160, yy:40}, {x:0, y:0, t:500, xx:0, yy:40}, {x:0, y:0, t:190, xx:0, yy:40}, {x:160, y:0, t:666, xx:160, yy:40}, {x:160, y:0, t:668, xx:160, yy:40}, {x:0, y:0, t:300, xx:0, yy:40}); 


			}
		}/// room-2

	//limitScreenRight

}

///////////   PRELOAD IMAGES!!!

/////   {x:160, y:0, t:400}   >>>    NOT REALLY... ANOTHER ONE THAT LOOKS THE SAME WHEN OUT BUT DIFFERENT WHEN IN..
											///   NOT YET IN spritesBg







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
						}else{
							areas.push(
								new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default")
							);


						}

					   
					}else if(mapObsL1[tileMapIndex]>=200&&mapObsL1[tileMapIndex]<226){ ///////// obstacle out

						
						obstacles.push(
							new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "wall", mapObsL1[tileMapIndex], "active")
						);
					}else if(mapObsL1[tileMapIndex].toString().substring(0,1)==7){ ///////// area 1

					 
						areas.push(
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "uno")
						);
					}else if(mapObsL1[tileMapIndex].toString().substring(0,1)==4){ ///////// door in area
						areas.push(
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "uno")
						);
						
						if(inActive.length==0){
							obstacles.push(
								new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL1[tileMapIndex], "active", 50, "closed")//// ID has to be = to the tileNumber
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
									new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL1[tileMapIndex], "inActive", 50, "closed")//// ID has to be = to the tileNumber
									);
									
							}else{
								obstacles.push(
									new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL1[tileMapIndex], "active", 50, "closed")//// ID has to be = to the tileNumber
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
								new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL1[tileMapIndex], "active", 50, "closed")//// ID has to be = to the tileNumber
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
									new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL1[tileMapIndex], "inActive", 50, "closed")//// ID has to be = to the tileNumber
									);


									
							}else{
								obstacles.push(
									new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL1[tileMapIndex], "active", 50, "closed")//// ID has to be = to the tileNumber
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
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "uno", "door", 668, 669, tileIndexX, tileIndexY,"room-2")
						);
					}else if(mapObsL1[tileMapIndex]==669){ ///////// doorTO in area

					 
						areas.push(////////////////////////////////    //  IMPORTANT!!!  after "door"=.n >> 888 = id, 885, dooTo >>> door is going to
										/////// now here below, this room it is going to (888)>> 888 tile has to be given it's 885 id so dootTo here MATCHES!!
										///first is ID of this door, then ID doorItIsGoinggTo
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "uno", "door", 669, 668, tileIndexX, tileIndexY,"room-1")
						);
					}else if(mapObsL1[tileMapIndex]==666){ ///////// doorTO in area

					 
						areas.push(
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default", "door", 666, 666, tileIndexX, tileIndexY, "room-1")
						);
					}else if(mapObsL1[tileMapIndex].toString().substring(0,1)==5){ /////////  doorTOout

					 
						areas.push(
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default", "door", 500, 500,tileIndexX, tileIndexY,  "room-2",)
							/////////////////////////////           PLUS:  TO WHAT DOOR IN WHAT ROOM
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

/////////   I JUST DON'T KNOW HOW TO TURN {mapObsL1}{mapObsL2} into a variable, to have tilesDefine in only one function
////  whatever I've tried doesn't work

function tilesDefineLevel2(newShiftX, newShiftY, img, area, {mapObsL2}, roomNumberTilesY, roomNumberTilesX, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, newTileIndexX){

inAct=false;
//// cuidado con los ID de las puertas... si son iguales puede haber problemas
			
		for(var i =0; i<roomNumberTilesY; i++){
			for(var e=0; e<roomNumberTilesX; e++){


					if(mapObsL2[tileMapIndex].toString().substring(0,1)==1){ ///////// area (default)

						if(mapObsL2[tileMapIndex]==150){ /////////  doorTOout

							areas.push(
								new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "transition")
								/////////////////////////////           PLUS:  TO WHAT DOOR IN WHAT ROOM
							);
						}else{
							areas.push(
								new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default")
							);
						}

					   
					}else if(mapObsL2[tileMapIndex]>=200&&mapObsL2[tileMapIndex]<226){ ///////// obstacle out

						
						obstacles.push(
							new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "wall", mapObsL2[tileMapIndex], "active")
						);
					}else if(mapObsL2[tileMapIndex].toString().substring(0,1)==7){ ///////// area 1

					 
						areas.push(
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "uno")
						);
					}else if(mapObsL2[tileMapIndex].toString().substring(0,1)==4){ ///////// door in area
						areas.push(
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "uno")
						);
						
						if(inActive.length==0){
							obstacles.push(
								new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL2[tileMapIndex], "active", 50, "closed")//// ID has to be = to the tileNumber
								);
						}else{

							///WHATS HAPPENING:
							/// inAct keeps track of whether this Tile's number has had any match within the inactive Obstacles.
							// if at any poin it did, then doesn't matter what happens, inAct is true and the obstacle is not (this way it waits for the whole inActive-obs Array to finish befire deciding to draw or not)

							// repeat same for breakableObstacles
							console.log(inAct);

							for (var a = 0; a < inActive.length; a++) {
								if(inActive[a]==mapObsL2[tileMapIndex]){
									inAct=true;
									
								}else if(inActive[a]!=mapObsL2[tileMapIndex]){
									if(!inAct){
										inAct=false;
									}
									 
								}
							}

							if(inAct){
								obstacles.push(
									new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL2[tileMapIndex], "inActive", 50, "closed")//// ID has to be = to the tileNumber
									);
									
							}else{
								obstacles.push(
									new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL2[tileMapIndex], "active", 50, "closed")//// ID has to be = to the tileNumber
									);
									
							}

						}

						inAct=false;
						
					}else if(mapObsL2[tileMapIndex].toString().substring(0,1)==3){ ///////// door out

						/// has to also be an area >> when opened >> so changes from inside room to outside
						areas.push(
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default")
						);
					 
					   if(inActive.length==0){
							obstacles.push(
								new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL2[tileMapIndex], "active", 50, "closed")//// ID has to be = to the tileNumber
								);
						}else{

							for (var a = 0; a < inActive.length; a++) {
								if(inActive[a]==mapObsL2[tileMapIndex]){
									inAct=true;
									
								}else if(inActive[a]!=mapObsL2[tileMapIndex]){
									if(!inAct){
										inAct=false;
									}
									 
								}
							}

							if(inAct){
								obstacles.push(
									new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL2[tileMapIndex], "inActive", 50, "closed")//// ID has to be = to the tileNumber
									);


									
							}else{
								obstacles.push(
									new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", mapObsL2[tileMapIndex], "active", 50, "closed")//// ID has to be = to the tileNumber
									);
									
							}

						}
						inAct=false;
					}else if(mapObsL2[tileMapIndex]>=250&&mapObsL2[tileMapIndex]<275){ ///////// obstacle in area

					 
						obstacles.push(
							new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "wall", mapObsL2[tileMapIndex], "active")
						);
					}else if(mapObsL2[tileMapIndex]==668){ ///////// doorTO in area

					 
						areas.push(////////////////////////////////    //  IMPORTANT!!!  after "door"=.n >> 888 = id, 885, dooTo >>> door is going to
										/////// now here below, this room it is going to (888)>> 888 tile has to be given it's 885 id so dootTo here MATCHES!!
										///first is ID of this door, then ID doorItIsGoinggTo
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "uno", "door", 668, 668, tileIndexX, tileIndexY,"room-2")
						);
					}else if(mapObsL2[tileMapIndex]==666){ ///////// doorTO in area

					 
						areas.push(
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default", "door", 666, 666, tileIndexX, tileIndexY, "room-1")
						);
					}else if(mapObsL2[tileMapIndex].toString().substring(0,1)==5){ /////////  doorTOout

					 
						areas.push(
							new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default", "door", 500, 500,tileIndexX, tileIndexY,  "room-2")
							/////////////////////////////           PLUS:  TO WHAT DOOR IN WHAT ROOM
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

} /////   tilesDefine  L 2




var areaY=0;
var areaX=0;

var animX=0;

var doorsOpened=[];
var animC=0;

var closeIt;

var doorAnimX = 0;
var doorAnimCount = 0;

var doorOpened=false;


var doorOpenCounter=50;

var doorClosingRememberIndex;

var doorClosingRememberId;



														 //\               
														 ///\\				   //\ 
			     ///////  //    //      ////|            //////     ///////   // \    |||||\
				   ///    //    //      //               //   //   ///  //   //  \   |/   \\
				   ///    //    //      //|              //  ///  ///////   //   \   |/   \\
				   ///    //    //////  ////|            /////   //  //    //____\   \||||\
				   										 ///			  //     \





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

	/// menuMap back-ground >> drawn only once, under
	ctxMapOverMenu.fillStyle = "#000";					
	//ctxMapOverMenu.fillRect(1140, 0, 4, 4);
	ctxMapOverMenu.fillRect(0, 10, 130, 100);

	for(var i =0; i<roomNumberTilesY; i++){



		for(var e=0; e<roomNumberTilesX; e++){

			for(var j=0; j < defaultTiles.length; j++){	
			
				/// HERE WE IGNORE defaultTiles[j].x/y/xx/yy & jump to the flash states of this Tiles as aligned in the sprite
				//(even though now every Tile doesn't have its repeated row of 0 to 40 Y axis when onAreas
				//  and are sharing spots in the Sprite, this tile-spots have their course when entering the flashing tiles...............................................................................

				// if(area=="flash-1"){            
				// 	areaY=80;                            
				// }else if(area=="flash-2"){
				//  areaY=120;       
				// } //  .. etc



				//// not sure I'll be using this now
				if(mapOverDraw[tileMapIndex]==defaultTiles[j].t){   

					//////  DEPENDING ON WHAT AREA, where in the Sprite(Y) to draw
					if(area=="default"||area=="transition"){ ///+ other outside areas
						srcX= defaultTiles[j].x;
						srcY= defaultTiles[j].y;
					}else{//////////////////////////   SPECIFY ALL NUMBR OF AREAS + FLASH STATES.....
						srcX= defaultTiles[j].xx;
						srcY= defaultTiles[j].yy;
					}



					/// PROUDLY PRESENTS:
					////                    DA
					////						M   E   N   U   >>>>>>>>>>>>>>>>>>>>>       M          A          P
					///																		M          A          P	
				///		   																	M          A          P
			///	   																		    M          A          P
		///	   																		        M          A          P
	///	   																		            M          A          P
///		   																		            M          A          P

										///////////        4        &      10   seem to match, perhaps because
										///   4 is tileDiameter/10  >>>  player position  /10  then  matches!
					
					ctxMapOverMenu.fillStyle = "#84ff00";					
					ctxMapOverMenu.fillRect(20+newDrawX/16, 10+newDrawY/16, 4, 4);

					if(defaultTiles[j].t.toString().substring(0,1)==1){
						ctxMapOverMenu.fillStyle = "#0b0020";
						ctxMapOverMenu.fillRect(20+e*4+shiftX/16, 10+i*4+shiftY/16, 4, 4);
					}else if(defaultTiles[j].t.toString().substring(0,1)==2){
						ctxMapOverMenu.fillStyle = "#ff001f";
						ctxMapOverMenu.fillRect(20+e*4+shiftX/16, 10+i*4+shiftY/16, 4, 4);
					}


//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



					


					 
					    ///////   ||||  |||  ||  //|    ||     ///   /////////  ///////  ///////  
					   ///    |  ||||| |||  ||  // |   ||/    // //     ///    //       //   ///    
					  ///     | |  ||||||  ||  //  |  ||//   //  //    ///    ///      //  ///      
					 /// ANIM tiles       ||  //   ||||///  //   //   ///    //////   //////       
				    /// 



					if(defaultTiles[j].t==105){

						if(animX>=0&&animX<5){
							areaX=0;
						}else if(animX>=5&&animX<10){
							areaX=40;
						}else if(animX>=10&&animX<15){
							areaX=80;
						}else if(animX>=15){
							areaX=0;
							animX=0;
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

						   /// this is just to prove that you can differentiate withint tiles that have same first substring, but different second... so you can pass different images pointing to the SAME SPRITE starting X for all 1s... (ex: diff types of defaultTiles), here you can plus it or whatever to suit more specific differences
						if(!inArea.inIt){   

							if(mapOverDraw[tileMapIndex].toString().substring(0,2)>=10&&mapOverDraw[tileMapIndex].toString().substring(0,2)<15){

								ctxBg.drawImage(img, srcX+areaX, srcY+areaY, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);



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
														ctxOverlay.drawImage(doors, 0+doorClosing[q].animX, 60, 40, 60, tileIndexX, tileIndexY-20, tileWidthHeight, tileWidthHeight+20);
															// ctxOverlay.drawImage(doors, 0+doorOpening[q].animX, 60, 40, 60, tileIndexX, tileIndexY-20, tileWidthHeight, tileWidthHeight+20);
													}else{
														ctxOverlay.drawImage(doors, 0+doorClosing[q].animX, 0, 40, 60, tileIndexX, tileIndexY-20, tileWidthHeight, tileWidthHeight+20);
															// ctxOverlay.drawImage(doors, 0+doorOpening[q].animX, 0, 40, 60, tileIndexX, tileIndexY-20, tileWidthHeight, tileWidthHeight+20);
													}  
												}


												tallerDoor=0;
											}else{
												if(!doorOpened){
													doorOpened=false;
												}
											}
									   

											// if(!doorOpened){

										 // 		tallerDoor=20;
											// 	   ////  NOT THAT SAME SPRITE but a different one >> ROUNDED
											// 	if(doorClosing[q].id==mapOverDraw[tileMapIndex+1]||doorClosing[q].id==mapOverDraw[tileMapIndex-1]){
													
											// 		if(mapOverDraw[tileMapIndex-1]>=400&&mapOverDraw[tileMapIndex-1]<450){
											// 			ctxOverlay.drawImage(doors, 0+doorClosing[q].animX, 60, 40, 60, tileIndexX, tileIndexY-20, tileWidthHeight, tileWidthHeight+20);
											// 		}else{
											// 			ctxOverlay.drawImage(doors, 0+doorClosing[q].animX, 0, 40, 60, tileIndexX, tileIndexY-20, tileWidthHeight, tileWidthHeight+20);
											// 		}  
											// 	}

											// }else{
											// 	/// without this it could never draw another door
											// 	doorOpened=false;    
											// }
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
								ctxBg.drawImage(img, srcX+areaX, srcY+areaY, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);
							}else if(mapOverDraw[tileMapIndex].toString().substring(1,3)==90){ /////  Numeros reservados para Overlays



								ctxBg.drawImage(img, srcX+areaX, srcY+areaY, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);  
								
									  
							/// >>>>  HERE could go  EDGES -UNDER - PLAYER 

							} 

						}else{//// else if  inArea
							
							ctxBg.drawImage(img, srcX, srcY, 40, 40, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
						}

					}else if(mapOverDraw[tileMapIndex].toString().substring(0,1)==4||mapOverDraw[tileMapIndex].toString().substring(0,1)==3){

						//// Door tiles, but first, we draw what would go underneath. What tiles these would be were they not doors
						ctxBg.drawImage(img, srcX+areaX, srcY+areaY, 40, 40, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);







					 ///////   ||||||  ||||||  ||////   /////        //           ///////  |||  || || //|  ||
					 //   ///  ||||||  ||||||  ||  //  ///           //          ///    | |||| || || // | ||/
					 //  ///   ||||||  ||||||  ||///   //////     ////////      ///     ||  |||| || //  |||//
					 //////    ||||||  ||||||  ||  \\     ///        //        //       |          //   |  //
					 ////                              /////         //       //                           //

							///  doorOpening needs to keep track of its own doorAnimC and X...
							//                     so can open 2+ at the same time >> independent anim							
						if(doorOpening.length>0){

								//console.log("ABRIENDO YA");
								//console.log(mapOverDraw[tileMapIndex]);
								/// SO basically FOR THIS TO WORK, DOOR# MUST have been assigned a Sprite
							for (var q = 0; q< doorOpening.length; q++) {
									
								   
									///first we check if one of the doorsCurrentlyOpening === the currentTile
								if(doorOpening[q].id==mapOverDraw[tileMapIndex]){

									

									doorOpened=true;

									///for whatever purposes, not being used at the moment
									/// originally put there for slow-down effect
									opening=true;
								

									doorOpening[q].animC++; 

										

									if(doorOpening[q].timer==0&&doorOpening[q].closeDone==false){
										doorClose(doorOpening[q].id, doorOpening[q].animC, doorOpening[q].animX);
										doorClosingRememberId=doorOpening[q].id;
											
										doorOpening[q].closeDone=true;
									}	

									
									if(doorOpening[q].animC>2&&doorOpening[q].animC<=4){
										doorOpening[q].animX=40;
										//console.log("opening 1");
									}else if(doorOpening[q].animC>4&&doorOpening[q].animC<=6){
										doorOpening[q].animX=80;
										//console.log("opening 2");
										//console.log(doorOpening[q].animC);
									}else if(doorOpening[q].animC>6&&doorOpening[q].animC<=8){
										//console.log(doorOpening[q].animC);
										doorOpening[q].animX=120;
									}else if(doorOpening[q].animC>8){
										//console.log(doorOpening[q].animC);
										doorOpening[q].animX=120;
										doorOpening[q].animC=8;

										opening=false;

								
									}    
									
																	
									
									//doorOpenCounter++;
									//console.log(doorOpenCounter);
									if(mapOverDraw[tileMapIndex]>=300&&mapOverDraw[tileMapIndex]<400&&mapOverDraw[tileMapIndex]!=301){
										//// first ever pass (no doorsOpen) /// or else already in doorOpening[0,1,2,3..
										doorX=0;
										doorY=180;


									} else if(mapOverDraw[tileMapIndex]>=400&&mapOverDraw[tileMapIndex]<450){
											

											
										doorX=200;
										doorY=120;
										tallerDoor=20;

										if(inArea.inIt){
											ctxOverlay.drawImage(doors, doorX+doorOpening[q].animX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
										}

									}else if(mapOverDraw[tileMapIndex]>=450&&mapOverDraw[tileMapIndex]<499){
										doorX=200;
										doorY=180;

										ctxBg.drawImage(doors, doorX+doorOpening[q].animX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
											
									}else if(mapOverDraw[tileMapIndex]==301){
										//// first ever pass (no doorsOpen) /// or else already in doorOpening[0,1,2,3..
										if(inArea.inIt){
											doorX=400; 
										}else{
											doorX=200; 
										}
											

										doorY=180;
										if(inArea.inIt){
											ctxOverlay.drawImage(doors, doorX+doorOpening[q].animX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
										}else{
											ctxBg.drawImage(doors, doorX+doorOpening[q].animX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
										}
									}

										


									tallerDoor=0;
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
							
								if(mapOverDraw[tileMapIndex]>=300&&mapOverDraw[tileMapIndex]<400&&mapOverDraw[tileMapIndex]!=301){
										//// first ever pass (no doorsOpen) /// or else already in doorOpening[0,1,2,3..
										doorX=0;
										doorY=180;


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

										ctxBg.drawImage(doors, doorX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
											
									}else if(mapOverDraw[tileMapIndex]==301){
										//// first ever pass (no doorsOpen) /// or else already in doorOpening[0,1,2,3..
										if(inArea.inIt){
											doorX=400; 
										}else{
											doorX=200; 
										}
											

										doorY=180;
										if(inArea.inIt){
											ctxOverlay.drawImage(doors, doorX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
										}else{
											ctxBg.drawImage(doors, doorX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
										}
									}

										


									tallerDoor=0;

									

							}else{


								/// without this it could never draw another door
								doorOpened=false;    
							}

							////
///////			 SO WHY ON EARTH DOES THIS TAKE SO MUCH LONGER WHEN ON  ROOM-2 !!!??!?!?@?@#?@@@@$^%*&!!!!!!!!!!

											
								 

						}else{// NO DoorOpening YET

							if(mapOverDraw[tileMapIndex]>=300&&mapOverDraw[tileMapIndex]<400&&mapOverDraw[tileMapIndex]!=301){
										//// first ever pass (no doorsOpen) /// or else already in doorOpening[0,1,2,3..
								doorX=0;
								doorY=180;


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

								ctxBg.drawImage(doors, doorX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
											
							}else if(mapOverDraw[tileMapIndex]==301){
										//// first ever pass (no doorsOpen) /// or else already in doorOpening[0,1,2,3..
								if(inArea.inIt){
									doorX=400; 
								}else{
									doorX=200; 
								}
											

								doorY=180;
								if(inArea.inIt){
									ctxOverlay.drawImage(doors, doorX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
								}else{
									ctxBg.drawImage(doors, doorX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
								}
							}

							tallerDoor=0;
									
									
						}/// if doorOpening

				//// REMEMBER THIS IS ALL INSIDE 300 & 400 TILES >>> OGO BACK REPEAT ON 100 TILES >> Function Out
		/////   and it is there.. so check it out proper <<< only openDoor implemented up there, not closeDoor

					}else{ /// other tiles

						ctxBg.drawImage(img, srcX+areaX, srcY+areaY, 40, 40, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
		  
					}/// else... everything else



					if(doorClosing.length>0){
							

						for (var q = 0; q< doorClosing.length; q++){

							if(doorClosing[q].id==mapOverDraw[tileMapIndex]){

									
									//console.log(doorClosing.length);
										
												
										

								if(doorClosing[q].animC==7){
									doorClosing[q].animX=120;

									// not coming around here on second doorClose (same door)
									console.log("closing 1");
								}else if(doorClosing[q].animC<7&&doorClosing[q].animC>=4){
									doorClosing[q].animX=80;
									console.log("closing 2");
								}else if(doorClosing[q].animC<4&&doorClosing[q].animC>=2){
									doorClosing[q].animX=40;
								}else if(doorClosing[q].animC<2){
									doorClosing[q].animX=0;
									doorClosing[q].animC=0;
													
								}    


								

								for(var k=0; k<obstacles.length; k++){

									if(obstacles[k].isDoor=="door"&&obstacles[k].doorID==doorClosing[q].id&&obstacles[k].isActive=="active"){


										//console.log("CUANTEAS ABRIMOS ?  " + doorClosing.length);
											/// aqui esta el meollo.. ta repitiendo doores

										if(mapOverDraw[tileMapIndex]>=300&&mapOverDraw[tileMapIndex]<400&&mapOverDraw[tileMapIndex]!=301){
												//// first ever pass (no doorsOpen) /// or else already in doorOpening[0,1,2,3..
											doorX=0;
											doorY=180;


											ctxBg.drawImage(doors, doorX+doorClosing[q].animX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
											tallerDoor=0;
										}else if(mapOverDraw[tileMapIndex]>=400&&mapOverDraw[tileMapIndex]<450){

											doorX=200;
											doorY=120;
											tallerDoor=20;

											if(!inArea.inIt){
												ctxBg.drawImage(doors, doorX+doorClosing[q].animX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
												tallerDoor=0;
											}else{
												ctxOverlay.drawImage(doors, doorX+doorClosing[q].animX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
												tallerDoor=0;
											}
										}else if(mapOverDraw[tileMapIndex]>=450&&mapOverDraw[tileMapIndex]<499){
											doorX=200;
											doorY=180;

											ctxBg.drawImage(doors, doorX+doorClosing[q].animX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
											tallerDoor=0;
											
										}else if(mapOverDraw[tileMapIndex]==301){
											doorY=180;
										   
												
											
											if(inArea.inIt){
												doorX=400;

												ctxOverlay.drawImage(doors, doorX+doorClosing[q].animX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
												tallerDoor=0;
											}else{
												doorX=200;
												ctxBg.drawImage(doors, doorX+doorClosing[q].animX, doorY, 40, 40, tileIndexX, tileIndexY-tallerDoor, tileWidthHeight, tileWidthHeight+tallerDoor);
												tallerDoor=0;
											}
											
											
										}/// 301 - tiles



									}/// if door active
								}/// for obstacles

									
								// if(doorClosing[q].isOpen!="closed"){
								
								// 	console.log("open id "+doorClosing[q].id);
								// 	console.log("open MIERDA "+doorClosing[q].isOpen);
								// }


								if(doorClosing[q].id==doorClosingRememberId&&doorClosing[q].isOpen=="open"){
													
									if(doorClosing[q].animC>0){

										doorClosing[q].animC-=1;

									}else{
										
										console.log("FUUUCK "+doorClosing[q].animC);

										doorClosing[q].isOpen="closed";
										//doorClosing[q].animX=120;
				
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
							ctxOverlay.drawImage(img, srcX, srcY, 40, 40, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
							}
								
						}  

						////  this ones always over player
						if(mapOverDraw[tileMapIndex]==110){   /// y menos de la mitad
					   
							/// 33 is the width of the portion to be drawn from the sprite (actual width in the sprite)
							ctxOverlay.drawImage(img, srcX, srcY+areaY, 40, 40, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
								
						}    
						/// 301 when inside and notOpen


						if(mapOverDraw[tileMapIndex]>=210&&mapOverDraw[tileMapIndex]<=220){  
			   /// have to leave == 250, ,  fixed, or else there's no way to add && <3 in this multiple if/else

				//img, srcX, srcY  and get 250 right in sprite 

							if(!inArea.inIt){
							/// 40 is the width of the portion to be drawn from the sprite (actual width in the sprite)
							ctxOverlay.drawImage(img, 200,0, 40, 40, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
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
							ctxOverlay.drawImage(img, defaultTiles[8].x, defaultTiles[8].y, 40, 40, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
							}
								
						}    

					}

					overPlayer();








						/////   ///////   ///////   /////     /////               
						//      //   ///  //        //       ///                  
						///     //  ///   //   //   ///      //////       
						//      //////    //   ///  //          ///     
						//////  ////      ///////   //////  /////    


						// remember how many Tiles per X, Y axis
						// roomNumberTilesY = 15;
						// roomNumberTilesX = 10;
								 
						var tilesToCheck = [];            

						///edges outside  

						/// beware, this is really resource consuming....
						/// bring game speed down to the slowest so speed with or without edges doesn't change          
						if(!inArea.inIt){
									//// tileMapIndex+roomNumberTilesX meaning, the one directly below
							if(typeof mapOverDraw[tileMapIndex+roomNumberTilesX+1]!="undefined"){

								if(mapOverDraw[tileMapIndex].toString().substring(0,1)==1){

									

								/////////////////////  THIS HAS TO BE both LOWER & UPPER >>> WHOLE!!!!
								if(mapOverDraw[tileMapIndex]!=105){

									tilesToCheck=[100, 222, 105];
									//// 221  is my go to   so roofs on 100 wrap around it
										addEdges(1, 0, ctxBg, "lower");

								}else if(mapOverDraw[tileMapIndex]==105){
									tilesToCheck=[105];
									//// 221  is my go to   so roofs on 100 wrap around it
									addEdges(1, 0, ctxBg, "up");
								}


									tilesToCheck=[100, 105, 400, 401, 402, 222,  224, 300, 301, 150, 668, 500];
									//// 221  is my go to   so roofs on 100 wrap around it
										addEdges(1, 80, ctxOverlay, "lower-up");
		

								}else if(mapOverDraw[tileMapIndex].toString().substring(0,1)==2){
						   

							///this means: if the one directly under is...

									  //// turns out, check and no check kinda work the same.. meaning Check is an extension of NOTcheck.. so you might as well do it always like that (and save code space, looks better)

									if(mapOverDraw[tileMapIndex]>=210&&mapOverDraw[tileMapIndex]<=220){
										 tilesToCheck=[210, 211, 214, 720, 710, 400, 401, 402, 110, 450];

										addEdges(2, 40, ctxOverlay, "lower");


									}else if(mapOverDraw[tileMapIndex]==221){
										tilesToCheck=[221, 710]; /// only downside is having to look for each manually, instead of all sub>2....
									///  but NOTchecking is not excempt of bullshit (such as && !=3)

										addEdges(2, 160, ctxBg, "lower");
										///ok, so it works.. now change the Sprite
									}else{
										tilesToCheck=[301, 222, 221, 220, 211, 210, 110, 720, 224,710, 101, 711]; 
										// 711 == 710  >> but 710 has no roof edges

										addEdges(2, 0, ctxBg, "lower");

									}

								   
								//////   ADD EDGE IF <- or -> == 3 >> Door
								}else if(mapOverDraw[tileMapIndex].toString().substring(0,1)==3){

									tilesToCheck=[301];
									///this means: if the one directly under is...

									/// this If? elses would get too long; for example, there's roofs, when Out, on tiles.sub 7, 6, 4 and 210 to 220....  
									// So we put this in a function and call it many times with different number instead
									addEdges(4,40, ctxBg, "upper-door");//////
									////
									//  for doors to not get the bottom EDGE >>> DIFF Y in SPRITE

								}else if(mapOverDraw[tileMapIndex].toString().substring(0,1)==4){
							
									tilesToCheck=[210, 211, 214, 720, 710, 400, 401, 402, 110, 450];
									///this means: if the one directly under is...

									/// this If? elses would get too long; for example, there's roofs, when Out, on tiles.sub 7, 6, 4 and 210 to 220....  
									// So we put this in a function and call it many times with different number instead
									addEdges(4, 40, ctxOverlay, "lower");



								}else if(mapOverDraw[tileMapIndex].toString().substring(0,1)==7){
						   
								   
									tilesToCheck=[221,210, 211, 214, 710, 400, 401, 402, 110,  450];
									
									addEdges(7, 40, ctxOverlay, "lower");

									// addEdges(2, 80, ctxOverlay, "lower-up"); 

								}
							}/// if nextTiles != undefined
						} /////if(!inArea.inIt){





							//// ADD Parameter to specify what edges(angles) to go for... not just all edges for everyTile.. some up, some down
								/////   more specificaly  Roof Edges (upper edges)  VS  lower edges (almost all tiles)  VS  whole edges  (Some tiles)__

							////  also whether this is to be drawn IN area or OUTside of it (tileNumber, y, z, check....   InOut, whereEdges )

							/// so then  before the if cornerRight etc..  wrap this IF/ELSE in   if(whereEdges=="whole"||whereEdges=="lower")

							////   for cornerRightUp >>>>   if(whereEdges=="whole"||whereEdges=="lower-up")  << roof Tiles



								function addEdges(tileNumber, y, z, where){

									var cornerLeft=false;
									var cornerRight=false;

									var downDown=false;  
									var downLeft=false;  
									var downRight=false;  

									var leftLeft=false;  
									var rightRight=false;

									var upperLeft=false;  
									var upperRight=false;

									for (var i = 0; i< tilesToCheck.length; i++) {

										/// because it has to check against every one, it will find "no" many times, and then yes when the "no" has already been painted...
										// so make 4 vars, if at any time this is untrue, they are, only if they are not, draw....


										// the problem still is that some tiles I want edges even if they have roof beside them (depth effect).. like those 2 "higher" ones at the front

										///  EVEN IF THIS WOULD EXTEND THE SPRITE A LOT (adding like 4 or 8 options per tile > if its got edges, and even more if this are going to change colours and surroundings)
										/// MAYBE HAVING DIFFERENT TILES FOR EVERY EDGE, HARDCODING THE NUMBERS (ex. 210 cornerLeft, 211 leftLeft, 212 rightRight, 213 cornerRight >> for the same type of tile)... is somehow less cumbersome than calculating this shit-EDGES for a very complex set of possibilities....

										/// OR SIMPLY A COMBINATION OF THESE 2 IDEAS, keeping this function, and ruling out the "special tiles" that already have edges drawn, when calling this edges-Function...   since this problem only applies to so few tiles in such specific circumstances (and only for some stupid graphics effect, like it's gonna be the shit...)

										/////////////////////////////////////  Bingo!

										if(where=="up"){
											if(mapOverDraw[tileMapIndex-1]!=tilesToCheck[i]&&mapOverDraw[tileMapIndex-roomNumberTilesX]!=tilesToCheck[i]){

		 
											}else{
										   
													if(mapOverDraw[tileMapIndex]!=401){
														upperLeft=true;
													}  
											}

											if(mapOverDraw[tileMapIndex+1]!=tilesToCheck[i]&&mapOverDraw[tileMapIndex-roomNumberTilesX]!=tilesToCheck[i]){

		 
											}else{
										   
													if(mapOverDraw[tileMapIndex]!=401){
														upperRight=true;
													}  
											}


										}

										if(mapOverDraw[tileMapIndex-1]!=tilesToCheck[i]&&mapOverDraw[tileMapIndex+roomNumberTilesX]!=tilesToCheck[i]){

		 
										}else{
											/// THERE YOU GO!  after reading all that shit above.. here's the exclusions.... 

												/////////// ADD exceptions, but not this number (401), rather, make special numbers for this
												////  graphics driven exceptions...   
												////                                ex. cornerRight=true; needs 1->710 exception, but theres too many, soi change it to like 799... or whatever

												if(mapOverDraw[tileMapIndex]!=401){
													cornerLeft=true;
												}  
										}

										///cornerLeft=true; /// it takes out both Lower Left and uppr Right....
										//// gotta separate and be more specific


										//non-exclusive ifs
										if(mapOverDraw[tileMapIndex+1]!=tilesToCheck[i]&&mapOverDraw[tileMapIndex+roomNumberTilesX]!=tilesToCheck[i]){
					 
										}else{                                          
												cornerRight=true;                                      
										}

										if(mapOverDraw[tileMapIndex+roomNumberTilesX]!=tilesToCheck[i]){

					 
										}else{

												downDown = true;            
										}
										///not every Tile, but the ones to have edges "up"
									if(where=="lower-up"){

										if(mapOverDraw[tileMapIndex+roomNumberTilesX]!=tilesToCheck[i]&&mapOverDraw[tileMapIndex+roomNumberTilesX-1]!=tilesToCheck[i]){

					 
										}else{
												downLeft = true;            
										}

										if(mapOverDraw[tileMapIndex+roomNumberTilesX]!=tilesToCheck[i]&&mapOverDraw[tileMapIndex+roomNumberTilesX+1]!=tilesToCheck[i]){

					 
										}else{
												downRight = true;            
										}





									}



										if(mapOverDraw[tileMapIndex-1]!=tilesToCheck[i]&&mapOverDraw[tileMapIndex+roomNumberTilesX-1]!=tilesToCheck[i]){
					 
										}else{
											leftLeft=true;
					   
										}

										if(mapOverDraw[tileMapIndex+1]!=tilesToCheck[i]&&mapOverDraw[tileMapIndex+roomNumberTilesX+1]!=tilesToCheck[i]){
					 
										}else{


											rightRight=true;                          
										}
										
									}//for tilesToCheck


									/// here it has to still check which ones againt one another (can't do both corner and flat.....as its doing now)

									if(!upperLeft){
										if(where!="lower-up"&&where!="lower"){
											z.drawImage(edges, 80,y, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);   
										} 
										
									}

									if(!upperRight){
										overPlayer();
										if(where!="lower-up"&&where!="lower"){
											z.drawImage(edges, 120, y, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);  
										}
										
									}

									if(!cornerLeft){
										if(where!="lower-up"){
											z.drawImage(edges, 0,y, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);   
										} 
										/// remember it's doing 1 half of a Tile each. So forgetting this will leave the corner tiles without this other edge right below
										if(where!="lower"&&where!="up"){
											z.drawImage(edges, 120, y, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight); 
										}
									}



									if(!cornerRight){
										overPlayer();
										if(where!="lower-up"){
											z.drawImage(edges, 40, y, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);  
										}
										
										if(where!="lower"&&where!="up"){
											z.drawImage(edges, 80, y, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);  
										}
									}

									if(!downDown){
										if(where!="upper-door"){
										z.drawImage(edges, 160, y, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);  
										}
									}


									if(where=="lower-up"){
										if(!downLeft){
											z.drawImage(edges, 240, y, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);  
												
										}

										if(!downRight){
											z.drawImage(edges, 280, y, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);  
												
										}


									}

									if(where=="lower"){    

										if(!leftLeft){  ///    ||mapOverDraw[tileMapIndex-1]==214  >>> FORCE EDGES ON few exceptions
														////    HAVE a defined SET of numbers   ---> as Exceptions

											if(mapOverDraw[tileMapIndex+1].toString().substring(0,1)!=4){
												z.drawImage(edges, 240, y, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);  
											} 
										}

										if(!rightRight){

											/// set some parameters so this doesn't conflict with the rest
											if(mapOverDraw[tileMapIndex+1].toString().substring(0,1)!=4){

												z.drawImage(edges, 280, y, 40, 40, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);  

											}
										   
												
										}


									}


								}/// addEdges!





//////   for OVER ROOF do something similar.... array of what tiles are roof >> then if tile==1 check for this out roofs and add border on self..

// if tile = 7||4  check for the inside roofs and repeat//


/// also on edges  DOWN vs UP... you are missing the side connectors... so like 4 more if/else situations..
///////////                                           meaning:  check also left-left/up    &&   right-right/up


//but the GREAT basis has been laid down..







					}   ///   if(mapOverDraw[tileMapIndex]==defaultTiles[j].t){

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
		doorOpening[memberII].timer=50;
		doorOpening[memberII].isOpen="closed";

		doorOpeningExists=false;

		console.log("seocond+ "+id);///now thats right

	}else{
		console.log("first "+id);
		doorOpening.push({id:id, animC:0, animX:0, timer:timer, closeDone:false, isOpen:"closed"}); 
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

	player1.direction="stop! rebel scum";

	// this feels a lot better>>  watch out though, sometimes you have to press direction again to go back

}/// doorOpen





var doorClosingExists=false;
var memberI;
var notThisDoor=false;

function doorClose(id, animC, animX){

	notThisDoor=false;

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
		
			memberI=doorOpening[i].id;

			/// also only doing it first doorClose........
			console.log("dddddddddddddddddddddddoor Closing "+ doorOpening[i].id);
		}
	
	}	

	for(var i=0; i <doorClosing.length; i++){
		if(doorClosing[i].id==memberI){
			console.log("RER rrrrrrrrrrrrrrrrrrrrrERERER  "+ doorClosing[i].id);
			doorClosing[i].animC=animC;
			doorClosing[i].animX=animX;			
			doorClosing[i].isOpen="open";
			notThisDoor=true;
		}
	}

	if(!notThisDoor){
		doorClosing.push({id:id, animC:animC, animX:animX, isOpen:"open"});
	}
}/// doorClose








///////   |||||\\\\  |||||\\\\  ||\ |\ /\         ////////    //  //
//   //   |||||\\\\  |||||\\\\  |||||\\\\         ///    //   //  //
//////    |||||\\\\  |||||\\\\  |||||\\\\         //          //////
///  //   |||||\\\\  |||||\\\\  |||/  \\\         //          //  //
///  ///  |||||\\\\  |||||\\\\  ||/    \\         ///    //   //  //
												  ////////

function changeRoom(whatRoom, whatDoorId, newShiftX, newShiftY){ ///////////////////   WHAT AREA!

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

		paused=true;
		pauseType="transitionBlack";


		roomChangeLoop();
}




/// This is a bit messed up, it works but only if both rooms keep the same amount of Y tiles (or X I supposed, when X is implemented)...   but thats fine >>> the same room[tileMap] can be used for many different "mini" rooms

var daVar=0;  




function roomChangeLoop() {
			  
	

	pausedRoomChangeLoop=true;    

	if (paused) {

		// <3 <6 < 9   --> will depend on game/computer SPEED


		///// from roomChangeLoop() have roomChangeLoop(ARGUMENT) to determine if its a "door-pause" or a "game||menu-pause"
		if(pauseType=="normalFlash"){

			//// this is way obsolete... thats not the way, changing area, but simply pointing to the Sprite directly
				if(pauseCount<3){
					pauseCount+=1;
					currentArea="areaFuck";
					roomDraw(currentRoom, currentArea, 0, tileDiameter, 0, 0, "not-first", currentLevel);
				   
					requestAnimFrame(roomChangeLoop);
				}else if(pauseCount>=3&&pauseCount<6){
					pauseCount+=1;
					currentArea="areaFuck2";
					roomDraw(currentRoom, currentArea, 0, tileDiameter, 0, 0, "not-first", currentLevel);
					requestAnimFrame(roomChangeLoop);
				}else if(pauseCount>=6&&pauseCount<9){
					pauseCount+=1;
					currentArea="areaFuck3";
					roomDraw(currentRoom, currentArea, 0, tileDiameter, 0, 0, "not-first", currentLevel);
					requestAnimFrame(roomChangeLoop);

				}else{
		   
					paused=false;
					isPlaying=true;
					pauseCount=0;
					currentArea="default";

					obstacles = [];
					areas = [];

					clearCtx(ctxBg);
					clearCtx(ctxOverlay);

					//////HERE LOAD BLACK SCREEN... MAKE VAR=true, and when back in the loop, at the beginning theres an if/else
										// asking for this VAR  >> if true >>> do this animation backwards, from black to screen

					roomDraw(nextRoom, currentArea, 0, tileDiameter, 0, 0, "first", currentLevel);

					currentRoom=nextRoom;
					///AREA?

					// whatPlayer?
					for (var i = 0; i < players.length; i++) {
						if(players[i] == 1){
							player1.drawX=100;/////////////////////////    depends on room >>> REDRAW  OUTSIDE FUNCTION
							player1.drawY=300;
						}else{
							// player2.drawX=100;
							// player2.drawY=300;
						}
					}  



			   isPlaying = true;
			}   





			///                     ///      
////////////////        ////////////////           
/////////////////       /////////////////          
///////////////         ///////////////                 
		   ///                     ///                




		}else if(pauseType=="transitionBlack"){////////////////////////////////////////////////////////////////////////////////////

			clearCtx(ctxPlayer);



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
							roomToMap = whatRoomMap("room1map");
						}else if(nextRoom=="room-2"){
							roomToMap = whatRoomMap("room2map");;
						}

						for(var e = 0; e<roomToMap.length; e++){ /////////  room2map >>> 1map, 3 map >>> SEGUN DONDE VAYA
							if(roomToMap[e]==doorID){
								//console.log("row kinda like  .."+((e/roomNumberTilesX)*tileDiameter));
								//console.log("WHERE "+(e/roomNumberTilesX)*tileDiameter);
								if((e/roomNumberTilesY)*tileDiameter>window.outerHeight/2){

									//console.log("DOOR X::Y "+ areas[k].drawX + " :: " + areas[k].drawY);
									//  keep teleporting pads away from extreme edges!! (so no white borders when re-centering)

									///daVar=-200; /// >>>>>> seems to work better than one below.. jsut like that
									daVar = Math.round((window.outerHeight/1.5)-(e/roomNumberTilesY)*tileDiameter)-menuHeight;
									//// 2.5 seems to compromise 3 & 2 >> 3 still drags the screen beynd player at one point, but 2 shifts player a bit off the door (at another...)...
									//daVar = (window.outerHeight/2)-(e/roomNumberTilesY)*tileDiameter;
									////      Its fine... its just about keeping the items in place...
	/////// NEED TO TAKE VARIATION IN shiftY/X into Account (move+drag or no drag screen before/after  changing room)
								}else{
								   
									daVar =0;   
								}

							}/// if room-N-map == doorID

						}///for room-N-map

						//console.log("DVAR "+daVar);
						firstCol=true;// so gets only first
					}
						
				}/// if areas == doorID

			}///for areas


			 
			 if(pauseCount<(window.innerHeight/2)){   ///<(canvasHeight/2)
				ctxOverOverlay.fillStyle = "#000000";
				ctxOverOverlay.fillRect(0, pauseCount-9, canvasWidth-50, 40);   

				
				pauseCount+=40;
				requestAnimFrame(roomChangeLoop);

			}else{

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


				
				roomDraw(nextRoom, currentArea, 0, tileDiameter, 0,0-shiftY+daVar,"first", currentLevel); 

				
										  ///  SO WHATEVER THE NUMBER HERE >> daVar <<< depending on how far from top or bottom is the door
										  ///   when checking its player1.drawY=areas[k].row
										  ////    >>>> how tall/wide is the screen? 
										  //            then we will know how much under it is
										 ////        and so we set this daVAR automatically from that offset

				currentRoom=nextRoom;
				
				var lastShiftY;
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
						//console.log(lastShiftY);
						//console.log(shiftY);
						lastShiftY =shiftY;


						blockedDoorIndex.push(k);
						areas[k].isBlocked="blocked"
						
						if(!colRow){
							shiftY=daVar;////////////////////     REPLICATED HERE  >>> daVAR
						}
					//           HAVE TO COMPENSATE FOR IT!!    >>> when roomChange to SAME ROOM
	   
					}
	
				}
			  /// gotta keep track of all the shifts in whichever room


				for(var k =0; k<items.length; k++){
					  ///// OJO WHAT ROOM!! currentRoom

				  ///ok, so that shiftY is being reset to zero, because of something to do with FirstDraw.. or whatever
				  // point is, need to remember it before it goes to zero, to minus it to the items...

				  if(!firsty){
						items[k].drawY -=Math.abs(daVar);
						items[k].centerY -=Math.abs(daVar);  
							firsty=true;
				  }else{
					items[k].drawY -=Math.abs(daVar)-Math.abs(memberShiftY);
						items[k].centerY -=Math.abs(daVar)-Math.abs(memberShiftY); 
				  }
							
									 
				}  
				////   ALSO HAVE TO LOOP ALL ITEMS AND ADJUST TOO   

				///   por ahi va..... ahora tengo que ajustar tambien  
				///  ....   bien, igual que el player, tiene que ajustar nomas..


				pausedRoomChangeLoop=false;

				
				
			}/// ELSE


		   isPlaying = true;

		   clearCtx(ctxMenuOverOver);	/// gotta clear it, activates with the Pause
		}/// transition black /////////////////////////////////////////////////////////////////////////////////////////

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
	
	this.width = 82; /// this only needs to be 64 (real tight), its 82 now because the Psprite is not using its whole size
	this.height = 82; /// this only needs to be 64 (real tight), its 82 now because the sprite is not using its whole size
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

					bulletsFired.push( new activeBullet(id, 0,0,this.drawX,this.drawY+10, 10, 10, this.weaponSelected, this.playerType, this.shootingDirection, true));
						///// sprite needs to be smaller

						id++;
				}
				
			}
		}
		
		// if(opening){
		// 	if(latestKeys[0]==39||keysPressed[0]==39){
		// 		player1.direction="right";
		// 	}else if(latestKeys[0]==37||keysPressed[0]==37){
		// 		player1.direction="left";
		// 	}else if(latestKeys[0]==38||keysPressed[0]==38){
		// 		player1.direction="up";
		// 	}else if(latestKeys[0]==40||keysPressed[0]==40){
		// 		player1.direction="down";
		// 	}
		// }

////  DEPENDING ON SELECT WHAT MENU-ITEM PLAYER IS USING  >>>>  1 button for gun, another for life item
///  while other item spermanently do/change something in the game/player  (like activating this dash ability up here)

	if(releaseCounter){
		releaseCounterCount++;
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

	ctxPlayer.drawImage(imgPlayer, this.srcX, this.srcY, 35, 50, this.drawX, this.drawY, this.width, this.height);
/////////////////////////////            OK NOW DRAW SPRITE PROPERLY AND THE ANIMATION RIGHT WHEN SHOOTING
////////////
//////////                      moving changes srcX, Y... so should shooting (change upperSrcX, Y)
														  /// upperXrcX + + + as in the if(this.shooting) below

			///////////////   Y AXIS should have a + VAR >>>  + 350..==> all weapons.. if got suit, or + 0  
		///// (at that point all weapon cicles are repeated, but wearing this mega-cool suit)
		  /////
			//////////////////  try same with certain items, such as the goggles or the belt... can be seen


	if(this.shooting){      ///// changing upperSrc Anim according to shooting
		ctxPlayer.drawImage(imgPlayer, this.upperSrcX, this.upperSrcY, 35, 50, this.drawX, this.drawY, this.width, this.height);
	}else{                     //// shifted sprite (srcX, Y) for upperBody parts
		ctxPlayer.drawImage(imgPlayer, this.srcX+840, this.srcY, 35, 50, this.drawX, this.drawY, this.width, this.height);                 //// take off +3, that just to show its been drawn on top
							////            +3 actually + length of sprite (legs/upperbody)
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
				   this.direction=slowDownDirection;     
				   this.speed-=2;

				   //onsole.log(player1.direction)   

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

		//// THERE YOU GO!  this fixes that mess described below, so the shift tracking only happens when the screen has shifted too... (which is what pushes the player in the first place...)
		if(daVar!=0){
			playerShiftY = parseInt(playerFirstY)-parseInt(newDrawY);
			//console.log(playerShiftY);
			/// OK, so  next roomChange>> if this + or -, minus it or add it to drawY..
			////     but it's all mixed up with daVar too.. sometimes doesn't need to calculate this, if didn't cross the middle of the canvas or something.... needs a profound revision and understanding to FIX...(or to make bulletproof smooth) >> elements are shiftY >> for obstacles, daVar >> center around player..
			/// or use this calculation to replace that whole daVar/shiftY mess..... (cause I think its this kinda shift what shifts gets the obstacles wrong)

			//console.log(newDrawY);
		}

		
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

		   
		     /// if player's got Right KEY for THIS DOOR >> obstacles[obstacleIndex].key#
/// add parameter on obstacles >>> "LOCKED" - "notLOCKED"  && "KEY#"  <<< if locked, only open when carrying that key
										/////////////////   or when broken, if breakable

								///            id   |   timer
		    doorOpen(obstacles[obstacleIndex].doorID, obstacles[obstacleIndex].timeToClose);
		    										
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
//|\\//////     ///////   ||||||||||  //|||  ///
//|\\//////    ///    |  ||||| ||||  //     ////
//|\//////    ///     | |||||||||| ///|||  ///// 
////////     ///      ||      ||  //      //////
////        ///       |      ||  ||||||| ///////
///
///          
				   
				   

////   IF AREA   DOOR-to-other-room >>>>>>>>>>>>>>>>  changeRoom(CORRESPONDING ROOM TO THIS DOOR)

Player.prototype.checkArea = function (){


	function doorTo(areasIndex){

//// ROOM TO !!!!
		if(areas[areasIndex].isDoor=="door"){

			if(areas[areasIndex].isBlocked!="blocked"){

				//console.log("door "+areasIndex);
				//console.log("ESTE?? "+ areas[i].roomTo);
				//console.log("MOV " +shiftY);
				changeRoom(areas[i].roomTo, areas[i].doorTO, shiftX, shiftY);/////  room-2 >> determined by door"To" (9[2]11), then ID (92[11])
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
	}


	function transitionArea(){
		if(currentArea=="transition"&&currentLevel!=2){
			
			currentLevel=2;
			//alert("miercale!! CARAMBA");
			roomDraw(currentRoom, currentArea, 0, tileDiameter, 0, 0, "first", currentLevel);

		}
		else if(currentArea!="transition"&&currentLevel!=1){
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

				///Door to other room (& blocking mechanism)
				doorTo(i);
				//console.log(areas[i].roomTo);

				if(areas[i].n!="default"&&areas[i].n!="transition"){
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

				///Door to other room (& blocking mechanism)
				doorTo(i);

				if(areas[i].n!="default"&&areas[i].n!="transition"){
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
					///Door to other room (& blocking mechanism)
					doorTo(i);

					if(areas[i].n!="default"&&areas[i].n!="transition"){
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

					///Door to other room (& blocking mechanism)
					doorTo(i);

				if(areas[i].n!="default"&&areas[i].n!="transition"){
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

					///Door to other room (& blocking mechanism)
					doorTo(i);

				if(areas[i].n!="default"&&areas[i].n!="transition"){
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

					///Door to other room (& blocking mechanism)
					doorTo(i);

				if(areas[i].n!="default"&&areas[i].n!="transition"){
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

					///Door to other room (& blocking mechanism)
					doorTo(i);

				if(areas[i].n!="default"&&areas[i].n!="transition"){
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

					///Door to other room (& blocking mechanism)
					doorTo(i);

				if(areas[i].n!="default"&&areas[i].n!="transition"){
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

	}// for Areas
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
	tileIndexY=0

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
