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
        this.stopAction();
        this.runAction(cc.Animate.create(this.actions[0]));
    },
    walkLeft: function () {

        this.walkDirection = WALK_LEFT;

        var actionMove = cc.MoveBy.create(.5, cc.p(-this.getBoundingBox().width*2, 0));

        var actionMoveDone = cc.CallFunc.create(this.onWalkedLeft, this);

        this.stopAction();
        this.runAction(cc.Animate.create(this.actions[0]));
        this.runAction(cc.Sequence.create([actionMove, actionMoveDone]));

        this.isWalking = true;
    },
    walkRight: function () {

        this.walkDirection = WALK_RIGHT;

        var actionMove = cc.MoveBy.create(.5, cc.p(this.getBoundingBox().width*2, 0));
        var actionMoveDone = cc.CallFunc.create(this.onWalkedRight, this);

        this.stopAction();
        this.runAction(cc.Animate.create(this.actions[0]));
        this.runAction(cc.Sequence.create([actionMove, actionMoveDone]));

        this.isWalking = true;

    },
    onWalkedLeft: function () {
        this.isWalking = false;
        this.lastX -= this.getBoundingBox().width;  //this.getPosition().x;
    },
    onWalkedRight: function () {
        this.isWalking = false;
        this.lastX += this.getBoundingBox().width;//this.getPosition().x;
    },
    onFalledDown: function(){
        this.isFalling = false;
    },
    fallDown: function (toY) {

        var distanceY = this.getPosition().y-Math.max(toY,0);

        if(distanceY == 0){
            this.isFalling = true;
            return;
        }

        var speed = ((distanceY)/this.getBoundingBox().height)*.25;

        //console.log("fallDown by" + -distanceY + " during " + speed);

        var actionDown = cc.MoveBy.create(speed, cc.p(0, -distanceY));
        var actionDownDone = cc.CallFunc.create(this.onFalledDown, this);

        this.runAction(cc.Sequence.create([actionDown, actionDownDone]));

        this.isFalling = true;
    },
    update: function(delta){

         var x = this.getPositionX();


        if(!this.isWalking)
            this.getBody().setPos( new cc.p(this.lastX, this.getPositionY()) );

        else{

             var minX = this.lastX - this.getBoundingBox().width;
             var maxX = this.lastX + this.getBoundingBox().width;

             if(this.walkDirection == WALK_LEFT && this.getPositionX() < minX )
                this.getBody().setPos( new cc.p(minX, this.getPositionY()) );
             if(this.walkDirection == WALK_RIGHT && this.getPositionX() > maxX)
                this.getBody().setPos( new cc.p(maxX, this.getPositionY()) );
        }


        console.log(this.lastX, this.getPositionX());


        //Constraints
        var z = this.getRotation();
        if(this.getRotation() < 0)
            this.setRotation( Math.max(z, -10) );
        else
            this.setRotation( Math.min(z, 10) );

        //if(!this.isWalking)
            //this.setPositionX(this.lastX);


    }
});