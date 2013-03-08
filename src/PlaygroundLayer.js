
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
                    cricker.walkLeft();
                if( swipeDirection == 'right')
                    cricker.walkRight();

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
    }
});
