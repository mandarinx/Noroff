ig.module(
	'game.entities.powerup'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPowerup = ig.Entity.extend({
	size: {x: 16, y: 16},
    gravityFactor: 0,
    zIndex: -1,

	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.NEVER,

	powerupType: "bomb",
	full: true,
	open: false,
	amount: 10,

	sfx: new ig.Sound('media/powerup_pickup.*'),

	animSheet: new ig.AnimationSheet( 'media/powerup.png', 16, 16),

	init: function( x, y, settings ) {
        this.addAnim('idle', 1, [0]);
        this.addAnim('openFull', .3, [0,1], true);
        this.addAnim('openEmpty', .3, [0,2], true);
        this.addAnim('empty', 1, [2]);
		this.parent( x, y, settings ); // Super
	},

	update: function() {
		if (this.open && this.full) {
			this.currentAnim = this.anims.openFull;
		} else if (this.open && !this.full) {
			this.currentAnim = this.anims.empty;
		} else {
			this.currentAnim = this.anims.idle;
		}
		this.parent();
	},

	check: function(other) {
		if (!this.open) {
			this.open = true;

        	if (this.touches(ig.game.player)) {
				this.full = false;
				ig.game.player.pickedupPowerup(this);
				this.sfx.play();
			}
		}
	},

});

});
