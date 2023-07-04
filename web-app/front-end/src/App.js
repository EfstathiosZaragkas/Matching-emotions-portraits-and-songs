import React, { useState, useRef } from 'react';
import logo1 from './icons/ncsr-logo.png';
import logo2 from './icons/uop-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedOption, setSelectedOption] = useState('classical');
  const [predictedLabels, setPredictedLabels] = useState([]);

  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  
    // Reset the file input
    // fileInputRef.current.value = null;
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
  
          fetch('http://localhost:5000/upload', {
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
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };  

  const handleUploadIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="container">
      <div className="header-container">
        <img src={logo1} alt="Logo 1" className="logo" />
        <img src={logo2} alt="Logo 2" className="logo" />
      </div>
      <div className="main-container">
        <div className="head-container">
          <h1 className="header">Portrait-Song Match</h1>
        </div>
        <div className="central-container">
          <div className="head">
            <h2 className="upload-header">
              {selectedImage ? "Uploaded Portrait:" : "Upload a Portrait:"}
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
              style={{ display: "none" }}
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
                    value="classical"
                    checked={selectedOption === 'classical'}
                    onChange={handleOptionChange}
                    disabled={!selectedImage} // Disable radio buttons before image upload
                  />
                  Classical Music
                </label>
                <label>
                  <input
                    type="radio"
                    value="modern"
                    checked={selectedOption === 'modern'}
                    onChange={handleOptionChange}
                    disabled={!selectedImage} // Disable radio buttons before image upload
                  />
                  Modern Music
                </label>
              </div>
              <button
                className="match-button"
                onClick={handleMatchButtonClick}
                disabled={!selectedImage} // Disable match button before image upload
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
                  <li key={index} className="predicted-label">{label}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;