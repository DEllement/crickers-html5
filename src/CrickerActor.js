/// <reference path="../js/libs/lib/Cocos2d-html5-v2.1.1.min.js" />

var CrickerActor = cc.Sprite.extend({
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
    walkLeft: function(){

        console.log('walkLeft');

        var actionMove = cc.MoveBy.create(.5, cc.p(-this.getBoundingBox().width, 0));

        var actionMoveDone =  cc.CallFunc.create(this.onWalkedLeft, this );

        this.stopAction();
        this.runAction(cc.Animate.create(this.actions[0]));
        this.runAction(cc.Sequence.create([actionMove, actionMoveDone]));
    },
    walkRight: function(){

        var me = this;
        console.log('walkRight');

        var actionMove = cc.MoveBy.create(.5, cc.p(this.getBoundingBox().width, 0));
        var actionMoveDone =  cc.CallFunc.create( this.onWalkedRight, this );

        this.stopAction();
        this.runAction(cc.Animate.create(this.actions[0]));
        this.runAction(cc.Sequence.create([actionMove, actionMoveDone]));

    },
    onWalkedLeft :function(){

        console.log('Moved Left' + this.getPosition().x);
        //Move down if there is no crickers below
        var actionDown = cc.MoveBy.create(.5, cc.p(0,-this.getBoundingBox().height*2));
        this.runAction(actionDown);
    },
    onWalkedRight :function(){

        var actionDown = cc.MoveBy.create(.5, cc.p(0,-this.getBoundingBox().height*2));
        this.runAction(actionDown);
    }
});
