(function(){
    var data = {
        'audio': null,
        'image': null
    };
    
    function CCB_Media( count ) {
        this.count = count;
        

        this.range( );
    }


    CCB_Media.prototype = new Array( );

    CCB_Media.prototype.constructor = CCB_Media;

    CCB_Media.prototype.range = function( ) {
        for (var j = 1; j <= this.count; j++) {
            this.push( j );
        }

        return this;
    }

    CCB_Media.prototype.sample = function( ) {
        if ( !this.length ) { this.range(); }
        var index = Math.floor( Math.random( ) * this.length );
        return this.splice(index, 1)[0];
    }
    
    function CCB_Audio( count, element ) {
        CCB_Media.call( this, count );
        this.element = element;
    }


    CCB_Audio.prototype = new CCB_Media( );

    CCB_Audio.prototype.constructor = CCB_Audio;

    CCB_Audio.prototype.ref = function( ) {
        if ( this.length > 0 ) {
            return 'https://s3.amazonaws.com/conferencecall.biz/audio/' + this.sample( ) + '.mp3';
        } else {
            this.range( );

            return this.ref( );
        }
    }

    CCB_Audio.prototype.play = function(url, force_play) {
        var element = this.element;
        element.preload = true;
        element.src = url;
        if ( force_play || element.paused ) { element.play(); }
        
        setTimeout(function(){
            /* ANALYTICS
            ga('send', {
                'hitType': 'event',
                'eventCategory': 'audio',
                'eventAction': 'play',
                'eventLabel': element.src,
                'nonInteraction': true
            });
            */
        }, 25);
    }
    function CCB_Image( count ) {
        CCB_Media.call( this, count );
    }


    CCB_Image.prototype = new CCB_Media( );

    CCB_Image.prototype.constructor = CCB_Image;

    CCB_Image.prototype.ref = function( ) {
        if ( this.length > 0 ) {
            return 'url(https://s3.amazonaws.com/conferencecall.biz/images/' + this.sample( ) + '.gif)';
        } else {
            this.range( );
            return this.ref( );
        }
    }

    CCB_Image.prototype.swap = function(url) {
        document.body.style.backgroundImage = 'url(' + url + ')';
        /* ANALYTICS
        ga('send', {
            'hitType': 'event',
            'eventCategory': 'image',
            'eventAction': 'view',
            'eventLabel': document.body.style.backgroundImage.replace(/url\((.*?)\)/, '$1'),
            'nonInteraction': true
        });
        */
    }
    var audio = new CCB_Audio( 79, document.getElementById('foreground_track') );

    var images = new CCB_Image( 29 );
    
    function preloadScene() {
        data = {};
        data.audio = audio.ref();
        data.image = images.ref().replace(/url\((.*?)\)/, '$1');
        
        var audioEl = document.createElement('audio');
        audioEl.preload = "auto";
        audioEl.src = data.audio;
        
        var imgEl = document.createElement('img');
        imgEl.onload = function(){  };
        imgEl.src = data.image;
    }
    function getNextScene() {
        if( data.audio && data.image ) {
            next = data;
            preloadScene();
            return next;
        }
        preloadScene();
        return data;
    }
    document.body.onload = preloadScene();

    function fadeOut( element ) {
        var opacity = 1;

        var timer = setInterval( function( ) {
            if ( opacity <= 0.001 ) {
                clearInterval( timer );

                element.style.display = 'none';
            }

            element.style.opacity = opacity;
            element.style.filter = 'alpha(opacity=' + opacity * 100 + ")";

            opacity -= opacity * 0.1;
        }, 50 );
    }

    var join = document.getElementById('JoinButton');

    join.onclick = function( ) {
        /* ANALYTICS CODE
        ga('send', {
            'hitType': 'event',
            'eventCategory': 'uiAction',
            'eventAction': 'buttonPress',
            'eventLabel': 'Join'
        });
        */

        fadeOut( document.getElementsByTagName('h1')[0] );
        
        if ( !navigator.userAgent.match(/mobile|iphone|ipad|ipod|android|blackberry|iemobile|facebook/i) ) {
            var musique_concrete = document.getElementById( 'musique_concrete' );
            musique_concrete.src = 'https://s3.amazonaws.com/conferencecall.biz/audio/bounce.mp3';
            musique_concrete.play();
            
            /* ANALYTICS CODE
            ga('send', {
                'hitType': 'event',
                'eventCategory': 'audio',
                'eventAction': 'play',
                'eventLabel': musique_concrete.src,
                'nonInteraction': true
            });
            */
        }
        var scene = getNextScene();
        audio.play(scene.audio, true);
        images.swap(scene.image);
        
        
        var foreground_track = document.getElementById('foreground_track');
        var lastAudio = foreground_track.currentSrc;
        // gets stuck often on mobile, this resets and keeps tracks playing
        setInterval(function(){
            var el = foreground_track;
            if ( el.paused && (el.currentSrc == lastAudio || el.networkState == 4) ) {
                var data = getNextScene();
                audio.play(data.audio);
                images.swap(data.image);
            }
            lastAudio = el.currentSrc; 
        }, 5000);
        
        foreground_track.addEventListener( 'ended', function() {
            var data = getNextScene();
            audio.play(data.audio);
            images.swap(data.image);
        }, false );
    };

})();

window.onerror = function(e){ return false; };
function toggle_visibility( id ) {
    try{
        var e = document.getElementById( id );
        if ( e.style.display == 'block' )
            e.style.display = 'none';
        else
            e.style.display = 'block';
    } catch (e) {}
}

function toggleInfo(){
    $("#info-overlay").toggleClass("show");
    $("#info-btn").toggleClass("show");
}

$(document).ready(function() {
    $("#info-btn").click(toggleInfo);
});