
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
                    this.selectedCricker.unSelect();
                }

                cricker.select();
                this.selectedCricker = cricker;
            }
        }
    },
    onTouchesCancelled: function (touches, event) {
        console.log("onTouchesCancelled");
    }
});
