from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine

Base = declarative_base()

class Game(Base):
    __tablename__ = 'game'
    GameNumber = Column(Integer, primary_key=True)
    TickerPrice = Column(Integer)
    Name = Column(String(32))
    TopPrize = Column(Integer)
    TotalWinners = Column(Integer)
    PrizesClaimed = Column(Integer)
    PrizesAvailable = Column(Integer)

engine = create_engine('mysql+mysqlconnector://appuser:C$575app@localhost/testpython')

Base.metadata.create_all(engine)