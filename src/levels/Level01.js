var Level01 = LevelScene.extend({
    portalA: null,
    portalB: null,
    portalC: null,
    elevatorA: null,
    crumblingRockA: null,
    crumblingRockB: null,
    crumblingRockC: null,
    bombA: null,
    bombB: null,
    lastPortalLogicDeltaTime: 0,
    lastCrumblingRockLogicDeltaTime: 0,
    ctor: function () {
        this._super();
        this.name = "01";
        this.levelXmlPath = "Level01.xml?v=" + new Date().getTime();
    },
    init : function(){
        this._super();


        this.scheduleUpdate();
    },
    update:function(delta){
        this._super(delta);


    }
});