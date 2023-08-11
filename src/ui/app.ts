import { WebRTCPlayer } from '@eyevinn/webrtc-player';

window.addEventListener('DOMContentLoaded', async () => {
  const video = document.querySelector("video");

  if (video) {
    const player = new WebRTCPlayer({
      video: video,
      type: 'whep'
    });

    await player.load(new URL(`http://${window.location.hostname}:8000/channel`));

    video.muted = true;
    video.controls = true;
    video.play();
  }

  const resetBtn = document.querySelector("#btnReset");
  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      await fetch(`http://${window.location.hostname}:3000/monitor/reset`);
    });
  }
});