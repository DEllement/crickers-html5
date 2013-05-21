
var PalmTree = cc.Sprite.extend({
    minRotation: 0,
    maxRotation: 5,
    increment:.03,
    ctor: function () {
        this._super();

        this.scheduleUpdate();
    },
    update: function(delta){
        this._super(delta);

        this.setRotation(this.getRotation()+this.increment);
        //this.setPositionX(this.getPositionX()+this.increment*2);

        if(this.getRotation() >= this.maxRotation){
            this.increment = -.03;
        }
        if(this.getRotation() <= this.minRotation){
            this.increment = .03;
        }

    }
});