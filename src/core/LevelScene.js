//

TEAM_RED = 0;
TEAM_GREEN = 1;
TEAM_BLUE = 2;
TEAM_ORANGE = 3;

FLOOR_COLLISION_TYPE = 100;
CRICKER_COLLISION_TYPE = 101;
BOXOBJECT_COLLISION_TYPE = 110;
PORTALOBJECT_COLLISION_TYPE = 111;
ELEVATOROBJECT_COLLISION_TYPE = 112;
CRUMBLINGBLOCK_OBJECT_COLLISION_TYPE = 113;
BOMB_OBJECT_COLLISION_TYPE = 114;

var LevelScene = cc.Scene.extend({
    actors:[],
    interactiveObjects:[],
    gridSquareSize: 60,
    levelXmlPath: "LevelTest_Phx.xml",
    touchAnim:null,
    onEnter:function(){
        this._super();

        cc.SPRITE_DEBUG_DRAW = false;

        var winSize = cc.Director.getInstance().getWinSize();

        //Chipmunk
        var DENSITY = 1;

        // physic:
        this.space = new cp.Space();
        this.space.gravity = cp.v(0,-500);
        this.space.iterations = 10;
        this.space.collisionBias = Math.pow(1 - 0.2, 60);
        this.space.sleepTimeThreshold = .5;

        var staticBody = this.space.staticBody;

        //load level data
        if (window.XMLHttpRequest)
            xhttp = new XMLHttpRequest();
        else
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");

        xhttp.open("GET", "res/" + this.levelXmlPath, false);
        xhttp.send();

        var sceneNodeXml = xhttp.responseXML.getElementsByTagName("Level")[0].getElementsByTagName("Scene")[0];

        this.gridSquareSize = sceneNodeXml.getElementsByTagName("GridSquareSize")[0].firstChild.nodeValue;

        var layersXml = sceneNodeXml.getElementsByTagName("Layer");

        for (var i = 0; i < layersXml.length; i++) {

            var layerName = layersXml[i].getElementsByTagName("Name")[0].firstChild.nodeValue;

            var layer = null;
            if( layerName == "Background")
                layer = new cc.Layer.create();
            if( layerName == "Playground" ){
                layer = new PlaygroundLayer();

                //setup physic debug node
                this._debugNode = cc.PhysicsDebugNode.create( this.space );
                this._debugNode.setSpace(this.space);
                this._debugNode.setVisible( true );
                if(window.location.toString().indexOf('PHYSIC_DEBUG=1') >= 0)
                    layer.addChild( this._debugNode );

                var physicBodiesXml =  layersXml[i].getElementsByTagName("PhysicBody");
                for(var j = 0; j < physicBodiesXml.length; j++){

                    var physicBodyXml = physicBodiesXml[j];

                    var physicBody_x = parseFloat(physicBodyXml.getElementsByTagName("X")[0].firstChild.nodeValue);
                    var physicBody_y = parseFloat(physicBodyXml.getElementsByTagName("Y")[0].firstChild.nodeValue);
                    var physicBody_w = parseFloat(physicBodyXml.getElementsByTagName("Width")[0].firstChild.nodeValue);
                    var physicBody_h= parseFloat(physicBodyXml.getElementsByTagName("Height")[0].firstChild.nodeValue);


                    staticBody.setPos(cc.p((physicBody_x+(physicBody_w/2)) , winSize.height-(physicBody_y+(physicBody_h/2))));

                    var boxShape = new cp.BoxShape( staticBody, physicBody_w, physicBody_h);
                    boxShape.setElasticity(0);
                    boxShape.setFriction(2);
                    boxShape.setCollisionType(FLOOR_COLLISION_TYPE);

                    this.space.addStaticShape( boxShape );
                }
            }else
                layer = cc.Layer.create();

            layer.init();
            layer.name = layerName;

            this.addChild(layer);

            var gameSpritesXml = layersXml[i].getElementsByTagName("GameSprite");

            for (var j = 0; j < gameSpritesXml.length; j++) {

                var gameSpriteXml = gameSpritesXml[j];

                var x = parseFloat(gameSpriteXml.getElementsByTagName("X")[0].firstChild.nodeValue);
                var y = parseFloat(gameSpriteXml.getElementsByTagName("Y")[0].firstChild.nodeValue);
                //var z = parseInt(gameSpriteXml.getElementsByTagName("ZIndex")[0].firstChild.nodeValue);
                var w = parseFloat(gameSpriteXml.getElementsByTagName("Width")[0].firstChild.nodeValue);
                var h = parseFloat(gameSpriteXml.getElementsByTagName("Height")[0].firstChild.nodeValue);
                var assetType = gameSpriteXml.getElementsByTagName("AssetType")[0].firstChild.nodeValue;
                var imageSourceSrc = gameSpriteXml.getElementsByTagName("ImageSourceStr")[0].firstChild.nodeValue;
                var name = gameSpriteXml.getElementsByTagName("Name")[0].firstChild.nodeValue;

                //Create sprite based on data
                var sprite = null;
                if (assetType == "ACTOR_SPRITE") {

                    var team = gameSpriteXml.getElementsByTagName("Team")[0].firstChild.nodeValue;

                    sprite = new CrickerActor();
                    sprite.initWithFile("res" + imageSourceSrc);
                    //sprite.setAnchorPoint(cc.p(0.5,0.4));
                    //Chipmunk Cricker Body Setup
                    var mass = w * h * DENSITY;
                    var moment = cp.momentForBox(mass, w-(w*0.3), h-(h *.3));
                    var crickerBody = new cp.Body(mass, moment);

                    var shape = new cp.BoxShape( crickerBody,  w-(w*0.3), h-(h *.28));

                    shape.setElasticity( 0 );
                    shape.setFriction(0);
                    shape.setCollisionType(CRICKER_COLLISION_TYPE);
                    //shape.group = name;

                    //sprite.team = team;
                    sprite.shape = shape;

                    this.space.addBody( crickerBody );
                    this.space.addShape( shape );

                    crickerBody.resetForces();

                    sprite.setBody(crickerBody);

                    if( team == "Blue"){
                        sprite.team = TEAM_BLUE;
                        sprite.idleAnim = SpriteSheetsLoader.createAnimationFromSpriteSheetFileName("blue_02","blue_02_80x80.png", 12 , 8, 93 ,cc.size(81,80));
                        sprite.holdingAnim = SpriteSheetsLoader.createAnimationFromSpriteSheetFileName("blue_04","blue_04_80x80.png", 10 , 8, 71 ,cc.size(95,80));
                        sprite.selectedIdleAnim = SpriteSheetsLoader.createAnimationFromSpriteSheetFileName("blue_13","blue_13_80x80.png", 6 , 4, 21 ,cc.size(80,80));
                        sprite.walkingAnim = SpriteSheetsLoader.createAnimationFromSpriteSheetFileName("blue_07-08","blue_07-08_80x80.png", 6 , 4, 19 ,cc.size(80,81));
                    }else if(team == "Green"){
                        sprite.team = TEAM_GREEN;
                        sprite.idleAnim = SpriteSheetsLoader.createAnimationFromSpriteSheetFileName("vert_02","vert_02_80x80.png", 12 , 5, 75 ,cc.size(81,81));
                        sprite.selectedIdleAnim = SpriteSheetsLoader.createAnimationFromSpriteSheetFileName("vert_13","vert_13_80x80.png", 6 , 4, 21 ,cc.size(81,80));
                        sprite.walkingAnim = SpriteSheetsLoader.createAnimationFromSpriteSheetFileName("vert_07-08","vert_07-08_80x80.png", 6 , 4, 19 ,cc.size(81,81));
                    }else if(team == "Orange"){
                        sprite.team = TEAM_ORANGE;
                        sprite.idleAnim = SpriteSheetsLoader.createAnimationFromSpriteSheetFileName("orange_02","orange_02_80x80.png", 12 , 4, 50 ,cc.size(80,80));
                        sprite.selectedIdleAnim = SpriteSheetsLoader.createAnimationFromSpriteSheetFileName("orange_13","orange_13_80x80.png", 6 , 3, 17 ,cc.size(80,81));
                        sprite.walkingAnim = SpriteSheetsLoader.createAnimationFromSpriteSheetFileName("orange_07-08","orange_07-08_80x80.png", 6 , 4, 23 ,cc.size(80,81));
                    }else{
                        sprite.team = TEAM_RED;
                        sprite.idleAnim = SpriteSheetsLoader.createAnimationFromSpriteSheetFileName("red_02","red_02_80x80.png", 12 , 6, 65 ,cc.size(81,80));
                        sprite.selectedIdleAnim = SpriteSheetsLoader.createAnimationFromSpriteSheetFileName("red_13","red_13_80x80.png", 6 , 4, 21 ,cc.size(81,81));
                        sprite.walkingAnim = SpriteSheetsLoader.createAnimationFromSpriteSheetFileName("red_07-08","red_07-08_80x80.png", 6 , 3, 18 ,cc.size(81,82));
                    }
                    sprite.explosionAnim = SpriteSheetsLoader.createAnimationFromSpriteSheetFileName("explosion_1024_167","explosion_1024_167.png", 6 , 5, 28 ,cc.size(167,167));

                    sprite.playIdleAnim();

                    this.actors.push(sprite);
                }
                else if( assetType == "INTERACTIVE_SPRITE" ){

                    if( name.indexOf("portal") >= 0){
                        sprite = new PortalObject();
                        sprite.initWithFile("res" + imageSourceSrc);
                    }
                    if (name.indexOf("box") >= 0){
                        sprite = new BoxObject();
                        sprite.initWithFile("res" + imageSourceSrc);

                        var mass = w * h * DENSITY;
                        var moment = cp.momentForBox(mass,  w, h);
                        var boxBody = new cp.Body(mass, moment);

                        var shape = new cp.BoxShape( boxBody, w, h);

                        shape.setElasticity( 0 );
                        shape.setFriction(.5);
                        shape.setCollisionType(BOXOBJECT_COLLISION_TYPE);
                        shape.group = name;

                        this.space.addBody( boxBody );
                        this.space.addShape( shape );

                        boxBody.resetForces();

                        sprite.setBody(boxBody);
                    }
                    if (name.indexOf("elevator") >= 0){

                        sprite = new ElevatorObject();
                        sprite.initWithFile("res" + imageSourceSrc);

                        var elevatorBody = new cp.Body(Infinity, Infinity);

                        var shape = new cp.BoxShape( elevatorBody, w, 20);

                        shape.setElasticity(0);
                        shape.setFriction(2);
                        shape.setCollisionType(ELEVATOROBJECT_COLLISION_TYPE);
                        shape.group = name;

                        //this.space.addBody( elevatorBody );
                        this.space.addShape( shape );

                        sprite.setAnchorPoint(cc.p(0.5,0.4));
                        sprite.setBody(elevatorBody);

                        sprite.currentY = sprite.origY;
                    }
                    if(name.indexOf("crumblingRock") >= 0){

                        sprite = CrumblingBlock.create("res/Assets/Sprites/crumblingRockl1.png",5,.5);

                        var crumblingRockBody = new cp.Body(9999999, 9999999);

                        var shape = new cp.BoxShape( crumblingRockBody, w, h);

                        shape.setElasticity(0);
                        shape.setFriction(2);
                        shape.setCollisionType(CRUMBLINGBLOCK_OBJECT_COLLISION_TYPE);
                        shape.group = name;

                        //this.space.addBody( crumblingRockBody );
                        this.space.addShape( shape );

                        sprite.physicShape = shape; //Be carefull for memory leak here
                        sprite.setBody(crumblingRockBody);
                    }
                    if (name.indexOf("bomb") >= 0){
                        sprite = new BombObject();
                        sprite.initWithFile("res" + imageSourceSrc);
                        sprite.explosionAnim = SpriteSheetsLoader.createAnimationFromSpriteSheetFileName("explose_01","explose_01.png", 7 , 4, 28 ,cc.size(267,241));

                        var smokeTexture = cc.TextureCache.getInstance().addImage("res/Assets/Sprites/bomb_smoke.png");
                        sprite.smokeTexture = smokeTexture;

                        var radius = 19;
                        var mass = radius * radius * DENSITY;
                        var moment = cp.momentForCircle(mass, 0, radius, cp.v(0,0) );
                        var bombBody = new cp.Body(mass, moment);

                        var shape = new cp.CircleShape( bombBody, radius ,cp.v(0,0));

                        shape.setElasticity( 0 );
                        shape.setFriction( 1 );
                        shape.setCollisionType(BOMB_OBJECT_COLLISION_TYPE);
                        shape.group = name;

                        this.space.addBody( bombBody );
                        this.space.addShape( shape );

                        //bombBody.resetForces();

                        sprite.shape = shape;

                        sprite.setBody(bombBody);
                    }
                    if(name.indexOf("destructibleBlock") >= 0){

                        sprite = new DestructibleBlock();
                        sprite.initWithFile("res/Assets/Sprites/crumblingRockl1.png");

                        var destructibleBlockBody = new cp.Body(9999999, 9999999);

                        var shape = new cp.BoxShape( destructibleBlockBody, w, h);

                        shape.setElasticity(0);
                        shape.setFriction(2);
                        shape.setCollisionType(CRUMBLINGBLOCK_OBJECT_COLLISION_TYPE);
                        shape.group = name;

                        //this.space.addBody( crumblingRockBody );
                        this.space.addShape( shape );


                        sprite.shape = shape; //Be carefull for memory leak here
                        sprite.setBody(destructibleBlockBody);
                    }

                    this.interactiveObjects.push(sprite);
                }
                else if( assetType == "ANIMATED_SPRITE"){

                    if( name.indexOf("palmTree") >= 0 ){

                        sprite = new PalmTree();
                        sprite.initWithFile("res" + imageSourceSrc);

                        sprite.setAnchorPoint(cc.p(0.5,0));

                        y = y+(h/2);

                    }

                }
                else{
                    sprite = cc.Sprite.create("res" + imageSourceSrc);
                    //sprite.setAnchorPoint(cc.p(0.5,0.5));

                }
                sprite.name = name;
                sprite.assetType = assetType;

                sprite.setPosition(cc.p((x+(w/2)) , winSize.height-(y+(h/2))));


                sprite.lastX = sprite.getPosition().x;
                sprite.setRotation(0);

                var scaleX = w / sprite.getContentSize().width;
                var scaleY = h / sprite.getContentSize().height;
                sprite.setScaleX(scaleX);
                sprite.setScaleY(scaleY);

                layer.addChild(sprite);
            }
            this.touchAnim = SpriteSheetsLoader.createAnimationFromSpriteSheetFileName("touch_anim","touch_anim.png", 4 , 4, 15 ,cc.size(60,60));
        }

        //Arrange Z order
        var layerZOrder = 0;
        var spriteZOrder = 0;
        for(var i =  this.getChildrenCount()-1; i >=0 ; i--)
        {
            var layer = this.getChildren()[i];
            layer.setZOrder(layerZOrder++);

            spriteZOrder = 0;

            for(var j = layer.getChildrenCount()-1; j >=0 ; j--)
            {
                var sprite = layer.getChildren()[j];
                sprite.setZOrder(spriteZOrder++);
            }
        }
        this.init();

        this.playLevelIntro();

        return true;
    },
    update: function(delta){

        this._super();


        this.space.step(1/60); // 1/60 Fixed time step


    },
    onMatchFound: function(team){

        //Remove Crickers from the crickers Array and explode them!
        for( var i = this.actors.length-1 ; i >= 0 ; i--){

            var cricker = this.actors[i];

            if(cricker.team == team){
                this.actors.splice(i, 1);
                cricker.doExplosion();
            }

        }
        //Score


    },
    checkCrickers: function(){

        var requiredMatch = 1; //or 4 or this.requiredMatch
        var winSize = cc.Director.getInstance().getWinSize();
        var cols = Math.ceil(winSize.width/this.gridSquareSize);
        var rows = Math.ceil(winSize.height/this.gridSquareSize);

        //Build Crickers matrix
        var crickersMatrix = createArray(cols,rows);
        var crickersPosArr = [];

        for( var i = 0 ; i < this.actors.length; i++){

            var cricker = this.actors[i];

            var cellX = Math.floor(cricker.getPosition().x/this.gridSquareSize);
            var cellY = Math.floor((winSize.height-cricker.getPosition().y)/this.gridSquareSize);

            crickersMatrix[cellX][cellY] = cricker.team;
            crickersPosArr.push(cc.p(cellX, cellY));  //just for x & y
        }
        //Check Matching Crickers
        var foundMatch = 0;
        for( var i = 0 ; i < this.actors.length; i++){

            foundMatch = 0;
            var team = this.actors[i].team;
            var pos = crickersPosArr[i];

            //Check left
            if( pos.x != 0 && crickersMatrix[pos.x-1][pos.y] == team ){
                foundMatch++;
                if( pos.x-1 != 0 && crickersMatrix[pos.x-2][pos.y] == team ){
                    foundMatch++;
                    if( pos.x-2 != 0 && crickersMatrix[pos.x-3][pos.y] == team ){
                        foundMatch++;
                        if( pos.x-3 != 0 && crickersMatrix[pos.x-4][pos.y] == team )
                            foundMatch++;
                    }
                }
            }

            if( foundMatch == requiredMatch){
                this.onMatchFound(team);
                break;
            }

            //Check right
            if( pos.x != cols && crickersMatrix[pos.x+1][pos.y] == team ){
                foundMatch++;
                if( pos.x+1 != cols && crickersMatrix[pos.x+2][pos.y] == team ){
                    foundMatch++;
                    if( pos.x+2 != cols && crickersMatrix[pos.x+3][pos.y] == team ){
                        foundMatch++;
                        if( pos.x+3 != cols && crickersMatrix[pos.x+4][pos.y] == team )
                            foundMatch++;
                    }
                }
            }

            if( foundMatch == requiredMatch){
                this.onMatchFound(team);
                break;
            }

            //Check up
            if( pos.y != 0 && crickersMatrix[pos.x][pos.y-1] == team ){
                foundMatch++;
                if( pos.y-1 != 0 && crickersMatrix[pos.x][pos.y-2] == team ){
                    foundMatch++;
                    if( pos.y-2 != 0 && crickersMatrix[pos.x][pos.y-3] == team ){
                        foundMatch++;
                        if( pos.y-3 != 0 && crickersMatrix[pos.x][pos.y-4] == team )
                            foundMatch++;
                    }
                }
            }

            if( foundMatch == requiredMatch){
                this.onMatchFound(team);
                break;
            }

            //Check down
            if( pos.y != rows && crickersMatrix[pos.x][pos.y+1] == team ){
                foundMatch++;
                if( pos.y+1 != rows && crickersMatrix[pos.x][pos.y+2] == team ){
                    foundMatch++;
                    if( pos.y+2 != rows && crickersMatrix[pos.x][pos.y+3] == team ){
                        foundMatch++;
                        if( pos.y+3 != rows && crickersMatrix[pos.x][pos.y+4] == team )
                            foundMatch++;
                    }
                }
            }

            if( foundMatch == requiredMatch){
                this.onMatchFound(team);
                break;
            }
        }

        console.log(foundMatch);

        //Check Cricker Support (Anim)

        for( var i = 0 ; i < this.actors.length; i++){

            var crickerHeld = 0;
            var pos = crickersPosArr[i];
            var onTopOfCricker = false;

            //Check down
            if( pos.y != rows && crickersMatrix[pos.x][pos.y+1] != null ){
                onTopOfCricker = true;
            }

            //Check up
            if( pos.y != 0 && crickersMatrix[pos.x][pos.y-1] != null ){
                crickerHeld++;
                if( pos.y-1 != 0 && crickersMatrix[pos.x][pos.y-2] != null ){
                    crickerHeld++;
                    if( pos.y-2 != 0 && crickersMatrix[pos.x][pos.y-3] != null ){
                        crickerHeld++;
                        if( pos.y-3 != 0 && crickersMatrix[pos.x][pos.y-4] != null )
                            crickerHeld++;
                    }
                }
            }

            this.actors[i].setIsHoldingCricker(crickerHeld > 0);
        }

        //Check Portal Location
    },
    playLevelIntro: function(){

        var backgroundLayer = this.getChildren()[4];
        var middleBackgroundLayer = this.getChildren()[3];
        var playgroundLayer = this.getChildren()[2];
        var middleForegroundLayer = this.getChildren()[1];
        var foregroundLayer = this.getChildren()[0];

        backgroundLayer.setPositionY(-600);
        middleBackgroundLayer.setPositionY(-650);
        playgroundLayer.setPositionY(-700);
        middleForegroundLayer.setPositionY(-700);
        foregroundLayer.setPositionY(-800);

        this.scheduleOnce(this.setLayerPosition, 2);
    },
    setLayerPosition: function(){

        var backgroundLayer = this.getChildren()[4];
        var middleBackgroundLayer = this.getChildren()[3];
        var playgroundLayer = this.getChildren()[2];
        var middleForegroundLayer = this.getChildren()[1];
        var foregroundLayer = this.getChildren()[0];

        backgroundLayer.runAction(cc.MoveTo.create(2,cc.p(0,0)));
        middleBackgroundLayer.runAction(cc.MoveTo.create(2,cc.p(0,0)));
        playgroundLayer.runAction(cc.MoveTo.create(2,cc.p(0,0)));
        middleForegroundLayer.runAction(cc.MoveTo.create(2,cc.p(0,0)));
        foregroundLayer.runAction(cc.MoveTo.create(2,cc.p(0,0)));

        this.onLayerReady();

    },
    onLayerReady:function(){
        //this.scheduleUpdate();
        this.schedule(this.checkCrickers,.5);

        for(var i = 0 ; i < this.actors.length; i++){
            var cricker = this.actors[i];
            cricker.scheduleUpdate();
        }



    }
});