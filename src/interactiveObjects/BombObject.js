/**
 * Created with JetBrains WebStorm.
 * User: EMpiRE
 * Date: 10/05/13
 * Time: 10:56 PM
 * To change this template use File | Settings | File Templates.
 */
var BombObject = cc.PhysicsSprite.extend({
    lastPos: null,
    explosionAnim: null,
    exploded: false,
    shape: null,
    ctor: function(){
        this._super();
    },
    explode: function(interactiveObjects){

        //Check Interactive Object to explode : rather than check againts the grid we check againt a Bounding Box
        //Check Crickers too... ????

        var bb = this.getBoundingBoxToWorld();

        var explosionArea = new cc.rect(bb.getX()-bb.getWidth(), bb.getY()-bb.getHeight(), bb.getWidth()*3, bb.getHeight()*3);

        for(var i = 0 ; i < interactiveObjects.length; i++){

            if(interactiveObjects[i] instanceof DestructibleBlock){
               if( cc.rectContainsPoint(explosionArea, interactiveObjects[i].getPosition() ))
                   interactiveObjects[i].explode();
            }
        }

        this.scheduleOnce(this.doExplosion,1);
        //this.initSmokeEmitter();
    },
    doExplosion: function(){
        this.setRotation(0);
        this.runAction( cc.Sequence.create([cc.Animate.create(this.explosionAnim), cc.CallFunc.create(this.onBombExploded,this, null ) ]));
    },
    onBombExploded: function(){
        this.exploded = true;
        //this.setOpacity(0);

        this.stopAllActions();

        this.removeFromParent();

        var curScene = cc.Director.getInstance().getRunningScene();
        curScene.space.removeShape(this.shape);
    }

});