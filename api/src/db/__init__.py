from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base

from src.config import app_config


# Create database engine
# Set echo=True for SQL query logging
engine = create_engine(app_config.DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
Base.metadata.create_all(engine)

# Create DB session
def db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


class DB:

    @staticmethod
    def execute(query: str):
        with engine.connect() as connection:
            connection.execute(text(query))
            connection.commit()

    @staticmethod
    def is_table_exists(table_name: str) -> bool:
        global engine
        inspector = inspect(engine)
        return inspector.has_table(table_name=table_name)
