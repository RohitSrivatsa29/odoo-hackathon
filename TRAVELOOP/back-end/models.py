from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, Date
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    profile_picture_url = Column(String, nullable=True)
    
    trips = relationship("Trip", back_populates="owner")

class Trip(Base):
    __tablename__ = "trips"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    destination = Column(String)
    start_date = Column(String)
    end_date = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("User", back_populates="trips")
    itineraries = relationship("ItineraryItem", back_populates="trip", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="trip", cascade="all, delete-orphan")
    checklists = relationship("ChecklistItem", back_populates="trip", cascade="all, delete-orphan")
    journals = relationship("JournalEntry", back_populates="trip", cascade="all, delete-orphan")

class ItineraryItem(Base):
    __tablename__ = "itinerary_items"
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"))
    day = Column(Integer)
    time = Column(String)
    activity = Column(String)
    location = Column(String)
    
    trip = relationship("Trip", back_populates="itineraries")

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"))
    category = Column(String)
    amount = Column(Float)
    description = Column(String)
    
    trip = relationship("Trip", back_populates="expenses")

class ChecklistItem(Base):
    __tablename__ = "checklist_items"
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"))
    task = Column(String)
    is_completed = Column(Boolean, default=False)
    
    trip = relationship("Trip", back_populates="checklists")

class JournalEntry(Base):
    __tablename__ = "journal_entries"
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"))
    date = Column(String)
    content = Column(String)
    
    trip = relationship("Trip", back_populates="journals")
