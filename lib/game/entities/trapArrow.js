ig.module(
	'game.entities.trapArrow'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityTrapArrow = ig.Entity.extend({

	size: {x: 3, y: 14},
	offset: {x: 6, y: 2},

	damage: 1,
	zIndex: -1,

    gravityFactor: 0,

    vel: {x:0, y:600},
    maxVel: {x:0, y:600},
    fired: false,
    hit: false,

    sfx: new ig.Sound('media/arrow_fire.*'),

    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

	animSheet: new ig.AnimationSheet('media/trap_arrow.png', 16, 16),

	init: function( x, y, settings ) {
        this.addAnim('idle', 1, [0], true);
        this.addAnim('hit', .1, [3,2,3,2,1,2,1,3,1], true);
        this.sfx.volume = .8;
		this.parent(x, y, settings); // Super
	},

	triggeredBy: function(entity, trigger) {
		this.fired = true;
		this.sfx.play();
	},

	handleMovementTrace: function (res) {
		this.parent(res);
		if (res.collision.x || res.collision.y) {
			this.hit = true;
		}
	},

	check: function (other) {
		other.receiveDamage(this.damage, this);
		this.kill();
	},

	update: function() {
		if (this.fired) {
			if (this.currentAnim == this.anims.hit) {
				this.currentAnim.update();
				if (this.currentAnim.loopCount) {
					this.fired = false;
				}
				return;
			}

			if (this.hit) {
				this.checkAgainst = ig.Entity.NONE;
				this.currentAnim = this.anims.hit;
				this.currentAnim.rewind();
			} else {
				this.currentAnim = this.anims.idle;
			}

			this.parent();
		}
	}
});

});