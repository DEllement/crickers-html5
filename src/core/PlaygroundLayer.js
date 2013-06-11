



var PlaygroundLayer = cc.Layer.extend({
    selectedCricker: null,
    drawDestination: false,
    init: function () {
        var me = this;
        //////////////////////////////
        // 1. super init first
        this._super();


        this.touchSpriteArr = [];

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
        var isSwipping = false;
        var isSelection = false;
        var swipeDirection = null;
        var startX = this.touchtStartLocation.x;
        var endX = touches[0].getLocation().x;
        var endY = touches[0].getLocation().y;
        var distanceX = Math.max( startX, endX ) - Math.min(startX, endX);
        if( distanceX > 25){
            isSwipping = true;
            swipeDirection = startX < endX ? 'right' : 'left';
        }

        var curScene = cc.Director.getInstance().getRunningScene();

        //Check for Selection && Walking if swipping
        for (var i = 0; i < curScene.actors.length; i++) {
            var cricker = curScene.actors[i];

            //console.log(cricker.team);

            var bb = cricker.getBoundingBox();
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

                //console.log("cricker selected");

                cricker.select();
                this.selectedCricker = cricker;
                isSelection = true;
            }
        }

        if(!isSwipping){
            var touchSprite = cc.Sprite.create();
            touchSprite.setPosition(touches[0].getLocation());
            curScene.getChildren()[4].addChild(touchSprite); //TODO: create an adorner layer
            touchSprite.runAction(cc.Sequence.create([cc.Animate.create(curScene.touchAnim) , cc.CallFunc.create(this.removeTouch,this ) ]));  /* Could be a id... */
            this.touchSpriteArr.push(touchSprite);
        }


        //Check for point and click move
        if(!isSwipping && !isSelection && this.selectedCricker){

            var walkDirection = endX > this.selectedCricker.getPositionX() ? "right" : "left";

            if(walkDirection == "left")
                this.selectedCricker.walkLeft();
            else
                this.selectedCricker.walkRight();

            //TODO: Encapsulate
            var xOffset = -(960/2);
            var yOffset = -(640/2);

            var destX = Math.floor((endX)/curScene.gridSquareSize);
            var destY = Math.floor(((640-endY)/curScene.gridSquareSize));

            //this.selectedCricker.walkDestination = Math.round(endX);
            this.selectedCricker.gotoCell(destX, destY);
            this.drawDestinationCell(destX, destY, 120);
        }
    },
    onTouchesCancelled: function (touches, event) {
        console.log("onTouchesCancelled");
    },
    removeTouch: function(){
        var sprite = this.touchSpriteArr.shift();

        sprite.removeFromParent();

    },
    /*draw: function(ctx){
        this._super(ctx);

       /* var xOffset = -(960/2);
        var yOffset = -(640/2);

        //Script for displaying the Level Grid
        var gridSquareSize = cc.Director.getInstance().getRunningScene().gridSquareSize;

        /*for(var y = 0 ; y <= 640/gridSquareSize; y++){


            cc.drawingUtil.drawLine( cc.p(0+xOffset, 640 - (y*gridSquareSize)+yOffset), cc.p(960+xOffset, 640 - (y*gridSquareSize)+yOffset) );

            for(var x = 0 ; x <= 960/gridSquareSize; x++){

                cc.drawingUtil.drawLine( cc.p((x*gridSquareSize)+xOffset, 0+yOffset), cc.p((x*gridSquareSize)+xOffset, 640+yOffset) );

            }
        }

        if(this.drawDestination){
           this.drawDestinationDelai--;

            var scene = cc.Director.getInstance().getRunningScene();

            var destX = (this.currDestination.x * scene.gridSquareSize)+(scene.gridSquareSize/2);
            var destY = (this.currDestination.y * scene.gridSquareSize)+(scene.gridSquareSize/2);
            cc.drawingUtil.drawCircle(cc.p(destX+xOffset, 640- destY+yOffset), scene.gridSquareSize/2, 0, 1, false  )


           if(this.drawDestinationDelai <= 0)
               this.drawDestination = false;
        }


    }, */
    drawDestinationCell: function(cellX, cellY, delai){
        this.drawDestination = true;
        this.currDestination = cc.p(cellX, cellY);
        this.drawDestinationDelai = delai;
    }
});
