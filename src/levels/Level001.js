var Level001 = LevelScene.extend({
    portalA: null,
    portalB: null,
    portalC: null,
    elevatorA: null,
    lastPortalLogicDeltaTime: 0,
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
            if(this.interactiveObjects[i].name == "elevatorA")
                this.elevatorA = this.interactiveObjects[i];
        }

        this.portalA.destinationPortal = this.portalB;
        this.portalB.destinationPortal = this.portalC;
        this.portalC.destinationPortal = this.portalA;


        this.space.addCollisionHandler(ELEVATOROBJECT_COLLISION_TYPE , BOXOBJECT_COLLISION_TYPE,
            null,
            null,
            this.elevatorCollisionFixes.bind(this),
            this.elevatorCollisionFixes.bind(this)
        );
        this.space.addCollisionHandler(ELEVATOROBJECT_COLLISION_TYPE , CRICKER_COLLISION_TYPE,
            null,
            null,
            this.elevatorCollisionFixes.bind(this),
            this.elevatorCollisionFixes.bind(this)
        );
        this.space.addCollisionHandler(BOXOBJECT_COLLISION_TYPE , CRICKER_COLLISION_TYPE,
            null,
            null,
            this.elevatorCollisionFixes.bind(this),
            this.elevatorCollisionFixes.bind(this)
        );

        this.scheduleUpdate();

    },
    update:function(delta){
        this._super(delta);

        this.lastPortalLogicDeltaTime += delta;
        if(this.lastPortalLogicDeltaTime >= .5){ //Logic is executed each 1/2 second

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
            this.lastPortalLogicDeltaTime = 0;
        }
    },
    elevatorCollisionFixes: function(arbiter, space){

        var shapes = arbiter.getShapes();

        //Detect if shapes is on the elevator

        //var elevatorBB = this.elevatorA.getBoundingBoxToWorld();
        //var shape1BB = cc.rect( shapes[1].getBB().l, shapes[1].getBB().b, shapes[1].getBB().r - shapes[1].getBB().l, shapes[1].getBB().t-shapes[1].getBB().b);

        if(cc.rectContainsPoint(this.elevatorA.getBoundingBoxToWorld() , shapes[1].getBody().getPos()))
            shapes[1].getBody().setPos(cc.p(shapes[1].getBody().getPos().x, shapes[1].getBody().getPos().y + (this.elevatorA.increment )));


    }

});