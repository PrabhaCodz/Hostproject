from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import re
import csv
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import TextVectorization
from googleapiclient.discovery import build
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.makedirs("static", exist_ok=True)

MODEL_PATH = "my_model.keras"
model = None

try:
    if os.path.exists(MODEL_PATH):
        model = load_model(MODEL_PATH)
        print("✅ Model successfully loaded.")
    else:
        print("❌ ERROR: Model file not found!")
except Exception as e:
    print(f"❌ ERROR: Model loading failed - {str(e)}")

# Text Vectorizer setup
SEQUENCE_LENGTH = 1800
MAX_FEATURES = 200000
vectorizer = TextVectorization(max_tokens=MAX_FEATURES, output_sequence_length=SEQUENCE_LENGTH, output_mode='int')

SAMPLE_TEXTS = [
    "This is a great video!",
    "I totally hate this content.",
    "You are an idiot!",
    "This is wonderful!",
    "Awful experience, worst ever."
]
vectorizer.adapt(SAMPLE_TEXTS)
print("✅ Vectorizer initialized successfully.")

# Utility to extract video ID
def extract_video_id(url):
    match = re.search(r"(?:youtube\.com/.*[?&]v=|youtu\.be/)([a-zA-Z0-9_-]{11})", url)
    return match.group(1) if match else None

# Fetch YouTube comments
def get_youtube_comments(video_id, max_comments=500):
    api_key ="AIzaSyADISd-Qq8iVkyxZCdYxxUOEHre0g_M6JQ"   # ✅ Fetch key dynamically
    if not api_key:
        return {"error": "YouTube API key is missing"}

    try:
        youtube = build('youtube', 'v3', developerKey=api_key)
        comments = []
        next_page_token = None
        fetched_count = 0

        while fetched_count < max_comments:
            request = youtube.commentThreads().list(
                part='snippet',
                videoId=video_id,
                maxResults=min(100, max_comments - fetched_count),
                textFormat='plainText',
                pageToken=next_page_token
            )
            response = request.execute()

            for item in response.get("items", []):
                snippet = item["snippet"]["topLevelComment"]["snippet"]
                text = snippet.get("textDisplay", "").strip()
                if text:
                    comments.append({
                        "text": text,
                        "author": snippet.get("authorDisplayName", "Unknown"),
                        "timestamp": snippet.get("publishedAt", ""),
                        "likes": snippet.get("likeCount", 0),
                        "visibility": snippet.get("visibility", "public")
                    })
                    fetched_count += 1

            next_page_token = response.get("nextPageToken")
            if not next_page_token:
                break

        print(f"✅ Fetched {len(comments)} comments.")
        return comments

    except Exception as e:
        print(f"❌ ERROR: Error fetching comments - {str(e)}")
        return {"error": f"Error fetching comments: {str(e)}"}

# Predict toxicity
def predict_toxicity(comments):
    if not comments or model is None:
        return {"error": "Model not loaded or no comments provided"}

    try:
        texts = [comment['text'] for comment in comments]
        processed_comments = vectorizer(np.array(texts))
        predictions = model.predict(processed_comments)

        threshold = 0.3
        for i, comment in enumerate(comments):
            comment["score"] = float(predictions[i][0])
            comment["binary_prediction"] = int(predictions[i][0] > threshold)

        return comments
    except Exception as e:
        print(f"❌ ERROR: Prediction failed - {str(e)}")
        return {"error": f"Prediction failed: {str(e)}"}

# Endpoint: /predict for single comment
def get_severity(value):
    if value >= 0.8:
        return "Severe"
    elif value >= 0.6:
        return "High"
    elif value >= 0.4:
        return "Medium"
    elif value >= 0.2:
        return "Low"
    else:
        return "Minimal"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the incoming data
        data = request.get_json()
        
        # Validate the input
        if not data or "text" not in data:
            return jsonify({"error": "Invalid request, 'text' field is required"}), 400
        
        input_text = data["text"]
        
        # Vectorize the input text (ensure this uses the correct vectorizer for your model)
        input_text_vectorized = vectorizer([input_text])
        
        # Get the model prediction (assuming your model returns probabilities for each category)
        res = model.predict(input_text_vectorized)
        
        # Prepare the output with severity based on the predicted values
        output = {
            "toxic": {
                "predicted": float(res[0][0]), 
                "severity": get_severity(res[0][0]),
                "is_toxic": bool(res[0][0] > 0.5)  # This gives a binary result based on the threshold of 0.5
            },
            "severe_toxic": {
                "predicted": float(res[0][1]), 
                "severity": get_severity(res[0][1]),
                "is_severe_toxic": bool(res[0][1] > 0.5)
            },
            "obscene": {
                "predicted": float(res[0][2]), 
                "severity": get_severity(res[0][2]),
                "is_obscene": bool(res[0][2] > 0.5)
            },
            "threat": {
                "predicted": float(res[0][3]), 
                "severity": get_severity(res[0][3]),
                "is_threat": bool(res[0][3] > 0.5)
            },
            "insult": {
                "predicted": float(res[0][4]), 
                "severity": get_severity(res[0][4]),
                "is_insult": bool(res[0][4] > 0.5)
            },
            "identity_hate": {
                "predicted": float(res[0][5]), 
                "severity": get_severity(res[0][5]),
                "is_identity_hate": bool(res[0][5] > 0.5)
            }
        }
        
        # Return the output as JSON response
        return jsonify(output), 200
        
    except Exception as e:
        # If an error occurs, return the error message
        return jsonify({"error": str(e)}), 500

# Endpoint: /toxic_comments for a YouTube video
@app.route('/toxic_comments', methods=['POST'])
def get_toxic_comments():
    data = request.get_json()
    url = data.get("url")
    if not url:
        return jsonify({"error": "Missing YouTube URL"}), 400

    video_id = extract_video_id(url)
    if not video_id:
        return jsonify({"error": "Invalid YouTube URL"}), 400

    comments = get_youtube_comments(video_id)
    if "error" in comments:
        return jsonify(comments), 500
    if not comments:
        return jsonify({"error": "No comments found"}), 404

    toxic_results = predict_toxicity(comments)
    if "error" in toxic_results:
        return jsonify(toxic_results), 500

    csv_path = "static/toxic_comments.csv"
    try:
        with open(csv_path, 'w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(["Comment", "Author", "Timestamp", "Likes", "Visibility", "Toxicity Score", "Binary Prediction"])
            for result in toxic_results:
                writer.writerow([
                    result["text"],
                    result.get("author", "Unknown"),
                    result["timestamp"],
                    result["likes"],
                    result["visibility"],
                    result["score"],
                    result["binary_prediction"]
                ])
    except Exception as e:
        return jsonify({"error": "Failed to generate CSV"}), 500

    return jsonify({"results": toxic_results, "csv_download": csv_path})

# Endpoint: Download toxic comments CSV
@app.route('/download_csv')
def download_csv():
    return send_from_directory('static', "toxic_comments.csv", as_attachment=True)

# Run Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

