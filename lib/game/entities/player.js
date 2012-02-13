ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
	size: {x: 12, y: 27},
	offset: {x: 12, y: 6},

	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.B,
	collides: ig.Entity.COLLIDES.PASSIVE,

	animSheet: new ig.AnimationSheet( 'media/character_01_map.png', 40, 33),

	lookDir: "right",

	accelGround: 250,
	accelAir: 200,
	jump: 300,
	maxVel: {x:70, y:450},
	maxVelRunning: 170,
	maxVelWalking: 70,
	friction: {x: 900, y: 100},
	slopeStanding: {min: (44).toRad(), max: (136).toRad() },
	flip: false,
	health: 10,
	hasWoken: true,
	turnAccel: 500,

	bombs: 0,
/*
	accelGround: 250, maxVel.x: 150, friction: 900, turnAccel: 500, Fast walking
	accelGround: 250, maxVel.x: 40, friction: 900, turnAccel: 500, Slow walking
*/

	init: function( x, y, settings ) {
		this.addAnim('wakeup', .1, [0,0,0,0,0,1,1,2,3,3,3,4,4,5,5,5,5,5,5], true);
		this.addAnim('idle', 1, [12]);
		this.addAnim('walk', .2, [13,14,13,15]);
		this.addAnim('jump', 1, [19], true);
		this.addAnim('hover', 1, [20], true);
		this.addAnim('run', .1, [16,17,18]);
		this.addAnim('die', .5, [6,7]);

		this.parent( x, y, settings ); // Super
	},

	update: function() {
		
		if (!this.hasWoken) {
			if (this.currentAnim == this.anims.wakeup) {
				this.currentAnim.update();
				if (this.currentAnim.loopCount) {
					this.currentAnim = this.anims.idle;
					this.flip = true;
					this.hasWoken = true;
				}
			}
		
		} else {

			if (this.currentAnim == this.anims.die) {
				this.currentAnim.update();
				if (this.currentAnim.loopCount) {
					this.kill();
				}
				return;
			}
			
			var accel = this.standing ? this.accelGround : this.accelAir;
			
			if (ig.input.state('run')) {
				this.maxVel.x = this.maxVelRunning;
			} else {
				this.maxVel.x = this.maxVelWalking;
			}

			if (ig.input.state('right')) {
				if (this.vel.x < 0) accel += this.turnAccel;
				this.accel.x = accel;
				this.flip = true;
			
			} else if (ig.input.state('left')) {
				if (this.vel.x > 0) accel += this.turnAccel;
				this.accel.x = -accel;
				this.flip = false;
			
			} else {
				this.accel.x = 0;
			}
			
			if (ig.input.pressed('throw') && this.bombs > 0) {
				var x = this.pos.x + (this.flip ? 23 : -10);
				var y = this.pos.y - 5;
                ig.game.spawnEntity(EntityBomb, x, y, {flip: this.flip});
                this.bombs--;
			}

			if (this.standing && ig.input.state('jump')) {
				this.vel.y = -this.jump;
			}

			if (this.maxVel.x == this.maxVelWalking && this.vel.x != 0) {
				this.currentAnim = this.anims.walk;
			} else if (this.maxVel.x == this.maxVelRunning && this.vel.x != 0) {
				this.currentAnim = this.anims.run;
			} else {
				this.currentAnim = this.anims.idle;
			}

			if (this.vel.y > -200 && this.vel.y < 100 && !this.standing) {
				this.currentAnim = this.anims.hover;
			} else if (this.vel.y != 0 && !this.standing) {
				this.currentAnim = this.anims.jump;
			}

			this.currentAnim.flip.x = this.flip;
		}

		this.parent();
	},

	pickedupPowerup: function(powerup) {
		if (powerup.powerupType == "bomb") {
			this.bombs += powerup.amount;
		}
	},

	receiveDamage: function (amount, from) {
		if (this.currentAnim != this.anims.die) {
			this.currentAnim = this.anims.die.rewind();
		}
	},

});

EntityBomb = ig.Entity.extend({
    bounciness: 0.8,
    size: {x: 5, y: 5},
    offset: {x:5, y:6},
    vel: {x: 300, y: -50},
    friction: {x: 60, y: 30},

    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,
    
    bounceCount: 0,
    entityType: "bomb",
    exploded: false,

    sfx: new ig.Sound('media/explode_bomb.*'),

    animSheet: new ig.AnimationSheet('media/bomb.png', 16, 16),
    
    init: function (x, y, settings) {
    	this.flip = settings.flip;
        this.vel.x *= this.flip ? 1 : -1;
        this.addAnim('idle', 1, [0]);
        this.addAnim('explode', .1, [1,2,2,3,3,3,3]);
        this.parent(x, y, settings);
    },
    
    handleMovementTrace: function (res) {
        this.parent(res);
        if (res.collision.x || res.collision.y) {
            this.bounceCount++;
            if (this.bounceCount >= 3) {
                this.explode();
            }
        }
    },

    check: function (other) {
        other.receiveDamage(10, this);
		this.explode();
    },

    explode: function() {
        this.sfx.play();
    	this.exploded = true;
    },

    update: function() {
		if (this.currentAnim == this.anims.explode) {
			this.currentAnim.update();
			if (this.currentAnim.loopCount) {
				this.kill();
			}
			return;
		}

		if (this.exploded) {
			this.currentAnim = this.anims.explode;
		} else {
			this.currentAnim = this.anims.idle;
		}

    	this.parent();
    }
});

});

