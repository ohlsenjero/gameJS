window.addEventListener("load", initGame, false);


var canvasBg = document.getElementById("canvasBg"),
    ctxBg = canvasBg.getContext("2d"),
    canvasPlayer = document.getElementById("canvasPlayer"),
    ctxPlayer = canvasPlayer.getContext("2d");

var canvasWidth = 0,
    //Same for Height
    canvasHeight = 0;


    isPlaying = false,
    requestAnimFrame =  window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.oRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        function(callback) {
                            window.setTimeout(callback, 1000 / 1);
                        },


imgPlayer = new Image();
imgPlayer.src = "images/hero.png";


imgBG = new Image();
imgBG.src = "images/sprite2.png";
    


var shiftX=0;
var shiftY=0;

var keysPressed = []; 

var obstacles = [];
var areas= [];

player1 = new Player();


var animCount = 0;

//should be in Funtion => GAME

function initGame() {
    document.addEventListener("keydown", function(e) {checkKey(e, true);}, false);
    document.addEventListener("keyup", function(e) {checkKey(e, false);}, false);
    // defineObstacles();
    // initEnemies();


    


    begin();
     

        // for (var i = 0; i < obstacles.length; i++) {
        //         obstacles[i].topY= obstacles[i].topY-startY;
        //         obstacles[i].bottomY= obstacles[i].bottomY-startY; 
        //         obstacles[i].leftX= obstacles[i].leftX-startX;
        //         obstacles[i].rightX= obstacles[i].rightX-startX; 

        // }
}

function begin() {
    ///


  
    roomDraw("room-1", 0, 25, 0, 0);


    isPlaying = true;
    requestAnimFrame(loop);

    // for (var i = 0; i < obstacles.length; i++) {
    //     console.log(obstacles[i].drawX);

    // }


}


//UPDATE everything
function update() {
    clearCtx(ctxPlayer);
    player1.update();



}

// & Re-DRAW
function draw() {
    player1.draw(); 
    // ammoDrop.draw();
    // weaponDrop.draw();
    // lifeB.draw();
    // lifeDrop.draw();  ITEMS
}

//master controls
function loop() {
    if (isPlaying) {
        update();
        draw();
        requestAnimFrame(loop);
    }
}

function clearCtx(ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function randomRange (min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
}




   



////////////////
/////// delay in direction change (when pressing 2 keys, then releasing one)
////////////// might be solved by trigering the checkMoving from here, rather than on a periodic update
//////

function checkKey(e, value) {

    
    // e = e || event; 
    keysPressed[e.keyCode] = e.type;


    if (keysPressed[38]) { 
        
        //player1 should change to "Da player"
        player1.direction = "up";

        
        
    }
    if (keysPressed[40]) {  /////////////////////////////// YES, WORKS
        

        player1.direction = "down";  /// to know it can do another one..     
        
    }
    if (keysPressed[39]) {  /////////////////////////////// YES, WORKS
        

        player1.direction = "right";  /// to know it can do another one..          
    }
    if (keysPressed[37]) {  /////////////////////////////// YES, WORKS
        

        player1.direction = "left";  /// to know it can do another one..          
    }
    if (keysPressed[40]&&keysPressed[39]) {  /////////////////////////////// YES, WORKS
        

        player1.direction = "right-down";  /// to know it can do another one..          
    }


    if(!value){
    
        keysPressed = []; 
        player1.direction = "nowhere";
    }else{
        dirMemory.push(player1.direction);
    }

    //MAKE VAR TO REMEMBER LAST DIRECTION 
    ///
    /// ROOM of ice >>> pushes you in your last direction >> recursively, a bit less everytime until fade << momentum

    e.preventDefault();
}//END check spacebar










function roomDraw(whatRoom, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY){
    
        if(whatRoom == "room-1"){

            room1(tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY);     

        }

    //limitScreenRight
    obstacles.push(
        new Obstacle(canvasWidth-tileWidthHeight*2, 0, tileWidthHeight, canvasHeight)// no cacho por que ese -50, dos veces tileW
    );
    //limitScreen L
    obstacles.push(
        new Obstacle(-tileWidthHeight, 0, tileWidthHeight, canvasHeight)
    );
    //limitScreen T
    obstacles.push(
        new Obstacle(0, -tileWidthHeight, canvasWidth, tileWidthHeight)
    );
    //limitScreen B
    obstacles.push(
        new Obstacle(0, canvasHeight-tileWidthHeight*3, canvasWidth, tileWidthHeight)
    );
}


function Obstacle(x, y, w, h) {
    this.drawX = x;
    this.drawY = y;
    this.width = w;
    this.height = h;
    this.leftX = this.drawX;
    this.rightX = this.drawX + this.width;
    this.topY = this.drawY;
    this.bottomY = this.drawY + this.height;


}
    
    var roomStartX= 0;
    var roomStartY= 0;
    var roomLengthX= 0;
    var roomLengthY= 0;

function Area(x, y, w, h) {
    this.drawX = x;
    this.drawY = y;
    this.width = w;
    this.height = h;
    this.leftX = this.drawX;
    this.rightX = this.drawX + this.width;
    this.topY = this.drawY;
    this.bottomY = this.drawY + this.height;
}


















function room1(tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY){



    //the starter X tile to change in all rows   >> do same for Y 
    var newTileIndexX = tileIndexX;


var tileMap =   [1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 1,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,2,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0, 
                 0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0];

    roomLengthY= 27* tileWidthHeight;
    roomLengthX= 34* tileWidthHeight;

    canvasWidth = roomLengthX;
    canvasHeight = roomLengthY;



    imgSpriteTile0 = new Image();
    imgSpriteTile0.src = "images/0.png";
    imgSpriteTile1 = new Image();
    imgSpriteTile1.src = "images/1.png";
    imgSpriteTile2 = new Image();
    imgSpriteTile2.src = "images/weaponHighlight.png";


////  room1(tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY >>>>   add: area

///                       make var for imgSpriteTile0
    //////////////////////////////////////////  img0=0
    //////////////////////////////////// ////// img1=1
    /////////////////////////////////////  //   img2=2

    ///  put in array

    //////////////////////////////  then down here:    if area == default, like that, else == 1

    ////////////////////////////////////////////////////////////////////////////  img0=4
    ////////////////////////////////////////////////////////////////////////////  img1=5
    ////////////////////////////////////////////////////////////////////////////  img2=5
    ///  copy  array with new values
    /// keep original
    //// }


////////// then call this in outside function !! 
//// 

tilesDraw({tileMap}, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, newTileIndexX, imgSpriteTile0,  imgSpriteTile1,  imgSpriteTile2);
//TilesDraw(tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY,||||| img0, imgS1, img2, imgORIGINAL0, ORIG1, ORIG2)




}



function tilesDraw({tileMap}, tileMapIndex, tileWidthHeight, tileIndexX, tileIndexY, newTileIndexX){
    for(var i =0; i<27; i++){
    for(var e=0; e<34; e++){


        ////////////////  finally looping here according to that imgSpriteTileARRAY
        /////////////////////////////  giving imgSpriteTile0>> the value of the current value in arguments[i] 
        ////////////////////////////////////////////////////// arguments from TILeDRAW() after tileIndexY >>> from [4] onwards (hasta la mitad)

        ////////////////////////  & tileMap[tileMapIndex]==THIS <<<<<   values from original array (desde la mitad)


        for(var j=0; j < arguments.length; j++){
            if(j>5){
              console.log(arguments[j]);  
          }
        }



    if(tileMap[tileMapIndex]==0){

        ctxBg.drawImage(imgSpriteTile0, 0, 0, tileWidthHeight, tileWidthHeight, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);
    }else if(tileMap[tileMapIndex]==2){
        ctxBg.drawImage(imgSpriteTile2, 0, 0, tileWidthHeight, tileWidthHeight, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);

        areas.push(
            new Area(tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight)
        );
    }else{
        ctxBg.drawImage(imgSpriteTile1, 0, 0, tileWidthHeight, tileWidthHeight, tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight);

        obstacles.push(
            new Obstacle(tileIndexX, tileIndexY, tileWidthHeight, tileWidthHeight)
        );

    }


            tileIndexX+= tileWidthHeight;

        tileMapIndex++;

    }
///////// newTileIndexY  >>> declare up at the beginning, needed for easy shift when moving
tileIndexY+=tileWidthHeight;
tileIndexX=newTileIndexX;

}
}










function Player() {
    //where in sprite
    this.srcX = 0;
    this.srcY = 0;
    //where in tileMap
    this.drawX = 400;
    this.drawY = 300;
    //in sprite with & height
    this.width = 35;
    this.height = 54;
    this.centerX = this.drawX + (this.width / 2);
    this.centerY = this.drawY + (this.height / 2);
    //starting moving values & speed
    this.speed = 8;
    this.moving = true;
    this.direction = "nowhere";
    //animation
    this.isDead = false;
    this.animRate = 1;

this.hitArea=false;

}

//Shit happens
Player.prototype.update = function () {
    // this.centerX = this.drawX + (this.width / 2);
    // this.centerY = this.drawY + (this.height / 2);
    this.checkMoving(this.direction, this.moving);//  a bit faster when called right after keyPress
    this.animationState(this.dead, this.direction, this.animRate, this.moving);
};


//Shit is shown
Player.prototype.draw = function () {

    ctxPlayer.drawImage(imgPlayer, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);

};
var newDrawX, 
     newDrawY;
var dirMemory = ["anywhere"];
var crashMemory = [];
var firstCrashDirVariant;
var crash = false;
var areasCrash = false;


Player.prototype.checkMoving = function (direction, moving) {


    var boxLimit_XL = 300, 
        boxLimit_XR = 500,
        boxLimit_YT = 250,
        boxLimit_YB = 350,
        sprtLimit_XL = 100, 
        sprtLimit_XR = canvasWidth-100,
        sprtLimit_YT = 100,
        sprtLimit_YB = canvasHeight-100;

        ctxBg.strokeStyle = "#FF0000";
        ctxBg.strokeRect(boxLimit_XL, boxLimit_YT, boxLimit_XR-boxLimit_XL, boxLimit_YB-boxLimit_YT);



    ////////////////////////////////
    ////
    //     if not too close to room boundaries || not in center-screen-moving-areas >> you move, but the draw X,Y changes for everything else instead

    if(!this.checkCrash()){ 

        this.moving=true;

    }else {
        
        //////if direction same as crash -> false. 
        this.moving=false;
        crash=false;
        
    }

    if(!this.checkAreasCrash()){ 

        this.hitArea=false;

    }else {       

        //////if direction same as crash -> false. 
        this.hitArea=true;
        areasCrash=false;
      

  ////////////    roomDraw(room 1, area 1 !!)


    }

//console.log(this.hitArea);
    
    if(this.moving){

    var newCenterX = Math.round(newDrawX + (this.width / 2)),
        newCenterY = Math.round(newDrawY + (this.height / 2));
        ///
        ///// if within limits >, <=, >, <=



        newDrawX = this.drawX;
        newDrawY = this.drawY;

        if(direction=="up"){
            if(newCenterY<boxLimit_YT&&canvasHeight+shiftY<canvasHeight-this.speed){
                shiftY+=this.speed;
                obstacles = [];
                areas = [];
                clearCtx(ctxBg);
                /////////////////////  "room-1" tiene que ser VARIABILIZADO

                // TAMBIEN, ASK si tilePlayer = tileCambiodeTile(para esta piesa)
                ////////////////////////////////// >>> entonces draw con ("room-1", 0, 25, shiftX, shiftY, STEP ON areas 1); << diff areass per room
                roomDraw("room-1", 0, 25, shiftX, shiftY);

            }else{
            this.drawY = this.drawY-this.speed;
            }
        }else if(direction=="down"){
            console.log(canvasHeight+shiftY);
            if(newCenterY>boxLimit_YB&&canvasHeight-canvasBg.height>=Math.abs(shiftY)+this.speed){
                shiftY-=this.speed;
                obstacles = [];
                areas = [];
                clearCtx(ctxBg);
                roomDraw("room-1", 0, 25, shiftX, shiftY);

            }else{
                this.drawY = this.drawY+this.speed;
            }

        }else if(direction=="right"){

            /// yep yep 
            if(newCenterX>boxLimit_XR&&canvasWidth>((shiftX*-1)+canvasBg.width+this.speed)){
                shiftX-=this.speed;
                obstacles = [];
                areas = [];
                clearCtx(ctxBg);
                roomDraw("room-1", 0, 25, shiftX, shiftY);

            }else{

                this.drawX = this.drawX+this.speed;

            }            

        }else if(direction=="left"){

            if(newCenterX<boxLimit_XL&&canvasWidth+shiftX<canvasWidth-this.speed){
                shiftX+=this.speed;
                obstacles = [];
                areas = [];
                clearCtx(ctxBg);
                roomDraw("room-1", 0, 25, shiftX, shiftY);

            }else{
                this.drawX = this.drawX-this.speed;
            }
        }

         else if(direction=="right-down"){
            if(newCenterX>boxLimit_XR&&canvasWidth>((shiftX*-1)+canvasBg.width+this.speed)){
                shiftX-=this.speed;
                obstacles = [];
                areas = [];
                clearCtx(ctxBg);
                roomDraw("room-1", 0, 25, shiftX, shiftY);

            }else{

                this.drawX = this.drawX+this.speed;

            }

            if(newCenterY>boxLimit_YB&&canvasHeight-canvasBg.height>=Math.abs(shiftY)+this.speed){
                shiftY-=this.speed;
                obstacles = [];
                clearCtx(ctxBg);
                roomDraw("room-1", 0, 25, shiftX, shiftY);

            }else{
                this.drawY = this.drawY+this.speed;
            }



        } 

        /////  else  >>>>> oposite, stay same but move the rest..  logic down at checkCrash should remain the same (stays true both ways)


    }

}



Player.prototype.checkCrash = function () {          ////////// GET PARAMETER >> if triggered from 




    var newCenterX = Math.round(newDrawX + (this.width / 2)),
        newCenterY = Math.round(newDrawY + (this.height / 2));

    
    for (var i = 0; i < obstacles.length; i++) {

        if(this.direction=="right"){
        
            ///in other words: as long as you are standing in the block before what would be the next one when going right
            if(newCenterY>=obstacles[i].topY&&newCenterY<obstacles[i].bottomY&&newCenterX<=obstacles[i].leftX&&newCenterX>obstacles[i].leftX-25) {

                //but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
                if(newCenterX+this.speed>=obstacles[i].leftX-(this.speed+1)){
                    crash = true;
                }
            }
        }  
        if(this.direction=="left"){

            if(newCenterY<=obstacles[i].bottomY&&newCenterY>obstacles[i].topY&&newCenterX>=obstacles[i].rightX&&newCenterX<obstacles[i].rightX+25) {
                
                if(newCenterX-this.speed<=obstacles[i].rightX+(this.speed+1)){
                    crash = true;
                }
            }
        }   
        if(this.direction=="up"){

            if(newCenterX>=obstacles[i].leftX&&newCenterX<obstacles[i].rightX&&newCenterY>=obstacles[i].bottomY&&newCenterY<obstacles[i].bottomY+25) {

                if(newCenterY-this.speed<=obstacles[i].bottomY+(this.speed+1)){
                    crash = true;
                }         
            }
        }   
        if(this.direction=="down"){

            if(newCenterX>obstacles[i].leftX&&newCenterX<=obstacles[i].rightX&&newCenterY<=obstacles[i].topY&&newCenterY>obstacles[i].topY-25) {

                if(newCenterY+this.speed>=obstacles[i].topY-(this.speed+1)){
                    crash = true;
                }
            }
        }   

        /////////////////////////////////////HAS TO UNLOCK one particular side (new key after crash) for everyside
        // Continue all 8 sides

        ///// instead of checkCrash >>> checkareas(checkFor)
        ///////////////////////////////////////
        ///////////      if(checkFor=="obstacles"){
            // array >>> obstacles
       ////////////////} else if(checkFor=="roomXtiles")
            // whatArray >>> roomXtiles
            //}
            //for (var i = 0; i < whatArray.length; i++) {
                   // }

            ///  crash -> connect -> steped



    }

///////////// put this 2 functions together, and then when called if(lklkl == crash vs == areasCrash)

///                return the crash type, instead of just true or false... same prototype, still 2 different calls

    if (crash) {
        return true;
    } else {
        return false;
    }

};



Player.prototype.checkAreasCrash = function () {          ////////// GET PARAMETER >> if triggered from 




    var newCenterX = Math.round(newDrawX + (this.width / 2)),
        newCenterY = Math.round(newDrawY + (this.height / 2));

    
    for (var i = 0; i < areas.length; i++) {

        if(this.direction=="right"){
        
            ///in other words: as long as you are standing in the block before what would be the next one when going right
            if(newCenterY>=areas[i].topY&&newCenterY<areas[i].bottomY&&newCenterX<=areas[i].leftX&&newCenterX>areas[i].leftX-25) {

                //but don't stop me just yet, i've just entered the square, now wait for me to be at the other side
                if(newCenterX+this.speed>=areas[i].leftX-(this.speed+1)){
                    areasCrash = true;
                }
            }
        }  
        if(this.direction=="left"){

            if(newCenterY<=areas[i].bottomY&&newCenterY>areas[i].topY&&newCenterX>=areas[i].rightX&&newCenterX<areas[i].rightX+25) {
                
                if(newCenterX-this.speed<=areas[i].rightX+(this.speed+1)){
                    areasCrash = true;
                }
            }
        }   
        if(this.direction=="up"){

            if(newCenterX>=areas[i].leftX&&newCenterX<areas[i].rightX&&newCenterY>=areas[i].bottomY&&newCenterY<areas[i].bottomY+25) {

                if(newCenterY-this.speed<=areas[i].bottomY+(this.speed+1)){
                    areasCrash = true;
                }         
            }
        }   
        if(this.direction=="down"){

            if(newCenterX>areas[i].leftX&&newCenterX<=areas[i].rightX&&newCenterY<=areas[i].topY&&newCenterY>areas[i].topY-25) {

                if(newCenterY+this.speed>=areas[i].topY-(this.speed+1)){
                    areasCrash = true;
                }
            }
        }   

        /////////////////////////////////////HAS TO UNLOCK one particular side (new key after crash) for everyside
        // Continue all 8 sides

        ///// instead of checkCrash >>> checkareas(checkFor)
        ///////////////////////////////////////
        ///////////      if(checkFor=="obstacles"){
            // array >>> obstacles
       ////////////////} else if(checkFor=="roomXtiles")
            // whatArray >>> roomXtiles
            //}
            //for (var i = 0; i < whatArray.length; i++) {
                   // }

            ///  crash -> connect -> steped



    }



    if (areasCrash) {
        return true;
    } else {
        return false;
    }

};



Player.prototype.animationState = function (dead, direction, animRate, moving) {



    if(direction=="up"){
        this.srcX = 35;
    }else if(direction=="down"){

        animCount += animRate;
        if(animCount<2){
            this.srcX = 0;
        }else if(animCount>2&&animCount<4){
            this.srcX = 20;
        }else if(animCount>4){
            animCount =0;
        }
        
    }


}