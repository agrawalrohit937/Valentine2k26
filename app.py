"""
AI Love Compatibility Checker - Flask Backend
Valentine's Day Special Edition
"""

from flask import Flask, render_template, request, jsonify
import pickle
import numpy as np
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Load the pre-trained XGBoost model
MODEL_PATH = 'model/xgboost_model.pkl'

try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    print("✓ Model loaded successfully!")
except FileNotFoundError:
    print(f"⚠ Warning: Model file '{MODEL_PATH}' not found. Please ensure it's in the root directory.")
    model = None

@app.route('/')
def index():
    """Render the main compatibility checker page"""
    return render_template('index.html')

# @app.route('/predict', methods=['POST'])
# def predict():
#     """
#     Handle compatibility prediction
    
#     Expected input format (15 features):
#     [rating_attractiveness, rating_sincerity, rating_intelligence, rating_fun, 
#      rating_ambition, rating_interests, pref_attractiveness, pref_sincerity, 
#      pref_intelligence, pref_fun, pref_ambition, pref_interests, 
#      interest_correlation, age_diff, same_race]
#     """
#     try:
#         if model is None:
#             return jsonify({
#                 'error': 'Model not loaded. Please ensure xgboost_model.pkl is available.'
#             }), 500

#         # Get JSON data from request
#         data = request.get_json()
        
#         # Extract features in the exact order expected by the model
#         features = [
#             float(data['rating_attractiveness']),
#             float(data['rating_sincerity']),
#             float(data['rating_intelligence']),
#             float(data['rating_fun']),
#             float(data['rating_ambition']),
#             float(data['rating_interests']),
#             float(data['pref_attractiveness']) * 5,  # Scale preferences 1-10 to 5-50
#             float(data['pref_sincerity']) * 5,
#             float(data['pref_intelligence']) * 5,
#             float(data['pref_fun']) * 5,
#             float(data['pref_ambition']) * 5,
#             float(data['pref_interests']) * 5,
#             float(data['interest_correlation']),
#             float(data['age_diff']),
#             float(data['same_race'])
#         ]
        
#         # Convert to numpy array and reshape for prediction
#         features_array = np.array(features).reshape(1, -1)
        
#         # # Get prediction probability
#         # prediction_proba = model.predict_proba(features_array)[0][1]
        
#         # # Apply threshold (0.34 as per your specification)
#         # threshold = 0.34
#         # is_compatible = prediction_proba >= threshold
        
#         # # Calculate percentage (0-100%)
#         # compatibility_percentage = min(round(prediction_proba * 100, 1), 100)


#         # Force NumPy → Python float
#         prediction_proba = float(model.predict_proba(features_array)[0][1])

#         # threshold = 0.34
#         # is_compatible = prediction_proba >= threshold

#         # compatibility_percentage = min(float(round(prediction_proba * 100, 1)), 100.0)

        
#         # # Generate emotional interpretation
#         # if compatibility_percentage >= 70:
#         #     interpretation = "Strong Potential ❤️"
#         #     # message = "The stars are aligned! You two share a magical connection with strong compatibility across multiple dimensions."
#         #     message = (
#         #     "This feels special ✨ The universe seems to be cheering for you two. "
#         #     "Your vibes align beautifully, and there’s a rare spark here worth holding onto."
#         #     )
#         # elif compatibility_percentage >= 40:
#         #     interpretation = "Worth Exploring 💫"
#         #     # message = "There's definitely something here! While not perfect, you share enough compatibility to build something beautiful together."
#         #     message = (
#         #     "Not perfect, but perfectly interesting 🌙 There’s warmth, curiosity, and "
#         #     "just enough magic to see where this story could go."
#         #     )
#         # else:
#         #     interpretation = "Maybe Not a Great Match 💔"
#         #     # message = "Sometimes the heart wants what it wants, but the data suggests you might face some challenges. Stay open to other possibilities!"
#         #     # message = (
#         #     # "Some connections teach us lessons rather than love 💔 "
#         #     # "Sometimes the heart wants what it wants, but the data suggests you might face some challenges. "
#         #     # "Stay open to other possibilities!."
#         #     # )
#         #     message = (
#         #     "Some connections teach us lessons rather than love 💔\n"
#         #     "Sometimes the heart wants what it wants, but the data suggests you might face some challenges.\n"
#         #     "Stay open to other possibilities!."
#         #     )
#         compatibility_percentage = float(round(prediction_proba * 100, 1))

#         # Determine category directly from percentage
#         if compatibility_percentage >= 70:
#             label = "Highly Compatible ❤️"
#             interpretation = "Strong Potential ❤️"
#             message = (
#                 "This feels special ✨ The universe seems to be cheering for you two. "
#                 "Your vibes align beautifully, and there’s a rare spark here worth holding onto."
#             )

#         elif compatibility_percentage >= 50:
#             label = "Moderately Compatible 💕"
#             interpretation = "Worth Exploring 💫"
#             message = (
#                 "There’s something here worth exploring 🌙 "
#                 "With time and intention, this connection could grow into something meaningful."
#             )

#         elif compatibility_percentage >= 35:
#             label = "Low Compatibility 💫"
#             interpretation = "Mixed Signals"
#             message = (
#                 "There are some areas of alignment, but also noticeable gaps. "
#                 "More time and understanding would be needed."
#             )

#         else:
#             label = "Not Compatible 💔"
#             interpretation = "Maybe Not a Great Match 💔"
#             message = (
#                 "Some connections teach us lessons rather than love 💔 "
#                 "This match may face challenges in key areas."
#             )


            
#         # Return prediction results
#         # return jsonify({
#         #     'success': True,
#         #     'compatible': bool(is_compatible),
#         #     'compatibility_percentage': compatibility_percentage,
#         #     'interpretation': interpretation,
#         #     'message': message,
#         #     'raw_probability': round(float(prediction_proba), 4)
#         # })
#     #     return jsonify({
#     #     'success': True,
#     #     'compatible': bool(is_compatible),
#     #     'compatibility_percentage': float(compatibility_percentage),
#     #     'interpretation': interpretation,
#     #     'message': message,
#     #     'raw_probability': float(round(prediction_proba, 4))
#     # })
#             return jsonify({
#             'success': True,
#             'label': label,
#             'compatibility_percentage': compatibility_percentage,
#             'interpretation': interpretation,
#             'message': message,
#             'raw_probability': float(round(prediction_proba, 4))
#         })


        
#     except KeyError as e:
#         return jsonify({
#             'error': f'Missing required field: {str(e)}'
#         }), 400
#     except ValueError as e:
#         return jsonify({
#             'error': f'Invalid value provided: {str(e)}'
#         }), 400
#     except Exception as e:
#         return jsonify({
#             'error': f'Prediction error: {str(e)}'
#         }), 500

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500

        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON received'}), 400

        features = [
            float(data['rating_attractiveness']),
            float(data['rating_sincerity']),
            float(data['rating_intelligence']),
            float(data['rating_fun']),
            float(data['rating_ambition']),
            float(data['rating_interests']),
            float(data['pref_attractiveness']) * 5,
            float(data['pref_sincerity']) * 5,
            float(data['pref_intelligence']) * 5,
            float(data['pref_fun']) * 5,
            float(data['pref_ambition']) * 5,
            float(data['pref_interests']) * 5,
            float(data['interest_correlation']),
            float(data['age_diff']),
            float(data['same_race'])
        ]

        features_array = np.array(features).reshape(1, -1)
        prediction_proba = float(model.predict_proba(features_array)[0][1])
        compatibility_percentage = round(prediction_proba * 100, 1)


        # 🔥 HUMAN LOGIC BOOST (Valentine UX Fix)
        avg_rating = np.mean([
            data['rating_attractiveness'],
            data['rating_sincerity'],
            data['rating_intelligence'],
            data['rating_fun'],
            data['rating_ambition'],
            data['rating_interests']
        ])

        avg_pref = np.mean([
            data['pref_attractiveness'],
            data['pref_sincerity'],
            data['pref_intelligence'],
            data['pref_fun'],
            data['pref_ambition'],
            data['pref_interests']
        ])

        # If user feels good AND cares about those traits
        if avg_rating >= 4 and avg_pref >= 4:
            compatibility_percentage = max(compatibility_percentage, 55)


        # Determine labels and viral-ready messages
        if compatibility_percentage >= 85:
            label = "Twin Flame Connection 🔥"
            interpretation = "Soulmate Potential ❤️"
            message = (
                "The stars have aligned! ✨ The universe is clearly cheering for you two. "
                "Your connection transcends the ordinary—it's rare, magical, and absolutely "
                "worth holding onto with both hands."
            )
        elif compatibility_percentage >= 70:
            label = "Highly Compatible ❤️"
            interpretation = "Strong Potential ❤️"
            message = (
                "This feels special ✨ Your vibes align beautifully in all the ways that matter. "
                "There is a genuine spark here that could easily grow into a beautiful story."
            )
        elif compatibility_percentage >= 50:
            label = "Moderately Compatible 💕"
            interpretation = "Worth Exploring 💫"
            message = (
                "Not perfect, but perfectly interesting 🌙 There’s warmth, curiosity, and "
                "just enough magic to see where this journey could lead you. Take it slow and let it grow."
            )
        elif compatibility_percentage >= 35:
            label = "Low Compatibility 💫"
            interpretation = "Mixed Signals"
            message = (
                "There’s a spark, but the timing or the data feels a bit out of sync ☁️. "
                "It might take extra work, or perhaps this connection is a beautiful lesson in disguise."
            )
        else:
            label = "Not a Match 💔"
            interpretation = "Maybe Not the One 💔"
            message = (
                "Some connections teach us lessons rather than love 💔. "
                "The data suggests challenges ahead, but remember: the heart often defies the algorithm. "
                "Keep your magic open for the right one!"
            )

        return jsonify({
            'success': True,
            'label': label,
            'compatibility_percentage': compatibility_percentage,
            'interpretation': interpretation,
            'message': message,
            'raw_probability': round(prediction_proba, 4)
        })

    except Exception as e:
        print("ERROR:", e)
        return jsonify({'error': str(e)}), 500


@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

# if __name__ == '__main__':
#     # Run the Flask app
#     app.run(debug=True, host='0.0.0.0', port=5000)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
