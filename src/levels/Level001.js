var Level001 = LevelScene.extend({
    portalA: null,
    portalB: null,
    portalC: null,
    ctor: function () {
        this._super();

        this.levelXmlPath = "LevelTest_Phx.xml?v=" + new Date().getTime();


    },
    init : function(){
        this._super();

        for(var i = 0; i < this.interactiveObjects.length; i++){
            if(this.interactiveObjects[i].name == "portalA")
                this.portalA = this.interactiveObjects[i];
            if(this.interactiveObjects[i].name == "portalB")
                this.portalB = this.interactiveObjects[i];
            if(this.interactiveObjects[i].name == "portalC")
                this.portalC = this.interactiveObjects[i];
        }

        this.portalA.destinationPortal = this.portalB;
        this.portalB.destinationPortal = this.portalC;
        this.portalC.destinationPortal = this.portalA;

        //this.scheduleUpdate();

    },
    update:function(delta){
        this._super(delta);

        for(var i=0; i < this.actors.length; i++){
            //Check if one of the crickers is inside one of the portal
            var cricker = this.actors[i];

            if(cricker.isTeleporting)
                continue;

            if( this.portalA.testCricker(cricker)){}
            else if(this.portalB.testCricker(cricker)){}
            else if(this.portalC.testCricker(cricker)){}

            if(cricker.isTeleporting)
                cricker.isTeleporting = false;
        }

    }

});