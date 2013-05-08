/// <reference path="../js/libs/lib/Cocos2d-html5-v2.1.1.min.js" />

WALK_LEFT = 0;
WALK_RIGHT = 1;

var CrickerActor = cc.PhysicsSprite.extend({
    name:"",
    actions: [],
    selected: false,
    walkDirection: "",
    walkStep:0,
    walkDestination: 0,
    isWalking: false,
    isFalling: false,
    isTeleporting: false,
    ctor: function () {
        this._super();

        this.scheduleUpdate();
    },
    select : function(){
        this.selected = true;
        this.stopAllActions();
        //TODO: Fix this part
        //this.runAction(cc.RepeatForever.create(cc.Animate.create(this.actions[0])));
        this.getBody().activate();
    },
    unSelect: function(){
        this.selected = false;
        this.stopAllActions();
        //this.startIdleAnimation();
    },
    walkLeft: function () {

        this.getBody().activate();

        this.walkDirection = WALK_LEFT;

        var actionMove = cc.MoveBy.create(.5, cc.p(-this.getBoundingBox().width, 0));

        var actionMoveDone = cc.CallFunc.create(this.onWalkedLeft, this);
        var x = Math.round(this.getPositionX());
        this.stopAction();
        /*this.runAction(cc.Animate.create(this.actions[0]));
        this.runAction(cc.Sequence.create([actionMove, actionMoveDone]));  */
        //this.getBody().setPos( new cc.p(x-1, this.getPositionY()) );
        this.isWalking = true;
        this.walkStep += this.getBoundingBox().width;
    },
    walkRight: function () {

        this.walkDirection = WALK_RIGHT;

        var actionMove = cc.MoveBy.create(.5, cc.p(this.getBoundingBox().width, 0));
        var actionMoveDone = cc.CallFunc.create(this.onWalkedRight, this);
        var x = Math.round(this.getPositionX());
        this.stopAction();
        /*this.runAction(cc.Animate.create(this.actions[0]));
        this.runAction(cc.Sequence.create([actionMove, actionMoveDone]));*/
       // this.getBody().setPos( new cc.p(x+1, this.getPositionY()) );
        this.isWalking = true;
        this.walkStep += this.getBoundingBox().width;

    },
    gotoCell: function(cellX, cellY){

        var scene = cc.Director.getInstance().getRunningScene();

        this.walkDestination = ((cellX * scene.gridSquareSize)) + (scene.gridSquareSize/2);
        this.isWalking = true;
        console.log("cX:" + cellX + " cY:" + cellY + " " + this.walkDestination);
    },
    update: function(delta){

        if(this.isTeleporting)
            return;

        var x = Math.round(this.getPositionX());
        var y = Math.round(this.getPositionY());

        this.isFalling = this.lastY != y && Math.max(this.lastY, y)-Math.min(this.lastY, y) > 2;

        if( this.isWalking ){
            if(this.walkDirection == WALK_LEFT){
                var newPos = cc.v2f(x-1, this.getPositionY());
                this.getBody().setPos( newPos );
            }
            if(this.walkDirection == WALK_RIGHT){
                var newPos = cc.v2f(x+1, this.getPositionY());
                this.getBody().setPos( newPos );
            }
            if(!this.isFalling){

                //Detect if he is obstructed
                if(x == this.lastX)
                    this.xStuck++;
                else
                    this.xStuck = 0;

                if( this.xStuck >= 3){
                    this.isWalking = false;
                    //TODO: Move back to grid X align position, get the cell and walk trought there
                    //TODO: Encapsulate

                    var curScene = cc.Director.getInstance().getRunningScene();

                    var xOffset = -(960/2);
                    var yOffset = -(640/2);

                    var destX = Math.floor((this.getPositionX())/curScene.gridSquareSize);
                    var destY = Math.floor(((640-this.getPositionY())/curScene.gridSquareSize));

                    //this.selectedCricker.walkDestination = Math.round(endX);
                    this.gotoCell(destX, destY);
                }

                //Detect if he miss the target destination and bring it back to right direction
                if(!this.isFalling && this.walkDirection == WALK_LEFT && this.getPositionX() < this.walkDestination ){
                    this.walkDirection = WALK_RIGHT;

                } else if(!this.isFalling && this.walkDirection == WALK_RIGHT && this.getPositionX() > this.walkDestination ){
                    this.walkDirection = WALK_LEFT;
                }

                this.lastX = Math.round(this.getPositionX());
            }
            this.lastY = y;
        }

        //Stabilise X Pos while Falling
        if(!this.isWalking || this.isFalling){
            this.getBody().setPos(cc.v2f(this.lastX, this.getPositionY()));
        }

        if( this.isWalking && Math.round(this.getPositionX()) == this.walkDestination ){
            this.isWalking = false;
        }

        //Constraints
        this.setRotation(0);

        this.setNodeDirty();




    }
});