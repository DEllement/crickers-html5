var Level001 = LevelScene.extend({
    portalA: null,
    portalB: null,
    portalC: null,
    elevatorA: null,
    crumblingRockA: null,
    crumblingRockB: null,
    crumblingRockC: null,
    lastPortalLogicDeltaTime: 0,
    lastCrumblingRockLogicDeltaTime: 0,
    ctor: function () {
        this._super();

        this.levelXmlPath = "LevelTest_Phx.xml?v=" + new Date().getTime();
    },
    init : function(){
        this._super();

        for(var i = 0; i < this.interactiveObjects.length; i++){
            if(this.interactiveObjects[i].name == "portalA")
                this.portalA = this.interactiveObjects[i];
            else if(this.interactiveObjects[i].name == "portalB")
                this.portalB = this.interactiveObjects[i];
            else if(this.interactiveObjects[i].name == "portalC")
                this.portalC = this.interactiveObjects[i];
            else if(this.interactiveObjects[i].name == "elevatorA")
                this.elevatorA = this.interactiveObjects[i];
            else if(this.interactiveObjects[i].name == "crumblingRockA")
                this.crumblingRockA = this.interactiveObjects[i];
            else if(this.interactiveObjects[i].name == "crumblingRockB")
                this.crumblingRockB = this.interactiveObjects[i];
            else if(this.interactiveObjects[i].name == "crumblingRockC")
                this.crumblingRockC = this.interactiveObjects[i];
        }

        this.portalA.destinationPortal = this.portalB;
        this.portalB.destinationPortal = this.portalC;
        this.portalC.destinationPortal = this.portalA;


        /*this.space.addCollisionHandler(ELEVATOROBJECT_COLLISION_TYPE , BOXOBJECT_COLLISION_TYPE,
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
        );  */

        //TODO: Move in LevelScene has a edge case fixe
        this.space.addCollisionHandler(FLOOR_COLLISION_TYPE , CRUMBLINGBLOCK_OBJECT_COLLISION_TYPE,
            this.resolveCrumblingBlockCollision.bind(this),
            this.resolveCrumblingBlockCollision.bind(this),
            this.resolveCrumblingBlockCollision.bind(this),
            this.resolveCrumblingBlockCollision.bind(this)
        );
        this.space.addCollisionHandler(CRUMBLINGBLOCK_OBJECT_COLLISION_TYPE , CRUMBLINGBLOCK_OBJECT_COLLISION_TYPE,
            this.resolveCrumblingBlockCollision.bind(this),
            this.resolveCrumblingBlockCollision.bind(this),
            this.resolveCrumblingBlockCollision.bind(this),
            this.resolveCrumblingBlockCollision.bind(this)
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

                var teleporting =  this.portalA.testCricker(cricker) || this.portalB.testCricker(cricker) || this.portalC.testCricker(cricker);

                if( teleporting)
                    cricker.isTeleporting = false;
            }
            this.lastPortalLogicDeltaTime = 0;
        }
        this.lastPortalLogicDeltaTime += delta;

        if(this.lastCrumblingRockLogicDeltaTime >= .25){ //Logic is executed each 1/4 second
            for(var i=0; i < this.actors.length; i++){

                if( this.crumblingRockA.isCrumbled && this.space.containsShape(this.crumblingRockA.physicShape) ){
                    this.space.removeShape(this.crumblingRockA.physicShape);
                    //TODO: dispose the block....
                }else{
                    this.crumblingRockA.testCricker(this.actors[i]);
                }

                if( this.crumblingRockB.isCrumbled && this.space.containsShape(this.crumblingRockB.physicShape) ){
                    this.space.removeShape(this.crumblingRockB.physicShape);
                    //TODO: dispose the block....
                }else{
                    this.crumblingRockB.testCricker(this.actors[i]);
                }

                if( this.crumblingRockC.isCrumbled && this.space.containsShape(this.crumblingRockC.physicShape) ){
                    this.space.removeShape(this.crumblingRockC.physicShape);
                    //TODO: dispose the block....
                }else{
                    this.crumblingRockC.testCricker(this.actors[i]);
                }
            }
            this.lastCrumblingRockLogicDeltaTime = 0;
        }
        this.lastCrumblingRockLogicDeltaTime += delta;
    },
    resolveCrumblingBlockCollision: function(arbiter,space){
        return 0;
    }

    /*elevatorCollisionFixes: function(arbiter, space){

        var shapes = arbiter.getShapes();

        //Detect if shapes is on the elevator

        //var elevatorBB = this.elevatorA.getBoundingBoxToWorld();
        //var shape1BB = cc.rect( shapes[1].getBB().l, shapes[1].getBB().b, shapes[1].getBB().r - shapes[1].getBB().l, shapes[1].getBB().t-shapes[1].getBB().b);

        if(cc.rectContainsPoint(this.elevatorA.getBoundingBoxToWorld() , shapes[1].getBody().getPos()))
            shapes[1].getBody().setPos(cc.p(shapes[1].getBody().getPos().x, shapes[1].getBody().getPos().y + (this.elevatorA.increment )));


    }*/

});