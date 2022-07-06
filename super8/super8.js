const video = document.getElementById("video");
const videoGrain = document.getElementById("video-grain");
const videoScratches = document.getElementById("video-scratches");
const projectorSound = document.getElementById("projector-sound");
const videoInput = document.getElementById("video-input");

let blurRadius = 2;
let saturate = 1.25;
let bwContrast = 1.1;
let colorContrast = 1;

projectorSound.volume = 0.5;
const timeoutForSkipping = 250;

const toggleVideoPlayback = (isPlaying) => {
  if (isPlaying) {
    setTimeout(() => {
      videoGrain.playbackRate = 1;
      videoScratches.playbackRate = 1;
      if (!video.pause) {
        projectorSound.currentTime = 0;
      }
    }, timeoutForSkipping);
    videoGrain.play();
    videoScratches.play();
    projectorSound.play();
  } else {
    // play ending sound
    setTimeout(() => {
      if (video.paused) {
        videoGrain.playbackRate = 0.25;
        videoScratches.playbackRate = 0.25;
        setTimeout(() => {
          videoGrain.pause();
          videoScratches.pause();
        }, 100);

        projectorSound.currentTime = 1211.25;
      }
    }, timeoutForSkipping);
  }
};

video.addEventListener("pause", (event) => {
  toggleVideoPlayback(event.type === "play");
  if (video.currentTime >= video.duration) {
    setTimeout(() => video.classList.add("finished"), 250);
  }
});
video.addEventListener("play", (event) => {
  document.querySelector("body").classList.remove("loading");
  video.classList.remove("finished");
  toggleVideoPlayback(event.type === "play");
});

const assignBackdropFilters = () => {
  document.getElementById(
    "blur-filter"
  ).style.backdropFilter = `blur(${blurRadius}px) saturate(${saturate})`;
  document.getElementById("bw-filter").style.backdropFilter = `brightness(${
    bwContrast * 0.95
  }) contrast(${bwContrast}) grayscale(1)`;
};

document.addEventListener("keyup", (event) => {
  if (event.key === "b") {
    document.querySelector("body").classList.toggle("bw-film");
  }
  if (event.key === "+" || event.key === "-") {
    blurRadius = blurRadius + Number(event.key + "1");
    if (blurRadius < 0) {
      blurRadius = 0;
    }
  }
  if (event.key === "[") {
    bwContrast = bwContrast - 0.05;
    if (bwContrast < 0) {
      bwContrast = 0;
    }
  }
  if (event.key === "]") {
    bwContrast = bwContrast + 0.05;
    if (bwContrast > 2) {
      bwContrast = 2;
    }
  }
  if (event.key === "s") {
    projectorSound.muted = !projectorSound.muted;
  }
  if (event.key === "m") {
    video.muted = !video.muted;
  }
  if (event.key === "c") {
    video.controls = !video.controls;
  }
  if (event.key === "l") {
    video.loop = !video.loop;
  }
  if (event.key === "h") {
    document.querySelector("body").classList.toggle("show-help");
  }
  assignBackdropFilters();
});

const onMediaLoaded = (ev) => {
  if (ev.target.readyState >= 3) {
    ev.target.classList.remove("unloaded");
  }

  if (!document.querySelector("video.unloaded")) {
    document.querySelector("body").classList.remove("loading");
    setTimeout(() => {
      document.querySelector("body").classList.add("hide-help");
    }, 500);
  }
};
document.querySelectorAll("video").forEach((e) => {
  e.classList.add("unloaded");
  e.addEventListener("loadeddata", onMediaLoaded);
  // e.addEventListener("suspend", onMediaLoaded);
});

document.getElementById("video-input").addEventListener("drop", (event) => {
  setTimeout(() => {
    video.src = URL.createObjectURL(videoInput.files[0]);
    video.play();
  }, 500);
  document.querySelector("body").classList.remove("dragover");
});

document
  .querySelector(".help-box")
  .addEventListener("click", () =>
    document.querySelector("body").classList.remove("show-help")
  );

let showHelp = localStorage.getItem("showedHelpInitial");
if (!showHelp) {
  document.querySelector("body").classList.add("show-help");
  localStorage.setItem("showedHelpInitial", "showed");
}

assignBackdropFilters();
