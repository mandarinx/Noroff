/*
The EntityDebris will randomly spawn a certain count of EntityDebrisParticle 
entities for a certain duration.

The spawn position of the EntityDebrisParticle is inside the area occupied
by the EntityDebris entity. I.e. make the EntityDebris larger in Weltmeister
to increase the area in which particles will spawn.

Keys for Weltmeister:

duration
	Duration in seconds over which to spawn EntityDebrisParticle entities.
	Default: 5
	
count
	Total count of particles to spawn during the #duration# time span.
	Default: 5
*/

ig.module(
	'game.entities.debris'
)
.requires(
	'impact.entity',
	'game.entities.particle'
)
.defines(function(){

EntityDebris = ig.Entity.extend({
	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(255, 170, 66, 0.7)',
	
	size: {x: 16, y: 16},
	duration: 5,
	count: 5,
	direction: "left",
	power: 150,
	
	durationTimer: null,
	nextEmit: null,
	used: false,
	triggered: false,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.durationTimer = new ig.Timer();
		this.nextEmit = new ig.Timer();
	},
	
	triggeredBy: function( entity, trigger ) {
		if (this.duration > 0) {
			this.durationTimer.set( this.duration );
			this.nextEmit.set( 0 );
		} else {
			this.triggered = true;
		}
	},
	
	update: function(){
		if (this.duration == 0 && !this.used && this.triggered) {
			for (var i=0; i<this.count; i++) {
				var x = Math.random().map( 0,1, this.pos.x, this.pos.x+this.size.x );
				var y = Math.random().map( 0,1, this.pos.y, this.pos.y+this.size.y );
				ig.game.spawnEntity(EntityWallDebris, x, y, {direction:this.direction, power:this.power});
			}
			this.used = true;

		} else if( this.durationTimer.delta() < 0 && this.nextEmit.delta() >= 0 ) {
			this.nextEmit.set( this.duration / this.count );
			
			var x = Math.random().map( 0,1, this.pos.x, this.pos.x+this.size.x );
			var y = Math.random().map( 0,1, this.pos.y, this.pos.y+this.size.y );
			ig.game.spawnEntity( EntityWallDebris, x, y );
		}
	}
});



/*
The particles to spawn by the EntityDebris. See particle.js for more details.
*/

EntityWallDebris = EntityParticle.extend({
    friction: {x: 60, y: 30},
    bounciness: 0.3,
    size: {x: 4, y: 4},
    vel: {x: 160, y: -150},

    lifetime: 1,
    fadetime: 1,

    velRange: 200,
    power: 150,

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER,
    
    animSheet: new ig.AnimationSheet('media/debris.png', 4, 4),
    
    init: function (x, y, settings) {

		this.addAnim('idle', 1, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
		this.parent(x, y, settings);
    	
    	this.power = settings.power;

    	var vx, vy, fx, fy;

    	switch (settings.direction) {
			case "left":
				vx = ((Math.random() * this.velRange) + this.power) * -1;
				vy = ((Math.random() * (this.velRange * .3)) + (this.power * .3)) * -1;
				fx = vx * .2 * -1;
				fy = vy * -.2;
				break;
			case "right":
				vx = ((Math.random() * this.velRange) + this.power);
				vy = ((Math.random() * (this.velRange * .3)) + (this.power * .3)) * -1;
				fx = vx * -.2;
				fy = vy * .2;
				break;
			case "up":
				var vr = this.velRange * .3;
				vx = ((Math.random() * vr) - (vr * .5));
				vy = ((Math.random() * this.velRange) + this.power) * -1;
				fx = vx <= 0 ? vx * .2 : vx * -.2;
				fy = vy * -.2;
				break;
			case "down":
				var vr = this.velRange * 1;
				vx = ((Math.random() * vr) - (vr * .5));
				vy = ((Math.random() * this.velRange) + this.power);
				fx = vx <= 0 ? vx * .2 : vx * -.2;
				fy = vy * -.2;
				break;
			case "none":
				vx = (Math.random() * 500) - 250;
				vy = (Math.random() * 500) - 250;
				fx = vx <= 0 ? vx * .2 : vx * -.2;
				fy = vy <= 0 ? vy * .2 : vy * -.2;
				break;
    	}
        
        this.vel.x = vx;
        this.vel.y = vy;
        this.friction.x = fx;
        this.friction.y = fy;
    },
});

});