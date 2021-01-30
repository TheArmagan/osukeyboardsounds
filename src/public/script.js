const { ipcRenderer } = require("electron");

const soundFiles = ["key-caps.mp3", "key-confirm.mp3", "key-delete.mp3", "key-movement.mp3", "key-press-1.mp3", "key-press-2.mp3", "key-press-3.mp3", "key-press-4.mp3"];
const sounds = {};

for (let i = 0; i < soundFiles.length; i++) {
  const soundFileName = soundFiles[i];
  sounds[camelCase(soundFileName.slice(0, -4))] = new Howl({
    src: [`./sounds/${soundFileName}`]
  });
}

let isActive = true;

ipcRenderer.on("isActive", (_, state) => {
  isActive = state;
})

ipcRenderer.on("keydown", (_, keyCode) => {
  if (!isActive) return;
  switch (keyCode) {
    case 20: // Caps
      sounds.keyCaps.play();
      break;
    case 8: // Delete
      sounds.keyDelete.play();
      break;
    case 40: // Arrow keys
    case 39:
    case 38:
    case 37:
      sounds.keyMovement.play();
      break;
    case 13: // Enter key
      sounds.keyConfirm.play();
      break;
    case 160:
    case 162:
    case 164: // ctrl, shift etc..
    case 165:
      break;
    default: // Other all keys
      sounds[`keyPress${getRandomInt(1, 4)}`].play();
      break;
  }
})


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}