ig.module(
	'game.entities.monsterSkeleton'
)
.requires(
	'impact.entity',
    'game.entities.particle'
)
.defines(function(){
	
EntityMonsterSkeleton = ig.Entity.extend({
	size: {x: 11, y: 19},
	maxVel: {x: 20, y: 0},
	
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	target: null,
	targets: [],
	currentTarget: 0,
	speed: 20,
	flip: false,
	health: 10,

	sfxDie: new ig.Sound('media/skeleton_die.*'),
	
	animSheet: new ig.AnimationSheet('media/monster_skeleton.png', 11, 19),
	
	init: function (x, y, settings) {
		this.addAnim('walk', .2, [0,1,0,2]);
		this.parent(x, y, settings);
		
		// Transform the target object into an ordered array of targets
		this.targets = ig.ksort(this.target);
	},
	
	update: function() {
		var oldDistance = 0;
		var target = ig.game.getEntityByName( this.targets[this.currentTarget] );
		if (target) {
			oldDistance = this.distanceTo(target);
			this.vel.x = this.speed;
		} else {
			this.vel.x = 0;
		}
		
		this.parent();

		var newDistance = this.distanceTo(target);
		if (target && (newDistance > oldDistance || newDistance < 0.5) ) {
			this.currentTarget++;
			this.flip = this.flip == true ? false : true;
			this.currentAnim.flip.x = this.flip;
			this.speed = this.speed * (this.flip ? -1 : 1);
			if (this.currentTarget >= this.targets.length && this.targets.length > 1 ) {
				this.currentTarget = 0;
			}
		}
	},

	receiveDamage: function(amount, from) {
		if (from.entityType == "bomb") {
			from.explode();
			for (var i=0; i<50; i++) {
				var x = Math.random().map( 0,1, this.pos.x, this.pos.x+this.size.x );
				var y = Math.random().map( 0,1, this.pos.y, this.pos.y+this.size.y );
				ig.game.spawnEntity(EntitySkeletonBonesDebris, x, y);
			}
			this.sfxDie.play();
			this.kill();
		}
	},

	check: function(other) {
		other.receiveDamage(10, this);
	}

});

EntitySkeletonBonesDebris = EntityParticle.extend({
    bounciness: 0.2,
    size: {x: 4, y: 4},

    lifetime: 1,
    fadetime: 1,

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER,
    
    animSheet: new ig.AnimationSheet('media/bones_debris.png', 4, 4),
    
    init: function (x, y, settings) {
        this.addAnim('idle', 5, [0,1,2,3,4,5,6,7]);
        this.parent(x, y, settings);

        this.vel.x = (Math.random() * 100) - 50;
        this.vel.y = (Math.random() * 100) - 100;
        this.friction.x = this.vel.x * -.3;
        this.friction.y = this.vel.y * -.3;
    },
});

});