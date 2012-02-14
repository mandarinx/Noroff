ig.module(
	'game.entities.spawnPoint'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntitySpawnPoint = ig.Entity.extend({
	size: {x: 16, y: 16},
	
	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(0, 255, 0, 0.7)',
	
	wait: -1,
	waitTimer: null,
	canFire: true,

	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.NEVER,
	
	spawnPoint: "",
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.waitTimer = new ig.Timer();
	},
	
	check: function( other ) {
		if (this.canFire && this.waitTimer.delta() >= 0) {
			if (ig.game.player.touches(this)) {
				ig.game.setSpawnPoint(this.spawnPoint, this.pos);
			}
			
			if (this.wait == -1) {
				this.canFire = false;
			} else {
				this.waitTimer.set( this.wait );
			}
		}
	},
	
});

});