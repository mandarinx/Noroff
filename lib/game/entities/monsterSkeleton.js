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
	maxVel: {x: 120, y: 100},
//	friction: {x: 200, y: 100},
	
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	target: null,
	targets: [],
	currentTarget: 0,
	speed: 20,
	flip: false,
	health: 3,

	hit: 0,
	attack: false,
	hitPoint: 5,

	sfxDie: new ig.Sound('media/skeleton_die.*'),
	
	animSheet: new ig.AnimationSheet('media/monster_skeleton.png', 11, 19),
	
	init: function (x, y, settings) {
		this.addAnim('walk', .2, [0,1,0,2]);
		this.addAnim('attack', .3, [1,1,2]);
		this.parent(x, y, settings);
		
		// Transform the target object into an ordered array of targets
		this.targets = ig.ksort(this.target);
	},
	
	update: function() {
		if (this.attack) {
			
			if (this.currentAnim.loopCount) {
				ig.game.player.receiveDamage(this.hitPoint);
				this.attack = false;
			}

			this.vel.x = 0;
			this.parent();


		} else {
			if (this.hit != 0) {
				this.pos.x = this.pos.x + (30 * this.hit);
				this.hit = 0;
				this.parent();

			} else {

				var oldDistance = 0;
				var target = ig.game.getEntityByName( this.targets[this.currentTarget] );
				if (target) {
					oldDistance = this.distanceTo(target);
					this.vel.x = this.speed;
					
					var p = ig.game.player;

		            var ydist = Math.abs(ig.game.player.pos.y - this.pos.y);
		            var xdist = Math.abs(ig.game.player.pos.x - this.pos.x);

		            var xdir = ig.game.player.pos.x - this.pos.x < 0 ? -1 : 1;

					if (p.pos.x > target.pos.x && p.pos.x < this.pos.x && ydist < 20) {
						if (xdist > 25) this.vel.x = -100;
						else {
							this.attack = true;
							this.currentAnim = this.anims.attack.rewind();
							this.currentAnim.flip.x = (xdir < 0);
						}

					}
					if (p.pos.x < target.pos.x && p.pos.x > this.pos.x && ydist < 20) {
						if (xdist > 25) this.vel.x = 100;
						else {
							this.attack = true;
							this.currentAnim = this.anims.attack.rewind();
							this.currentAnim.flip.x = (xdir < 0);
						}
					}


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
			}
		}
	},

	receiveDamage: function(amount, from) {
		var dir = from.vel.x > 0 ? -1 : 1;
		this.vel.x = 50 * dir;
		var x = Math.random().map(0, 1, this.pos.x, this.pos.x+10 );
		var y = Math.random().map(0, 1, this.pos.y, this.pos.y+10 );

		if (this.health < 2) {
			for (var i=0; i<10; i++) {
				var x = Math.random().map( 0,1, this.pos.x, this.pos.x+this.size.x );
				var y = Math.random().map( 0,1, this.pos.y, this.pos.y+this.size.y );
				ig.game.spawnEntity(EntitySkeletonBonesDebris, x, y, {direction:dir, lifetime:1});
			}
		} else {
			ig.game.spawnEntity(EntitySkeletonBonesDebris, x, y, {direction:dir});
			ig.game.spawnEntity(EntitySkeletonBonesDebris, x, y, {direction:dir});
			ig.game.spawnEntity(EntitySkeletonBonesDebris, x, y, {direction:dir});
		}

		this.parent(amount);
	},

	check: function(other) {
//		other.receiveDamage(10, this);
	}

});

EntitySkeletonBonesDebris = EntityParticle.extend({
    bounciness: 0.6,
    size: {x: 4, y: 4},

    lifetime: .2,
    fadetime: .1,

    power: 100,

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER,
    
    animSheet: new ig.AnimationSheet('media/bones_debris.png', 4, 4),
    
    init: function (x, y, settings) {
        this.addAnim('idle', 5, [0,1,2,3,4,5,6,7]);
        this.parent(x, y, settings);

        if (settings.lifetime) {
        	this.lifetime = settings.lifetime;
        	this.fadetime = settings.lifetime * .5;
        }

        var dir = this.power * settings.direction;
        this.vel.x = ((Math.random() * (this.power*2)) - this.power) + dir;
        this.vel.y = (Math.random() * -this.power);
        this.friction.x = this.vel.x * -.7;
        this.friction.y = this.vel.y * -.3;
    },
});

});