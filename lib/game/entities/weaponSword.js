ig.module(
	'game.entities.weaponSword'
)
.requires(
	'impact.entity',
	'game.entities.weapon'
)
.defines(function(){

EntityWeaponSword = EntityWeapon.extend({

	weaponType: "MELEE",
	amount: 1,
	weaponName: "sword",
	weapon: null,

	animSheet: new ig.AnimationSheet('media/weapon_sword.png', 16, 16),

	init: function( x, y, settings ) {
        this.addAnim('idle', .1, [0,1,2,1]);
//		ig.input.bind(ig.KEY._2, this.weaponName);
//		this.weapon = EntityBomb;
		this.parent( x, y, settings ); // Super
	},
/*
	update: function() {
		if (ig.input.pressed(this.weaponName)) {
			ig.game.player.setCurWeapon(this);
		}
		this.parent();	
	},
*/
});
/*
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
    },
});
*/
});
