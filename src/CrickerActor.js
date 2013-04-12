/// <reference path="../js/libs/lib/Cocos2d-html5-v2.1.1.min.js" />

WALK_LEFT = 0;
WALK_RIGHT = 1;

var CrickerActor = cc.PhysicsSprite.extend({
    name:"",
    actions: [],
    selected: false,
    walkDirection: "",
    isWalking: false,
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
        this.walkStep = this.getBoundingBox().width;
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
        this.walkStep = this.getBoundingBox().width;

    },
    update: function(delta){

        var x = Math.round(this.getPositionX());

        if(this.isWalking && this.walkStep > 0){
            if(this.walkDirection == WALK_LEFT)
                this.getBody().setPos( new cc.p(x-1, this.getPositionY()) );
            if(this.walkDirection == WALK_RIGHT)
                this.getBody().setPos( new cc.p(x+1, this.getPositionY()) );

            this.walkStep--;

            if(this.walkStep == 0){
                this.lastX = this.getPositionX();
                this.isWalking = false;
            }
        }
        if(!this.isWalking)
            this.getBody().setPos(cc.p(this.lastX, this.getPositionY()));
        else{
             var minX = this.lastX - this.getBoundingBox().width;
             var maxX = this.lastX + this.getBoundingBox().width;

             if(this.walkDirection == WALK_LEFT && this.getPositionX() < minX )
                this.getBody().setPos( new cc.p(Math.round(minX), this.getPositionY()) );
             if(this.walkDirection == WALK_RIGHT && this.getPositionX() > maxX)
                this.getBody().setPos( new cc.p(Math.round(maxX), this.getPositionY()) );
        }

        //Constraints
        var z = this.getRotation();
        /*if(this.getRotation() < 0)
            this.setRotation( Math.max(z, -10) );
        else
            this.setRotation( Math.min(z, 10) );*/

        this.setRotation(0);




    }
});