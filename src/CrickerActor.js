/// <reference path="../js/libs/lib/Cocos2d-html5-v2.1.1.min.js" />

var CrickerActor = cc.Sprite.extend({
    name:"",
    actions: [],
    selected: false,
    ctor: function () {
        this._super();

    },
    select : function(){
        this.selected = true;
        this.stopAction();
        this.runAction(cc.Animate.create(this.actions[0]));
    },
    walkLeft: function (walkFinishCallBack) {

        var me = this;
        console.log('walkLeft');

        var actionMove = cc.MoveBy.create(.5, cc.p(-this.getBoundingBox().width, 0));

        var actionMoveDone = cc.CallFunc.create(walkFinishCallBack, this);

        this.stopAction();
        this.runAction(cc.Animate.create(this.actions[0]));
        this.runAction(cc.Sequence.create([actionMove, actionMoveDone]));
    },
    walkRight: function (walkFinishCallBack) {

        var me = this;
        console.log('walkRight');

        var actionMove = cc.MoveBy.create(.5, cc.p(this.getBoundingBox().width, 0));
        var actionMoveDone = cc.CallFunc.create(walkFinishCallBack, this);

        this.stopAction();
        this.runAction(cc.Animate.create(this.actions[0]));
        this.runAction(cc.Sequence.create([actionMove, actionMoveDone]));

    },
    onWalkedLeft: function () {

        if (callBack)
            callBack(this);

        console.log('Moved Left' + this.getPosition().x);
        
    },
    onWalkedRight: function () {

        if (callBack)
            callBack(this);
    },
    fallDown: function (toY) {

        var distanceY = this.getPosition().y-Math.max(toY,0);

        var speed = ((distanceY)/this.getBoundingBox().height)*.25;

        console.log("fallDown by" + -distanceY + " during " + speed);

        var actionDown = cc.MoveBy.create(speed, cc.p(0, -distanceY));
        this.runAction(actionDown);
    }
});
