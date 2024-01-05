import os
from flask import Flask, jsonify, request, session
from flask_jwt_extended import JWTManager, jwt_required, create_refresh_token, create_access_token, get_jwt_identity
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
app.secret_key = str(os.getenv('JWT_SECRET_KEY'))
app.config['JWT_SECRET_KEY'] = str(os.getenv('JWT_SECRET_KEY'))
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=1)
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access']

jwt = JWTManager(app)
blacklist = set()
auth = HTTPBasicAuth()


@auth.verify_password
def verify_password(login, passwd):
    db_manager = DatabaseManager(
            username=username, password=password, host=host, port=port, database=database)
    user_id = db_manager.authenticate_user(login, passwd)
    if user_id:
        session['user_id'] = user_id
        db_manager.close_session()
        return True
    else:
        db_manager.close_session()
        return False


@app.route('/login', methods=['POST'])
@auth.login_required  # Requires Basic Authentication
def login():
    user = auth.current_user()
    access_token = create_access_token(identity=user)
    refresh_token = create_refresh_token(identity=user)
    return jsonify(
        access_token=access_token, 
        refresh_token=refresh_token, 
        user=user)

@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    auth_header = request.headers.get('Authorization')

    if auth_header:
        # Extracting JTI from Authorization header
        jti = decode_token(auth_header.split()[1])['jti']
        blacklist.add(jti)

        return jsonify(logout="success")
    else:
        return jsonify(message="No authorization header provided"), 401

@app.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token)

@app.route('/signup', methods=['POST'])
def signup():
    db_manager = DatabaseManager(
            username=username, password=password, host=host, port=port, database=database)
    try:
        data = request.get_json()
        new_user_email = data['email']
        new_user_username = data['username']
        new_user_password = data['password']

        db_manager.add_user(username=new_user_username, password=new_user_password, email=new_user_email)
        db_manager.close_session()
        return jsonify({'msg': 'User created successfully'}), 200
    except Exception as e:
        db_manager.close_session()
        return jsonify({'error': str(e)}), 500
    

@app.route('/tasks', methods=['GET', 'POST'])
@jwt_required()
def tasks_collection():
    db_manager = DatabaseManager(
            username=username, password=password, host=host, port=port, database=database)
    if request.method == "GET":
        tasks = db_manager.get_tasks(session.get('user_id'))
        response = jsonify(results=tasks)

    if request.method == "POST":
        # Add a new task
        pass
        response = jsonify({"msg": ""})
    db_manager.close_session()
    return response

@app.route('/tasks(<task_id>)', methods=['GET', 'PUT', 'PATCH', 'DELETE'])
@jwt_required()
def task_item():
    if request.method == "GET":
        # Get task
        pass
    if request.method == "PUT":
        # Update task
        pass
    if request.method == "PATCH":
        # Update task fields
        pass
    if request.method == "DELETE":
        # Delete task
        pass
    response = jsonify({"msg": ""})
    return response



@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    return jti in blacklist

# Function to decode a JWT without verification


def decode_token(token):
    from jose import jwt
    # Replace 'your_jwt_secret_key' with your actual secret key
    return jwt.decode(token, 'your_jwt_secret_key', algorithms=['HS256'], options={'verify_signature': False})


@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):

    return jsonify({'msg': 'Token has expired',
                    'error': 'token_expired'}), 401


@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({'msg': 'Token is invalid',
                    'error': 'token_invalid'}), 403


@jwt.unauthorized_loader
def unauthorized_callback(error):
    return jsonify({'error': 'Failed to authenticate. Check your credentials'}), 403


@auth.error_handler
def unauthorized():
    return jsonify({'error': 'Failed to authenticate. Check your credentials'}), 403


if __name__ == '__main__':
    app.run()
