import unittest
from unittest.mock import patch
from flask import Flask
from flask_httpauth import HTTPBasicAuth
from flask_jwt_extended import JWTManager, create_access_token
from server import app  # Import your Flask application instance
import json
import os
import base64
from dotenv import load_dotenv


class FlaskAppTestCase(unittest.TestCase):

    access_token = None

    def setUp(self):
        load_dotenv()
        app.config['TESTING'] = True
        app.config['JWT_SECRET_KEY'] = str(os.getenv('JWT_SECRET_KEY'))  # Replace with your secret key
        self.app = app.test_client()

        if not self.access_token:
            self.access_token = self.get_access_token()

    def tearDown(self):
        pass

    @patch('server.DatabaseManager') 
    def get_access_token(self, mock_db_manager):
        # Mock the authenticate_user method
        mock_db_manager.return_value.authenticate_user.return_value = True

        credentials = base64.b64encode(b'user1:password1').decode('utf-8')
        
        response = self.app.post('/login', headers={'Authorization': 'Basic ' + credentials})
        return json.loads(response.data).get('access_token')


    @patch('server.DatabaseManager') 
    def test_login_with_valid_credentials(self, mock_db_manager):
        # Mock the authenticate_user method
        mock_db_manager.return_value.authenticate_user.return_value = True

        credentials = base64.b64encode(b'user1:password1').decode('utf-8')
        
        response = self.app.post('/login', headers={'Authorization': 'Basic ' + credentials})
        data = json.loads(response.get_data(as_text=True))
        self.assertIn('access_token', data)


    @patch('server.DatabaseManager') 
    def test_login_with_invalid_credentials(self, mock_db_manager):
        # Mock the authenticate_user method
        mock_db_manager.return_value.authenticate_user.return_value = False
        credentials = base64.b64encode(b'user:invalid').decode('utf-8')
        
        response = self.app.post('/login', headers={'Authorization': 'Basic ' + credentials})
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 403)
        data = json.loads(response.data)
        self.assertEqual(data, {'error': 'Failed to authenticate. Check your credentials'})

    def test_protected_route_without_token(self):
        response = self.app.get('/protected')
        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.data), {'error': 'Failed to authenticate. Check your credentials'})

    def test_protected_route_with_valid_token(self):
        # Obtain a valid access token for testing
        headers = {'Authorization': f'Bearer {self.access_token}'}
        response = self.app.get('/protected', headers=headers)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.data), {'message': 'Hello, user1! This is a protected resource.'})

    def test_protected_route_with_invalid_token(self):
        # Use an invalid access token
        headers = {'Authorization': 'Bearer invalid-token'}
        response = self.app.get('/protected', headers=headers)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.data), {'error': 'Invalid token'})

if __name__ == '__main__':
    unittest.main()
