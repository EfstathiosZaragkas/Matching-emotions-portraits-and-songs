from flask import Flask, render_template, request
from PIL import Image
import numpy as np
import imageio
from mtcnn import MTCNN
from numpy import asarray

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    # Check if a file was submitted in the request
    if 'image' not in request.files:
        return 'No image file uploaded'

    # Retrieve the uploaded file
    image_file = request.files['image']
    save_path = 'uploads/' + image_file.filename
    image_file.save(save_path)
    face_pixels = extract_face(save_path)
    face_image = Image.fromarray(face_pixels, 'RGB')
    face_image.save("cropt_photos/face.jpg")
    return 'Face extracted and saved successfully'

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