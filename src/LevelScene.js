//
var LevelScene = cc.Scene.extend({
    onEnter:function(){
        this._super();

        cc.SPRITE_DEBUG_DRAW = false;

        var winSize = cc.Director.getInstance().getWinSize();

        //Chipmunk
        var DENSITY = 1 / 10000;

        this.space = new cp.Space();

        var staticBody = this.space.staticBody;
        var floorShape = new cp.SegmentShape( staticBody, cp.v(0,125), cp.v(winSize.width,125), 0 );
        floorShape.setElasticity(0);
        floorShape.setFriction(1);
        floorShape.setCollisionType(0);

        this.space.addStaticShape( floorShape );

        // Gravity:
        this.space.gravity = cp.v(0,-500);
        this.space.iterations = 15;
        //this.space.sleepTimeThreshold = 0.5;

        //load level data
        if (window.XMLHttpRequest)
            xhttp = new XMLHttpRequest();
        else
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");

        xhttp.open("GET", "res/LevelTest.xml", false);
        xhttp.send();

        var sceneNodeXml = xhttp.responseXML.getElementsByTagName("Level")[0].getElementsByTagName("Scene")[0];
        var layersXml = sceneNodeXml.getElementsByTagName("Layer");

        for (var i = 0; i < layersXml.length; i++) {

            var layerName = layersXml[i].getElementsByTagName("Name")[0].firstChild.nodeValue;

            var layer = null;
            if( layerName == "Background")
                layer = new cc.LazyLayer();
            if( layerName == "Playground" ){
                layer = new PlaygroundLayer();

                //setup physic debug node
                this._debugNode = cc.PhysicsDebugNode.create( this.space );
                this._debugNode.setSpace(this.space);
                this._debugNode.setVisible( true );

                //layer.addChild( this._debugNode );

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
                    sprite = new CrickerActor();
                    sprite.initWithFile("res" + imageSourceSrc);

                    //Chipmunk Cricker Body Setup
                    var mass = w * h * DENSITY;
                    var moment = cp.momentForBox(mass, w, h);
                    var crickerBody = new cp.Body(mass, moment);
                    crickerBody.setPos(cc.p(20, 20));

                    var shape = new cp.BoxShape( crickerBody, w-20, h-12);

                    shape.setElasticity( 0 );
                    shape.setFriction( 1 );
                    shape.setCollisionType(1 );

                    this.space.addBody( crickerBody );
                    this.space.addShape( shape );

                    //this.space.addConstraint( new cp.RotaryLimitJoint(crickerBody, crickerBody, -10, 10) );

                    sprite.setBody(crickerBody);
                }else{
                    sprite = cc.Sprite.create("res" + imageSourceSrc);
                }
                sprite.name = name;
                sprite.assetType = assetType;

                sprite.setAnchorPoint(cc.p(0.5,0.5));
                sprite.setPosition(cc.p((x+(w/2)) , winSize.height-(y+(h/2))));
                sprite.lastX = sprite.getPosition().x;
                sprite.setRotation(0);

                var scaleX = w / sprite.getContentSize().width;
                var scaleY = h / sprite.getContentSize().height;
                sprite.setScaleX(scaleX);
                sprite.setScaleY(scaleY);

                layer.addChild(sprite);

                var animationsXml = gameSpriteXml.getElementsByTagName("Animation");

                for (var k = 0 ; k < animationsXml.length; k++) {

                    var animationXml = animationsXml[k];

                    var animationType = animationXml.getElementsByTagName("AnimationType")[0].firstChild.nodeValue;
                    var spriteSheetID = animationXml.getElementsByTagName("SpriteSheetID")[0].firstChild.nodeValue;
                    var startIndex = animationXml.getElementsByTagName("StartIndex")[0].firstChild.nodeValue;
                    var endIndex = animationXml.getElementsByTagName("EndIndex")[0].firstChild.nodeValue;
                    var frameRate = animationXml.getElementsByTagName("FrameRate")[0].firstChild.nodeValue;
                    var loopAnimation = animationXml.getElementsByTagName("LoopAnimation")[0].firstChild.nodeValue;

                    if (animationType != "IDLE")
                        continue;

                    var spriteSheetPath = "res/Assets/SpritesSheet/" + spriteSheetID + ".png";

                    var texture = cc.TextureCache.getInstance().textureForKey(spriteSheetPath);
                    if(!texture )
                        texture = cc.TextureCache.getInstance().addImage(spriteSheetPath);

                    var spriteSheet = cc.SpriteBatchNode.createWithTexture(texture);
                    var animFrames = [];

                    var framesCol = Math.ceil(Math.sqrt(33));
                    var frameX = 0;
                    var frameY = 0;

                    var frameWidth = 250; //FIXME
                    var frameHeight = 250;

                    for (var l = startIndex ; l < endIndex; l++) {
                        var spriteFrame = cc.SpriteFrame.createWithTexture(spriteSheet.getTexture(), cc.RectMake(frameX * frameWidth, frameY * frameHeight, frameWidth, frameHeight));

                        animFrames.push(spriteFrame);

                        frameX++;
                        if(frameX == framesCol){
                            frameX = 0;
                            frameY++;
                        }
                    }

                    var animation = new cc.Animation()
                    animation.initWithSpriteFrames(animFrames, 0.0333);
                    animation.setRestoreOriginalFrame(true);

                    cc.AnimationCache.getInstance().addAnimation(animation, "cricker_idle");

                    //var idle = cc.Animate.create(animation);

                    sprite.actions.push(animation);

                    //sprite.runAction(cc.RepeatForever.create(idle));

                }

            }
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

        this.scheduleUpdate();


        return true;
    },
    update: function(delta){
        this.space.step( delta );

    }
});