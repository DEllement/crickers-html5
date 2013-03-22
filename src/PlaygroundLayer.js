
function lineIntersectsRect(p1, p2, r)
{
    return cc.pSegmentIntersect(p1, p2, new cc.p(r.getX(), r.getY()), new cc.p(r.getX() + r.getWidth(), r.getY())) ||
        cc.pSegmentIntersect(p1, p2, new cc.p(r.getX() + r.getWidth(), r.getY()), new cc.p(r.getX() + r.getWidth(), r.getY() + r.getHeight())) ||
        cc.pSegmentIntersect(p1, p2, new cc.p(r.getX() + r.getWidth(), r.getY() + r.getHeight()),new cc.p(r.getX(), r.getY() + r.getHeight())) ||
        cc.pSegmentIntersect(p1, p2, new cc.p(r.getX(), r.getY() + r.getHeight()), new cc.p(r.getX(), r.getY())) ||
        (cc.rectContainsPoint(r, p1 ) && cc.rectContainsPoint(r, p2 ));
}


var PlaygroundLayer = cc.Layer.extend({
    selectedCricker: null,
    init: function () {
        var me = this;
        //////////////////////////////
        // 1. super init first
        this._super();

        this.setTouchEnabled(true);
        //this.schedule(this.validateGravity, 1 / 30);
    },
    onTouchesBegan: function (touches, event) {
        this.touchtStartLocation = touches[0].getLocation();
    },
    onTouchesMoved: function (touches, event) {
        /*if (this.isMouseDown) {
         if (touches) {
         //this.circle.setPosition(cc.p(touches[0].getLocation().x, touches[0].getLocation().y));
         }
         }*/
    },
    onTouchesEnded: function (touches, event) {
        var me = this;
        //SwipeTest
        var isSwippingOver = false;
        var isSwipping = false;
        var swipeDirection = null;

        var startX = this.touchtStartLocation.x;
        var endX = touches[0].getLocation().x;
        var distanceX = Math.max( startX, endX ) - Math.min(startX, endX);
        if( distanceX > 25){
            isSwipping = true;
            swipeDirection = startX < endX ? 'right' : 'left';
        }

        for (var i = 0; i < this.getChildrenCount() ; i++) {
            var cricker = this.getChildren()[i];

            var bb = cricker.getBoundingBoxToWorld();
            var rBB = cc.rect(bb.getX()+9, bb.getY()+11, bb.getWidth()-18, bb.getHeight()-17); //FIXME: get from the body instead...

            if( isSwipping && cricker.selected && lineIntersectsRect( this.touchtStartLocation, touches[0].getLocation() , rBB)){

                if( swipeDirection == 'left')
                    cricker.walkLeft();
                if( swipeDirection == 'right')
                    cricker.walkRight();

            } else if (!isSwipping && !cricker.selected && cc.rectContainsPoint(rBB, touches[0].getLocation())) {

                if( this.selectedCricker){
                    this.selectedCricker.selected = false;
                    this.selectedCricker.stopAction();
                }


                cricker.select();
                this.selectedCricker = cricker;
            }
        }
    },
    onTouchesCancelled: function (touches, event) {
        console.log("onTouchesCancelled");
    },
    validateGravity: function () {  //to Refactor or use Box2D instead...

        for (var i = 0; i < this.getChildrenCount() ; i++) {
            var childSprite = this.getChildren()[i];

            if( childSprite.assetType != "ACTOR_SPRITE")
                continue;

            var cricker = childSprite;

            var bb = cricker.getBoundingBoxToWorld();
            var rBB = cc.rect(bb.getX() + 9, bb.getY() + 8, bb.getWidth() - 18, bb.getHeight() - 17);

            var supported = false;
            var supportedAt = null;

            for (var j = 0; j < this.getChildrenCount() ; j++) {
                var sprite = this.getChildren()[j];

                if(sprite.name == cricker.name)
                    continue;

                var bb2 = sprite.getBoundingBoxToWorld();
                var rBB2 = cc.rect(bb2.getX(), bb2.getY(), bb2.getWidth(), bb2.getHeight());
                if( sprite.assetType == "ACTOR_SPRITE") //Temp will be replaced by Body Data
                    rBB2 = cc.rect(bb2.getX() + 9, bb2.getY() + 8, bb2.getWidth() - 18, bb2.getHeight() - 17);
                
                if (rBB2.getY() < rBB.getY() && cc.rectIntersectsRect(rBB2, rBB)) {
                    supported = true;
                    supportedAt = parseFloat(rBB2.getY())+parseFloat(rBB2.getHeight());
                    break;
                }
            }
            if(!supported){

                var testY = rBB.getY();
                while(!supported && testY > 0 ){

                    var sBB = cc.rect(rBB.getX(), testY--, rBB.getWidth(), rBB.getHeight());

                    for (var k = 0; k < this.getChildrenCount() ; k++) {
                        var sprite2 = this.getChildren()[k];

                        if(sprite2.name == cricker.name)
                            continue;

                        var bb3 = sprite2.getBoundingBoxToWorld();
                        var rBB3 = cc.rect(bb3.getX(), bb3.getY(), bb3.getWidth(), bb3.getHeight());
                        if( sprite2.assetType == "ACTOR_SPRITE") //Temp will be replaced by Body Data
                            rBB3 = cc.rect(bb3.getX() + 9, bb3.getY() + 8, bb3.getWidth() - 18, bb3.getHeight() - 17);

                        if (rBB3.getY() < sBB.getY() && cc.rectIntersectsRect(rBB3, sBB)) {
                            supported = true;
                            supportedAt = parseFloat(rBB3.getY()+rBB3.getHeight())+rBB.getHeight();
                            break;
                        }
                    }
                }
                if(!cricker.isFalling)
                    cricker.fallDown(supported ? supportedAt : -100);

            }
        }
    }
});
