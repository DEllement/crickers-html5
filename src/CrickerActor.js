/// <reference path="../js/libs/lib/Cocos2d-html5-v2.1.1.min.js" />

var CrickerActor = cc.Sprite.extend({
    name:"",
    actions: [],
    selected: false,
    isFalling: false,
    isWalking: false,
    ctor: function () {
        this._super();

    },
    select : function(){
        this.selected = true;
        this.stopAction();
        this.runAction(cc.Animate.create(this.actions[0]));
    },
    walkLeft: function () {

        console.log('walkLeft');

        var actionMove = cc.MoveBy.create(.5, cc.p(-this.getBoundingBox().width, 0));

        var actionMoveDone = cc.CallFunc.create(this.onWalkedLeft, this);

        this.stopAction();
        this.runAction(cc.Animate.create(this.actions[0]));
        this.runAction(cc.Sequence.create([actionMove, actionMoveDone]));

        this.isWalking = true;
    },
    walkRight: function () {

        console.log('walkRight');

        var actionMove = cc.MoveBy.create(.5, cc.p(this.getBoundingBox().width, 0));
        var actionMoveDone = cc.CallFunc.create(this.onWalkedRight, this);

        this.stopAction();
        this.runAction(cc.Animate.create(this.actions[0]));
        this.runAction(cc.Sequence.create([actionMove, actionMoveDone]));

        this.isWalking = true;

    },
    onWalkedLeft: function () {
        this.isWalking = false;
    },
    onWalkedRight: function () {
        this.isWalking = false;
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

        console.log("fallDown by" + -distanceY + " during " + speed);

        var actionDown = cc.MoveBy.create(speed, cc.p(0, -distanceY));
        var actionDownDone = cc.CallFunc.create(this.onFalledDown, this);

        this.runAction(cc.Sequence.create([actionDown, actionDownDone]));

        this.isFalling = true;
    }
});
