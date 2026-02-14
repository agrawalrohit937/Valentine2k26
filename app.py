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

@app.route('/predict', methods=['POST'])
def predict():
    """
    Handle compatibility prediction
    
    Expected input format (15 features):
    [rating_attractiveness, rating_sincerity, rating_intelligence, rating_fun, 
     rating_ambition, rating_interests, pref_attractiveness, pref_sincerity, 
     pref_intelligence, pref_fun, pref_ambition, pref_interests, 
     interest_correlation, age_diff, same_race]
    """
    try:
        if model is None:
            return jsonify({
                'error': 'Model not loaded. Please ensure xgboost_model.pkl is available.'
            }), 500

        # Get JSON data from request
        data = request.get_json()
        
        # Extract features in the exact order expected by the model
        features = [
            float(data['rating_attractiveness']),
            float(data['rating_sincerity']),
            float(data['rating_intelligence']),
            float(data['rating_fun']),
            float(data['rating_ambition']),
            float(data['rating_interests']),
            float(data['pref_attractiveness']) * 5,  # Scale preferences 1-10 to 5-50
            float(data['pref_sincerity']) * 5,
            float(data['pref_intelligence']) * 5,
            float(data['pref_fun']) * 5,
            float(data['pref_ambition']) * 5,
            float(data['pref_interests']) * 5,
            float(data['interest_correlation']),
            float(data['age_diff']),
            float(data['same_race'])
        ]
        
        # Convert to numpy array and reshape for prediction
        features_array = np.array(features).reshape(1, -1)
        
        # # Get prediction probability
        # prediction_proba = model.predict_proba(features_array)[0][1]
        
        # # Apply threshold (0.34 as per your specification)
        # threshold = 0.34
        # is_compatible = prediction_proba >= threshold
        
        # # Calculate percentage (0-100%)
        # compatibility_percentage = min(round(prediction_proba * 100, 1), 100)


        # Force NumPy → Python float
        prediction_proba = float(model.predict_proba(features_array)[0][1])

        threshold = 0.34
        is_compatible = prediction_proba >= threshold

        compatibility_percentage = min(float(round(prediction_proba * 100, 1)), 100.0)

        
        # Generate emotional interpretation
        if compatibility_percentage >= 70:
            interpretation = "Strong Potential ❤️"
            # message = "The stars are aligned! You two share a magical connection with strong compatibility across multiple dimensions."
            message = (
            "This feels special ✨ The universe seems to be cheering for you two. "
            "Your vibes align beautifully, and there’s a rare spark here worth holding onto."
            )
        elif compatibility_percentage >= 40:
            interpretation = "Worth Exploring 💫"
            # message = "There's definitely something here! While not perfect, you share enough compatibility to build something beautiful together."
            message = (
            "Not perfect, but perfectly interesting 🌙 There’s warmth, curiosity, and "
            "just enough magic to see where this story could go."
            )
        else:
            interpretation = "Maybe Not a Great Match 💔"
            # message = "Sometimes the heart wants what it wants, but the data suggests you might face some challenges. Stay open to other possibilities!"
            # message = (
            # "Some connections teach us lessons rather than love 💔 "
            # "Sometimes the heart wants what it wants, but the data suggests you might face some challenges. "
            # "Stay open to other possibilities!."
            # )
            message = (
            "Some connections teach us lessons rather than love 💔\n"
            "Sometimes the heart wants what it wants, but the data suggests you might face some challenges.\n"
            "Stay open to other possibilities!."
            )

            
        # Return prediction results
        # return jsonify({
        #     'success': True,
        #     'compatible': bool(is_compatible),
        #     'compatibility_percentage': compatibility_percentage,
        #     'interpretation': interpretation,
        #     'message': message,
        #     'raw_probability': round(float(prediction_proba), 4)
        # })
        return jsonify({
        'success': True,
        'compatible': bool(is_compatible),
        'compatibility_percentage': float(compatibility_percentage),
        'interpretation': interpretation,
        'message': message,
        'raw_probability': float(round(prediction_proba, 4))
    })

        
    except KeyError as e:
        return jsonify({
            'error': f'Missing required field: {str(e)}'
        }), 400
    except ValueError as e:
        return jsonify({
            'error': f'Invalid value provided: {str(e)}'
        }), 400
    except Exception as e:
        return jsonify({
            'error': f'Prediction error: {str(e)}'
        }), 500

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
