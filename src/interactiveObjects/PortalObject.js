var PortalObject = cc.Sprite.extend({
    destinationPortal: null,
    innerCricker: null,
    ctor: function () {
        this._super();

        this.scheduleUpdate();
    },
    update: function(delta){

    },
    testCricker:function(cricker){

        if( cricker.isTeleporting )
            return;

        var bb = cricker.getBoundingBoxToWorld();
        var crickerBB = cc.rect(bb.getX()+9, bb.getY()+11, bb.getWidth()-18, bb.getHeight()-17);

        var portalBB = this.getBoundingBoxToWorld();

        //Check if is inside
        if( cc.rectContainsRect(portalBB, crickerBB) )
            this.innerCricker = cricker;

        if(this.innerCricker == cricker && !cricker.isTeleporting && !cricker.isWalking && !cricker.isFalling){
           this.teleport(cricker);
           return true;
        }

        this.innerCricker = null;
        cricker.isTeleporting = false;

        return false;
    },
    teleport:function(cricker){

        if(!this.destinationPortal.innerCricker){

            cricker.isTeleporting = true;
            cricker.isWalking = false;
            cricker.isFalling = false;

            this.destinationPortal.innerCricker = cricker;

            cricker.lastX = this.destinationPortal.getPosition().x;
            cricker.getBody().setPos(this.destinationPortal.getPosition());
            cricker.setPosition(this.destinationPortal.getPosition());
            cricker.setNodeDirty();

            this.innerCricker = null;
            cricker.isTeleporting = false;
        }
    }
});