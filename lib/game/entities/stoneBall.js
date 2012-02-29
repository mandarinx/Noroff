ig.module(
	'game.entities.stoneBall'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityStoneBall = ig.Entity.extend({
	size: {x: 18, y: 28},
	offset: {x: 7, y: 2},
    zIndex: -1,

    health: 10,
    
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.FIXED,

	animSheet: new ig.AnimationSheet( 'media/ball.png', 32, 32),

	init: function( x, y, settings ) {
        this.addAnim('idle', 1, [0]);
        this.addAnim('roll', .2, [0,1,2,3]);
		this.parent( x, y, settings ); // Super
		this.currentAnim = this.anims.idle;
	},

	update: function() {
		if (this.standing && this.vel.x > 0 && this.vel.y > 0) {
			this.currentAnim = this.anims.roll;
		}
		this.parent();
	},


});

});
