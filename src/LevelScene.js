//
var LevelScene = cc.Scene.extend({
    onEnter:function(){
        this._super();

        var selfPointer = this;

        //cc.SPRITE_DEBUG_DRAW = true;

        var winSize = cc.Director.getInstance().getWinSize();

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
            if( layerName == "Playground" )
                layer = new PlaygroundLayer();
            else
                layer = cc.Layer.create();

            layer.init();
            this.addChild(layer);

            var gameSpritesXml = layersXml[i].getElementsByTagName("GameSprite");

            for (var j = 0; j < gameSpritesXml.length; j++) {

                var gameSpriteXml = gameSpritesXml[j];

                var x = parseFloat(gameSpriteXml.getElementsByTagName("X")[0].firstChild.nodeValue);
                var y = parseFloat(gameSpriteXml.getElementsByTagName("Y")[0].firstChild.nodeValue);
                var z = parseInt(gameSpriteXml.getElementsByTagName("ZIndex")[0].firstChild.nodeValue);
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

                }else{
                    sprite = cc.Sprite.create("res" + imageSourceSrc);
                }
                sprite.name = name;
                sprite.assetType = assetType;

                sprite.setAnchorPoint(cc.p(0,1));
                sprite.setPosition(cc.p(x, winSize.height - (0 + y)));
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

        return true;
    }
});