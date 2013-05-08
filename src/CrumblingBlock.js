var CrumblingBlock = cc.PhysicsSprite.extend({
    sprites: null,
    hotspotBB: null,
    falloutDurationByPart: null,
    delay: null,
    currentSpriteIndex: null,
    isCrumbled: false,
    ctor: function(){
        this._super();
    },
    testCricker: function(cricker){

        if(!this.hotspotBB){
            this.hotspotBB = this.getBoundingBoxToWorld();
            this.hotspotBB.setY(this.hotspotBB.getY()+10);
            this.hotspotBB.setX( this.hotspotBB.getX()+ this.hotspotBB.getWidth()/4 );
            this.hotspotBB.setWidth(this.hotspotBB.getWidth()/2);
            console.log(this.hotspotBB.getWidth());
        }


        var bb = cricker.getBoundingBoxToWorld();
        var crickerBB = cc.rect(bb.getX()+9, bb.getY()+11, bb.getWidth()-18, bb.getHeight()-17);

        //Check if is intersecting the hostSpot
        if( cc.rectIntersectsRect(this.hotspotBB, crickerBB) ){
            this.schedule(this.startCrumbling,.15);
            return true;
        }

        return false;
    },
    startCrumbling: function(){

        if(this.currentSpriteIndex == this.sprites.length){
            return;
        }

        var sprite = this.sprites[this.currentSpriteIndex++];

        var actionMove = cc.MoveBy.create(1, cc.p(0, -200));
        var actionFade = cc.FadeOut.create(1);
        //this.scheduleOnce(this.startCrumbling, .2);

        sprite.runAction(actionMove);
        sprite.runAction(actionFade);

        if(this.currentSpriteIndex == this.sprites.length){
            this.isCrumbled = true;
            this.unschedule(this.startCrumbling);
        }
    },
    update:function(delta){
        this._super(delta);
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