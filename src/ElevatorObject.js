/**
 * Created with JetBrains WebStorm.
 * User: EMpiRE
 * Date: 29/04/13
 * Time: 8:50 PM
 * To change this template use File | Settings | File Templates.
 */
var ElevatorObject = cc.PhysicsSprite.extend({
    origY: -9999999,
    origX: 0,
    direction: "down",
    maxOffsetY:200,
    increment: 1,
    ctor: function () {
        this._super();

        this.scheduleUpdate();
    },
    update: function(delta){
        this._super(delta);

        if( this.origY == -9999999 ){
            this.origY = this.getPositionY();
        }


        if( this.getPositionY() <= this.origY){
            console.log("up");
            this.direction = "up";
            this.increment = 1;
        }else if( this.getPositionY() >= this.origY + this.maxOffsetY ){
            console.log("down");
            this.direction = "down";

            this.increment = -1;
        }

        this.getBody().setPos(cc.p(this.getPositionX(), this.getPositionY() + this.increment));


    }
});