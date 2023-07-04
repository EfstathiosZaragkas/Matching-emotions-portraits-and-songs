from flask import Flask, render_template, request
from flask_cors import CORS
from PIL import Image
import numpy as np
import imageio
from mtcnn import MTCNN
from numpy import asarray
import tensorflow as tf
import h5py
import json
from flask import jsonify

app = Flask(__name__)
CORS(app, origins='http://localhost:3000')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    # Check if a file was submitted in the request
    if 'image' not in request.files:
        return jsonify({'error': 'No image file uploaded'})

    # Retrieve the uploaded file
    image_file = request.files['image']
    save_path = 'uploads/' + image_file.filename
    image_file.save(save_path)
    face_pixels = extract_face(save_path)
    face_image = Image.fromarray(face_pixels, 'RGB')
    face_image.save("cropt_photos/face.jpg")

    # Load the model from an HDF5 file
    model_path = 'models_mobilenet/mobilenet_model_4_bs64_quad.hdf5'
    with h5py.File(model_path, 'r') as file:
        loaded_model = tf.keras.models.load_model(file, compile=False)

    # Load and preprocess the image
    image_path = 'cropt_photos/face.jpg'
    image = Image.open(image_path)
    image = image.resize((48, 48))
    image = np.array(image) / 255.0  # Normalize the image
    predictions = loaded_model.predict(np.expand_dims(image, axis=0))
    predicted_class_index = np.argmax(predictions, axis=1)
    labels = {0: 'Q1', 1: 'N', 2: 'Q3', 3: 'Q2'}
    predicted_labels = [labels[k] for k in predicted_class_index]
    print(predicted_labels)  # Print the predicted labels

    return jsonify({'labels': predicted_labels})

def extract_face(filename, required_size=(48, 48)):
    pixels = imageio.imread(filename)
    detector = MTCNN()
    results = detector.detect_faces(pixels)
    x1, y1, width, height = results[0]['box']
    x2, y2 = x1 + width, y1 + height
    face = pixels[y1:y2, x1:x2]
    image = Image.fromarray(face)
    image = image.resize(required_size)
    face_array = asarray(image)
    return face_array

if __name__ == '__main__':
    app.run()
