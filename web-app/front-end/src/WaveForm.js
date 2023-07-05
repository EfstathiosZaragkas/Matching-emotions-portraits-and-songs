import React, { useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import WaveSurferReact from 'react-wavesurfer';

const Waveform = ({ audioFile }) => {
  const wavesurferRef = useRef(null);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: wavesurferRef.current,
      waveColor: 'rgba(255, 255, 255, 0.3)',
      progressColor: 'rgba(255, 255, 255, 0.8',
      cursorColor: '#ffffff',
      barWidth: 2,
      barRadius: 3,
      responsive: true,
    });

    wavesurfer.load(audioFile);

    return () => {
      wavesurfer.destroy();
    };
  }, [audioFile]);

  return (
    <div>
      <div ref={wavesurferRef}></div>
      <WaveSurferReact
        waveSurfer={wavesurferRef.current}
        options={{
          barWidth: 2,
          barRadius: 3,
          cursorColor: '#ffffff',
          cursorWidth: 1,
          height: 100,
          progressColor: '#ffffff',
          responsive: true,
          waveColor: '#ffffff',
          backend: 'WebAudio',
        }}
      />
    </div>
  );
};

export default Waveform;