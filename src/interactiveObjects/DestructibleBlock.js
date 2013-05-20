/**
 * Created with JetBrains WebStorm.
 * User: EMpiRE
 * Date: 11/05/13
 * Time: 11:13 PM
 * To change this template use File | Settings | File Templates.
 */
var DestructibleBlock = cc.PhysicsSprite.extend({
    isDestroyed: false,
    shape: null,
    explode: function(){

        if( this.isDestroyed)
            return;

        this.scheduleOnce(this.doExplosion, 2);
        this.isDestroyed = true;
    },
    doExplosion: function(){
        this.runAction(cc.Sequence.create(cc.FadeOut.create(.3), cc.CallFunc.create(this.onExplosionDone,this)));

    },
    onExplosionDone: function(){

        this.removeFromParent();

        var curScene = cc.Director.getInstance().getRunningScene();
        curScene.space.removeShape(this.shape);

    }
});