var SpriteSheetsLoader = {};

SpriteSheetsLoader.createAnimationFromSpriteSheetFileName = function(animationName, fileName, numCols, numRows, numFrames, frameSize){

    var startIndex = 0;
    var endIndex = numFrames-1;

    var spriteSheetPath = "res/Assets/SpritesSheet/" + fileName;

    var texture = cc.TextureCache.getInstance().textureForKey(spriteSheetPath);
    if(!texture )
        texture = cc.TextureCache.getInstance().addImage(spriteSheetPath);

    var spriteSheet = cc.SpriteBatchNode.createWithTexture(texture);
    var animFrames = [];

    var frameX = 0;
    var frameY = 0;

    var frameWidth = frameSize.width;
    var frameHeight = frameSize.height;

    for (var l = startIndex ; l < endIndex; l++) {
        var spriteFrame = cc.SpriteFrame.createWithTexture(spriteSheet.getTexture(), cc.RectMake(frameX * frameWidth, frameY * frameHeight, frameWidth, frameHeight));

        animFrames.push(spriteFrame);

        frameX++;
        if( frameX == numCols ){
            frameX = 0;
            frameY++;
        }
    }

    var animation = new cc.Animation();
    animation.initWithSpriteFrames(animFrames, 0.0333);
    animation.setRestoreOriginalFrame(false);

    cc.AnimationCache.getInstance().addAnimation(animation, "cricker_idle");

    return animation;
};
