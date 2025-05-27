from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
# from app.schemas.healthflag import *
# from app.schemas.badge import *

class UserBase(BaseModel):
    name: str
    model_config = {
        "from_attributes": True
    }


class UserCreate(UserBase):
    password:str
        
class UserProfileOut(UserBase):
    id: int
