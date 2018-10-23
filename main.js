window.onload = function () {
  var video = document.querySelector("video");

  var videoObj = {};

  var vcurrentTime = document.querySelector(".video-current-time");
  var vduration = document.querySelector(".video-duration-time");

  var playerWrap = document.querySelector(".player-wrap");
  playerWrap.style.setProperty(
    "height",
    `${(9 * playerWrap.offsetWidth) / 16}px`
  );

  // play list
  var btn1 = document.querySelector("#btn1");
  var btn2 = document.querySelector("#btn2");
  var pld = document.querySelector(".player-list-default");
  var plb = document.querySelector(".player-list-block");
  btn1.addEventListener(
    "click",
    function () {
      pld.style.display = "none";
      plb.style.display = "block";
      this.style.display = "none";
      btn2.style.display = "inline-block";
    },
    false
  );
  btn2.addEventListener(
    "click",
    function () {
      pld.style.display = "block";
      plb.style.display = "none";
      this.style.display = "none";
      btn1.style.display = "inline-block";
    },
    false
  );

  // contentmenu
  video.addEventListener(
    "contextmenu",
    function (e) {
      e.preventDefault();
    },
    false
  );



  // common function
  function Time(s) {
    var time;
    if (s >= 0) {
      var hour = Math.floor(s / 3600);
      var min = Math.floor(s / 60) % 60;
      var sec = Math.round(s % 60);

      function fix(t) {
        if (t < 10) {
          t = "0" + t;
        }
        t = "" + t;
        return t;
      }
      time = `${fix(min)}:${fix(sec)}`;
      if (hour > 0) {
        time = fix(hour) + ":" + time;
      }
    }
    return time;
  }

  // fullscreen btn

  var player = document.querySelector(".player");
  var screenBtn = document.querySelector(".video-fullscreen");

  screenBtn.addEventListener(
    "click",
    function () {
      if (!checkFull()) {
        requestFullScreen(player);
        videoObj.wideMode = false;
        videoObj.fullWeb = false;
        player.classList.add("fullscreen");
      } else {
        exitFullScreen(player);
      }
    },
    false
  );

  function requestFullScreen(element) {
    var requestMethod =
      element.requestFullScreen ||
      element.webkitRequestFullScreen ||
      element.mozRequestFullScreen ||
      element.msRequestFullScreen;
    if (requestMethod) {
      requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") {
      var wscript = new ActiveXObject("WScript.Shell");
      if (wscript !== null) {
        wscript.SendKeys("{F11}");
      }
    }
  }

  function exitFullScreen() {
    var exitMethod =
      document.exitFullscreen ||
      document.mozCancelFullScreen ||
      document.webkitExitFullscreen;
    if (exitMethod) {
      exitMethod.call(document);
    } else if (typeof window.ActiveXObject !== "undefined") {
      var wscript = new ActiveXObject("WScript.Shell");
      if (wscript !== null) {
        wscript.SendKeys("{F11}");
      }
    }
  }

  function checkFull() {
    var isFull =
      document.fullscreenEnabled ||
      window.fullScreen ||
      document.webkitIsFullScreen ||
      document.msFullscreenEnabled;
    if (isFull === undefined) {
      isFull = false;
    }
    return isFull;
  }

  window.addEventListener(
    "resize",
    function () {
      if (!checkFull()) {
        player.classList.remove("fullscreen");
      } else {
        if (f43) {
          var width = video.offsetWidth;
          var height = video.offsetHeight;
          var offsetWidth = (4 * height) / 3;
          var padding = (width - offsetWidth) / 2;
          var nwidth = (offsetWidth / width) * 100;
          video.style.setProperty("width", `${nwidth}%`);
          video.style.setProperty("height", "100%");
          video.style.setProperty("padding", `0px ${padding}px`);
        }
      }
    },
    false
  );

  //4:3
  var pro = document.querySelector("#pro");
  var f43 = false;
  pro.addEventListener("click", function () {
    f43 = true;
    var width = video.offsetWidth;
    var height = video.offsetHeight;
    var offsetWidth = (4 * height) / 3;
    var padding = (width - offsetWidth) / 2;
    var nwidth = (offsetWidth / width) * 100;
    video.style.setProperty("width", `${nwidth}%`);
    video.style.setProperty("height", "100%");
    video.style.setProperty("padding", `0px ${padding}px`);
    video.style.setProperty("object-fit", "fill");
  });

  //video.volume

  //volume bar

  var volNum = document.querySelector(".video-volume-num");
  var volumeBar = document.querySelector(".volume-bar");
  var volumeDot = document.querySelector(".bar-dot");
  var cVolume = document.querySelector(".current-volume");
  var volumeWrap = document.querySelector(".video-volume-wrap");

  function volumeChange(e) {
    var barHeight = volumeBar.getBoundingClientRect().height;
    var barTop = volumeBar.getBoundingClientRect().top;
    var cy = e.clientY;
    var volume = 1 - (cy - barTop) / barHeight;
    if (volume > 1) {
      volume = 1;
    }
    if (volume < 0) {
      volume = 0;
    }
    video.volume = volume.toFixed(2);
  }

  volumeBar.addEventListener(
    "mousedown",
    function (e) {
      volumeChange(e);
      volumeWrap.classList.add("volume-bar-hover");
      document.addEventListener("mousemove", volumeChange, false);
    },
    false
  );

  document.addEventListener(
    "mouseup",
    function () {
      document.removeEventListener("mousemove", volumeChange);
      volumeWrap.classList.remove("volume-bar-hover");
    },
    false
  );

  // volume.mute

  var volumeBtn = document.querySelector(".video-volume-wrap .icon-vol");
  var voled = 0;
  volumeBtn.addEventListener(
    "click",
    function () {
      if (video.volume !== 0) {
        voled = video.volume;
        video.volume = 0;
      } else {
        video.volume = voled;
        voled = 0.08;
      }
    },
    false
  );

  //volume event

  video.addEventListener("volumechange", function () {
    videoObj.volume = video.volume;
  });

  Object.defineProperty(videoObj, "volume", {
    set: function (value) {
      volNum.innerHTML = parseInt(value * 100);
      cVolume.style.setProperty("--volume", `${value}`);
      volumeDot.style.setProperty("--dot", `-${value * 50}px`);
      if (value == 0) {
        videoObj.muted = true;
      } else {
        videoObj.muted = false;
      }
    }
  });

  Object.defineProperty(videoObj, "muted", {
    set: function (flage) {
      if (flage) {
        video.volume = 0;
        volumeWrap.classList.add("volume-muted");
      } else {
        volumeWrap.classList.remove("volume-muted");
      }
    }
  });

  //progree bar
  var progreeBar = document.querySelector(".progree-bar");
  var currentBar = document.querySelector(".video-progree");
  var viewpoint = document.querySelector(".viewpoint");
  var detailTime = document.querySelector(".view-detail-time");

  function progree(e) {
    var left = this.getBoundingClientRect().left;
    var width = this.offsetWidth;
    var event = window.event || e
    var cx = event.clientX;
    var f = (cx - left) / width;
    if (f < 0) {
      f = 0;
    }
    if (f > 1) {
      f = 1;
    }
    return f;
  }

  currentBar.addEventListener(
    "mousedown",
    function (e) {
      video.currentTime = progree.call(this, e) * video.duration;
      videoObj.playState = true;
    },
    false
  );

  currentBar.addEventListener(
    "mousemove",
    function (e) {
      videoObj.detailTime = progree.call(this, e);
    },
    false
  );

  currentBar.addEventListener(
    "mouseout",
    function () {
      viewpoint.style.setProperty("display", "none");
    },
    false
  );

  Object.defineProperty(videoObj, "detailTime", {
    set: function (f) {
      viewpoint.style.setProperty("display", "block");
      viewpoint.style.setProperty("left", `${f * 100}%`);
      detailTime.innerHTML = Time(f * video.duration);
    }
  });

  Object.defineProperty(videoObj, "progreeTime", {
    set: function (cur) {
      vcurrentTime.innerHTML = Time(cur);
      progreeBar.style.setProperty("--progree", `${cur / video.duration}`);
    }
  });

  video.addEventListener("timeupdate", function () {
    videoObj.progreeTime = video.currentTime;
  });


  //define common
  var playStatus = document.querySelector(".video-status-btn");
  var videoWrap = document.querySelector(".video-wrapper");
  var controlWrap = document.querySelector(".video-control-wrapper");

  Object.defineProperty(videoObj, "playState", {
    get: function () {
      return this.status;
    },
    set: function (f) {
      this.status = f;
      if (f) {
        video.play();
      } else {
        video.pause();
      }
    }
  });

  Object.defineProperty(videoObj, "mouseState", {
    set: function (bool) {
      if (bool) {
        videoWrap.classList.remove("video-no-cursor");
        videoWrap.classList.add("show-control");
      } else {
        videoWrap.classList.remove("show-control");
        videoWrap.classList.add("video-no-cursor");
      }
    }
  });

  video.addEventListener(
    "click",
    function () {
      videoObj.playState = !videoObj.playState;
      if (videoObj.playState) {
        videoObj.mouseState = false;
      }
    },
    false
  );

  video.addEventListener("ended", function () {
    videoObj.playState = false;
  });

  video.addEventListener("play", function () {
    playStatus.classList.add("video-status-play");
    playStatus.classList.remove("video-status-pause");
  });

  video.addEventListener("pause", function () {
    playStatus.classList.add("video-status-pause");
    playStatus.classList.remove("video-status-play");
  });

  playStatus.addEventListener(
    "click",
    function () {
      videoObj.playState = !videoObj.playState;
    },
    false
  );

  var timeout;

  videoWrap.addEventListener(
    "mousemove",
    function () {
      clearTimeout(timeout);
      videoObj.mouseState = true;
      if (!document.querySelector(".control-wrap-hover")) {
        timeout = window.setTimeout(function () {
          videoObj.mouseState = false;
        }, 2000);
      }
    },
    false
  );

  controlWrap.addEventListener(
    "mouseover",
    function () {
      this.classList.add("control-wrap-hover");
    },
    false
  );

  controlWrap.addEventListener(
    "mouseout",
    function () {
      this.classList.remove("control-wrap-hover");
    },
    false
  );

  //ratebar

  var rateBar = document.querySelector(".video-rate-bar");
  var rateDot = document.querySelector(".rate-dot");

  Object.defineProperty(videoObj, "playbackRate", {
    set: function (val) {
      function left(val) {
        var v = val;
        if (v == 0.5) {
          rateDot.style.setProperty("transform", "translateX(0)");
        } else if (v == 2.0) {
          v = 1.75;
          rateDot.style.setProperty("transform", "translateX(-100%)");
        } else {
          rateDot.style.setProperty("transform", "translateX(-50%)");
        }
        var o = (v - 1.0) / 0.25;
        return 40 + o * 20;
      }

      video.playbackRate = val;
      rateDot.style.setProperty("left", `${left(val)}%`);
    }
  });

  rateBar.addEventListener(
    "click",
    function (e) {
      var f = progree.call(this, e);
      var s = 1.0;
      if (f <= 0.1) {
        s = 0.5;
      } else if (f <= 0.3) {
        s = 0.75;
      } else if (f <= 0.5) {
        s = 1.0;
      } else if (f <= 0.7) {
        s = 1.25;
      } else if (f <= 0.9) {
        s = 1.5;
      } else {
        s = 2.0;
      }
      videoObj.playbackRate = s;
    },
    false
  );

  var quan = document.querySelector(".video-web-fullscreen");
  quan.onclick = function () {
    videoObj.fullWeb = "";
  };

  Object.defineProperty(videoObj, "fullWeb", {
    set: function (f) {
      if (typeof this.fwb === "undefined") {
        this.fwb = true;
      }
      if (typeof f === "boolean") {
        this.fwb = f;
      }
      if (!this.wmd) {
        this.wideMode = false;
      }
      if (this.fwb) {
        player.classList.add("full-screen-mode");
      } else {
        player.classList.remove("full-screen-mode");
      }
      this.fwb = !this.fwb;
    }
  });

  var wide = document.querySelector(".video-wide-screen .icon-wide-screen");
  wide.onclick = function () {
    videoObj.wideMode = "";
  };

  Object.defineProperty(videoObj, "wideMode", {
    set: function (f) {
      var test = document.querySelector(".r-con .text-box");
      var width = document.querySelector(".wrap").offsetWidth;
      var height = (9 * width) / 16;
      if (typeof this.wmd === "undefined") {
        this.wmd = true;
      }
      if (typeof f === "boolean") {
        this.wmd = f;
      }
      if (!this.fwb) {
        this.fullWeb = false;
      }
      if (this.wmd) {
        playerWrap.classList.add("video-wide-mode");
        player.style.width = width + "px";
        player.style.position = "absolute";
        player.style.height = height + "px";
        test.style.height = height + "px";
      } else {
        playerWrap.classList.remove("video-wide-mode");
        player.style.width = "100%";
        player.style.height = "100%";
        player.style.position = "";
        test.style.height = "auto";
      }
      this.wmd = !this.wmd;
    }
  });

  // setting

  var checkBox = document.querySelectorAll('.other-checkbox')
  checkBox.forEach(function (item) {
    item.onclick = function () {
      var value = parseInt(item.value);
      var checked = item.checked;
      if (value === 0) {
        if (checked) {
          video.classList.add('video-mirror')
        } else {
          video.classList.remove('video-mirror')
        }
      } else if (value === 1) {
        var heimu = document.querySelector('.heimu')
        if (checked) {
          heimu.style.display = 'block';
        } else {
          heimu.style.display = '';
        }
      }
    }
  })


  var radioBox = document.querySelectorAll('input[name="scale"]');
  radioBox.forEach(function (radio) {
    radio.onclick = function () {
      var value = radio.value;
      var checked = radio.checked;
      if (value === 'scale-default') {
        if (checked) {

        } else {

        }
      } else if (value === 'scale-16-9') {
        if (checked) {

        } else {

        }
      } else if (value === 'scale-4-3') {
        if (checked) {

        } else {

        }
      }
    }
  })

  // updateitme

  // video

  video.addEventListener('loadstart', function () {
    // 视频开始加载
    console.log('loadstart')
  })

  video.addEventListener('durationchange', function () {
    vduration.innerHTML = Time(video.duration);
  })

  video.addEventListener('loadedmetadata', function () {
    console.log(this.videoWidth + "x" + this.videoHeight);
    console.log(this.videoHeight / this.videoWidth);
  })

  video.addEventListener('loadeddata', function () {
    // 缓存等待加载
    console.log('loadeddata')
  })

  var seekBar = document.querySelector('.seeked-bar');
  video.addEventListener('progress', function () {
    console.log('progree')
    if (this.buffered.length > 0) {
      var buffered = this.buffered.end(0);
      var rat = buffered / this.duration;
      seekBar.style.setProperty('--seeked', `${rat}`);
    }

  })

  video.addEventListener('canplay', function () {
    console.log('canplay')
  })

  video.addEventListener('canplaythrough', function () {
    console.log('canplaythroung')
    seekBar.style.setProperty('--seeked', '1')
  })

  var waiting = document.querySelector('.waiting');
  video.addEventListener('waiting', function () {
    console.log('waiting')
    waiting.style.display = 'block'
  })

  video.addEventListener('playing', function () {
    console.log('playing')
    waiting.style.display = ''

  })

  video.src = 'B.mp4'


};