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
    explosionAnim: null,
    idleAnim: null,
    selectedIdleAnim: null,
    isExploded: false,
    ctor: function () {
        this._super();

        this.scheduleUpdate();
    },
    select : function(){
        this.selected = true;
        this.stopAllActions();
        this.setFlipX(false);
        this.runAction(cc.RepeatForever.create(cc.Animate.create(this.selectedIdleAnim)));
        this.getBody().activate();
    },
    unSelect: function(){
        this.selected = false;
        this.setFlipX(false);
        this.stopAllActions();
        this.playIdleAnim();
    },
    walkLeft: function () {

        this.getBody().activate();

        this.walkDirection = WALK_LEFT;

        this.walkDestination = 0;
        this.setIsWalking(true);

    },
    walkRight: function () {

        this.getBody().activate();

        this.walkDirection = WALK_RIGHT;

        this.walkDestination = 2000;
        this.setIsWalking(true);

    },
    doExplosion: function(){

        this.isExploded = true;

        this.stopAllActions();
        this.setRotation(0);

        this.runAction( cc.Sequence.create([cc.Animate.create(this.explosionAnim), cc.CallFunc.create(this.onCrickerExploded,this, null ) ]));
    },
    onCrickerExploded: function(){
        //Remove from parent
        //this.setOpacity(0);

        this.isExploded = true;

        this.stopAllActions();
        this.removeFromParent();
        this.unscheduleUpdate();

        var scene = cc.Director.getInstance().getRunningScene();
        scene.space.removeShape(this.shape);

        //Garbage Collect?

    },
    playIdleAnim: function(){

        if(this.isExploded)
            return;

        this.stopAllActions();
        this.setFlipX(false);
        this.runAction( cc.RepeatForever.create(cc.Animate.create(this.selected ? this.selectedIdleAnim : this.idleAnim)));
    },
    setIsWalking: function(value){

        if( this.isExploded)
            return;

        if(value && !this.isWalking){
            this.stopAllActions();
            this.runAction(cc.RepeatForever.create(cc.Animate.create(this.walkingAnim)));
        }else if(!value && this.isWalking) {
            this.playIdleAnim();
        }

        this.isWalking = value;

    },
    gotoCell: function(cellX, cellY){

        var scene = cc.Director.getInstance().getRunningScene();

        this.walkDestination = ((cellX * scene.gridSquareSize)) + (scene.gridSquareSize/2);
        this.setIsWalking(true);
        console.log("cX:" + cellX + " cY:" + cellY + " " + this.walkDestination);
    },
    update: function(delta){

        this._super();

        //Constraints
        this.setRotation(0);

        if(this.isTeleporting)
            return;
        if( this.isExploded )
            return;

        var x = this.getPositionX();
        var y = this.getPositionY();

        this.isFalling = this.lastY != y && Math.max(this.lastY, y)-Math.min(this.lastY, y) > 2;

        var newPos = null;

        if( this.isWalking ){
            if(this.walkDirection == WALK_LEFT){
                newPos = cc.v2f(x-1,y);

                var newVelocity = cc.v2fmult(cc.v2fsub(newPos,this.getBody().getPos()), 1.0/delta);

                this.getBody().setVel(cc.v2f(newVelocity.x, this.getBody().getVel().y));

                this.setFlipX(true);
            }
            if(this.walkDirection == WALK_RIGHT){
                newPos = cc.v2f(x+1, y);

                var newVelocity = cc.v2fmult(cc.v2fsub(newPos,this.getBody().getPos()), 1.0/delta);

                this.getBody().setVel(cc.v2f(newVelocity.x, this.getBody().getVel().y));

                this.setFlipX(false);
            }
            if(!this.isFalling){

                //Detect if he is obstructed
                if(Math.round(x) == Math.round( this.lastX ))
                    this.xStuck++;
                else
                    this.xStuck = 0;

                if( this.xStuck >= 3){
                    this.setIsWalking(false);
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
        }

        if( this.isWalking && Math.round(x) == Math.round(this.walkDestination) ){
            this.setIsWalking(false);
        }


    }
});