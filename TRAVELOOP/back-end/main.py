import os
import shutil
from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from dotenv import load_dotenv

import models
import schemas
from database import engine, get_db

load_dotenv()

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Create uploads directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)

app = FastAPI(title="TRAVELOOP API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve the uploads directory
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"message": "Welcome to the TRAVELOOP API"}

# --- USERS ENDPOINTS ---
@app.post("/api/users/{user_id}/avatar")
async def upload_avatar(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_location = f"uploads/{user_id}_{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
        
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db_user.profile_picture_url = file_location
        db.commit()
        
    return {"info": f"file '{file.filename}' saved at '{file_location}'", "filename": file_location}

@app.post("/api/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(username=user.username, email=user.email, hashed_password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/api/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

# --- TRIPS ENDPOINTS ---
@app.post("/api/trips/", response_model=schemas.Trip)
def create_trip(trip: schemas.TripCreate, db: Session = Depends(get_db)):
    db_trip = models.Trip(**trip.model_dump(), owner_id=1) # Hardcoded owner for MVP
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip

@app.get("/api/trips/", response_model=list[schemas.Trip])
def read_trips(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    trips = db.query(models.Trip).offset(skip).limit(limit).all()
    return trips

@app.get("/api/trips/{trip_id}", response_model=schemas.Trip)
def read_trip(trip_id: int, db: Session = Depends(get_db)):
    db_trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if db_trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    return db_trip

# --- ITINERARY ENDPOINTS ---
@app.post("/api/trips/{trip_id}/itinerary/", response_model=schemas.ItineraryItem)
def create_itinerary_item(trip_id: int, item: schemas.ItineraryItemCreate, db: Session = Depends(get_db)):
    db_item = models.ItineraryItem(**item.model_dump(), trip_id=trip_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/api/trips/{trip_id}/itinerary/", response_model=list[schemas.ItineraryItem])
def read_itinerary(trip_id: int, db: Session = Depends(get_db)):
    items = db.query(models.ItineraryItem).filter(models.ItineraryItem.trip_id == trip_id).all()
    return items

# --- EXPENSE ENDPOINTS ---
@app.post("/api/trips/{trip_id}/expenses/", response_model=schemas.Expense)
def create_expense(trip_id: int, expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = models.Expense(**expense.model_dump(), trip_id=trip_id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@app.get("/api/trips/{trip_id}/expenses/", response_model=list[schemas.Expense])
def read_expenses(trip_id: int, db: Session = Depends(get_db)):
    expenses = db.query(models.Expense).filter(models.Expense.trip_id == trip_id).all()
    return expenses

# --- CHECKLIST ENDPOINTS ---
@app.post("/api/trips/{trip_id}/checklists/", response_model=schemas.ChecklistItem)
def create_checklist_item(trip_id: int, item: schemas.ChecklistItemCreate, db: Session = Depends(get_db)):
    db_item = models.ChecklistItem(**item.model_dump(), trip_id=trip_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/api/trips/{trip_id}/checklists/", response_model=list[schemas.ChecklistItem])
def read_checklists(trip_id: int, db: Session = Depends(get_db)):
    items = db.query(models.ChecklistItem).filter(models.ChecklistItem.trip_id == trip_id).all()
    return items

# --- JOURNAL ENDPOINTS ---
@app.post("/api/trips/{trip_id}/journals/", response_model=schemas.JournalEntry)
def create_journal_entry(trip_id: int, entry: schemas.JournalEntryCreate, db: Session = Depends(get_db)):
    db_entry = models.JournalEntry(**entry.model_dump(), trip_id=trip_id)
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@app.get("/api/trips/{trip_id}/journals/", response_model=list[schemas.JournalEntry])
def read_journals(trip_id: int, db: Session = Depends(get_db)):
    entries = db.query(models.JournalEntry).filter(models.JournalEntry.trip_id == trip_id).all()
    return entries
