/**
 * YouTube Player Implementation
 * A clean, modern implementation of the YouTube IFrame API player
 */

// YouTube player states and error codes
const YOUTUBE_STATES = {
  "-1": "unstarted",
  0: "ended",
  1: "playing",
  2: "paused",
  3: "buffering",
  5: "cued",
};

const YOUTUBE_ERROR = {
  INVALID_PARAM: 2,
  HTML5_ERROR: 5,
  NOT_FOUND: 100,
  UNPLAYABLE_1: 101,
  UNPLAYABLE_2: 150,
};

/**
 * YouTube Player Class
 * Handles all YouTube video player functionality
 */
class YouTubePlayer {
  /**
   * Create a new YouTube player instance
   * @param {string|HTMLElement} element - The element to create the player in
   * @param {Object} options - Player configuration options
   */
  constructor(element, options) {
    // Initialize event emitter
    this.events = {};

    // Get the target element
    this.element =
      typeof element === "string" ? document.querySelector(element) : element;

    // Generate unique ID if not provided
    this.id =
      this.element.id || `ytplayer-${Math.random().toString(16).slice(2, 8)}`;
    this.element.id = this.id;

    // Set default options
    this.options = {
      width: 640,
      height: 360,
      autoplay: false,
      captions: undefined,
      controls: true,
      keyboard: true,
      fullscreen: true,
      annotations: true,
      modestBranding: false,
      related: true,
      timeupdateFrequency: 1000,
      playsInline: true,
      start: 0,
      ...options,
    };

    // Initialize player state
    this.videoId = null;
    this.destroyed = false;
    this.api = null;
    this.player = null;
    this.ready = false;
    this.commandQueue = [];
    this.replayIntervals = [];

    // Bind methods
    this.startInterval = this.startInterval.bind(this);
    this.stopInterval = this.stopInterval.bind(this);

    // Set up event listeners
    this.on("playing", this.startInterval);
    this.on("unstarted", this.stopInterval);
    this.on("ended", this.stopInterval);
    this.on("paused", this.stopInterval);
    this.on("buffering", this.stopInterval);

    // Load the YouTube IFrame API
    this.loadIframeAPI((error, api) => {
      if (error) {
        return this.destroy(new Error("YouTube IFrame API failed to load"));
      }
      this.api = api;
      if (this.videoId) {
        this.load(this.videoId, this.options.autoplay, this.options.start);
      }
    });
  }

  /**
   * Load a video into the player
   * @param {string} videoId - YouTube video ID
   * @param {boolean} autoplay - Whether to autoplay the video
   * @param {number} start - Start time in seconds
   */
  load(videoId, autoplay = false, start = 0) {
    if (this.destroyed) return;

    this.startOptimizeDisplayEvent();
    this.optimizeDisplayHandler("center, center");

    this.videoId = videoId;
    this.options.autoplay = autoplay;
    this.options.start = start;

    if (this.api) {
      if (this.player) {
        if (this.ready) {
          if (autoplay) {
            this.player.loadVideoById(videoId, start);
          } else {
            this.player.cueVideoById(videoId, start);
          }
        }
      } else {
        this.createPlayer(videoId);
      }
    }
  }

  /**
   * Play the current video
   */
  play() {
    if (this.ready) {
      this.player.playVideo();
    } else {
      this.queueCommand("play");
    }
  }

  /**
   * Pause the current video
   */
  pause() {
    if (this.ready) {
      this.player.pauseVideo();
    } else {
      this.queueCommand("pause");
    }
  }

  /**
   * Stop the current video
   */
  stop() {
    if (this.ready) {
      this.player.stopVideo();
    } else {
      this.queueCommand("stop");
    }
  }

  /**
   * Seek to a specific time in the video
   * @param {number} seconds - Time in seconds
   */
  seek(seconds) {
    if (this.ready) {
      this.player.seekTo(seconds, true);
    } else {
      this.queueCommand("seek", seconds);
    }
  }

  /**
   * Set the volume of the player
   * @param {number} volume - Volume level (0-100)
   */
  setVolume(volume) {
    if (this.ready) {
      this.player.setVolume(volume);
    } else {
      this.queueCommand("setVolume", volume);
    }
  }

  /**
   * Get the current volume
   * @returns {number} Current volume level
   */
  getVolume() {
    return this.ready ? this.player.getVolume() : 0;
  }

  /**
   * Mute the player
   */
  mute() {
    if (this.ready) {
      this.player.mute();
    } else {
      this.queueCommand("mute");
    }
  }

  /**
   * Unmute the player
   */
  unMute() {
    if (this.ready) {
      this.player.unMute();
    } else {
      this.queueCommand("unMute");
    }
  }

  /**
   * Check if the player is muted
   * @returns {boolean} True if muted
   */
  isMuted() {
    return this.ready ? this.player.isMuted() : false;
  }

  /**
   * Destroy the player instance
   */
  destroy() {
    if (this.destroyed) return;

    this.destroyed = true;

    if (this.player) {
      this.player.stopVideo();
      this.player.destroy();
    }

    this.player = null;
    this.api = null;
    this.options = null;
    this.id = null;
    this.videoId = null;
    this.ready = false;
    this.commandQueue = null;

    this.stopInterval();
    this.removeListener("playing", this.startInterval);
    this.removeListener("paused", this.stopInterval);
    this.removeListener("buffering", this.stopInterval);
    this.removeListener("unstarted", this.stopInterval);
    this.removeListener("ended", this.stopInterval);
  }

  // Event handling methods
  on(event, callback) {
    if (typeof this.events[event] !== "object") {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  removeListener(event, callback) {
    if (typeof this.events[event] === "object") {
      const index = this.events[event].indexOf(callback);
      if (index > -1) {
        this.events[event].splice(index, 1);
      }
    }
  }

  emit(event, ...args) {
    if (typeof this.events[event] === "object") {
      const listeners = this.events[event].slice();
      for (const listener of listeners) {
        listener.apply(this, args);
      }
    }
  }

  // Private helper methods
  queueCommand(command, ...args) {
    if (!this.destroyed) {
      this.commandQueue.push([command, args]);
    }
  }

  flushQueue() {
    while (this.commandQueue.length) {
      const [command, args] = this.commandQueue.shift();
      this[command].apply(this, args);
    }
  }

  loadIframeAPI(callback) {
    if (window.YT && typeof window.YT.Player === "function") {
      return callback(null, window.YT);
    }

    // Load the IFrame API script
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;

    // Handle script load
    script.onload = () => {
      window.onYouTubeIframeAPIReady = () => {
        callback(null, window.YT);
      };
    };

    // Handle script error
    script.onerror = () => {
      callback(new Error("Failed to load YouTube IFrame API"));
    };

    document.head.appendChild(script);
  }

  createPlayer(videoId) {
    if (this.destroyed) return;

    const options = this.options;

    this.player = new this.api.Player(this.id, {
      width: options.width,
      height: options.height,
      videoId: videoId,
      playerVars: {
        autoplay: options.autoplay ? 1 : 0,
        mute: options.mute ? 1 : 0,
        controls: options.controls ? 2 : 0,
        enablejsapi: 1,
        allowfullscreen: true,
        modestbranding: options.modestBranding ? 1 : 0,
        rel: options.related ? 1 : 0,
        showinfo: 0,
        html5: 1,
      },
      events: {
        onReady: () => this.onReady(videoId),
        onStateChange: (event) => this.onStateChange(event),
        onError: (event) => this.onError(event),
      },
    });
  }

  onReady(videoId) {
    if (this.destroyed) return;

    this.ready = true;
    this.load(this.videoId, this.options.autoplay, this.options.start);
    this.flushQueue();
  }

  onStateChange(event) {
    if (this.destroyed) return;

    const state = YOUTUBE_STATES[event.data];
    if (state) {
      if (["paused", "buffering", "ended"].includes(state)) {
        this.onTimeupdate();
      }
      this.emit(state);
      if (["unstarted", "playing", "cued"].includes(state)) {
        this.onTimeupdate();
      }
    }
  }

  onError(event) {
    if (this.destroyed) return;

    const error = event.data;
    if (error !== YOUTUBE_ERROR.HTML5_ERROR) {
      if (
        [
          YOUTUBE_ERROR.UNPLAYABLE_1,
          YOUTUBE_ERROR.UNPLAYABLE_2,
          YOUTUBE_ERROR.NOT_FOUND,
          YOUTUBE_ERROR.INVALID_PARAM,
        ].includes(error)
      ) {
        return this.emit("unplayable", this.videoId);
      }
      this.destroy(
        new Error(`YouTube Player Error. Unknown error code: ${error}`)
      );
    }
  }

  startInterval() {
    this.interval = setInterval(
      () => this.onTimeupdate(),
      this.options.timeupdateFrequency
    );
  }

  stopInterval() {
    clearInterval(this.interval);
    this.interval = null;
  }

  onTimeupdate() {
    this.emit("timeupdate", this.getCurrentTime());
  }

  getCurrentTime() {
    return this.ready ? this.player.getCurrentTime() : 0;
  }
}

// Export the YouTubePlayer class
window.YouTubePlayer = YouTubePlayer;
