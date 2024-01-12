from dotenv import load_dotenv
import os
from sqlalchemy import create_engine, Column, Integer, String, Boolean, Sequence, exc
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
import bcrypt


Base = declarative_base()


class UserTable(Base):
    __tablename__ = 'users'
    user_id = Column(Integer, Sequence('user_id_seq'),
                     primary_key=True, index=True)
    username = Column(String(50), index=True)
    userpass = Column(String(255))
    email = Column(String(100), unique=True, index=True)


class TaskTable(Base):
    __tablename__ = 'tasks'
    task_id = Column(Integer, Sequence('task_id_seq'), primary_key=True)
    user_id = Column(String(50))
    task_name = Column(String(50))
    task_date = Column(String(100))
    task_complete = Column(Boolean)


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

    def authenticate_user(self, email, password):
        # Validate user and password
        user = self.session.query(UserTable).filter_by(
            email=email).first()

        if user and bcrypt.checkpw(password=password.encode('utf-8'), hashed_password=user.userpass.encode('utf-8')):
            return user.user_id  # Authentication successful
        else:
            return False  # Authentication failed

    def add_user(self, username, password, email):
        password_hash = bcrypt.hashpw(
            password.encode('utf-8'), bcrypt.gensalt())
        
        new_user = UserTable(
            username=username,
            email=email, 
            userpass=password_hash
        )
        try:
            self.session.add(new_user)
            self.session.commit()
            self.session.refresh(new_user)
            return new_user
        except exc.SQLAlchemyError as e:
            print(e)
            self.session.rollback()
            return e

    def get_tasks(self, user_id):
        # Get tasks from table associated to user
        if user_id:
            tasks = self.session.query(
                TaskTable).filter_by(user_id=user_id).all()
            tasks_schema = TaskTableSchema(many=True)
            return tasks_schema.dump(tasks)
        else:
            return []

    def add_task(self, task_name, user_id, date_due, task_complete):
        # Insert a new task for the user
        if user_id:
            new_task = TaskTable(
                user_id=user_id, 
                task_name=task_name, 
                task_date=date_due,
                task_complete=task_complete
            )
            try:
                self.session.add(new_task)
                self.session.commit()
                self.session.refresh(new_task)
                return new_task
            except exc.SQLAlchemyError as e:
                print(e)
                self.session.rollback()
                return e
        else:
            return "Missing user_id."

    def delete_task(self, task_id, user_id):
        # Insert a new task for the user
        if user_id:
            try:
                delete_user = self.session.query(TaskTable).filter_by(task_id=task_id).one()
                self.session.delete(delete_user)
                self.session.commit()
                return task_id
            except exc.SQLAlchemyError as e:
                print(e)
                self.session.rollback()
                return e
        else:
            return "Missing user_id."

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

    db_manager = DatabaseManager(
        username=username, password=password, host=host, port=port, database=database)

    # Add user

    db_manager.add_user('newuser', 'password', 'newuser@domain.com')

    # Verify Password

    if db_manager.authenticate_user('newuser@domain.com', 'password'):
        print("Authentication successful!")
    else:
        print("Authentication failed.")

    # print(db_manager.get_tasks('1'))

    db_manager.close_session()
