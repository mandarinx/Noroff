ig.module(
	'game.entities.wallExplode'
)
.requires(
	'impact.entity',
	'game.entities.debris'
)
.defines(function(){

EntityWallExplode = ig.Entity.extend({

	size: {x: 16, y: 16},
    gravityFactor: 0,

//	type: ig.Entity.TYPE.B,
//	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.FIXED,

	animSheet: new ig.AnimationSheet( 'media/classical_ruin.png', 16, 16),

	stoneType: "stone1",

	init: function( x, y, settings ) {
        this.addAnim('stone1', 1, [231], true);
        this.addAnim('stone2', 1, [232], true);
		this.parent( x, y, settings ); // Super
	},

	update: function() {
        switch (this.stoneType) {
        	case "stone1": this.currentAnim = this.anims.stone1; break;
        	case "stone2": this.currentAnim = this.anims.stone2; break;
        	default: this.currentAnim = this.anims.stone1; break;
        }

		this.parent();
	},

	triggeredBy: function(entity, trigger) {
//		ig.game.spawnEntity(EntityDebrisParticle, this.pos.x, this.pos.y);
		this.kill();
	}

});

});
