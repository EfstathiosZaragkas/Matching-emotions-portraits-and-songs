import React, { useState, useRef } from 'react';
import logo1 from './icons/ncsr-logo.png';
import logo2 from './icons/uop-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedOption, setSelectedOption] = useState('classical');

  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      // Send the file to the backend for further processing
    }
  
    // Reset the file input
    fileInputRef.current.value = null;
  };
  

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleMatchButtonClick = () => {
    // Perform song matching logic here
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
        </div>
      </div>
    </div>
  );
}  

export default App;