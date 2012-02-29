ig.module(
	'game.entities.weapon'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityWeapon = ig.Entity.extend({
	size: {x: 16, y: 16},
    gravityFactor: 0,
    zIndex: -1,

	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.NEVER,

	sfx: new ig.Sound('media/powerup_pickup.*'),

	weaponType: "NONE",
	weaponName: "none",
	weapon: null,
	amount: 10,

	init: function( x, y, settings ) {
		this.parent(x, y, settings);
	},

	check: function(other) {
    	if (this.touches(ig.game.player)) {
    		other.gotWeapon(this);
    		this.kill();
		}
	},
/*
	update: function() {
		if (ig.input.pressed(this.weaponName)) {
			console.log("set weapon to "+this.weaponName);
			ig.game.player.setCurWeapon(this);
		}
		this.parent();	
	},
*/
});

});
