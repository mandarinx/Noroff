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
	'game.entities.mover'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityMover = ig.Entity.extend({
	size: {x: 80, y: 16},
	maxVel: {x: 100, y: 100},
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.FIXED,
	
	target: null,
	targets: [],
	currentTarget: 0,
	speed: 20,
	gravityFactor: 0,
	width: 5,
	
	animSheet: new ig.AnimationSheet('media/platform_mover.png', 80, 16),
	
	init: function( x, y, settings ) {
		this.addAnim('five', 1, [0]);
		this.addAnim('four', 1, [1]);
		this.addAnim('three', 1, [2]);
		this.addAnim('two', 1, [3]);
		this.parent( x, y, settings );
		this.resize();
		
		// Transform the target object into an ordered array of targets
		this.targets = ig.ksort( this.target );
	},
	
	update: function() {
		var oldDistance = 0;
		var target = ig.game.getEntityByName( this.targets[this.currentTarget] );
		if( target ) {
			oldDistance = this.distanceTo(target);
			
			var angle = this.angleTo( target );
			this.vel.x = Math.cos(angle) * this.speed;
			this.vel.y = Math.sin(angle) * this.speed;
		}
		else {
			this.vel.x = 0;
			this.vel.y = 0;
		}
		
		this.parent();
		
		// Are we close to the target or has the distance actually increased?
		// -> Set new target
		var newDistance = this.distanceTo(target);
		if( target && (newDistance > oldDistance || newDistance < 0.5) ) {
			this.pos.x = target.pos.x + target.size.x*.5 - this.size.x*.5;
			this.pos.y = target.pos.y + target.size.y*.5 - this.size.y*.5;
			this.currentTarget++;
			if( this.currentTarget >= this.targets.length && this.targets.length > 1 ) {
				this.currentTarget = 0;
			}
		}
	},

	resize: function() {
		switch (this.width) {
			case 5:
				this.currentAnim = this.anims.five;
				this.size = {x:80, y:16};
				break;
			case 4:
				this.currentAnim = this.anims.four;
				this.size = {x:64, y:16};
				break;
			case 3:
				this.currentAnim = this.anims.three;
				this.size = {x:48, y:16};
				break;
			case 2:
				this.currentAnim = this.anims.two;
				this.size = {x:32, y:16};
				break;
			default:
				this.currentAnim = this.anims.five;
				this.size = {x:80, y:16};
				break;
		}
	},
});

});