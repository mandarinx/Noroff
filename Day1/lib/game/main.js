ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.levels.temp',
	'game.entities.player',
	'impact.debug.debug'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	gravity: 300,
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	
	init: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
		ig.input.bind(ig.KEY.X, 'jump');
		ig.input.bind(ig.KEY.C, 'shoot');
		ig.input.bind(ig.KEY.Z, 'run');
		
		this.loadLevel(LevelTemp);
	},
	
	update: function() {
		this.parent();
	},
	
	draw: function() {
		this.parent();
		
		this.font.draw('X jump, C shoot', ig.system.width*.5, 10, ig.Font.ALIGN.CENTER);
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main('#canvas', MyGame, 60, 480, 320, 2);

});
