from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DB_PATH = "sqlite:///./feedbacks.db"  # Will create feedbacks.db in backend/

engine = create_engine(DB_PATH, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False)
Base = declarative_base()


class FeedbackDB(Base):
    __tablename__ = "feedbacks"
    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, nullable=False)
    feedback = Column(String, nullable=False)


# Create the table
Base.metadata.create_all(bind=engine)
