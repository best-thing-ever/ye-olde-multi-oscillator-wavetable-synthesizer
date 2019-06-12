const WIDTH = 1000;
const HEIGHT = 400;

let hasRun = false;

const start = () => {
  if(hasRun) {
    return;
  }

  hasRun = true;

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      doTheThings(audioCtx, null);
  // if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  //   navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
  //     const micNode = audioCtx.createMediaStreamSource(stream)
  //     doTheThings(audioCtx, micNode);

  //   });
  // } else {
  //   console.log("NO MIC")
  // }
}

const doTheThings = (audioCtx, micNode) => {
  const analyser = audioCtx.createAnalyser();
  // micNode.connect(analyser);

  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(100, audioCtx.currentTime); // value in hertz
  oscillator.connect(audioCtx.destination);
  oscillator.connect(analyser);
  oscillator.start();

  // const biquadFilter = audioCtx.createBiquadFilter();
  // biquadFilter.type = "lowpass";
  // biquadFilter.frequency.setValueAtTime(500, audioCtx.currentTime);
  // biquadFilter.Q.value = 10;
  // biquadFilter.gain.setValueAtTime(25, audioCtx.currentTime);

  // micNode.connect(biquadFilter);
  // biquadFilter.connect(audioCtx.destination);

  // Drawing stuff
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  let dataArray = new Uint8Array(bufferLength);

  const canvas = document.getElementById('oscilloscope');
  const canvasCtx = canvas.getContext('2d');
  
  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  let runCounter = 0;
  function draw() {
    const drawVisual = requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    const newData = new Float32Array(dataArray.length);
    dataArray.forEach((v,i) => {
      newData[i] = v/255;
    });

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
    canvasCtx.beginPath();

    const sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;

    for(let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0;
      let y = v * HEIGHT/2;

      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.stroke();
    runCounter++;
  }

  draw();
};
