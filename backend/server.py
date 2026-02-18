from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import bcrypt
import jwt
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="SUASH Home Services API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Auth
security = HTTPBearer()
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-super-secret-jwt-key')
ALGORITHM = "HS256"

class UserRole(str, Enum):
    CUSTOMER = "customer"
    ADMIN = "admin"
    STAFF = "staff"

class ServiceStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

# Pydantic Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    phone: Optional[str] = None
    role: UserRole = UserRole.CUSTOMER
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    phone: Optional[str] = None
    password: str
    role: UserRole = UserRole.CUSTOMER

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Address(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    phone: str
    address_line: str
    city: str
    pincode: str
    is_default: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AddressCreate(BaseModel):
    name: str
    phone: str
    address_line: str
    city: str
    pincode: str
    is_default: bool = False

class ServiceAddOn(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    price: float
    description: Optional[str] = None

class Service(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    description: str
    base_price: float
    duration: int  # in minutes
    category: str
    add_ons: List[ServiceAddOn] = []
    status: ServiceStatus = ServiceStatus.ACTIVE
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ServiceCreate(BaseModel):
    name: str
    slug: str
    description: str
    base_price: float
    duration: int
    category: str
    add_ons: List[ServiceAddOn] = []

class BookingItem(BaseModel):
    service_id: str
    quantity: int = 1
    selected_addons: List[str] = []

class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    address_id: str
    items: List[BookingItem]
    scheduled_date: str
    scheduled_time: str
    total_amount: float
    status: BookingStatus = BookingStatus.PENDING
    payment_id: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BookingCreate(BaseModel):
    address_id: str
    items: List[BookingItem]
    scheduled_date: str
    scheduled_time: str
    notes: Optional[str] = None

class BookingQuote(BaseModel):
    items: List[BookingItem]

class QuoteResponse(BaseModel):
    total_amount: float
    breakdown: List[Dict[str, Any]]

class PaymentTransaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    booking_id: Optional[str] = None
    user_id: Optional[str] = None
    amount: float
    currency: str = "INR"
    session_id: Optional[str] = None
    payment_status: str = "initiated"
    metadata: Optional[Dict[str, str]] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PaymentIntent(BaseModel):
    amount: float
    currency: str = "INR"
    booking_id: Optional[str] = None
    success_url: Optional[str] = None
    cancel_url: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None

# Utility functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"id": user_id})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return User(**user)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Routes
@api_router.post("/auth/register", response_model=User)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_dict = user_data.dict()
    user_dict['password'] = hash_password(user_data.password)
    user_obj = User(**{k: v for k, v in user_dict.items() if k != 'password'})
    
    # Store in DB
    user_doc = user_obj.dict()
    user_doc['password'] = user_dict['password']
    await db.users.insert_one(user_doc)
    
    return user_obj

@api_router.post("/auth/login")
async def login(login_data: UserLogin):
    user = await db.users.find_one({"email": login_data.email})
    if not user or not verify_password(login_data.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user['id'], "email": user['email'], "role": user['role']})
    return {"access_token": access_token, "token_type": "bearer", "user": User(**user)}

@api_router.get("/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# Services
@api_router.get("/services", response_model=List[Service])
async def get_services():
    services = await db.services.find({"status": "active"}).to_list(1000)
    return [Service(**service) for service in services]

@api_router.get("/services/{service_id}", response_model=Service)
async def get_service(service_id: str):
    service = await db.services.find_one({"id": service_id})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return Service(**service)

@api_router.post("/admin/services", response_model=Service)
async def create_service(service_data: ServiceCreate, current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    service_obj = Service(**service_data.dict())
    await db.services.insert_one(service_obj.dict())
    return service_obj

# Addresses
@api_router.get("/account/addresses", response_model=List[Address])
async def get_addresses(current_user: User = Depends(get_current_user)):
    addresses = await db.addresses.find({"user_id": current_user.id}).to_list(1000)
    return [Address(**addr) for addr in addresses]

@api_router.post("/account/addresses", response_model=Address)
async def create_address(address_data: AddressCreate, current_user: User = Depends(get_current_user)):
    address_dict = address_data.dict()
    address_dict['user_id'] = current_user.id
    address_obj = Address(**address_dict)
    await db.addresses.insert_one(address_obj.dict())
    return address_obj

# Booking Quote
@api_router.post("/bookings/quote", response_model=QuoteResponse)
async def get_booking_quote(quote_data: BookingQuote):
    total_amount = 0
    breakdown = []
    
    for item in quote_data.items:
        service = await db.services.find_one({"id": item.service_id})
        if not service:
            raise HTTPException(status_code=404, detail=f"Service {item.service_id} not found")
        
        item_total = service['base_price'] * item.quantity
        item_breakdown = {
            "service_id": item.service_id,
            "service_name": service['name'],
            "quantity": item.quantity,
            "base_price": service['base_price'],
            "subtotal": item_total,
            "addons": []
        }
        
        # Calculate addons
        for addon_id in item.selected_addons:
            addon = next((a for a in service['add_ons'] if a['id'] == addon_id), None)
            if addon:
                addon_total = addon['price'] * item.quantity
                item_total += addon_total
                item_breakdown['addons'].append({
                    "id": addon_id,
                    "name": addon['name'],
                    "price": addon['price'],
                    "subtotal": addon_total
                })
        
        item_breakdown['total'] = item_total
        total_amount += item_total
        breakdown.append(item_breakdown)
    
    return QuoteResponse(total_amount=total_amount, breakdown=breakdown)

# Bookings
@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking_data: BookingCreate, current_user: User = Depends(get_current_user)):
    # Calculate total amount
    quote_data = BookingQuote(items=booking_data.items)
    quote = await get_booking_quote(quote_data)
    
    booking_dict = booking_data.dict()
    booking_dict['user_id'] = current_user.id
    booking_dict['total_amount'] = quote.total_amount
    booking_obj = Booking(**booking_dict)
    
    await db.bookings.insert_one(booking_obj.dict())
    return booking_obj

@api_router.get("/account/bookings", response_model=List[Booking])
async def get_user_bookings(current_user: User = Depends(get_current_user)):
    bookings = await db.bookings.find({"user_id": current_user.id}).to_list(1000)
    return [Booking(**booking) for booking in bookings]

@api_router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str, current_user: User = Depends(get_current_user)):
    booking = await db.bookings.find_one({"id": booking_id})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Check if user owns the booking or is admin/staff
    if booking['user_id'] != current_user.id and current_user.role not in [UserRole.ADMIN, UserRole.STAFF]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return Booking(**booking)

# Payment endpoints placeholder (will be implemented with actual payment integrations)
@api_router.post("/payments/razorpay/intent")
async def create_razorpay_intent(payment_data: PaymentIntent, current_user: User = Depends(get_current_user)):
    # This will be implemented with Razorpay integration
    return {"message": "Razorpay integration pending"}

@api_router.post("/payments/stripe/intent")
async def create_stripe_intent(payment_data: PaymentIntent, current_user: User = Depends(get_current_user)):
    # This will be implemented with Stripe integration  
    return {"message": "Stripe integration pending"}

# Admin routes
@api_router.get("/admin/bookings", response_model=List[Booking])
async def get_all_bookings(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    bookings = await db.bookings.find().to_list(1000)
    return [Booking(**booking) for booking in bookings]

# Staff routes
@api_router.get("/staff/jobs/today", response_model=List[Booking])
async def get_today_jobs(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.STAFF:
        raise HTTPException(status_code=403, detail="Staff access required")
    
    # Get today's bookings (simplified - you might want to add staff assignment logic)
    from datetime import date
    today = date.today().isoformat()
    bookings = await db.bookings.find({"scheduled_date": today}).to_list(1000)
    return [Booking(**booking) for booking in bookings]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
