import unittest
from unittest.mock import patch, MagicMock
from flask import Flask
from flask_httpauth import HTTPBasicAuth
from flask_jwt_extended import JWTManager, create_access_token
from server import app, blacklist
import json
import os
import base64
from dotenv import load_dotenv

from icecream import ic


class UserMock:
    def __init__(self, user_id, email, username, password) -> None:
        self.user_id = user_id
        self.email = email
        self.username = username
        self.password = password


class TaskMock:
    def __init__(self, task_date, task_id, task_name, user_id, task_complete) -> None:
        self.task_date = task_date
        self.task_id = task_id
        self.task_name = task_name
        self.user_id = user_id
        self.task_complete = task_complete


class FlaskAppTestCase(unittest.TestCase):

    access_token = None
    refresh_token = None

    def setUp(self):
        load_dotenv()
        app.config['TESTING'] = True
        app.config['JWT_SECRET_KEY'] = str(
            os.getenv('JWT_SECRET_KEY'))  # Replace with your secret key
        self.app = app.test_client()

        if not self.access_token:
            tokens = self.get_tokens()
            self.access_token = tokens['access_token']
            self.refresh_token = tokens['refresh_token']

    def tearDown(self):
        pass

    @patch('server.DatabaseManager')
    def get_tokens(self, mock_db_manager):
        # Mock the authenticate_user method
        mock_db_manager.return_value.authenticate_user.return_value = True

        credentials = base64.b64encode(b'user1:password1').decode('utf-8')

        response = self.app.post(
            '/login', headers={'Authorization': 'Basic ' + credentials})

        access_token = json.loads(response.data).get('access_token')
        refresh_token = json.loads(response.data).get('refresh_token')

        return {'access_token': access_token, 'refresh_token': refresh_token}

    @patch('server.DatabaseManager')
    def test_login_with_valid_credentials(self, mock_db_manager):
        # Mock the authenticate_user method
        mock_db_manager.return_value.authenticate_user.return_value = True

        credentials = base64.b64encode(b'user1:password1').decode('utf-8')

        response = self.app.post(
            '/login', headers={'Authorization': 'Basic ' + credentials})
        data = json.loads(response.get_data(as_text=True))
        self.assertIn('access_token', data)
        self.assertIn('refresh_token', data)

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
        self.assertEqual(response.status_code, 403)
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

        self.assertEqual(response.status_code, 403)
        self.assertEqual(json.loads(response.data), {
                         'error': 'token_invalid', 'msg': 'Token is invalid'})

    def test_refresh_token(self):
        # Use an invalid access token
        headers = {'Authorization': f'Bearer {self.refresh_token}'}
        response = self.app.post(
            '/refresh', headers=headers)

        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('access_token', data)
        self.assertNotEqual(data['access_token'], self.access_token)

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

    @patch('server.DatabaseManager')
    def test_user_signup(self, mock_db_manager):
        mock_db_manager.return_value.add_user.return_value = UserMock(
            user_id=1000,
            email='test@test',
            username='testuser',
            password='password'
        )

        headers = {'Authorization': f'Bearer {self.access_token}'}
        body = {'email': 'test@test',
                'username': 'testuser', 'password': 'password'}
        response = self.app.post(
            '/signup', headers=headers, json=body)

        self.assertEqual(response.status_code, 201)

    @patch('server.DatabaseManager')
    def test_user_signup_missing_values(self, mock_db_manager):
        headers = {'Authorization': f'Bearer {self.access_token}'}
        body = {'email': 'test@test',
                'password': 'password'}
        response = self.app.post(
            '/signup', headers=headers, json=body)

        self.assertEqual(response.status_code, 400)

    @patch('server.DatabaseManager')
    def test_add_task(self, mock_db_manager):
        mock_db_manager.return_value.add_task.return_value = TaskMock(
            task_date="2024-01-24",
            task_id=100,
            task_name="Test Task",
            user_id=100,
            task_complete=False
        )

        headers = {'Authorization': f'Bearer {self.access_token}'}
        body = {'taskName': 'Test Task',
                'dateDue': '2024-01-24'}
        response = self.app.post(
            '/tasks', headers=headers, json=body)

        self.assertEqual(response.status_code, 201)

    @patch('server.DatabaseManager')
    def test_add_task_missing_values(self, mock_db_manager):
        headers = {'Authorization': f'Bearer {self.access_token}'}
        body = {'task_name': 'Test Task',
                'task_date': '2024-01-24'}
        response = self.app.post(
            '/tasks', headers=headers, json=body)

        self.assertEqual(response.status_code, 400)

    @patch('server.DatabaseManager')
    def test_delete_task(self, mock_db_manager):
        mock_db_manager.return_value.delete_task.return_value = 100

        headers = {'Authorization': f'Bearer {self.access_token}'}
        response = self.app.delete(
            '/tasks(100)', headers=headers)

        self.assertEqual(response.status_code, 202)

    @patch('server.DatabaseManager')
    def test_delete_task_missing_values(self, mock_db_manager):
        mock_db_manager.return_value.delete_task.return_value = "Task does not exist."

        headers = {'Authorization': f'Bearer {self.access_token}'}
        response = self.app.delete(
            '/tasks(100)', headers=headers)

        self.assertEqual(response.status_code, 400)

if __name__ == '__main__':
    unittest.main()
