ig.module(
	'game.entities.boss'
)
.requires(
	'impact.entity',
    'game.entities.particle'
)
.defines(function(){

EntityBoss = ig.Entity.extend({
	size: {x: 38, y: 96},
    offset: {x:26, y:0},
    zIndex: -1,
    gravityFactor: 1,

	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,

	animSheet: new ig.AnimationSheet( 'media/boss_final.png', 64, 96),

	init: function( x, y, settings ) {
        this.addAnim('idle', 1, [1]);
		this.parent( x, y, settings ); // Super
	},

	update: function() {
        this.currentAnim = this.anims.idle;
		this.parent();
    },

    handleMovementTrace: function (res) {
        this.parent(res);
        if (res.collision.x) {
            for (var i=0; i<250; i++) {
                var x = Math.random().map( 0,1, this.pos.x, this.pos.x+this.size.x );
                var y = Math.random().map( 0,1, this.pos.y, this.pos.y+this.size.y );
                ig.game.spawnEntity(EntityBossMeatDebris, x, y);
            }
            this.kill();
            ig.game.gameOver();
        }
    },

});

EntityBossMeatDebris = EntityParticle.extend({
    bounciness: 0.2,
    size: {x: 8, y: 8},

    lifetime: 2,
    fadetime: 1,

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER,
    
    animSheet: new ig.AnimationSheet('media/meat_debris.png', 8, 8),
    
    init: function (x, y, settings) {
        this.addAnim('idle', 1, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
        this.parent(x, y, settings);

        this.vel.x = (Math.random() * 400) - 200;
        this.vel.y = (Math.random() * 400) - 200;
        this.friction.x = this.vel.x * -.3;
        this.friction.y = this.vel.y * -.3;
    },
});

});
