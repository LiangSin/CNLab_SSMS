from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from sqlalchemy import text
import os

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("SQLALCHEMY_DATABASE_URL")

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_exec():
    db = next(get_db())
    result = db.execute(text("SELECT 1")).scalar()
    print("Test SELECT 1 result:", result)

    tables = db.execute(text("SELECT name FROM sqlite_master WHERE type='table';")).fetchall()
    print("Tables:", [t[0] for t in tables]) 

if __name__ == '__main__':
    test_exec()