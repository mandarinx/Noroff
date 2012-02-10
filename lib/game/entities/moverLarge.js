/*
Simple Mover that visits all its targets in an ordered fashion. You can use
the void entities (or any other) as targets.


Keys for Weltmeister:

speed
	Traveling speed of the mover in pixels per second.
	Default: 20

target.1, target.2 ... target.n
	Names of the entities to visit.
*/

ig.module(
	'game.entities.moverLarge'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityMoverLarge = ig.Entity.extend({
	size: {x: 30, y: 78},
	offset: {x:1, y:1},
	maxVel: {x: 100, y: 0},
    zIndex: 1000, 

	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.FIXED,

	target: null,
	speed: 20,
	currentTarget: 0,
	targets: [],
	gravityFactor: 0,
	move: false,

	sfx: new ig.Sound('media/stone_drag.*'),

	animSheet: new ig.AnimationSheet('media/mover_large.png', 32, 80),


	init: function( x, y, settings ) {
		this.addAnim('idle', 1, [0]);
		this.parent(x, y, settings);

		// Transform the target object into an ordered array of targets
		this.targets = ig.ksort(this.target);
	},

	update: function() {
		if (this.move) {
			var oldDistance = 0;
			var target = ig.game.getEntityByName( this.targets[this.currentTarget] );
			if (target) {
				oldDistance = this.distanceTo(target);
				this.vel.x = 60;
			} else {
				this.vel.x = 0;
			}
			
			this.parent();

			var newDistance = this.distanceTo(target);

			if (target && (newDistance > oldDistance || newDistance < 0.5)) {
				this.move = false;
			}
		}
	},

	triggeredBy: function (entity, trigger) {
		this.move = true;
		this.sfx.play();
	},

});

});
