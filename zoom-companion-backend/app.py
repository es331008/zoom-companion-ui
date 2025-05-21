import requests
from flask import Flask, Blueprint, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json

api = Blueprint('api', __name__)
app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app, supports_credentials=True)

OPENROUTER_API_KEY = "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"

# Serve React frontend
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

# Serve other React routes (e.g., /about, /dashboard)
@app.route('/<path:path>')
def serve_react_app(path):
    file_path = f"{app.static_folder}/{path}"
    try:
        return send_from_directory(app.static_folder, path)
    except:
        return send_from_directory(app.static_folder, 'index.html')

@api.route("/get-meeting-list")
def get_meeting_list():
    meetings = []
    out_dir = './data'

    for filename in os.listdir(out_dir):
        if filename.endswith('.json') and '_' in filename:
            try:
                with open(os.path.join(out_dir, filename), 'r') as f:
                    data = json.load(f)

                # Extract meetingId and start_time from filename
                parts = filename.rstrip('.json').split('_')
                if len(parts) != 2:
                    continue

                epoch_time = int(parts[1])

                meetings.append({
                    "meetingTopic": data.get("meetingTopic", "Unknown Topic"),
                    "meetingId": data.get("meetingNumber", "Unknown"),
                    "start_time": epoch_time
                })

            except Exception as e:
                print(f"Failed to read {filename}: {e}")

    return jsonify(meetings)

@api.route('/get-meeting-data')
def get_meeting_data():
    # Get the parameters from the request
    meeting_id = request.args.get('meetingId')
    start_time = request.args.get('startTime')

    if not meeting_id or not start_time:
        return jsonify({"error": "Missing required parameters: meetingId and epoch"}), 400

    # Create the filename by combining meetingId and epoch
    filename = f"{meeting_id}_{start_time}.json"
    filepath = os.path.join('./data', filename)

    # Check if the file exists
    if not os.path.isfile(filepath):
        return jsonify({"error": f"File for meetingId {meeting_id} and epoch {start_time} not found"}), 404

    # Read the data from the file and return as JSON
    with open(filepath, 'r') as file:
        data = json.load(file)

    return jsonify(data)

@api.route("/summarize", methods=["POST"])
def summarize_transcript():
    data = request.get_json()
    voiceTranscript = data.get("voiceTranscript", "")
    chatTranscript = data.get("chatTranscript", "")

    content = f"Voice Transcript: {voiceTranscript}; Chat Transcript: {chatTranscript}"
    if not voiceTranscript or not chatTranscript:
        return jsonify({"error": "Missing one or more transcripts"}), 400

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "yourapp.com",   # Required by OpenRouter
        "X-Title": "ZoomBot Summary"
    }

    payload = {
        "model": "google/gemini-2.0-flash-exp:free",
        "messages": [
            {"role": "system", "content": """You are a helpful assistant that sits in on corporate phone meetings.
            you are able to effectively provide summaries of any transcript and chat history received following a call. You are able to
            effectively discern who unique speakers are by using context clues within the transcript. All summaries you provide
            give a general summary of the meeting, as well as a bulleted list of action items that need to be taken up following
            the completion of the call. This general summary should take into account both the voice and chat transcripts. Your response contains only the summary and the action items. You do not acknowledge that you
            have been asked to perform any actions. Do not preface the summary with any title. Start your response with the direct summary.
            The voice transcript will be prefixed by the words Voice Transcript and end with a semi-colon. The chat transcript will be prefixed by the words Chat Transcript.
            The chat transcript will come in the form of a JSON object where you will have to look at the message, senderName, and timestamp fields
            to understand who send the message, what that message is, and what time the message was sent. The content you receive will be the content you generate
            the summary for. If you are unable to generate a summary, say so."""},
            {"role": "user", "content": content}
        ]
    }

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers=headers,
        json=payload
    )

    if response.status_code == 200:
        summary = response.json()["choices"][0]["message"]["content"]
        return jsonify({"summary": summary})
    else:
        return jsonify({"error": "Failed to summarize", "details": response.text}), response.status_code


app.register_blueprint(api, url_prefix='/api')

if __name__ == "__main__":
    app.run(host='localhost', port=3000, debug=True)
