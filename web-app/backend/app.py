from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image
import numpy as np
import imageio
from mtcnn import MTCNN
from numpy import asarray
import tensorflow as tf
import h5py
import os
import random

app = Flask(__name__)
CORS(app, origins='http://localhost:3000')

MUSIC_FOLDER_CLASSICAL = 'Classical Music/'
MUSIC_FOLDER_MODERN = 'Modern Music/'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file uploaded'})

    image_file = request.files['image']
    save_path = 'uploads/' + image_file.filename
    image_file.save(save_path)
    face_pixels = extract_face(save_path)
    face_image = Image.fromarray(face_pixels, 'RGB')
    face_image.save("cropt_photos/face.jpg")

    model_path = 'models_mobilenet/mobilenet_model_4_bs64_quad.hdf5'
    with h5py.File(model_path, 'r') as file:
        loaded_model = tf.keras.models.load_model(file, compile=False)

    image_path = 'cropt_photos/face.jpg'
    image = Image.open(image_path)
    image = image.resize((48, 48))
    image = np.array(image) / 255.0
    predictions = loaded_model.predict(np.expand_dims(image, axis=0))
    predicted_class_index = np.argmax(predictions, axis=1)
    labels = {0: 'N', 1: 'Q1', 2: 'Q2', 3: 'Q3'}
    predicted_labels = [labels[k] for k in predicted_class_index]
    print(predicted_labels)

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

@app.route('/song', methods=['POST'])
def song():
    selected_option = request.form.get('option')
    label = request.form.get('label')
    print("label: " + label)

    if selected_option == 'classical':
        music_folder = os.path.join(MUSIC_FOLDER_CLASSICAL, label)
    else:
        music_folder = os.path.join(MUSIC_FOLDER_MODERN, label)

    music_files = os.listdir(music_folder)
    selected_song = random.choice(music_files)
    print("selected song: " + selected_song)

    return send_file(os.path.join(music_folder, selected_song), as_attachment=True)

if __name__ == '__main__':
    app.run()
