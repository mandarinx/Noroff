ig.module(
	'game.entities.inputCheck'
)
.requires(
	'impact.entity',
	'impact.game'
)
.defines(function(){

EntityInputCheck = ig.Entity.extend({
	size: {x: 16, y: 16},
	
	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(128, 0, 256, 0.7)',
	
	wait: -1,
	waitTimer: null,
	canFire: true,
	zIndex: -1,

	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.NEVER,

	inputkey: "",
	
	init: function( x, y, settings ) {
		if (settings.checks) {
			this.checkAgainst = ig.Entity.TYPE[settings.checks.toUpperCase()] || ig.Entity.TYPE.A;
			delete settings.check;
		}
		
		this.parent( x, y, settings );
		this.waitTimer = new ig.Timer();
	},
	
	
	check: function(other) {
		if (this.canFire && this.waitTimer.delta() >= 0) {
			if (typeof(other.triggeredByInput) == 'function' && this.inputkey != "" && ig.input.state(this.inputkey)) {
				other.triggeredByInput(this.inputkey);
				this.canFire = false;
			}
			
			if (this.wait != -1) {
				this.waitTimer.set(this.wait);
			}
		}
	},
	
	
	update: function(){}
});

});