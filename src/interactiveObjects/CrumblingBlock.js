var CrumblingBlock = cc.PhysicsSprite.extend({
    sprites: null,
    falloutDurationByPart: null,
    delay: null,
    currentSpriteIndex: null,
    isCrumbled: false,
    physicShape: null,
    ctor: function(){
        this._super();
    },
    startShaking: function(){
        for(var i = 0 ; i < this.sprites.length; i++){
            if(Math.round(Math.random()) == 0)
                this.sprites[i].runAction(cc.RepeatForever.create(cc.Sequence.create([cc.MoveBy.create(.1, cc.p(-2, 0)),
                    cc.MoveBy.create(.1, cc.p(2, 0)),
                    cc.MoveBy.create(.1, cc.p(-2, 0)),
                    cc.MoveBy.create(.1, cc.p(2, 0))])));
            else
                this.sprites[i].runAction(cc.RepeatForever.create(cc.Sequence.create([cc.MoveBy.create(.1, cc.p(0, -2)) ,
                    cc.MoveBy.create(.1, cc.p(0, 2)),
                    cc.MoveBy.create(.1, cc.p(0, -2)) ,
                    cc.MoveBy.create(.1, cc.p(0, 2))])));
        }

        this.schedule(this.startCrumbling,.15, this.sprites.length, 2 );
    },
    startCrumbling: function(){

        if( this.currentSpriteIndex == this.sprites.length){
            return;
        }

        var sprite = this.sprites[this.currentSpriteIndex++];
        sprite.stopAllActions();

        var actionMove = cc.MoveBy.create(1, cc.p(0, -200));
        var actionFade = cc.FadeOut.create(1);

        sprite.runAction(actionMove);
        sprite.runAction(actionFade);


        if(this.currentSpriteIndex == this.sprites.length){
            this.isCrumbled = true;
            this.unschedule(this.startCrumbling);

            var curScene = cc.Director.getInstance().getRunningScene();
            curScene.space.removeShape(this.physicShape);

        }
    }
});

CrumblingBlock.create = function(spritesBaseFileName, totalSprite, delay){

    var sprite = new CrumblingBlock();
    sprite.initWithFile(spritesBaseFileName);

    sprite.sprites = [];

    var spriteBaseFileName = spritesBaseFileName.replace("/Sprites/","/SpritesComponents/").replace(".png","") + "_";

    for(var i = 0 ; i < totalSprite; i++){

        var subSprite = cc.Sprite.create( spriteBaseFileName +i + ".png");

        sprite.sprites.push( subSprite );

        sprite.addChild( subSprite);

        subSprite.setAnchorPoint(cc.p(0,0));
        subSprite.setPosition(cc.p(0,0));
        subSprite.setScaleX(sprite.getScaleX());
        subSprite.setScaleY(sprite.getScaleY());
    }
    sprite.sprites.reverse();

    sprite.delay = delay ? delay : 1;
    sprite.falloutDurationByPart = .3;

    sprite.setOpacity(0);

    return sprite;
};