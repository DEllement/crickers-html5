/**
 * Created with JetBrains WebStorm.
 * User: EMpiRE
 * Date: 29/04/13
 * Time: 8:50 PM
 * To change this template use File | Settings | File Templates.
 */

EasingFunctions = {
    // no easing, no acceleration
    linear: function (t) { return t },
    // accelerating from zero velocity
    easeInQuad: function (t) { return t*t },
    // decelerating to zero velocity
    easeOutQuad: function (t) { return t*(2-t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
    // accelerating from zero velocity
    easeInCubic: function (t) { return t*t*t },
    // decelerating to zero velocity
    easeOutCubic: function (t) { return (--t)*t*t+1 },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
    // accelerating from zero velocity
    easeInQuart: function (t) { return t*t*t*t },
    // decelerating to zero velocity
    easeOutQuart: function (t) { return 1-(--t)*t*t*t },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
    // accelerating from zero velocity
    easeInQuint: function (t) { return t*t*t*t*t },
    // decelerating to zero velocity
    easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
    // acceleration until halfway, then deceleration
    easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}

var ElevatorObject = cc.PhysicsSprite.extend({
    origY: -9999999,
    origX: 0,
    direction: "down",
    maxOffsetY:200,
    increment: 1,
    waitDelta: 0,
    ctor: function () {
        this._super();



        this.scheduleUpdate();

    },
    update: function(delta){
        this._super(delta);

        if( this.origY == -9999999 ){
            this.origY = this.getPositionY();
        }

        var lastDirection = this.direction;

        if( this.getPositionY() <= this.origY){
            this.direction = "up";
        }else if( this.getPositionY() >= this.origY + this.maxOffsetY){
            this.direction = "down";
        }

        if(this.direction == "up"){
            var pixelDist = this.getPositionY()- this.origY;
            var pixelLeft = this.origY+this.maxOffsetY-this.getPositionY();

            if( pixelLeft <= 20)
                this.increment = Math.max(.1, pixelLeft/20);
            else if(pixelDist <= 20)
                this.increment = Math.max(.1, pixelDist/20);
            else
                this.increment = 1;
        }else{
            var pixelDist =  this.origY+this.maxOffsetY-this.getPositionY();
            var pixelLeft = (this.getPositionY()-this.origY);
            if( pixelLeft <= 20)
                this.increment = -Math.max(.1, pixelLeft/20);
            else if(pixelDist <= 20)
                this.increment = -Math.max(.1, pixelDist/20);
            else
                this.increment = -1;
        }
        if( this.direction != lastDirection)
            this.waitDelta = 60;

        if(this.waitDelta > 0){
            this.increment = 0;
            this.waitDelta--;
        }

        var newPos = cc.v2f(this.getPositionX(), this.getPositionY() + this.increment);
        this.getBody().setVel(cc.v2fmult(cc.v2fsub(newPos,this.getBody().getPos()), 1.0/delta));
        this.getBody().setPos(newPos);
    }
});