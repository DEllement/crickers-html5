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
    test: 0,
    update: function(delta){

        this._super();

        if(this.isTeleporting)
            return;

        var x =this.getPositionX();
        var y = /*Math.round(*/this.getPositionY();/*);*/

        this.isFalling = this.lastY != y && Math.max(this.lastY, y)-Math.min(this.lastY, y) > 2;

        var newPos = null;//this.getBody().getPos();

        if( this.isWalking ){
            if(this.walkDirection == WALK_LEFT){
                newPos = cc.v2f(x-1,y);

                var newVelocity = cc.v2fmult(cc.v2fsub(newPos,this.getBody().getPos()), 1.0/delta);

                this.getBody().setVel(cc.v2f(newVelocity.x, this.getBody().getVel().y));
                //this.getBody().setPos( newPos );
            }
            if(this.walkDirection == WALK_RIGHT){
                newPos = cc.v2f(x+1, y);

                var newVelocity = cc.v2fmult(cc.v2fsub(newPos,this.getBody().getPos()), 1.0/delta);

                this.getBody().setVel(cc.v2f(newVelocity.x, this.getBody().getVel().y));
                //this.getBody().setPos( newPos );
            }
            if(!this.isFalling){

                //Detect if he is obstructed
                if(Math.round(x) == Math.round( this.lastX ))
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

                    var destX = Math.floor((x)/curScene.gridSquareSize);
                    var destY = Math.floor(((640-y)/curScene.gridSquareSize));

                    //this.selectedCricker.walkDestination = Math.round(endX);
                    this.gotoCell(destX, destY);
                }

                //Detect if he miss the target destination and bring it back to right direction
                if(!this.isFalling && this.walkDirection == WALK_LEFT && x < this.walkDestination ){
                    this.walkDirection = WALK_RIGHT;

                } else if(!this.isFalling && this.walkDirection == WALK_RIGHT && x > this.walkDestination ){
                    this.walkDirection = WALK_LEFT;
                }

                this.lastX = x;
            }
            this.lastY = y;
        }

        //Stabilise X Pos while Falling
        if(!this.isWalking || this.isFalling){
            if(this.lastX != x)
                this.getBody().setPos(cc.v2f(this.lastX, y));
            this.lastY = y;

            //this.lastX = x;
        }

        if( this.isWalking && Math.round(x) == Math.round(this.walkDestination) ){
            this.isWalking = false;
        }

        //Constraints
        this.setRotation(0);



        //this.setNodeDirty();
    }
});