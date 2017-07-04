window.addEventListener("load", initGame, false);


var canvasBg = document.getElementById("canvasBg"),
    ctxBg = canvasBg.getContext("2d"),
    canvasPlayer = document.getElementById("canvasPlayer"),
    ctxPlayer = canvasPlayer.getContext("2d"),
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
    canvasMenuOverOver = document.getElementById("canvasMenuOver"),
    ctxMenuOverOver = canvasMenuOverOver.getContext("2d"),
    canvasOverOverlay = document.getElementById("canvasOverOverlay"),
    ctxOverOverlay = canvasOverOverlay.getContext("2d");

///// esto aca arriba HA de ser reducido


var mapObsL1;

var mapObsL2;

var canvasWidth = 0;
var canvasHeight = 0;


var shiftX=0;
var shiftY=0;


var keysPressed = []; 
var keyDown={isDown:false, whatKey:null};



var imgPlayer = new Image();
    imgPlayer.src = "images/hero.png";    //////   HERO.PNG


var itemSprite = new Image();
    itemSprite.src = "images/sprite2.png";
    
var imgSpriteTile0 = new Image();
    imgSpriteTile0.src = "images/map-tiles.png";

var menuSprite = new Image();
    menuSprite.src = "images/sprite3.png";


var tileDiameter; 

if(window.innerWidth>1000){
    tileDiameter = 46;  // window.innerWidth/40; || 30;     >>>> cambiar segun tamanho de pantalla
}else{
    tileDiameter = 40; 
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

window.cancelAnimFrame = (function () {
    return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || function (callback) {
        window.clearTimeout(callback);
    };
})();

var paused = false;

var pauseType;
var pausedRoomChangeLoop=false;
var pauseCount= 0;



var players=[];

var newPlayerCreation = new Array();
///// what controller triggered the playerCreation
newPlayerCreation[0] = "player1"; 
///////  what value was in what that controller pressed
newPlayerCreation[1] = "WASCHO";

players.push(newPlayerCreation);

var items = [];

var itemSelectPressed=false;
var itemSelectPressedCounter=0;


var menuCursor="nada";

var menuTrack=0;
var itemRow=0;
var gunRow=0;

var menuAnimCount=0;
 




//should be in Funtion => GAME
function initGame() {


    /////  for stupid display types (ex, when the hegth's bigger than the width) use:
    /// window.innerWidth; >>>> window.innerHeight / 6  o lo que sea   <<<   matiene aspect ratio

    //// better to keep display at hard pixels and change a few times depending ongeneral screen-size, maintaining aspect ratio and adding black
///////          this mainly because canvas goes fckng slow when on bigger-than screen, and the speed variation at diff sizes is insane 
    //////                                                                                                  (still need to adjust to it)

    canvasBg.width =1000;
    canvasBg.height = 600;
    canvasBgTop.width =1000;
    canvasBgTop.height = 600;
    canvasEntities.width =1000;
    canvasEntities.height = 600;
    canvasPlayer.width =1000;
    canvasPlayer.height = 600;
    canvasOverlay.width =1000;
    canvasOverlay.height = 600;
    canvasOverOverlay.width =1000;
    canvasOverOverlay.height = 600;
    canvasPause.width =1000;
    canvasPause.height = 600;
    canvasMenu.width =1000;
    canvasMenu.height = 600;
    canvasMenuOver.width =1000;
    canvasMenuOver.height = 600;
    canvasMenuOverOver.width =1000;
    canvasMenuOverOver.height = 600;


    if(canvasBg.width<window.innerWidth){
        document.getElementById("container").style.margin= "0 "+(window.innerWidth-canvasBg.width)/2+"px";
    }else{
        document.getElementById("container").style.margin= "0";
    }
    // CSS margin won't work





    document.addEventListener("keydown", function(e) {

        checkKey(e, true); 

         if(checkKey(e, true, true)==37||checkKey(e, true, true)==38||checkKey(e, true, true)==39||checkKey(e, true, true)==40){
            player1.speed=2;  /////////    8 =>   currentSpeed <<<   should vary throughout the game
        }

    }, false);



    document.addEventListener("keyup", function(e) {

        keysPressed = [];
        keyDown.isDown=false; 

        //player1.direction = "nowhere"; ///  ALGO ME TIENE QUE DETENER, NO EL LEVANTAR UNA TECLA, si no no puedo correr y disparar al mismo tiempo
        if(checkKey(e, true, true)==37||checkKey(e, true, true)==38||checkKey(e, true, true)==39||checkKey(e, true, true)==40){

        ///ONLY IF ARROWS!!!
        friction(); /// this should stop player when key up
        }

        if(checkKey(e, true, true)==50){

            player1.shooting=false;
        }


    },false);



    begin();

}





//diff keys for diff players
function checkKey(e, value, checkArrows) {


    if(checkArrows){
        return e.keyCode;
    }else{

    keyDown.isDown=true;
    // e = e || event; 
    keysPressed[e.keyCode] = e.type;


    if (keysPressed[38]) { 
        
        //player1 should change to "Da player"
        player1.direction = "up";
        player1.facing = "up";

        if(paused){
            
            menuCursor = "up";

            requestAnimFrame(pause);
        }                 
    }


    if (keysPressed[40]) {  /////////////////////////////// YES, WORKS        
        player1.direction = "down";  /// to know it can do another one.. 
        player1.facing = "down";


        if(paused){
           
            menuCursor = "down";



       
    
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
            
            if(typeof player1.guns[1]!="undefined"&&gunRow!=player1.guns.length-2){
                //alert(menuRow);
                gunRow+=1;
                //console.log("row"+menuRow);
                menuGunAlreadyPainted=false;

                  
                
            }else if(gunRow==player1.guns.length-2){

                gunRow=0;
                menuGunAlreadyPainted=false;
                
            }
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
        
        ///////////////////////////////////
        ////////////////                            DONT LET THE CURSOR THING HAPPEN, IF I HAVENT GOT THE ARRAYS!@

        player1.direction = "right";  /// to know it can do another one..
        player1.facing = "right";


        if(paused){
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
        player1.direction = "left";  /// to know it can do another one..   
        player1.facing = "left";

        if(paused){
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
    }
    if (keysPressed[40]&&keysPressed[39]) {  /////////////////////////////// YES, WORKS
        player1.direction = "right-down";  /// to know it can do another one..      
           
    }
    if (keysPressed[40]&&keysPressed[37]) {  /////////////////////////////// YES, WORKS
        player1.direction = "left-down";  /// to know it can do another one..  

    }



//// probando, check, check, 1, 2, lifebar
    if (keysPressed[71]) {  /////////////////////////////// YES, WORKS
        
        player1.life-=3;
        if(player1.life<=0){
            alert("MUERTE");
        }
    }




    if (keysPressed[32]) {  /////////////////////////////// YES, WORKS
        player1.direction="nada";
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

        keyDown.whatKey=49;

       
        //if(inDoorCrash.crash==true){

        //console.log(obstacles.length);
    if(inDoorCrash.crash==true){
        //console.log(inDoorCrash.id);
        doorOpen(inDoorCrash.id);
    }
/// now loop through all obstacles { loop through all doors >>>  if(door.id==inDoorCrash.id){ if(door.leftX == obstacle.leftX){ delete both}} }


    }


    if(keysPressed[50]){
         player1.shooting=true;
    }






    dirMemory.push(player1.direction);

    //MAKE VAR TO REMEMBER LAST DIRECTION 

    /// ROOM of ice >>> pushes you in your last direction >> recursively, a bit less everytime until fade << momentum

    e.preventDefault();

}

}//END check spacebar


 function selecto(){


    ////  MAKE SO WHEN A GUNTYPE FIRSTPICK >> GOES AND SELECT IT AND DRAWS IT IN MENU AS CURRENT


    //console.log("????"+menuTrack);


        if(menuTrack==0){

            //if not true already..
            
                menuH_items.isSelected=true;


                ///loop row =>> loop player1.items...
                for(var i=0; i<player1.items.length-1; i++){
                    if(itemRow==i){
                        player1.itemSelected=i+1;
                        menuH_items.rowSelec=i;
                       
                    }
                }

            menuH_items.draw();

        /// ELSE if menuTrack ==1 .... gunSelectPressed
        }else if(menuTrack==1){

            /// IF menuTrack==0

            //if not true already..
            
                menuH_guns.isSelected=true;

                for(var i=0; i<player1.guns.length-1; i++){
                    if(gunRow==i){
                        player1.gunSelected=player1.guns[i+1].gunType;
                        menuH_guns.rowSelec=i;
                    }
                }


           
            //alert("yapo");
            /// ELSE if menuTrack ==1 .... gunSelectPressed
            menuH_guns.draw();
        }else if(menuTrack==2){

        }
       //alert(menuH_items.rowSelec);
    }
function clearCtx(ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function randomRange (min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
}


function friction(){

        player1.speed=0;
        player1.direction="nada";
        //console.log(player1.speed);
        // if(player1.speed>0){
        //     //decrease speed until fully stopped
        //     friction();
        // }
        // no funciona, hay que ponerlo en player update (if not keyDown), pero las paredes se van a la mierda
}



///array para loopear >>> si number = id >> ese cambiar a lo que tiene que ser
var c;
var d;
var e;


function begin() {
    ///


    currentRoom= "room-1";
    currentArea="default";
    currentLevel=1;

    roomDraw(currentRoom, currentArea, 0, tileDiameter, 0, 0, "first", currentLevel);


    isPlaying = true;
    requestAnimFrame(loop);

    
    for (var i = 0; i < players.length; i++) {
      
        if(players[i][0]=="player1"){
            player1 = new Player(players[i][1]);

        }

    }   
    //CAN BE DONE PROGRAMATICALLY TOO

  //player1 = new Player(); /////////////  if (hitPlayer){  hitPlayer||player1 =  new Player(player1)
    // doors.push(
    //     new Door(325, 325, 25, 25, "inDoor")
    // );


    //should be in room  object?
    c=5;
    d=4;
    e=3;


    ///(srcX, y, drawX, yy, w, h, item, gun, ammo, life, selec,caught, branch)


    items.push( new Item(570,605,  150,tileDiameter*3, tileDiameter, tileDiameter,0, null, null, false, false, null, "room-1"), new Item(580,605, 200,200, tileDiameter, tileDiameter,2,null, null, false, false, null, "room-1"), new Item(600,605, 250,200, tileDiameter, tileDiameter,1,null, null, false, false, null, "room-2"), new Item(600,605, 330,360, tileDiameter, tileDiameter,1,null, null, false, false, null, "room-1"), new Item(600,605, 350,200, tileDiameter, tileDiameter,1,null, null, false, false, null, "room-1") );

    items.push( new Item(570,605,  150,250, tileDiameter, tileDiameter,null, 0, null, false, false, null, "room-1"), new Item(570,605, 200,250, tileDiameter, tileDiameter,null, 0, null, false, false, null, "room-1"), new Item(600,605, 250,250, tileDiameter, tileDiameter, null, 1, null, false, false, null, "room-1"));


    items.push( new Item(660,605,  150,150, tileDiameter, tileDiameter,null, null, 1, false, false, null, "room-2"), new Item(660,605,  180,150, tileDiameter, tileDiameter,null, null, 1, false, false, null, "room-2"));


menuH_items = new menuH(itemSprite, 700, 600, 30, 30, 200, 100, "item", false);
menuH_guns = new menuH(itemSprite, 700, 600, 30, 30, 230, 100, "gun", false);

}



//UPDATE everything
function update() {

    clearCtx(ctxBg);
    clearCtx(ctxPlayer);
    clearCtx(ctxOverlay);
    clearCtx(ctxOverOverlay);
    clearCtx(ctxEntities);

    //DONDE SEA QUE HALLA player1 >>> CAMBIAR POR 
    //for (var i = 0; i < players.length; i++) {
      
     //   if(players[i][0 == 1
    for (var i = 0; i < players.length; i++) {
        if(players[i][0] == "player1"){
            player1.update();
        }else{
            //player2.update();
        }
    }
   // player1.update();
    /// if ==2                            (if only) not exclusive
    /// player2.update()
    

//////////////////////////////////////////      ANIMATION TILES !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//////////////////////////////////////////      ANIMATION TILES !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//////////////////////////////////////////      ANIMATION TILES !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//////////////////////////////////////////      ANIMATION TILES !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    ///

    // if(!inArea){
    //     animScroll+=35;

    //     if(animScroll>=105){
    //         animScroll=0;
    //     }
    // }

     //console.log(player1.playerType);

    ////  Sample of being pushed unvoluntarily and still having walls stop you, yay! (enemy power weapon) >>>  for STUN FX simply block key-listening
        // if(player1.moving){
        //    player1.drawX +=player1.speed;
        //    player1.direction ="right";
        // }

    for(var i=0; i< items.length; i++){
        items[i].update();
    }
    roomDraw(currentRoom, currentArea, 0, tileDiameter, shiftX, shiftY, "not-first");

}



// & Re-DRAW
function draw() {
    for (var i = 0; i < players.length; i++) {
        if(players[i][0] == "player1"){
            player1.draw();
        }else{
            //player2.draw();
        }
    }
    for(var i=0; i< items.length; i++){
        items[i].draw();
    }
 

}



//master controls
function loop() {
    if (isPlaying) {
        update();
        draw();
        requestAnimFrame(loop);
    }

}



function roomChangeLoop() {
        
    pausedRoomChangeLoop=true;    

    if (paused) {


        // <3 <6 < 9   --> will depend on game/computer SPEED

        /// ONE OR THE OTHER, not together >>> colours vs drop black
        /////
        ///// from roomChangeLoop() have roomChangeLoop(ARGUMENT) to determine if its a "door-pause" or a "game||menu-pause"

        if(pauseType=="normalFlash"){

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
                        if(players[i][0] == "player1"){
                            player1.drawX=100;/////////////////////////    depends on room >>> REDRAW  OUTSIDE FUNCTION
                            player1.drawY=300;
                        }else{
                            // player2.drawX=100;
                            // player2.drawY=300;
                        }
                    }  



                requestAnimFrame(loop);
            }   

        }else if(pauseType=="transitionBlack"){

             clearCtx(ctxPlayer);
             //alert(window.innerHeight);
             if(pauseCount<(window.innerHeight/2)){   ///<(canvasHeight/2)
                ctxOverOverlay.fillStyle = "#000000";
                ctxOverOverlay.fillRect(0, pauseCount-9, canvasWidth-50, 40);   

                
                
                pauseCount+=40;
                requestAnimFrame(roomChangeLoop);

            }else{

                //clearCtx(ctxMenu);

                paused=false;
                isPlaying=true;
                pauseCount=0;
                //currentArea="default";

                obstacles = [];
                areas = [];
                doors = [];

                clearCtx(ctxBg);
                clearCtx(ctxOverlay);
                //alert(nextRoom); 
                roomDraw(nextRoom, currentArea, 0, tileDiameter, 0, 0, "first", currentLevel);

                currentRoom=nextRoom;
                currentArea="uno";  ////// >>>>>>>>>>>>>>>>>>>>  DEPENDS ON WHERE NEXT ROOM IS


        ///where to reDrawPlayer?
                for (var k = 0; k < areas.length; k++) {
                    
                        //alert(doorID);
                        if(areas[k].doorID==doorID){
                                                 ///////////   ==  where the door is going to... areas[k].whereTO

                                ///set player position when new room is Drawn
                                player1.drawX=areas[k].leftX-10;  /// player1.widht/2 height.. does quite work
                                player1.drawY=areas[k].topY-10;

                                blockedDoorIndex.push(k);
                                areas[k].isBlocked="blocked"
                                //alert(blockedDoorIndex[0]);  
                        }
    
                }

                pausedRoomChangeLoop=false;
                requestAnimationFrame(loop);
                
            }/// ELSe

        }
    }
}
        



function changeRoom(whatRoom, whatDoorId, newShiftX, newShiftY){ ///////////////////   WHAT AREA!

        clearCtx(ctxPlayer);

        //block buttons so can't pause and go through door at the same time!!!!!!!!!!!!!
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        isPlaying = false;

        //////////// this 2-4 doen here will dpend on what door(to other room, diff from obstacle door -> Array) you went through
        nextRoom =whatRoom;
        doorID=whatDoorId;

       // currentArea="areaFuck";
        //roomDraw(currentRoom, currentArea, 0, 25, 0, 0);

        /// Set shiftX, Y where it was on last stage
        //alert(newShiftY);

        //// only do this  IF player1.drawY > window.innerWidth/2){}
        shiftX=newShiftX;
        shitfY=newShiftY;
        //////////   


        paused=true;
        pauseType="transitionBlack";
        roomChangeLoop();
}



function doorOpen(id){
   
   inDoorCrash.crash=false;
   //alert(inDoorCrash.id);

    player1.direction="a donde ira";

        for(var i=0; i < obstacles.length; i++){

            if(inDoorCrash.id==5&&obstacles[i].doorID==5){
                c=0;
                //alert(obstacles[i].isDoor);
                obstacles.splice(i,1);         ///////   INSTEAD OF THIS, OBSTACLES WILL HAVE IDS
                //alert(obstacles[i].isDoor);
                
            }else if(inDoorCrash.id==4&&obstacles[i].doorID==4){         ////////////////// rather, jut keep track using var in doorRile
                d=2; /// area
                obstacles.splice(i,1);

   ///// now how do i remember and reinsert??   Maybe try with delete. and solving the undefined problem at obstacle-hit-detection
            }
           
        }


    //                 ///// SLICE & REMEMBER IN A DIFF ARRAY

    //                 ///   THEN SPLICE  or DELETE?


}



function pause(){///////parameter which player
    menuH_items.draw();
    menuH_guns.draw();


    if(paused){
        /////////// items are KEPT as their respective types, then each type looped, 
        //                  becoming highlighted when pressing down and keeping track of which one you are at  >> if highlighted 
       //// then when press "A" >> becomes selected

        isPlaying = false;

        //menuAnimCount++;
        //requestAnimFrame(pause);                ///messes up player1.speed (or game speed)

    }else{
        if(!itemSelectPressed){
           // clearCtx(ctxMenuOver);    
        }

        isPlaying = true;
        //cancelAnimFrame(pause);          ///doesn't work? 
        requestAnimFrame(loop);
    }
    //console.log(count);
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





    if(paused){

            if(menuTrack==0){

                        if(player1.items[1]!=null&&player1.items[1]!="undefined"){
                            ctxMenuOver.drawImage(menuSprite, 48, 0, menuH_items.width, menuH_items.height, menuH_items.drawX, menuH_items.drawY, menuH_items.width, menuH_items.height);                                                
                        }
            }else if(menuTrack==1){
                     
                     if(player1.guns[1]!=null&&player1.guns[1]!="undefined"){
              
                        ctxMenuOver.drawImage(menuSprite, 48, 0, menuH_guns.width, menuH_guns.height, menuH_guns.drawX, menuH_guns.drawY, menuH_guns.width, menuH_guns.height);
                    }
     
            }
    }

    if(menuTrack==0){

                    
        if(menuH_items.isSelected&&menuH_items.rowSelec==itemRow){
            ctxMenuOverOver.drawImage(menuSprite, 73, 0, menuH_items.width, menuH_items.height, menuH_items.drawX, menuH_items.drawY, menuH_items.width, menuH_items.height);
        }
                        
        if(menuH_guns.isSelected&&menuH_guns.rowSelec==gunRow){
            ctxMenuOverOver.drawImage(menuSprite, 73, 0, menuH_items.width-10, menuH_items.height, menuH_items.drawX+30, menuH_items.drawY, menuH_items.width, menuH_items.height);
        }


    }else if(menuTrack==1){
                         
        if(menuH_guns.isSelected&&menuH_guns.rowSelec==gunRow){
            ctxMenuOverOver.drawImage(menuSprite, 73, 0, menuH_items.width-10, menuH_items.height, menuH_items.drawX+30, menuH_items.drawY, menuH_items.width, menuH_items.height);
        }

        if(menuH_items.isSelected&&menuH_items.rowSelec==itemRow){
            ctxMenuOverOver.drawImage(menuSprite, 73, 0, menuH_items.width, menuH_items.height, menuH_items.drawX, menuH_items.drawY, menuH_items.width, menuH_items.height);
        }
                
    }
////  if not paused or whatever...SLECTOR (es decir, afuera de esos ifs dentro de la pausa,, independiente de si es pausa o no)


}



//WORLD

function Obstacle(x, y, w, h, type, id) {
    this.drawX = x;
    this.drawY = y;
    this.width = w;
    this.height = h;
    this.leftX = this.drawX;
    this.rightX = this.drawX + this.width;
    this.topY = this.drawY;
    this.bottomY = this.drawY + this.height;

    this.isDoor = type;
    this.doorID = id;
}

////  Area type door?
function Area(x, y, w, h, n, type, id, to, blocked) {
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
    this.doorTO=to;
}

    
var roomStartX= 0;
var roomStartY= 0;
var roomLengthX= 0;
var roomLengthY= 0;



function roomDraw(currentRoom, area, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, firstDraw, level){
    

        if(currentRoom == "room-1"){

            room1(currentRoom, area, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, firstDraw, level);     

        }

        if(currentRoom == "room-2"){

        ////////////   VAR get current room
        ////////       REMEMBER THIS ROOM  >>> CURRENT ROOM = "room-1"

            room2(currentRoom, area, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, firstDraw, level);     

        }

    //limitScreenRight
    obstacles.push(
        new Obstacle(canvasWidth+shiftX, 0+shiftY, tileWidthHeight, canvasHeight)
    );
    //limitScreen L
    obstacles.push(
        new Obstacle(-tileWidthHeight+shiftX, 0+shiftY, tileWidthHeight, canvasHeight)
    );
    //limitScreen T
    obstacles.push(
        new Obstacle(0+shiftX, -tileWidthHeight+shiftY, canvasWidth, tileWidthHeight)
    );
    //limitScreen B
    obstacles.push(
        new Obstacle(0+shiftX, canvasHeight+shiftY, canvasWidth, tileWidthHeight)
    );
}


///////////   PRELOAD IMAGES!!!

function room1(currentRoom, area, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, firstDraw){

    var img;

    //the starter X tile to change in all rows   >> do same for Y 
    var newTileIndexX = tileIndexX;

//////
/////
/////               DIIFERNT  MAPS >>>>>>  mapObsL1   Non-Obstacle(0) - Obstacle(1)  - Transition to second level(3)
/////
////                                       mapObsL2   same as above, when in second level
//                              ______________
//                               basic elements DRAWN >> (like S.metroid x-rays view)
//
//                                 tileMap   DRAWN on top of everything. Other areas roof when outside.
//                                              >>> fake walls>passages, invisible walls, camouflaged areas, doors...



    /////////  SO HERE: areas+doorToRoom inArea,outofArea  &&  obstacles+doorInRoom inArea,outofArea

    //// 1, 2, 3, 4, 5 >> , 6, 7, 8, 9 => default + 3 Areas posibles, antes de weviar con 2 digitos, pero los necesito igual, pa tener mas cosas en el otro mapa


var mapObsL1 =   [1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,1,6,1,1,1,0,0,0,0,0,1,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,8,6,2,2,2,2,4,8,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,9,1,1,2,2,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,9,9,1,2,2,0,0,0,0,0,0,1,1,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,1,5,0,0,0,0,0,1,1,1,0,5,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,5,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,5,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0];


var mapObsL2 =   [1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 1,0,0,0,1,0,0,0,0,0,0,0,1,3,3,3,3,3,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 1,1,1,1,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,1,6,1,1,1,0,0,0,0,0,1,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,8,6,2,2,2,2,4,8,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,9,1,1,2,2,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,9,9,1,2,2,0,0,0,0,0,0,1,1,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,1,5,0,0,0,0,0,1,1,1,0,5,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,5,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,5,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0];

                 ///Same as before, but difference in obstacles when in level 2

                 //   THERE NEEDS TO BE AN IN BETWEEN..>> under player >> for blocks under animation tiles
                                            ////   with transparency to show this tiles behind (on rounded edges)
                                                  /// otherwise the animation effect would be static on this edges

var mapOverDraw =   [1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 1,0,0,0,1,0,0,0,0,0,0,0,0,7,7,7,7,7,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 1,1,1,1,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,1,6,3,3,3,0,0,0,0,0,1,0,0,0,0,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,8,6,2,2,2,2,d,8,0,0,0,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,9,1,1,2,2,0,0,0,0,0,0,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,9,9,1,7,7,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,1,1,1,0,c,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,c,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,c,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0];

                 ////  letters for different doors, as their value will change
                 /// 
                 /////////////   ANIMATIONS: simply move down srcY repeatedly con animCounters (mas de uno para mas realismo, disinto tempo..)

                 /////////////////////////////////////               Y pasarlas por el defaultTiles[i] como "de la mitad hacia el final"
                 /////////////////////////////////////                          de la mitad pa abajo son las coordenadas para los estaticos

                                                                   /////           entonces asi puedo 

    roomNumberTilesY = 27;
    roomNumberTilesX = 41;

    roomLengthY= roomNumberTilesY * tileWidthHeight;
    roomLengthX= roomNumberTilesX * tileWidthHeight;

    canvasWidth = roomLengthX;
    canvasHeight = roomLengthY;



    imgSpriteTile0 = new Image();
    imgSpriteTile0.src = "images/map-tiles.png";

    imgSpriteTile1 = new Image();
    imgSpriteTile1.src = "images/bg.png";    ///map-tiles2


    imgSpriteTile4 = new Image();
    imgSpriteTile4.src = "images/sprite.png";

    imgSpriteTile5 = new Image();
    imgSpriteTile5.src = "images/sprite2.png";

    imgSpriteTile6 = new Image();
    imgSpriteTile6.src = "images/sprite.png";




    imgSpriteTile2 = new Image();
    imgSpriteTile2.src = "images/map-tiles.png";

    imgSpriteTile3 = new Image();
    imgSpriteTile3.src = "images/bg.png";



        if(area=="default"){
            img = imgSpriteTile0;
            //alert(img);
        }else if(area=="uno"){          
            img = imgSpriteTile1;
            //alert(img);
        }else if(area=="transition"){          
            img = imgSpriteTile0;
            //alert(img);
        }else if(area=="areaFuck"){

    ////en vez de cambiar la sprite.. bajar el srcY de todo (tener todo en la MISMA Sprite) y animar saltando con este srxY+nuevoY
// y AreaFuck -> areaPause  (y tal vez sacarlo de area y ponerlo en su propia var..   empezando de if) 

/// es la unica manera, si no como calzamos sprites con areas...

            img = imgSpriteTile4;
        }else if(area=="areaFuck2"){
            img = imgSpriteTile5;
        }else if(area=="areaFuck3"){
            img = imgSpriteTile6;
        }
    //////////////////        IF hitsLEVEL 1 - 2 is like a room change... all obstacles reset
    /////////////////////////
    //////////////////////           itemAdd to roomDraw the dimension of  LEVEL 1 or 2..(whatLevel)

    //////////////////    when hit "transition-area" >>> LEVEL 2  roomDraw (whatLevel ==2) but down here changes the Obstacles
    ///////////////                                                                            whereas the drawings on top remain the same

                                                    

if(firstDraw=="first"){

   //console.log(currentLevel);

   obstacles =[];
   areas = [];

   var whatMap = {};

   if(currentLevel==1){



    tilesDraw(shiftX, shiftY, img, area, {mapObsL1}, roomNumberTilesY, roomNumberTilesX, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, newTileIndexX);

    //////////// ELSE LEVEL 2
    /////////             obstacles = [];
    ///////                               tilesDraw({tileMap LEVEL 2!! } >> with its own set of obstacles...  

        //////                                                            then transition-area again >> goes back (var in, out to keep track)

    }else{
        tilesDrawLevel2(shiftX, shiftY, img, area, {mapObsL2}, roomNumberTilesY, roomNumberTilesX, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, newTileIndexX);
    }

//////////////

///////////////   CLARIFICADO:
//                                   cuando pisa zona 3 (area transision), roomDraw(transition, level2)  [transition se ve igual que default, pero tiene que seguir siendo eso, asi no vuelve a nivel 1..mientras siga en transition]  
//////////////////
//////////                              Level 2 {TileMap}  es exactamente igual, con la diferencia que los blockes que te impedian entrar en level 2 desde abajo, ahora son area3(transition) caminable, y en cambio se corrieron y no te dejan bajar... Lo demas todo igual


}else{


    tilesOverlayDraw(shiftX, shiftY, img, area, {mapOverDraw}, roomNumberTilesY, roomNumberTilesX, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, newTileIndexX, {x:132, y:0}, {x:165, y:0}, {x:165, y:35}, {x:126, y:0}, {x:10, y:0}, {x:155, y:0}, {x:99, y:0}, {x:35, y:70}, {x:132, y:0}, {x:33, y:35}); 
     /////  {x:165, y:35} 3 > 4 doorHAS TO LOOK THE SAME, BUT NOT BE THE SAME (invisible door), so it looks like a door when in area
                                                        /// (or still not if invisible..then just leave as the area block in the drawing Map[]
                                                                           /// SAME WITH in-AREA OBSTACLES
}





}


function room2(currentRoom, area, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, firstDraw){

    var img;

    //the starter X tile to change in all rows   >> do same for Y 
    var newTileIndexX = tileIndexX;


var mapObsL1 =   [1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 1,0,0,0,0,0,0,0,0,8,2,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 1,0,0,0,1,0,0,0,0,2,2,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,0,2,2,2,0,9,0,0,0,0,0,5,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,0,2,2,2,0,9,0,0,0,0,0,5,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,
                 0,0,0,2,2,2,0,0,0,0,0,0,0,5,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,0,2,2,2,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,1,1,2,2,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,1,1,2,2,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,1,1,2,2,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0];

///////////////////  what out, 3s don't work in here (cachar bien pa donde va todo que hace que aca se trunque cuando pisas un 3)
/////////                                                   puede que la funcion pa dibujar el segundo piso no tenga argumento para "level"

var mapOverDraw =   [1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 1,0,0,0,0,0,0,0,0,8,2,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 1,0,0,0,1,0,0,0,0,2,2,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,7,7,0,0,0,0,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 
                 0,0,0,2,2,2,0,9,0,0,0,0,0,c,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,0,2,2,2,0,9,0,0,0,0,0,c,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0, 
                 0,0,0,2,2,2,0,0,0,0,0,0,0,c,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0, 
                 0,0,0,2,2,2,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0, 
                 0,0,1,1,2,2,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0, 
                 0,0,1,1,2,2,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0, 
                 0,0,1,1,2,2,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0];

    roomNumberTilesY = 27;
    roomNumberTilesX = 34;

    roomLengthY= roomNumberTilesY * tileWidthHeight;
    roomLengthX= roomNumberTilesX * tileWidthHeight;

    canvasWidth = roomLengthX;
    canvasHeight = roomLengthY;



    imgSpriteTile0 = new Image();
    imgSpriteTile0.src = "images/map-tiles.png";

    imgSpriteTile1 = new Image();
    imgSpriteTile1.src = "images/bg.png";    ///map-tiles2


    imgSpriteTile4 = new Image();
    imgSpriteTile4.src = "images/sprite.png";

    imgSpriteTile5 = new Image();
    imgSpriteTile5.src = "images/sprite2.png";

    imgSpriteTile6 = new Image();
    imgSpriteTile6.src = "images/sprite.png";




    imgSpriteTile2 = new Image();
    imgSpriteTile2.src = "images/map-tiles.png";

    imgSpriteTile3 = new Image();
    imgSpriteTile3.src = "images/bg.png";

    // imgInDoor = new Image();
    // imgInDoor.src = "images/weaponHighlight.png";

        if(area=="default"){
            img = imgSpriteTile0;
            //alert(img);
        }else if(area=="uno"){          
            img = imgSpriteTile1;
            //alert(img);
        }else if(area=="areaFuck"){
            img = imgSpriteTile4;
        }else if(area=="areaFuck2"){
            img = imgSpriteTile5;
        }else if(area=="areaFuck3"){
            img = imgSpriteTile6;
        }

// var lastS=shiftY;

            ///// ACA HAY QUE VER A QUE DOOR VA EL PLAYER, Y SEGUN ESO PONER SU DRAWX RELATIVO AL DRAX DE LA DOOR A LA QUE VA
    // for(var j =0; j<areas.length; j++){  

    //     if(areas[j].doorID==doorID&&areas[j].drawY<window.innerHeight/2){
 
    //         shiftY=areas[j].drawY-window.innerHeight;
    //         shiftX=areas[j].drawX-window.innerWidth;
    //         player1.drawY=areas[j].drawY+shiftY;
    //         player1.drawX=areas[j].drawX+shiftX;
    //     }
    // }

    //////  NEED TO BRING BOTH PLAYER AND EVERYTHING AROUND THE DOOR LOCATION (door from which player comes.. doorID... etc)

    /////  HOW TO CENTER SCREEN AROUND PLAYER?

/////       O SENCILLAMENTE PONER LAS PUERTAS EN EL MISMO LUGAR (mas simple manera de prevenir este problema de shift y player1.draw)


    if(firstDraw=="first"){
        tilesDraw(shiftX, shiftY, img, area, {mapObsL1}, roomNumberTilesY, roomNumberTilesX, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, newTileIndexX);
        c=5;
        d=4;
        e=3;

    }else{
        tilesOverlayDraw(shiftX, shiftY, img, area, {mapOverDraw}, roomNumberTilesY, roomNumberTilesX, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, newTileIndexX, {x:132, y:0}, {x:165, y:0}, {x:165, y:35}, {x:126, y:0}, {x:10, y:0}, {x:155, y:0}, {x:99, y:0}, {x:35, y:70}, {x:132, y:0}, {x:33, y:35});   /////  {x:165, y:0} HAS TO LOOK THE SAME, BUT NOT BE THE SAME (invisible door), so when different area then will look like a door
                                                                                /// (or still not)
    }


}















function tilesDraw(newShiftX, newShiftY, img, area, {mapObsL1}, roomNumberTilesY, roomNumberTilesX, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, newTileIndexX){


            
        for(var i =0; i<roomNumberTilesY; i++){
            for(var e=0; e<roomNumberTilesX; e++){




                    if(mapObsL1[tileMapIndex]==0){ ///////// area (default)

                        
                        areas.push(
                            new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default")
                        );
                    }else if(mapObsL1[tileMapIndex]==1){ ///////// obstacle out

                        
                        obstacles.push(
                            new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "wall", 0)
                        );
                    }else if(mapObsL1[tileMapIndex]==2){ ///////// area 1

                     
                        areas.push(
                            new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "uno")
                        );
                    }else if(mapObsL1[tileMapIndex]==4){ ///////// door in area
                        areas.push(
                            new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "uno")
                        );
                     
                        obstacles.push(
                            new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", 4)

                 
                        );
                    }else if(mapObsL1[tileMapIndex]==5){ ///////// door out

                     
                        obstacles.push(
                            new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", 5)
                        );
                    }else if(mapObsL1[tileMapIndex]==6){ ///////// obstacle in area

                     
                        obstacles.push(
                            new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "wall", 0)
                        );
                    }else if(mapObsL1[tileMapIndex]==8){ ///////// doorTO in area

                     
                        areas.push(
                            new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "uno", "door", 8, 9)
                        );
                    }else if(mapObsL1[tileMapIndex]==9){ /////////  doorTOout

                     
                        areas.push(
                            new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default", "door", 9, 8)
                            /////////////////////////////           PLUS:  TO WHAT DOOR IN WHAT ROOM
                        );
                    }else if(mapObsL1[tileMapIndex]==3){ /////////  doorTOout

                     
                        areas.push(
                            new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "transition")
                            /////////////////////////////           PLUS:  TO WHAT DOOR IN WHAT ROOM
                        );
                    }


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

} /////   tilesDraw  

/////////   I JUST DON'T KNOW HOW TO TURN {mapObsL1}{mapObsL2} into a variable, to have tilesDraw in only one function
////  whatever I've tried doesn't work

function tilesDrawLevel2(newShiftX, newShiftY, img, area, {mapObsL2}, roomNumberTilesY, roomNumberTilesX, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, newTileIndexX){


            
        for(var i =0; i<roomNumberTilesY; i++){
            for(var e=0; e<roomNumberTilesX; e++){




                    if(mapObsL2[tileMapIndex]==0){ ///////// area (default)

                        
                        areas.push(
                            new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default")
                        );
                    }else if(mapObsL2[tileMapIndex]==1){ ///////// obstacle out

                        
                        obstacles.push(
                            new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "wall", 0)
                        );
                    }else if(mapObsL2[tileMapIndex]==2){ ///////// area 1

                     
                        areas.push(
                            new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "uno")
                        );
                    }else if(mapObsL2[tileMapIndex]==4){ ///////// door in area
                        areas.push(
                            new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "uno")
                        );
                     
                        obstacles.push(
                            new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", 4)

                 
                        );
                    }else if(mapObsL2[tileMapIndex]==5){ ///////// door out

                     
                        obstacles.push(
                            new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "door", 5)
                        );
                    }else if(mapObsL2[tileMapIndex]==6){ ///////// obstacle in area

                     
                        obstacles.push(
                            new Obstacle(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "wall", 0)
                        );
                    }else if(mapObsL2[tileMapIndex]==8){ ///////// doorTO in area

                     
                        areas.push(
                            new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "uno", "door", 8, 9)
                        );
                    }else if(mapObsL2[tileMapIndex]==9){ /////////  doorTOout

                     
                        areas.push(
                            new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "default", "door", 9, 8)
                            /////////////////////////////           PLUS:  TO WHAT DOOR IN WHAT ROOM
                        );
                    }else if(mapObsL2[tileMapIndex]==3){ /////////  doorTOout

                     
                        areas.push(
                            new Area(tileIndexX+shiftX, tileIndexY+shiftY, tileWidthHeight, tileWidthHeight, "transition")
                            /////////////////////////////           PLUS:  TO WHAT DOOR IN WHAT ROOM
                        );
                    }


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

} /////   tilesDraw  L 2







function tilesOverlayDraw(newShiftX, newShiftY, img, area, {mapOverDraw}, roomNumberTilesY, roomNumberTilesX, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, newTileIndexX){


    var defaultTiles = [];


    for(var j=0; j < arguments.length; j++){
        if(j>11){
            ///// 8 are all the arguments before the Sprites 
            defaultTiles.push(arguments[j]);
        }
    }

   // console.log(defaultTiles[0].x);
            
        for(var i =0; i<roomNumberTilesY; i++){
            for(var e=0; e<roomNumberTilesX; e++){

        /// on each IF should call a function which takes ==N as parameter and calculates surroundings (according to that number) for smooth corners
        ///////
        //////////                                                           defaultTiles[j].x +  >>>> depending on result
        
                for(var j=0; j < defaultTiles.length; j++){
                    

                    if(mapOverDraw[tileMapIndex]==j){   /// y menos de la mitad



                        /// 33 is the width of the portion to be drawn from the sprite (actual width in the sprite)
                        ctxBg.drawImage(img, defaultTiles[j].x, defaultTiles[j].y, 33, 33, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);

                            
                    } /////////////////    o mas de la mitad >>>  defaultTiles[j].y  +  animRate1  .. 2 .. 3

                    if(mapOverDraw[tileMapIndex]==2){   /// y menos de la mitad
                        if(!inArea.inIt){
                        /// 33 is the width of the portion to be drawn from the sprite (actual width in the sprite)
                        ctxOverlay.drawImage(img, defaultTiles[2].x, defaultTiles[2].y, 33, 33, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
                        }                            
                    }
                    if(mapOverDraw[tileMapIndex]==4){   /// y menos de la mitad


                        if(!inArea.inIt){
                        /// 33 is the width of the portion to be drawn from the sprite (actual width in the sprite)
                        ctxOverlay.drawImage(img, defaultTiles[4].x, defaultTiles[4].y, 33, 33, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
                        }
                            
                    }                    
                    if(mapOverDraw[tileMapIndex]==8){   /// y menos de la mitad


                        if(!inArea.inIt){
                        /// 33 is the width of the portion to be drawn from the sprite (actual width in the sprite)
                        ctxOverlay.drawImage(img, defaultTiles[8].x, defaultTiles[8].y, 33, 33, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
                        }
                            
                    }                   
                }


                if(mapOverDraw[tileMapIndex]==7){ /////  Numeros reservados para Overlays

                    /// 33 is the width of the portion to be drawn from the sprite (actual width in the sprite)
                    if(!inArea.inIt){
                        ctxOverlay.drawImage(img, 99, 0+animScroll, 33, 33, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
                    }else{
                        ctxBg.drawImage(img, 99, 0+animScroll, 33, 33, tileIndexX, tileIndexY, tileWidthHeight/*+variance*/, tileWidthHeight/*+variance*/);
                    }

                            
                }

                


            tileIndexX+= tileWidthHeight;

            tileMapIndex++;

            }
        tileIndexY+=tileWidthHeight;
        tileIndexX=newTileIndexX;


        }



} /////   tilesDraw  










































function Player(type) {
    //where in sprite
    this.srcX = 0;
    this.srcY = 0;

    this.upperSrcX= 35;
    this.upperSrcY=0;


    //where in tileMap
    this.drawX = 420;
    this.drawY = 200;
    //in sprite with & height/// Math.round it
    this.width = tileDiameter+(tileDiameter/4);
    this.height = tileDiameter+tileDiameter/1.6;
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


    this.life=20; //also inside playerType if/elses
    this.lifeTotal=100;
    ////  this(all) starts with 0,  then each diff type gets + more or less.. like Diablo, 

    ///////
    ///
    //   DIFFERENT QUALITIES LIKE speed, power, strength, intelligence.. hp, mp,  etc.....

}





//Shit happens
Player.prototype.update = function () {

    this.checkMoving(this.direction, this.moving);//  a bit faster when called right after keyPress
    this.animationState(this.dead, this.direction, this.animRate, this.moving);
    this.checkArea();

////  DEPENDING ON SELECT WHAT MENU-ITEM PLAYER IS USING  >>>>  1 button for gun, another for life item, other item permanently does/changes something

 

};




//Shit is shown
Player.prototype.draw = function () {


////////////////////////////////////////                  35, 50  ==>> this.width, this.height  ACTUAL W/H IN SPRITE

                                    ///// srcX, Y >> lower body
    ctxPlayer.drawImage(imgPlayer, this.srcX, this.srcY, 35, 50, this.drawX, this.drawY, this.width, this.height);

    console.log("GUN SEL"+this.gunSelected); /////   ACCORDING TO THIS WE GO DOWN Y AXIS  this.srcY+50, 50, 50, 50
            //////////////////////       then in the future another dimension for the suits/armor you find

    if(this.gunSelected==1){
        this.srcY=0;
    }else if(this.gunSelected==0){
        this.srcY=50;
    }

/////////////////////////////            OK NOW DRAW SPRITE PROPERLY AND THE ANIMATION RIGHT WHEN SHOOTING
////////////
//////////                      moving changes srcX, Y... so should shooting (change upperSrcX, Y)
                                                          /// upperXrcX + + + as in the if(this.shooting) below

    if(this.shooting){            ///// changing upperSrc Anim according to shooting
        ctxPlayer.drawImage(imgPlayer, this.upperSrcX, this.upperSrcY, 35, 50, this.drawX, this.drawY, this.width, this.height);
    }else{                     //// shifted sprite (srcX, Y) for upperBody parts
        ctxPlayer.drawImage(imgPlayer, this.srcX+3, this.srcY, 35, 50, this.drawX, this.drawY, this.width, this.height);                 //// take off +3, that just to show its been drawn on top
                            ////            +3 actually + length of sprite (legs/upperbody)
    }
    ////  HEALTH BAR !!
    var shifto=0;
    for (var i = 0; i<player1.life; i++) {

                                                                  /// tal vez window.innerHeight... no se ve cuando achicas
        ctxOverlay.drawImage(itemSprite,770, 600, 5, 10, 255+shifto,window.innerHeight-60,5, 10); ///////////// ctx player so it gets updated
        shifto+=7;
    };

};


var newDrawX, 
    newDrawY;
var dirMemory = ["anywhere"];

var crash = false;
var areasCrash = false;





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





    if(this.moving){

        //console.log(currentRoom);

    var newCenterX = Math.round(newDrawX + (this.width / 2)),
        newCenterY = Math.round(newDrawY + (this.height / 2));
        ///
        ///// if within limits >, <=, >, <=


        newDrawX = this.drawX;
        newDrawY = this.drawY;

        
//////////////      ///      
//////////////      ///  //  
//////////////      ///     /
//////////////      ///  ////    
///////////////    ////  ////
///////////////////////  ////
/////////////////////////////


        if(this.direction=="up"){
            if(newCenterY<boxLimit_YT&&canvasHeight+shiftY<canvasHeight-this.speed){
                shiftY+=this.speed;

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

//////////    ///////
//////////     /////  
//////////      ///
//////////     ////
//////////    /////
/////////////////////

        }else if(this.direction=="down"){
            //console.log(canvasHeight+shiftY);
            if(newCenterY>boxLimit_YB&&canvasHeight-canvasBg.height>=Math.abs(shiftY)+this.speed){
                shiftY-=this.speed;
 
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

        }else if(this.direction=="right"){

            /// yep yep 
            if(newCenterX>boxLimit_XR&&canvasWidth>((shiftX*-1)+canvasBg.width+this.speed)){
                shiftX-=this.speed;

                for(var i =0; i<obstacles.length; i++){
                    obstacles[i].leftX -= this.speed;
                    obstacles[i].rightX -= this.speed;
                }

                for(var j =0; j<areas.length; j++){
                    areas[j].leftX -= this.speed;
                    areas[j].rightX -= this.speed;
                }
              //alert(newObs[0].leftX);


            }else{

                this.drawX = this.drawX+this.speed;

            }            

        }else if(this.direction=="left"){

            if(newCenterX<boxLimit_XL&&canvasWidth+shiftX<canvasWidth-this.speed){
                shiftX+=this.speed;

                for(var i =0; i<obstacles.length; i++){
                    obstacles[i].leftX += this.speed;
                    obstacles[i].rightX += this.speed;
                }

                for(var j =0; j<areas.length; j++){
                    areas[j].leftX += this.speed;
                    areas[j].rightX += this.speed;
                }
            }else{
                this.drawX = this.drawX-this.speed;
            }

        }else if(this.direction=="right-down"){
            if(newCenterX>boxLimit_XR&&canvasWidth>((shiftX*-1)+canvasBg.width+this.speed)){
                shiftX-=this.speed;

                for(var i =0; i<obstacles.length; i++){
                    obstacles[i].leftX -= this.speed;
                    obstacles[i].rightX -= this.speed;
                }

                for(var j =0; j<areas.length; j++){
                    areas[j].leftX -= this.speed;
                    areas[j].rightX -= this.speed;
                }

            }else{

                this.drawX = this.drawX+this.speed;

            }

            if(newCenterY>boxLimit_YB&&canvasHeight-canvasBg.height>=Math.abs(shiftY)+this.speed){
                shiftY-=this.speed;
 
                for(var i =0; i<obstacles.length; i++){
                    obstacles[i].topY -= this.speed;
                    obstacles[i].bottomY -= this.speed;
                }

                for(var j =0; j<areas.length; j++){
                    areas[j].topY -= this.speed;
                    areas[j].bottomY -= this.speed;

                }


            }else{
                this.drawY = this.drawY+this.speed;
            }



        } else if(this.direction=="left-down"){
            if(newCenterX<boxLimit_XL&&canvasWidth+shiftX<canvasWidth-this.speed){
                shiftX+=this.speed;

                for(var i =0; i<obstacles.length; i++){
                    obstacles[i].leftX += this.speed;
                    obstacles[i].rightX += this.speed;
                }

                for(var j =0; j<areas.length; j++){
                    areas[j].leftX += this.speed;
                    areas[j].rightX += this.speed;
                }
            }else{
                this.drawX = this.drawX-this.speed;
            }

            if(newCenterY>boxLimit_YB&&canvasHeight-canvasBg.height>=Math.abs(shiftY)+this.speed){
                shiftY-=this.speed;
 
                for(var i =0; i<obstacles.length; i++){
                    obstacles[i].topY -= this.speed;
                    obstacles[i].bottomY -= this.speed;
                }

                for(var j =0; j<areas.length; j++){
                    areas[j].topY -= this.speed;
                    areas[j].bottomY -= this.speed;

                }


            }else{
                this.drawY = this.drawY+this.speed;
            }



        }

        /////  else  >>>>> oposite, stay same but move the rest..  logic down at checkCrash should remain the same (stays true both ways)


    }
        ///////////  DELETE LATER
        ctxOverlay.strokeStyle = "#FF0000";
        ctxOverlay.strokeRect(boxLimit_XL, boxLimit_YT, boxLimit_XR-boxLimit_XL, boxLimit_YB-boxLimit_YT);
}






//////  ALSO TO BE checkDOORCrash   checkCrash(wall vs door  or maybe both at all times, no if else needed, one for loop after the other) 

Player.prototype.checkCrash = function () {          ////////// GET PARAMETER >> if triggered from 


    //console.log(this.direction);

    var newCenterX = Math.round(newDrawX + (this.width / 2)),
        newCenterY = Math.round(newDrawY + (this.height / 2));


    function doorCrash(obstacleIndex){
        if(obstacles[obstacleIndex].isDoor=="door"){                     
            inDoorCrash={crash:true, id:obstacles[obstacleIndex].doorID};
        }
    }

    ///Loop through Obstacles
    for (var i = 0; i < obstacles.length; i++) {


        if(this.direction=="right"){
        
            ///in other words: as long as you are standing in the block before what would be the next one when going right
            if(newCenterY>=obstacles[i].topY&&newCenterY<obstacles[i].bottomY&&newCenterX<=obstacles[i].leftX&&newCenterX>obstacles[i].leftX-tileDiameter) {

                //but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
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

                        //if it's a door, you may open it   
                        doorCrash(i);
                }
            }
        }   
        if(this.direction=="up"){

            if(newCenterX>=obstacles[i].leftX&&newCenterX<obstacles[i].rightX&&newCenterY>=obstacles[i].bottomY&&newCenterY<obstacles[i].bottomY+tileDiameter) {

                if(newCenterY-this.speed<=obstacles[i].bottomY+(this.speed+1)){
                    crash = true;

                        //if it's a door, you may open it   
                        doorCrash(i);
                }         
            }
        }   
        if(this.direction=="down"){

            if(newCenterX>obstacles[i].leftX&&newCenterX<=obstacles[i].rightX&&newCenterY<=obstacles[i].topY&&newCenterY>obstacles[i].topY-tileDiameter) {

                if(newCenterY+this.speed>=obstacles[i].topY-(this.speed+1)){
                    crash = true;

                        //if it's a door, you may open it   
                        doorCrash(i);
                }
            }
        }   
        if(this.direction=="right-down"){ //////////   CONTINUE WITH ALL SIDES NOW THAT IT WORKS

            // if(newCenterY>=obstacles[i].topY&&newCenterY<obstacles[i].bottomY&&newCenterX<=obstacles[i].leftX&&newCenterX>obstacles[i].leftX-tileDiameter||newCenterX>obstacles[i].leftX&&newCenterX<=obstacles[i].rightX&&newCenterY<=obstacles[i].topY&&newCenterY>obstacles[i].topY-tileDiameter) {


            //     //but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
            //     if(newCenterX+this.speed>=obstacles[i].leftX-(this.speed+1)||newCenterY+this.speed>=obstacles[i].topY-(this.speed+1)){

            //         crash = true; 

            //         //if it's a door, you may open it   
            //         doorCrash(i);

            //     }

            // }

            // /////////////// right on the CORNERS NOW WORKS!!  YAY!
            // else if(newCenterY<=obstacles[i].topY&&newCenterX<=obstacles[i].leftX&&newCenterY>obstacles[i].topY-tileDiameter&&newCenterX>obstacles[i].leftX-tileDiameter) {


            //     //but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
            //     if(newCenterX+this.speed>=obstacles[i].leftX-(this.speed+1)&&newCenterY+this.speed>=obstacles[i].topY-(this.speed+1)){

            //         crash = true; 

            //         //if it's a door, you may open it   
            //         doorCrash(i);

            //     }

            // }
            if(newCenterY>=obstacles[i].topY&&newCenterY<obstacles[i].bottomY&&newCenterX<=obstacles[i].leftX&&newCenterX>obstacles[i].leftX-tileDiameter) {

                //but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
                if(newCenterX+this.speed>=obstacles[i].leftX-(this.speed+1)){

                    crash = true; 

                    //if it's a door, you may open it   
                    doorCrash(i);
                }
            }


            if(newCenterX>obstacles[i].leftX&&newCenterX<=obstacles[i].rightX&&newCenterY<=obstacles[i].topY&&newCenterY>obstacles[i].topY-tileDiameter) {

                if(newCenterY+this.speed>=obstacles[i].topY-(this.speed+1)){
                    crash = true;

                        //if it's a door, you may open it   
                        doorCrash(i);
                }
            }

        } 

        if(this.direction=="left-down"){ 

             if(newCenterY<=obstacles[i].bottomY&&newCenterY>obstacles[i].topY&&newCenterX>=obstacles[i].rightX&&newCenterX<obstacles[i].rightX+tileDiameter) {
                
                if(newCenterX-this.speed<=obstacles[i].rightX+(this.speed+1)){
                    crash = true;

                        //if it's a door, you may open it   
                        doorCrash(i);
                }
            }

            if(newCenterX>obstacles[i].leftX&&newCenterX<=obstacles[i].rightX&&newCenterY<=obstacles[i].topY&&newCenterY>obstacles[i].topY-tileDiameter) {

                if(newCenterY+this.speed>=obstacles[i].topY-(this.speed+1)){
                    crash = true;

                        //if it's a door, you may open it   
                        doorCrash(i);
                }
            }

        }




    }/// for loop Obstacles



    if (crash) {
        return true;
    } else {
        return false;
    }

};








////   IF AREA   DOOR-to-other-room >>>>>>>>>>>>>>>>  changeRoom(CORRESPONDING ROOM TO THIS DOOR)

Player.prototype.checkArea = function (){


    function doorTo(areasIndex){

        if(areas[areasIndex].isDoor=="door"){

            if(areas[areasIndex].isBlocked!="blocked"){

                //console.log("door "+areasIndex);
                
                changeRoom("room-2", areas[i].doorTO, shiftX, shiftY);/////  room-2 >> determined by door"To" (9[2]11), then ID (92[11])
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

                if(areas[i].n!="default"){
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
        
        if(this.direction=="left"){

            if(newCenterX<=areas[i].rightX&&newCenterX>areas[i].leftX&&newCenterY<areas[i].bottomY&&newCenterY>=areas[i].topY) {
                
                currentArea=areas[i].n;

                ///Door to other room (& blocking mechanism)
                doorTo(i);

                if(areas[i].n!="default"){
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

        if(this.direction=="up"){
            //console.log(areasCrash);      


            if(newCenterY<=areas[i].bottomY&&newCenterY>areas[i].topY&&newCenterX>=areas[i].leftX&&newCenterX<areas[i].rightX) {

                    currentArea=areas[i].n;
                    ///Door to other room (& blocking mechanism)
                    doorTo(i);

                    if(areas[i].n!="default"){
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
        if(this.direction=="down"){

            if(newCenterY<areas[i].bottomY&&newCenterY>=areas[i].topY&&newCenterX>areas[i].leftX&&newCenterX<=areas[i].rightX) {
                    currentArea=areas[i].n;

                    ///Door to other room (& blocking mechanism)
                    doorTo(i);

                if(areas[i].n!="default"){
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

        if(this.direction=="right-down"){

            if(newCenterX<areas[i].rightX&&newCenterX>=areas[i].leftX&&newCenterY<=areas[i].bottomY&&newCenterY>areas[i].topY||newCenterY<areas[i].bottomY&&newCenterY>=areas[i].topY&&newCenterX>areas[i].leftX&&newCenterX<=areas[i].rightX) {

                    currentArea=areas[i].n;

                    ///Door to other room (& blocking mechanism)
                    doorTo(i);

                if(areas[i].n!="default"){
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

                if(areas[i].n!="default"){
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

    }

}


Player.prototype.animationState = function (dead, direction, animRate, moving) {

    //DIFFERENT ANIMATIONS WITH DIFF WEAPON




        //// Also keep track of what weapon is selected and move whole srcY of the sprite one down (where player is holding corresponging gun

            ////  +  in all rows include a Fighting mode for every direction (so it animates when shoting or punching)




        if(this.direction=="up"){
            this.srcX = 35;
            this.srcY = 0;

        }else if(this.direction=="down"){

            this.srcX = 0;
            animCount += animRate;
            if(animCount<2){
                this.srcY = 0;
            }else if(animCount>2&&animCount<4){
                this.srcY = 54; //////////// actual width in Sprite (in pixels)
            }else if(animCount>4){
                animCount =0;
            }
            
        }

        if(this.shooting){
           animCount += animRate;
           
            if(animCount<2){
                if(this.facing=="up"){
                    this.upperSrcX = 140;
                }else{
                    this.upperSrcX = 145;
                }
            }else if(animCount>2&&animCount<4){
                this.upperSrcX = 160;
            }else if(animCount>4){
                animCount =0;
            }
        }else{
            if(this.facing=="up"){
                    this.upperSrcX = 70;
                }else{
                    this.upperSrcX = 35;
                }
        }


}









 























    








//////////////////////////////////////  have another arguemtn for big and small, which applies when ammo != null
///////////////
function Item(x,y, xx, yy, w,h, item, gun, ammo, selec, caught, branch, room) {   //// ALSO CURRENTROOM!!!!!!S for drawing purposes
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

    this.itemType = item;
    this.gunType = gun;         /// 0 to 9
    this.ammoType = ammo;      //// 0 to 9 (+10 = special)     branch 0 = weak, branch 1, stronger.. etc.
                                ///         if selec (use) >> if ammoType == 1 >> (loop gunsMenu, if gunMenuType[i] == 1) >> gunsMenu.bullets += X
                                 //                            if ammoType == 10 >>  all gunMenu.bullets + X.... (or some mmore than others)    

    //this.lifeType = life; //// NOT NEEDED... LIFE CAN BE ITEMS THAT DO LIFE.... (very special)  >> the rest like Marathon
    //////////////                      special  stations scattered around the place which increase your life (method)

    this.select=selec;
    this.isCaught=caught;

    this.inRoom=room;
}


Item.prototype.update = function () {


    this.pickUp();

};










var menuItemAlreadyPainted=false;
var menuGunAlreadyPainted=false;




Item.prototype.draw = function () {


       
 




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
                        if(areas[i].n!="default"){

                            // if areas[i].n == inArea.THE-EXACT-AREA 

                            /// DRAW  this only
                            //alert(inArea.whatArea);
                            if(inArea.whatArea == areas[i].n){
                                if(currentRoom==this.inRoom){
                                    ctxEntities.drawImage(itemSprite, this.srcX, this.srcY, 30, 30, this.drawX, this.drawY, this.width, this.height);
                                }
                            }

                            




                            //////  si inArea={inIt:true, whichOne:n}  >>
                                                                                
             ///  if player's position inArea >>> if(inArea.whichOne == areas[i].n)

                        }
                        
                    }
                };
            }//// IF item inArea

    
        }// IF   not-Caught


        //// inMenu DRAW

        //// OK, so if there is an Item already there.. keep itemAdding to the array, but only show the newst one (then in pause mode you can scroll and select other ones with the arrows)

        for (var i =0; i<3; i++) { ///// 3 Tracks

        
            if(i==0){
                if(player1.items[1]!=null&&player1.items[1]!="undefined"){
                        
                    if(!menuItemAlreadyPainted){

                        ctxMenu.clearRect(200,window.innerHeight-60,this.width,this.height);
      

                    for (var j = 0;j<player1.items.length; j ++) {
                           
                        
                        /// FOR  ROW>>> IT COULD BE INFINITE!    for player1.items  igual que en checkKey
                        if(itemRow==j){
                            if(typeof player1.items[j+1]!="undefined"){
                                ctxMenu.drawImage(itemSprite, player1.items[j+1].srcX, player1.items[j+1].srcY, 30, 30, 200, window.innerHeight-60, player1.items[j+1].width, player1.items[j+1].height);
                            }    
                        }
                    };
                    
                    menuItemAlreadyPainted=true;
                        ///// should be this.ICON >> diff image in game and inventory
                }
            } 
            
        }else if(i==1){
            if(player1.guns[1]!=null&&player1.guns[1]!="undefined"){

                if(!menuGunAlreadyPainted){
                        ctxMenu.clearRect(230,100,this.width,this.height);

                     for (var j = 0;j<player1.guns.length; j ++) {
                      
                        if(gunRow==j){
                            if(typeof player1.guns[j+1]!="undefined"){
                                ctxMenu.drawImage(itemSprite, player1.guns[j+1].srcX, player1.guns[j+1].srcY, 30, 30, 230, 100, player1.guns[j+1].width, player1.guns[j+1].height);
                            }
                        }
                    };
                    menuGunAlreadyPainted=true;
                        ///// should be this.ICON >> diff image in game and inventory
                }
            }
        }


   
}/// FOR  menuTrack

        
};



Item.prototype.pickUp = function(){

    //console.log(player1.items.length);
    var newCenterX = Math.round(newDrawX + (player1.width / 2)),
        newCenterY = Math.round(newDrawY + (player1.height / 2));
selecto();    

var itemAdd=false;
var noItemAdd=false;
var memberJ;

var gunAdd=false;
var noGunAdd=false;

player1.items[0]={srcX:this.srcX, srcY:this.srcY, width:this.width, height:this.height, selec:this.selec, itemType:null, gunType:null, ammoType:null,lifeType:null,amount:0};

player1.guns[0]={srcX:this.srcX, srcY:this.srcY, width:this.width, height:this.height, selec:this.selec, itemType:null, gunType:0, ammoType:null,lifeType:null,amount:0};

/////////////////
////  for some reason that I forgot, I need to set the first mnenu-items/weapon's  values here. 

///  it doesn't mattter since the first weapon in the game will always be 0. The problem comes when that's not the case.

if(newCenterX>this.centerX-this.width/2&&newCenterX<this.centerX+this.width/2&&newCenterY>this.centerY-this.height/2&&newCenterY<this.centerY+this.height/2){
       
    if(currentRoom==this.inRoom){
        if(!this.isCaught){

            this.isCaught=true;

            /// here sort whether player1.items has already got one item of this type...
                if(this.itemType!=null){

                    for(var j=0; j<player1.items.length; j++){
                        if(player1.items.length==1){
                            itemAdd=true;

                        }else if(player1.items.length>1){
                          
                            if(this.itemType!=player1.items[j].itemType&&j!=0){
                               itemAdd=true;
                                
                            }else if(this.itemType==player1.items[j].itemType&&j!=0) {
                            
                              noItemAdd=true;   
                                 memberJ=j;  
                            }
                        }
                        
                    }

                    menuTrack=0;
                         
                  
                    console.log("ITEM");
                     
                }else if(typeof this.gunType!=null&&this.ammoType==null){
                    menuTrack=1;
              
                    console.log("GUN");
                     
                }else if(typeof this.ammoType!=null&& this.gunType==null){
                    menuTrack=1;
     
                    console.log("AMMO");
                }
                ////  ... if not, push into a newly sortted array to tidily show items in menu
                /////  .. if yes, then 

                if(itemAdd&&!noItemAdd){  
                    itemRow=0;
                    if(player1.items.length<=1){
                        player1.items[0]={srcX:this.srcX, srcY:this.srcY, width:this.width, height:this.height, selec:this.selec, rowSelec:null, trackSelec:null, itemType:this.itemType, amount:1};   
                    }
                    player1.items.push({srcX:this.srcX, srcY:this.srcY, width:this.width, height:this.height, selec:this.selec, rowSelec:null, trackSelec:null, itemType:this.itemType, amount:1});   
  
                }else if(noItemAdd&&memberJ!="undefined"){

                    player1.items[memberJ].amount++;    ////////////  maybe set a limit to this amount (like secret of Mana's magic 4....)
                }

                noItemAdd=false;
                itemAdd=false;
               

            ///////////   GUN PICK-UP    
                //////
                if(this.gunType!=null&&this.inRoom==currentRoom){
                    for(var j=0; j<player1.guns.length; j++){

                    if(this.gunType!=null&&this.itemType==null){

                            if(player1.guns.length==1){
                                gunAdd=true;

                            }else if(player1.guns.length>1){
                              
                                if(this.gunType!=player1.guns[j].gunType&&j!=0){
                                   gunAdd=true;
                                    
                                }else if(this.gunType==player1.guns[j].gunType&&j!=0) {
                                
                                    noGunAdd=true;  
                                }
                            }
                        }
                    }
                }                
                ////  ... if not, push into a newly sortted array to tidily show items in menu
                /////  .. if yes, then remember the player1.items.INDEX so as to increment its amount

                if(gunAdd&&!noGunAdd){
                    gunRow=0;

                    //alert(player1.guns.length);

                    if(player1.guns.length<=1){
                        //console.log("TYPE "+player1.guns[0].gunType);
                       player1.guns[0]={srcX:this.srcX, srcY:this.srcY, width:this.width, height:this.height, selec:this.selec, rowSelec:null, trackSelec:null,itemType:this.itemType, gunType:this.gunType, ammoType:this.ammoType, lifeType:this.lifeType, bullets:0};
                       //console.log("TYPE "+player1.guns[0].gunType);
                    }

                    player1.guns.push({srcX:this.srcX, srcY:this.srcY, width:this.width, height:this.height, selec:this.selec, rowSelec:null, trackSelec:null,itemType:this.itemType, gunType:this.gunType, ammoType:this.ammoType, lifeType:this.lifeType, bullets:0}); 
                     // console.log("TYPE "+player1.guns[1].gunType);
         ///if this.gunType = 1  player1.guns[player1.guns.length].bullets = "WHATEVER INICIAL LOAD FOR THAT WEAPON FIND<< thats:last one just added           
                }

                noGunAdd=false;
                gunAdd=false;



                if(this.ammoType!=null&&this.inRoom==currentRoom){
                    if(typeof player1.guns[1]!="undefined"){
                    for (var i = 0; i<player1.guns.length; i++) {
                        if(this.ammoType==player1.guns[i].gunType){
                            //console.log("ANTES "+player1.guns[i].bullets);
                            player1.guns[i].bullets+=10;

                            /// ALSO HAVE DIFF TYPE OF AMMO, BIG & SMALL
                            console.log( player1.guns[i].bullets);

                            //console.log("DESPUES "+player1.guns[i].bullets);
                        }
                    };
                }

                }           

///////////////////////////////////////////////////////////////////////////////////////////////////////


        }//// IF this caught
    
       }/// if this in room

        //console.log("DE ESTE "+player1.items[1].itemType+"HAY " +player1.items[1].amount); 



    }/// IF  newCenterX == itemCoordinates
   
}
