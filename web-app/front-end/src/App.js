import React, { useState, useEffect, useRef } from 'react';
import logo1 from './icons/ncsr-logo.png';
import logo2 from './icons/uop-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import WaveSurfer from 'wavesurfer.js';
import MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone';



function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedOption, setSelectedOption] = useState('classical');
  const [predictedLabels, setPredictedLabels] = useState([]);
  const [selectedSongPath, setSelectedSongPath] = useState(null);
  const [waveform, setWaveForm] = useState(null);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const waveSurferRef = useRef(null);
  const waveformRef = useRef(null);


  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleMatchButtonClick = () => {
    if (selectedImage) {
      fetch(selectedImage)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], 'image.png', { type: 'image/png' });
  
          const formData = new FormData();
          formData.append('image', file);
  
          return fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData,
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Error occurred during file upload');
              }
              return response.json();
            })
            .then((data) => {
              setPredictedLabels(data.labels);
              const predictedLabel = data.labels[0]; // Assuming a single predicted label
  
              const songFormData = new FormData();
              songFormData.append('option', selectedOption);
              songFormData.append('label', predictedLabel);
  
              return fetch('http://localhost:5000/song', {
                method: 'POST',
                body: songFormData,
              });
            })
            .then((response) => response.blob())
            .then((blob) => {
              const url = URL.createObjectURL(blob);
              setSelectedSongPath(url);
              const wavesurfer = WaveSurfer.create({
                container: "#waveform",
                waveColor: "violete",
                progressColor: "purple"
              });
              wavesurfer.load(url);
              setWaveForm(wavesurfer);
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        });
    }
  };

  // const renderWaveform = (mp3Blob) => {
  //   const waveform = WaveSurfer.create({
  //       container: waveformRef.current,
  //       waveColor: 'violet',
  //       progressColor: 'purple',
  //       barWidth: 3,
  //       barHeight: 1,
  //       cursorWidth: 1,
  //       cursorColor: '#333',
  //       height: 100
  //   });

  //   // Load the MP3 file from the Blob object
  //   const objectUrl = URL.createObjectURL(mp3Blob);
  //   waveform.load(objectUrl);

  //   // Add play button functionality
  //   const playButton = document.createElement('button');
  //   playButton.innerHTML = 'Play';
  //   playButton.addEventListener('click', () => waveform.play());
  //   waveformRef.current.appendChild(playButton);
  //   console.log(waveform)
  //   return waveform;
  // };

  const handleUploadIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // const initializeWaveSurfer = () => {
  //   waveSurferRef.current = WaveSurfer.create({
  //     container: '#waveform',
  //     waveColor: 'violet',
  //     progressColor: 'purple',
  //     height: 200,
  //     plugins: [MicrophonePlugin.create()],
  //   });
  // };

  // Load the selected song into WaveSurfer
  const loadSongIntoWaveSurfer = () => {
    if (waveSurferRef.current && selectedSongPath) {
      waveSurferRef.current.load(selectedSongPath);
    }
  };

  // Handle playing and pausing the song
const handlePlay = () => {
  if (waveform) {
    if (waveform.isPlaying()) {
      waveform.pause();
    } else {
      waveform.play();
    }
  }
};

  // Initialize WaveSurfer on component mount
  // useEffect(() => {
  //   const waveSurfer = WaveSurfer.create({
  //     container: '#waveform',
  //     waveColor: 'violet',
  //     progressColor: 'purple',
  //     height: 200,
  //     plugins: [MicrophonePlugin.create()],
  //   });

  //   return () => {
  //     waveSurfer.destroy();
  //   };
  // }, []);
  

  // Load the song into WaveSurfer when selectedSongPath changes
  useEffect(() => {
    loadSongIntoWaveSurfer();
  }, [selectedSongPath]);

  useEffect(() => {
    if (audioRef.current && selectedSongPath) {
      audioRef.current.src = selectedSongPath;
      audioRef.current.load();
    }
  }, [selectedSongPath]);

  
  return (
    <div className="container">
      <div className="header-container">
        <img src={logo1} alt="Logo 1" className="logo" />
        <img src={logo2} alt="Logo 2" className="logo" />
      </div>
      <div className="main-container">
        <div className="head-container">
          <h1 className="header">Matching Emotions: Portraits and Songs</h1>
        </div>
        <div className="central-container">
          <div className="head">
            <h2 className="upload-header">
              {selectedImage ? 'Uploaded Portrait:' : 'Upload a Portrait:'}
            </h2>
          </div>
          <div className="central-body">
            {!selectedImage && (
              <div className="upload-icon" onClick={handleUploadIconClick}>
                <FontAwesomeIcon icon={faUpload} className="upload-icon-svg" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            {selectedImage && (
              <div className="selected-image-container">
                <img src={selectedImage} alt="Selected" className="selected-image" />
                <button className="remove-button" onClick={() => setSelectedImage(null)}>
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="bottom-container">
          <div className="match-container">
            <h2>Match portrait with song:</h2>
            <div className="radio-buttons">
              <div>
                <label>
                  <input
                    type="radio"
                    name="option"
                    value="classical"
                    checked={selectedOption === 'classical'}
                    onChange={handleOptionChange}
                    disabled={!selectedImage}
                  />
                  Classical Music
                </label>
                <label>
                  <input
                    type="radio"
                    name="option"
                    value="modern"
                    checked={selectedOption === 'modern'}
                    onChange={handleOptionChange}
                    disabled={!selectedImage}
                  />
                  Modern Music
                </label>
              </div>
              <button
                className="match-button"
                onClick={handleMatchButtonClick}
                disabled={!selectedImage}
              >
                Match
              </button>
            </div>
          </div>
          {predictedLabels && predictedLabels.length > 0 && (
            <div className="result-container">
              <h3 className="predicted-labels-header">Predicted Labels:</h3>
              <ul className="predicted-labels-list">
                {predictedLabels.map((label, index) => (
                  <li key={index} className="predicted-label">
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div id="waveform" className="waveform-container"></div>
          {selectedSongPath && (
            <div>
              <div ref={waveformRef} id="waveform" />
              <button onClick={handlePlay}>Play/Pause</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;