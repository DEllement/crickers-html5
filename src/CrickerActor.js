/// <reference path="../js/libs/lib/Cocos2d-html5-v2.1.1.min.js" />

WALK_LEFT = 0;
WALK_RIGHT = 1;

var CrickerActor = cc.PhysicsSprite.extend({
    name:"",
    actions: [],
    selected: false,
    walkDirection: "",
    isWalking: false,
    isFalling: false,
    isTeleporting: false,
    walkStep:0,
    ctor: function () {
        this._super();

        this.scheduleUpdate();
    },
    select : function(){
        this.selected = true;
        this.stopAllActions();
        this.runAction(cc.RepeatForever.create(cc.Animate.create(this.actions[0])));
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
    update: function(delta){

        if(this.isTeleporting)
            return;

        var x = Math.round(this.getPositionX());
        var y = Math.round(this.getPositionY());

        this.isFalling = this.lastY != y && Math.max(this.lastY, y)-Math.min(this.lastY, y) > 2;

        if( this.isWalking ){
            if(this.walkDirection == WALK_LEFT)
                this.getBody().setPos( new cc.p(x-1, this.getPositionY()) );
            if(this.walkDirection == WALK_RIGHT)
                this.getBody().setPos( new cc.p(x+1, this.getPositionY()) );

            if(!this.isFalling){

                //Detect if he is obstructed
                if(x == this.lastX)
                    this.xStuck++;
                else
                    this.xStuck = 0;

                if(this.xStuck >= 3){
                    this.isWalking = false;
                    //TODO: Move back to grid X align position
                }

                this.lastX = this.getPositionX();
            }
            this.lastY = y;
        }

        //Stabilise X Pos
        if(!this.isWalking || this.isFalling)
            this.getBody().setPos(cc.p(this.lastX, this.getPositionY()));

        if( this.isWalking && Math.round(this.getPositionX()) == this.walkDestination ){
            this.isWalking = false;
            //TODO: Move back to grid X align position
        }

        //Constraints
        this.setRotation(0);

        this.setNodeDirty();




    }
});