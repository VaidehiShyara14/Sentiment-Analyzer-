from flask import Flask, request, jsonify
from textblob import TextBlob
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

def analyze_sentiment(text):
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    if polarity > 0:
        sentiment = "Positive"
    elif polarity < 0:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"
    return sentiment, polarity

@app.route('/api/sentiment', methods=['POST'])
def sentiment_api():
    review = request.form.get("review")
    if not review:
        return jsonify({"error": "No review provided."}), 400
    sentiment, polarity = analyze_sentiment(review)
    return jsonify({"sentiment": sentiment, "polarity": polarity})

@app.route('/api/bulk_sentiment', methods=['POST'])
def bulk_sentiment_api():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    reviews = file.read().decode("utf-8").splitlines()
    results = []

    for review in reviews:
        if review.strip():
            sentiment, score = analyze_sentiment(review.strip())
            results.append({
                "review": review.strip(),
                "sentiment": sentiment,
                "polarity": score
            })

    return jsonify(results)

@app.route('/api/explain', methods=['POST'])
def explain_sentiment():
    data = request.get_json()
    review = data.get("review", "")
    sentiment = data.get("sentiment", "")

    review_lower = review.lower()

    # Some simple keyword hints
    positives = ["good", "great", "amazing", "excellent", "love", "happy", "wonderful"]
    negatives = ["bad", "worst", "awful", "terrible", "hate", "poor", "disappointed"]

    explanation = "This review was classified as " + sentiment + " because "

    if sentiment == "Positive":
        explanation += "it uses words that express satisfaction or appreciation, such as "
        explanation += ", ".join([word for word in positives if word in review_lower]) or "positive tone overall"
    elif sentiment == "Negative":
        explanation += "it includes expressions of frustration or negativity, like "
        explanation += ", ".join([word for word in negatives if word in review_lower]) or "a generally critical tone"
    elif sentiment == "Neutral":
        explanation += "it lacks strong emotional cues and stays mostly factual or balanced."
    else:
        explanation = "Unable to generate explanation."

    return jsonify({"explanation": explanation})


if __name__ == "__main__":
    app.run(debug=True)

