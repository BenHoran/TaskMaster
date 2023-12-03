# database_manager.py
from dotenv import load_dotenv
import os
from sqlalchemy import create_engine, Column, Integer, String, Sequence
from sqlalchemy.orm import declarative_base, sessionmaker

class DatabaseManager:
    def __init__(self, username, password, host, port, database):
        # Replace these values with your actual database information
        self.DATABASE_URI = f'mysql+mysqlconnector://{username}:{password}@{host}:{port}/{database}'

        print(self.DATABASE_URI)

        # Define the database model
        self.Base = declarative_base()

        class UserTable(self.Base):
            __tablename__ = 'users'
            user_id = Column(Integer, Sequence('user_id_seq'), primary_key=True)
            username = Column(String(50))
            userpass = Column(String(50))
            email = Column(String(100))

        # Set UserTable as an attribute of the DatabaseManager instance
        self.UserTable = UserTable

        # Create the database engine
        self.engine = create_engine(self.DATABASE_URI)

        # Create the table in the database (if not exists)
        self.Base.metadata.create_all(self.engine)

        # Create a session to interact with the database
        self.Session = sessionmaker(bind=self.engine)
        self.session = self.Session()

    def authenticate_user(self, username, password):
        # Validate user and password
        user = self.session.query(self.UserTable).filter_by(username=username, userpass=password).first()

        if user:
            return True  # Authentication successful
        else:
            return False  # Authentication failed

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
    db_manager = DatabaseManager(username=username, password=password, host=host, port=port, database=database)

    if db_manager.authenticate_user('testuser', 'password'):
        print("Authentication successful!")
    else:
        print("Authentication failed.")

    db_manager.close_session()
