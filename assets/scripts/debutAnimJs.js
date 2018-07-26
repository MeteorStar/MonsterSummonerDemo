var ms = require('ms');
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    init (unit) {
        this.unit = unit;
        this.getComponent(cc.Animation).play('debutAnim');
    },

    debutAnimFinish () {
        this.unit.active = true;
        this.node.destroy();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
