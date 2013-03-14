
function lineIntersectsRect(p1, p2, r)
{
    return cc.pSegmentIntersect(p1, p2, new cc.p(r.getX(), r.getY()), new cc.p(r.getX() + r.getWidth(), r.getY())) ||
        cc.pSegmentIntersect(p1, p2, new cc.p(r.getX() + r.getWidth(), r.getY()), new cc.p(r.getX() + r.getWidth(), r.getY() + r.getHeight())) ||
        cc.pSegmentIntersect(p1, p2, new cc.p(r.getX() + r.getWidth(), r.getY() + r.getHeight()),new cc.p(r.getX(), r.getY() + r.getHeight())) ||
        cc.pSegmentIntersect(p1, p2, new cc.p(r.getX(), r.getY() + r.getHeight()), new cc.p(r.getX(), r.getY())) ||
        (cc.rectContainsPoint(r, p1 ) && cc.rectContainsPoint(r, p2 ));
}


var PlaygroundLayer = cc.Layer.extend({
    init: function () {
        var me = this;
        //////////////////////////////
        // 1. super init first
        this._super();

        this.setTouchEnabled(true);
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
        if( distanceX > 75){
            isSwipping = true;
            swipeDirection = startX < endX ? 'right' : 'left';
        }

        for (var i = 0; i < this.getChildrenCount() ; i++) {
            var cricker = this.getChildren()[i];

            var bb = cricker.getBoundingBoxToWorld();
            var rBB = cc.rect(bb.getX()+9, bb.getY()+11, bb.getWidth()-18, bb.getHeight()-17); //FIXME: get from the body instead...

            if( isSwipping && cricker.selected && lineIntersectsRect( this.touchtStartLocation, touches[0].getLocation() , rBB)){

                if( swipeDirection == 'left')
                    cricker.walkLeft(function () { me.validateGravity(); });
                if( swipeDirection == 'right')
                    cricker.walkRight(function () { me.validateGravity(); });

            } else if (!cricker.selected && cc.rectContainsPoint(rBB, touches[0].getLocation())) {

                cricker.select();

            } else {
                cricker.selected = false;
                cricker.stopAction();
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
            var rBB = cc.rect(bb.getX() + 9, bb.getY() + 11, bb.getWidth() - 18, bb.getHeight() - 17);
            var sBB = cc.rect(bb.getX() + 2, bb.getY() -10 , bb.getWidth() - 4, 10);

            var supported = false;
            var supportedAt = null;

            for (var j = 0; j < this.getChildrenCount() ; j++) {
                var sprite = this.getChildren()[j];
                var bb2 = sprite.getBoundingBoxToWorld();
                var rBB2 = bb2;
                if( sprite.assetType == "ACTOR_SPRITE") //Temp will be replaced by Body Data
                    rBB2 = cc.rect(bb2.getX() + 9, bb2.getY() + 11, bb2.getWidth() - 18, bb2.getHeight() - 17);
                
                if (cc.rectIntersectsRect(rBB2, sBB)) {
                    supported = true;
                    supportedAt = parseFloat(rBB2.getY())+parseFloat(rBB2.getHeight());
                    break;
                }
            }
            if(!supported){

                var testY = sBB.getY();
                while(!supported && testY > 0 ){

                    sBB.setY(testY--);

                    for (var k = 0; k < this.getChildrenCount() ; k++) {
                        var sprite2 = this.getChildren()[k];
                        var bb3 = sprite2.getBoundingBoxToWorld();
                        var rBB3 = bb3;
                        if( sprite2.assetType == "ACTOR_SPRITE") //Temp will be replaced by Body Data
                            rBB3 = cc.rect(bb3.getX() + 9, bb3.getY() + 11, bb3.getWidth() - 18, bb3.getHeight() - 17);

                        if (cc.rectIntersectsRect(rBB3, sBB)) {
                            supported = true;
                            supportedAt = parseFloat(rBB3.getY()+rBB3.getHeight())+rBB.getHeight();
                            break;
                        }
                    }
                }

                cricker.fallDown(supported ? supportedAt : -100);

            }
        }
    }
});
