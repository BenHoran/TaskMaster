import unittest
from unittest.mock import patch
from flask import Flask
from flask_httpauth import HTTPBasicAuth
from flask_jwt_extended import JWTManager, create_access_token
from server import app, blacklist  # Import your Flask application instance
import json
import os
import base64
from dotenv import load_dotenv


class FlaskAppTestCase(unittest.TestCase):

    access_token = None

    def setUp(self):
        load_dotenv()
        app.config['TESTING'] = True
        app.config['JWT_SECRET_KEY'] = str(
            os.getenv('JWT_SECRET_KEY'))  # Replace with your secret key
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

        response = self.app.post(
            '/login', headers={'Authorization': 'Basic ' + credentials})
        return json.loads(response.data).get('access_token')

    @patch('server.DatabaseManager')
    def test_login_with_valid_credentials(self, mock_db_manager):
        # Mock the authenticate_user method
        mock_db_manager.return_value.authenticate_user.return_value = True

        credentials = base64.b64encode(b'user1:password1').decode('utf-8')

        response = self.app.post(
            '/login', headers={'Authorization': 'Basic ' + credentials})
        data = json.loads(response.get_data(as_text=True))
        self.assertIn('access_token', data)

    @patch('server.DatabaseManager')
    def test_login_with_invalid_credentials(self, mock_db_manager):
        # Mock the authenticate_user method
        mock_db_manager.return_value.authenticate_user.return_value = False
        credentials = base64.b64encode(b'user:invalid').decode('utf-8')

        response = self.app.post(
            '/login', headers={'Authorization': 'Basic ' + credentials})
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 403)
        data = json.loads(response.data)
        self.assertEqual(
            data, {'error': 'Failed to authenticate. Check your credentials'})

    def test_protected_route_without_token(self):
        response = self.app.get('/tasks')
        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.data), {
                         'error': 'Failed to authenticate. Check your credentials'})

    @patch('server.DatabaseManager')
    def test_protected_route_with_valid_token(self, mock_db_manager):
        # Obtain a valid access token for testing
        mock_db_manager.return_value.get_tasks.return_value = [
            {
                "task_date": "2023-12-05",
                "task_id": 1,
                "task_name": "Feed fish",
                "user_id": "1"
            },
            {
                "task_date": "2023-12-05",
                "task_id": 2,
                "task_name": "Buy flowers",
                "user_id": "1"
            }
        ]

        headers = {'Authorization': f'Bearer {self.access_token}'}
        response = self.app.get('/tasks', headers=headers)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.data), {
                         'results': [
                             {
                                 "task_date": "2023-12-05",
                                 "task_id": 1,
                                 "task_name": "Feed fish",
                                 "user_id": "1"
                             },
                             {
                                 "task_date": "2023-12-05",
                                 "task_id": 2,
                                 "task_name": "Buy flowers",
                                 "user_id": "1"
                             }]})

    def test_protected_route_with_invalid_token(self):
        # Use an invalid access token
        headers = {'Authorization': 'Bearer invalid-token'}
        response = self.app.get('/tasks', headers=headers)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.data), {
                         'error': 'token_invalid', 'msg': 'Token is invalid'})
        
    @patch('server.DatabaseManager')
    def test_logout_revokes_token(self, mock_db_manager):
        mock_db_manager.return_value.authenticate_user.return_value = True

        credentials = base64.b64encode(b'user1:password1').decode('utf-8')

        response = self.app.post(
            '/login', headers={'Authorization': 'Basic ' + credentials})
        access_token = json.loads(response.data).get('access_token')
    
        headers = {'Authorization': f'Bearer {access_token}'}
        response = self.app.post('/logout', headers=headers)

        self.assertEqual(response.status_code, 200)

        headers = {'Authorization': f'Bearer {access_token}'}
        response = self.app.get('/tasks', headers=headers)

        self.assertEqual(response.status_code, 401)



if __name__ == '__main__':
    unittest.main()
