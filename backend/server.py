import os
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, unset_jwt_cookies 
from flask_httpauth import HTTPBasicAuth
from datetime import timedelta
from dotenv import load_dotenv
from flask_cors import CORS

from database_manager import DatabaseManager

app = Flask(__name__)
CORS(app)

load_dotenv()
username = str(os.getenv('MYSQL_USER'))
password = str(os.getenv('MYSQL_PASS'))
host = str(os.getenv('MYSQL_HOST'))
port = str(os.getenv('MYSQL_PORT'))
database = str(os.getenv('MYSQL_DB'))
app.config['JWT_SECRET_KEY'] = str(os.getenv('JWT_SECRET_KEY'))
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=5)

jwt = JWTManager(app)
auth = HTTPBasicAuth()


@auth.verify_password
def verify_password(login, passwd):
    # Replace these values with your actual database information
    db_manager = DatabaseManager(username=username, password=password, host=host, port=port, database=database)
    if db_manager.authenticate_user(login, passwd):
        return True
    else:
        return False

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
    return jsonify(access_token=access_token, user=user)

@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

# Custom error handler for JWT token validation failures
@jwt.expired_token_loader
def expired_token_callback(expired_token):
    return jsonify({'error': 'Token has expired'}), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({'error': 'Invalid token'}), 401

@jwt.unauthorized_loader
def unauthorized_callback(error):
    return jsonify({'error': 'Failed to authenticate. Check your credentials'}), 401

@auth.error_handler
def unauthorized():
    return jsonify({'error': 'Failed to authenticate. Check your credentials'}), 401

if __name__ == '__main__':
    app.run()
