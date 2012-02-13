ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.levels.ruins',
	'game.camera'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	gravity: 500, // All entities are affected by this
	
	player: null,
	isGameOver: false,
	camera: null,
	defaultMusic: 'outdoor',
	curMusic: null,
	spawnPoints: new Array(),

	init: function() {
		ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
		ig.input.bind(ig.KEY.UP_ARROW, 'up');
		ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
		ig.input.bind(ig.KEY.SPACE, 'jump');
		ig.input.bind(ig.KEY.SHIFT, 'run');
		ig.input.bind(ig.KEY.X, 'throw');
		ig.input.bind(ig.KEY.C, 'action');

		this.camera = new Camera(ig.system.width/2, ig.system.height/6, 10);
    	this.camera.trap.size.x = ig.system.width/10;
    	this.camera.trap.size.y = ig.system.height/3;
    	this.camera.lookAhead.x = ig.ua.mobile ? ig.system.width/6 : 0;

		ig.music.add('media/music_outdoor.*', 'outdoor'),
		ig.music.add('media/music_dungeon_light.*', 'dungeonDark'),
		
		ig.music.volume = 0.5;

		this.loadLevel(LevelRuins);

	},

	loadLevel: function(level) {
	    this.parent(level);

		this.player = this.getEntitiesByType(EntityPlayer)[0];

	    // Set camera max and reposition trap
	    this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
	    this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;
	    
	    this.camera.set(this.player);

	    ig.music.loop = true;
	    this.playMusic(this.defaultMusic);
	},

	playMusic: function(MusicName) {
		if (MusicName != this.curMusic) {
			ig.music.play(MusicName);
			this.curMusic = MusicName;
		}
	},

	update: function() {
		this.camera.follow(this.player);
		this.parent();
	},
	
	draw: function() {
		this.parent();

		this.camera.draw();

		if (this.player.bombs > 0) {
			this.font.draw('Bombs: ' + this.player.bombs, 10, 10, ig.Font.ALIGN.LEFT );
		}

		if (this.isGameOver) {
			this.font.draw('GAME OVER', ig.system.width*.5, ig.system.height*.5, ig.Font.ALIGN.CENTER);
		}
	},

	gameOver: function() {
		this.isGameOver = true;
	},

	addSpawnPoint: function(nick, pos) {
		this.spawnPoints.push(new Array(nick, pos));
	},

	reloadLevel: function() {
		var pos = null;
		var spawn = this.player.spawnPoint;
		var bombs = this.player.bombs;

		for (var i=0; i<this.spawnPoints.length; i++) {
			if (this.spawnPoints[i][0] == this.player.spawnPoint) {
				pos = this.spawnPoints[i][1];
				break;
			}
		}
		this.loadLevel(LevelRuins);
		this.player = this.getEntitiesByType(EntityPlayer)[0];
		if (spawn != "") this.player.spawnPoint = spawn;
		if (pos != null) {
			this.player.pos.x = pos.x;
			this.player.pos.y = pos.y;
		}
		this.player.bombs = bombs;
	}

});

ig.Sound.channels = 8;

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main('#canvas', MyGame, 60, 480, 320, 2);

});
