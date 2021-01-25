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

ipcRenderer.on("keydown", (_, eventData) => {
  if (!isActive) return;
  switch (eventData.keycode) {
    case 58: // Caps
      sounds.keyCaps.play();
      break;
    case 14: // Delete
      sounds.keyDelete.play();
      break;
    case 61000: // Arrow keys
    case 61008:
    case 61003:
    case 61005:
      sounds.keyMovement.play();
      break;
    case 28: // Enter key
      sounds.keyConfirm.play();
      break;
    case 20:
    case 56:
    case 42: // ctrl, shift etc..
    case 29:
    case 3640:
      break;

    default: // Other all keys
      sounds[`keyPress${getRandomInt(1, 4)}`].play();
      break;
  }
})


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}