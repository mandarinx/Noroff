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
//	size: {x: 40, y: 33},
//	offset: {x: 0, y: 0},

	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.B,
	collides: ig.Entity.COLLIDES.PASSIVE,

	animSheet: new ig.AnimationSheet( 'media/character_01_map.png', 40, 33),

	facing: "right",

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

	kills: false,

	spawnPoint: "",
	
	bombs: 0,
	curWeapon: null,
	weapons: new Array(),

	hitArea: {x:0, y:0, w:16, h:16},
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
		this.addAnim('kill', .5, [21,22,23]);
		this.addAnim('die', .5, [6,7]);
		this.addAnim('door', .1, [5,5,5,5,4,2,1,1,1], true);

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
					ig.game.reloadLevel();
				}
				return;
			}

			if (this.currentAnim == this.anims.door) {
				this.currentAnim.update();
				if (this.currentAnim.loopCount) {
					ig.game.loadNextLevel();
				}
				return;
			}

/*
			if (this.kills) {
				this.currentAnim.update();
				if (this.currentAnim.loopCount > 0) {
					this.kills = false;
					this.anims.kill.rewind();
					this.currentAnim = this.anims.idle;
				}
				return;
			}
*/
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
				this.facing = "right";
			
			} else if (ig.input.state('left')) {
				if (this.vel.x > 0) accel += this.turnAccel;
				this.accel.x = -accel;
				this.flip = false;
				this.facing = "left";
			
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

			if (ig.input.pressed('kill') && this.standing) {
				this.kills = true;
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

/*
			if (this.kills) {
				this.currentAnim = this.anims.kill;
			}
*/
			this.currentAnim.flip.x = this.flip;

			this.hitArea.x = this.flip ? this.pos.x + 20 : this.pos.x - 20;
			this.hitArea.y = this.pos.y;

			if (this.kills) {
                ig.game.spawnEntity(EntityBox, this.hitArea.x, this.hitArea.y, {flip:this.flip});
                this.kills = false;
			}
		}


		this.parent();
	},

	check: function (other) {
		
		if (this.kills) {
			if ((this.facing == "right" && other.pos.x > this.pos.x) || (this.facing == "left" && other.pos.x < this.pos.x)) {
				console.log("kill");
				other.receiveDamage(1, "Player");
				this.kills = false;
			}
		}

	},

	pickedupPowerup: function(powerup) {
		if (powerup.powerupType == "bomb") {
			this.bombs += powerup.amount;
		}
	},

	receiveDamage: function (amount, from) {
		this.health -= amount;
		if (this.health == 0) {
			if (this.currentAnim != this.anims.die) {
				this.currentAnim = this.anims.die.rewind();
			}
		}
	},

    triggeredByInput: function(inputKey) {
    	if (inputKey == 'up') {
    		this.currentAnim = this.anims.door.rewind();
    	}
    },

    gotWeapon: function(wpn) {
    	var add = true;
    	var i = 0;

    	for (i = 0; i < this.weapons.length; i++) {
    		if (this.weapons[i].weaponName == wpn.weaponName) {
	    		add = false;
	    		break;
	    	}
    	}
    	if (add) this.weapons.push(wpn);
    	else this.weapons[i].amount += wpn.amount;

    	this.setCurWeapon(wpn);
    },

    setCurWeapon: function(wpn) {
		if (wpn.weaponName != "none") {
			for (var i=0; i<this.weapons.length; i++) {
				if (this.weapons[i].weaponName == wpn.weaponName) {
					this.curWeapon = this.weapons[i];
					console.log("cur weapon is "+this.curWeapon.weaponName);
					break;
				}
			}
		}
    },

});

EntityBox = ig.Entity.extend({
    size: {x: 16, y: 16},
    vel: {x: 0, y: 0},

    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.LIGHT,
    
    used: false,
    flip: false,

//    animSheet: new ig.AnimationSheet('media/classical_ruin.png', 16, 16),
    
    init: function (x, y, settings) {
//        this.addAnim('idle', 1, [0]);
		this.flip = settings.flip;
        this.parent(x, y, settings);
    },

    update: function() {
//    	this.parent();
		if (!this.used) this.used = true;
		else this.kill();
    },

    check: function(other) {
    	this.vel.x = this.flip ? 100 : -100;
    	other.receiveDamage(1, this);
    	this.kill();
    },
});

});

