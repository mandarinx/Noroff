ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
	
	size: {x:8, y:12},
	offset: {x:4, y:2},

	maxVel: {x:100, y:200},
	friction: {x:600, y:0},
	slopeStanding: {min: (44).toRad(), max: (136).toRad() },

	animSheet: new ig.AnimationSheet('media/rotated-sprite.png', 16, 16),

	flip:false,
	accelGround: 400,
	accelAir: 150,
	accelRun: 200,
	jump: 200,
	remainingJumpPower: 0,
	jumping: false,
	stuckLeft: false,
	stuckRight: false,
	slideVel: 20,
	curAnim: "walk",

	init: function(x, y, settings) {
		this.parent(x, y, settings);

		this.addAnim('walk', 1, [0]);
		this.addAnim('NE45', 1, [1]);
		this.addAnim('NE22', 1, [2]);
		this.addAnim('NE15', 1, [3]);
		this.addAnim('NW45', 1, [7]);
		this.addAnim('NW22', 1, [8]);
		this.addAnim('NW15', 1, [9]);
	},
	
	update: function() {
		
		var acc = this.standing ? this.accelGround : this.accelAir;

		if (ig.input.state('run')) {
			this.maxVel.x = this.accelRun;
			acc += this.accelRun;
		} else {
			this.maxVel.x = 100;
		}

		if (ig.input.state('right')) {
			this.accel.x = acc;
			this.flip = false;
		} else if (ig.input.state('left')) {
			if (!this.stuckLeft || !this.stuckRight) {
				this.accel.x = -acc;
				this.flip = true;
			}
		} else {
			this.accel.x = 0;
		}

		if (ig.input.state('jump')) {

			if (this.standing) {
				this.remainingJumpPower = this.jump;
				this.vel.y = -this.jump;
				this.gravityFactor = 1;
				this.jumping = true;

			} else if (this.stuckLeft) {
				this.vel.y = -this.jump;
				this.accel.x = 20000;
			} else if (this.stuckRight) {
				this.vel.y = -this.jump;
				this.accel.x = -20000;
			}

		} else {
			this.jumping = false;
		}

		if (this.jumping) {
			var jumpPowerUsed = 20 * ig.system.tick;
			if (this.remainingJumpPower > jumpPowerUsed) {
				this.remainingJumpPower -= jumpPowerUsed
			} else {
				this.remainingJumpPower = 0;
			}
		} else {
			if (this.remainingJumpPower) { // If it is more than 0 I guess
				this.vel.y += this.remainingJumpPower*.5;
//				this.vel.y = 0;
				this.gravityFactor = 1.5;
				this.remainingJumpPower = 0;
			}
		}
/*
		if (this.vel.y > 0) {
			this.gravityFactor = 1.5;
		}
*/
		this.currentAnim.flip.x = this.flip;
		
		switch (this.curAnim) {
			case "walk": this.currentAnim = this.anims.walk; break;
			
			case "NE45": this.currentAnim = this.anims.NE45; break;
			case "NE22": this.currentAnim = this.anims.NE22; break;
			case "NE15": this.currentAnim = this.anims.NE15; break;
			
			case "NW45": this.currentAnim = this.anims.NW45; break;
			case "NW22": this.currentAnim = this.anims.NW22; break;
			case "NW15": this.currentAnim = this.anims.NW15; break;
		}

		this.parent();
	},



	handleMovementTrace: function(res) {

		var s = res.collision.slope;
		var angle = (Math.atan2( s.x, s.y )).toDeg();
		
		if (this.vel.x > 0) { // Moving right
			ig.log("moving right: "+angle);
			if (angle > 107 && angle < 109) this.curAnim = "NE15";
			if (angle > 110 && angle < 132) this.curAnim = "NE22";
			if (angle > 133 && angle < 137) this.curAnim = "NE45";
		}
		if (this.vel.x < 0) { // Moving left
			ig.log("moving left: "+angle);
			if (angle > 70 && angle < 72) this.curAnim = "NW15";
			if (angle > 62 && angle < 64) this.curAnim = "NW22";
			if (angle > 44 && angle < 46) this.curAnim = "NW45";
		}
		

		this.stuckLeft = false;
		if (res.collision.x && ig.input.state('left') && !this.standing && this.vel.y > 0) {
			this.vel.y = this.slideVel;
			this.stuckLeft = true;
		}

		this.stuckRight = false;
		if (res.collision.x && ig.input.state('right') && !this.standing && this.vel.y > 0) {
			this.vel.y = this.slideVel;
			this.stuckRight = true;
		}

		this.parent(res);
	}
	
});
});