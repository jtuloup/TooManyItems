define(['Renderer', 'Physics', 'Sound', 'Home', 'Intro', 'Game'], function(Renderer, Physics, Sound, Home, Intro, Game) {

    var Main = function() {
        this.sound = new Sound();
        var self = this;

        // google fonts first
        WebFontConfig = {
            google: {
                families: [ 'Peralta', 'Arvo:700italic', 'Podkova:700' ]
            },

            active: function() {
            // do something
                self.loadSounds();
            }

        };
        (function() {
            var wf = document.createElement('script');
            wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
            '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
            wf.type = 'text/javascript';
            wf.async = 'true';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(wf, s);
        })();

    };

    Main.prototype.loadSounds = function() {
        this.soundsPath = 'assets/sounds/';
        this.soundsNames = [
            'beam.mp3',
            'buttonPressed.mp3',
            'buttonReleased.mp3',
            'footsteps_1.mp3',
            'footsteps_2.mp3',
            'hurt.mp3'
        ];

        var n = this.soundsNames.length;
        var loaded = 0;
        var self = this;

        self.soundsNames.forEach(function(i) {
            var s = new Howl({
                urls: [self.soundsPath + i],
                onload: function() {
                    loaded++;
                    if (loaded == n) {
                        self.loadSprites();
                    }
                }
            });
            var name = i.substr(0, i.lastIndexOf('.'));
            self.sound.add(name, s);
        });
    };

    Main.prototype.loadSprites = function() {
        var assetsToLoader = ["assets/spritesheet.json"];
        var loader = new PIXI.AssetLoader(assetsToLoader);

        var self = this;
        loader.onComplete = function() {
            console.log("Assets loaded, start main loop");

            // create PIXI renderer
            var renderer =  PIXI.autoDetectRenderer(Conf.canvas.width, Conf.canvas.height);
            document.body.appendChild(renderer.view);

            // wrapper for renderer
            var rendererManager = new Renderer(renderer);
            // stats
            var stats = new Stats();
            document.body.appendChild(stats.domElement );
            stats.domElement.style.position = "absolute";
            stats.domElement.style.top = "0px";
            rendererManager.stats = stats;

            // create physics engine
            var physics = new Physics();

            // loading different screens
            self.home = new Home(self, rendererManager, self.sound, physics);
            self.intro = new Intro(self, rendererManager, self.sound, physics);
            self.game = new Game(self, rendererManager, self.sound, physics);

            // list of screens
            self.screens = [
                self.home,
                self.game
            ];

            // start with home
            self.home.show();

        };

        loader.load();
    };

    return Main;

});
