import os
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, unset_jwt_cookies
from flask_httpauth import HTTPBasicAuth
from datetime import timedelta
from dotenv import load_dotenv

app = Flask(__name__)
jwt = JWTManager(app)
auth = HTTPBasicAuth()

# Simulated user database (replace with your actual user database)
users = {
    'user1': 'password1',
    'user2': 'password2',
}

@auth.verify_password
def verify_password(username, password):
    if username in users and users[username] == password:
        return username
    else:
        return False

@app.route('/')
def home():
    return "Welcome to the main page!"

@app.route('/protected')
@jwt_required()  # Requires JWT token for access
def protected():
    current_user = get_jwt_identity()
    return jsonify(message=f"Hello, {current_user}! This is a protected resource.")

@app.route('/login', methods=['POST'])
@auth.login_required  # Requires Basic Authentication
def login():
    user = auth.current_user()
    access_token = create_access_token(identity=user, fresh=True)
    return jsonify(access_token=access_token)

@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

@auth.error_handler
def auth_error():
    return jsonify({'error': 'Authentication failed'}), 401


if __name__ == '__main__':
    load_dotenv()
    app.config['JWT_SECRET_KEY'] = str(os.getenv('JWT_SECRET_KEY'))
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=5)
    app.run()
