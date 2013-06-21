
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
            this.origY = this.getPosition().y;
        }

        var lastDirection = this.direction;

        if( this.getPosition().y <= this.origY){
            this.direction = "up";
        }else if( this.getPosition().y >= this.origY + this.maxOffsetY){
            this.direction = "down";
        }

        if(this.direction == "up"){
            var pixelDist = this.getPosition().y- this.origY;
            var pixelLeft = this.origY+this.maxOffsetY-this.getPosition().y;

            if( pixelLeft <= 20)
                this.increment = Math.max(.1, pixelLeft/20);
            else if(pixelDist <= 20)
                this.increment = Math.max(.1, pixelDist/20);
            else
                this.increment = 1;
        }else{
            var pixelDist =  this.origY+this.maxOffsetY-this.getPosition().y;
            var pixelLeft = (this.getPosition().y-this.origY);
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

        var newPos = cc.v2f(this.getPosition().x, this.getPosition().y + this.increment);
        this.getBody().setVel(cc.v2fmult(cc.v2fsub(newPos,this.getBody().getPos()), 1.0/delta));
        this.getBody().setPos(newPos);

        this.setNodeDirty();
    }
});