from pydantic import BaseModel
from typing import List, Optional

# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    email: str
    profile_picture_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

# --- Trip Schemas ---
class TripBase(BaseModel):
    title: str
    destination: str
    start_date: str
    end_date: str

class TripCreate(TripBase):
    pass

class Trip(TripBase):
    id: int
    owner_id: int
    class Config:
        from_attributes = True

# --- Itinerary Schemas ---
class ItineraryItemBase(BaseModel):
    day: int
    time: str
    activity: str
    location: str

class ItineraryItemCreate(ItineraryItemBase):
    pass

class ItineraryItem(ItineraryItemBase):
    id: int
    trip_id: int
    class Config:
        from_attributes = True

# --- Expense Schemas ---
class ExpenseBase(BaseModel):
    category: str
    amount: float
    description: str

class ExpenseCreate(ExpenseBase):
    pass

class Expense(ExpenseBase):
    id: int
    trip_id: int
    class Config:
        from_attributes = True

# --- Checklist Schemas ---
class ChecklistItemBase(BaseModel):
    task: str
    is_completed: Optional[bool] = False

class ChecklistItemCreate(ChecklistItemBase):
    pass

class ChecklistItem(ChecklistItemBase):
    id: int
    trip_id: int
    class Config:
        from_attributes = True

# --- Journal Schemas ---
class JournalEntryBase(BaseModel):
    date: str
    content: str

class JournalEntryCreate(JournalEntryBase):
    pass

class JournalEntry(JournalEntryBase):
    id: int
    trip_id: int
    class Config:
        from_attributes = True
