var audio = new Audio("../assets/music/volcansmusic.mp3");
audio.volume = 0.5;
audio.loop = true;

function playMusic() {
  audio.play();
}

function stopMusic() {
  audio.pause();
  audio.currentTime = 0;
}

function setVolume(level) {
  audio.volume = Math.min(1, Math.max(0, level));
}

function playAnimation() {
  playTitleIntro();
  showProjectSupporters();
}

function playTitleIntro() {
  const animation_container = document.getElementById("animation-container");
  const titleText = "GGREBORN PROJECTS";

  titleText.split("").forEach((char, i) => {
    let ggreborn_title = document.createElement("span");

    ggreborn_title.textContent = char === " " ? "\u00A0" : char;
    ggreborn_title.classList.add("ggreborn-title");

    animation_container.appendChild(ggreborn_title);

    setTimeout(() => {
      ggreborn_title.style.opacity = 1;
    }, i * 220);
  });
}

function showProjectSupporters() {
  const project_supporters_container = document.getElementById(
    "project-supporters-container",
  );

  let x = window.innerWidth;

  const text = document.createElement("span");

  text.textContent = "PROJECT SUPPORTERS";
  text.classList.add("project-supporters-text");
  project_supporters_container.appendChild(text);

  function showProjectSupportersText() {
    let speed = 4;
    x -= speed;
    text.style.transform = `translate(${x}px)`;

    if (x > 0) {
      requestAnimationFrame(showProjectSupportersText);
    } else {
      text.classList.add("animated");
    }
  }

  showProjectSupportersText();
}

module.exports = { playMusic, stopMusic, playAnimation };
