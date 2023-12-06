from dotenv import load_dotenv
import os
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Sequence
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from flask import session
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema


Base = declarative_base()


class UserTable(Base):
    __tablename__ = 'users'
    user_id = Column(Integer, Sequence('user_id_seq'), primary_key=True)
    username = Column(String(50))
    userpass = Column(String(50))
    email = Column(String(100))


class TaskTable(Base):
    __tablename__ = 'tasks'
    task_id = Column(Integer, Sequence('task_id_seq'), primary_key=True)
    user_id = Column(String(50))
    task_name = Column(String(50))
    task_date = Column(String(100))


class UserTableSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = UserTable


class TaskTableSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = TaskTable


class DatabaseManager:
    def __init__(self, username, password, host, port, database):
        # Replace these values with your actual database information
        self.DATABASE_URI = f'mysql+mysqlconnector://{username}:{password}@{host}:{port}/{database}'

        # Create the database engine
        self.engine = create_engine(self.DATABASE_URI)

        # Create the table in the database (if not exists)
        Base.metadata.create_all(self.engine)

        # Create a session to interact with the database
        self.Session = sessionmaker(bind=self.engine)
        self.session = self.Session()

    def authenticate_user(self, username, password):
        # Validate user and password
        user = self.session.query(UserTable).filter_by(
            username=username, userpass=password).first()

        if user:
            session['user_id'] = user.user_id
            return True  # Authentication successful
        else:
            return False  # Authentication failed

    def get_tasks(self):
        # Get tasks from table associated to user
        user_id = session.get('user_id')
        if user_id:
            tasks = self.session.query(
                TaskTable).filter_by(user_id=user_id).all()
            tasks_schema = TaskTableSchema(many=True)
            return tasks_schema.dump(tasks)
        else:
            return []

    def add_task(self, task_name):
        # Insert a new task for the user
        user_id = session.get('user_id')
        if user_id:
            new_task = TaskTable(user_id=user_id, task_name=task_name)
            self.session.add(new_task)
            self.session.commit()
            return new_task.task_id
        else:
            return None

    def close_session(self):
        # Close the session
        self.session.close()


# Example of using the DatabaseManager class
if __name__ == "__main__":
    load_dotenv()
    username = str(os.getenv('MYSQL_USER'))
    password = str(os.getenv('MYSQL_PASS'))
    host = str(os.getenv('MYSQL_HOST'))
    port = str(os.getenv('MYSQL_PORT'))
    database = str(os.getenv('MYSQL_DB'))
    # Replace these values with your actual database information
    db_manager = DatabaseManager(
        username=username, password=password, host=host, port=port, database=database)

    if db_manager.authenticate_user('testuser', 'password'):
        print("Authentication successful!")
    else:
        print("Authentication failed.")

    print(db_manager.get_tasks('1'))

    db_manager.close_session()
