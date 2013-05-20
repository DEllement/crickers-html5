
EasingFunctions = {
    // no easing, no acceleration
    linear: function (t) { return t },
    // accelerating from zero velocity
    easeInQuad: function (t) { return t*t },
    // decelerating to zero velocity
    easeOutQuad: function (t) { return t*(2-t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
    // accelerating from zero velocity
    easeInCubic: function (t) { return t*t*t },
    // decelerating to zero velocity
    easeOutCubic: function (t) { return (--t)*t*t+1 },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
    // accelerating from zero velocity
    easeInQuart: function (t) { return t*t*t*t },
    // decelerating to zero velocity
    easeOutQuart: function (t) { return 1-(--t)*t*t*t },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
    // accelerating from zero velocity
    easeInQuint: function (t) { return t*t*t*t*t },
    // decelerating to zero velocity
    easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
    // acceleration until halfway, then deceleration
    easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}

function lineIntersectsRect(p1, p2, r)
{
    return cc.pSegmentIntersect(p1, p2, new cc.p(r.getX(), r.getY()), new cc.p(r.getX() + r.getWidth(), r.getY())) ||
        cc.pSegmentIntersect(p1, p2, new cc.p(r.getX() + r.getWidth(), r.getY()), new cc.p(r.getX() + r.getWidth(), r.getY() + r.getHeight())) ||
        cc.pSegmentIntersect(p1, p2, new cc.p(r.getX() + r.getWidth(), r.getY() + r.getHeight()),new cc.p(r.getX(), r.getY() + r.getHeight())) ||
        cc.pSegmentIntersect(p1, p2, new cc.p(r.getX(), r.getY() + r.getHeight()), new cc.p(r.getX(), r.getY())) ||
        (cc.rectContainsPoint(r, p1 ) && cc.rectContainsPoint(r, p2 ));
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}