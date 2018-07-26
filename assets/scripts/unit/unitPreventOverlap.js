var ms = require('ms');
cc.Class({
    extends: cc.Component,

    onCollisionStay (other, self) {
        if(other.node.group === 'Body'){
            if(other.node.parent.position.x > self.node.parent.position.x){
                if(other.node.parent.position.y > self.node.parent.position.y){
                    self.node.parent.runAction(cc.moveBy(0.01, -cc.random0To1() * 1, -cc.random0To1() * 1).easing(cc.easeCubicActionInOut()));
                }else{  
                    self.node.parent.runAction(cc.moveBy(0.01, -cc.random0To1() * 1, cc.random0To1() * 1).easing(cc.easeCubicActionInOut()));
                }
            }else{
                if(other.node.parent.position.y > self.node.parent.position.y){
                    self.node.parent.runAction(cc.moveBy(0.01, cc.random0To1() * 1, -cc.random0To1() * 1).easing(cc.easeCubicActionInOut()));
                }else{
                    self.node.parent.runAction(cc.moveBy(0.01, cc.random0To1() * 1, cc.random0To1() * 1).easing(cc.easeCubicActionInOut()));
                }
            }  
        }
    },
});
