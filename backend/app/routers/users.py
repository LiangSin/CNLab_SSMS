from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, models
from app.db.db import get_db
from typing import List
from app.utils import response
from app.utils.ResponseResult import Response
from dotenv import load_dotenv
from sqlalchemy import text
import os
import subprocess
from ldap3 import Server, Connection, ALL


router = APIRouter(prefix="/users", tags=["users"])


# === Configuration ===
load_dotenv()
LADP_SCRIPT_PATH = os.getenv("LADP_SCRIPT_PATH")
LDAP_SERVER = os.getenv("LDAP_SERVER")
BASE_DN = os.getenv("BASE_DN")



def authenticate_ldap_user(username: str, password: str) -> bool:
    user_dn = f"uid={username},{BASE_DN}"
    server = Server(LDAP_SERVER, get_info=ALL)
    try:
        conn = Connection(server, user=user_dn, password=password)
        if not conn.bind():
            return False
        conn.unbind()
        return True
    except Exception as e:
        print(f"LDAP Error: {e}")
        return False

@router.post("/login")
def login(req: schemas.LoginRequest):
    if authenticate_ldap_user(req.name, req.password):
        return {"status": "success", "user": req.name}
    else:
        raise HTTPException(status_code=401, detail="Invalid username or password")


@router.get("/",response_model=Response[List[schemas.UserProfileOut]])
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    if users is None:
        return response.not_found(msg="No users found",code=404)
    user_out_list = [schemas.UserProfileOut.from_orm(user) for user in users]

    return Response(code=200, data=user_out_list, msg="Users Found successfully")

@router.post("/",response_model=Response[schemas.UserProfileOut])
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    subprocess.run([f'{LADP_SCRIPT_PATH}/add_user.sh', user.name, user.password])
    db_user = models.User(
        name=user.name,
        password=user.password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return Response(code=200, data=db_user, msg="User created successfully")

@router.delete("/{user_id}")
def delete_user_by_id(user_id, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    print(f'Find db_user: {db_user}')
    if db_user is None:
        # return response.not_found(msg="Product not found",code=404)
        return HTTPException(status_code=404, detail="User not found")
    subprocess.run([f'{LADP_SCRIPT_PATH}/del_user.sh', db_user.name])
    db.delete(db_user)
    db.commit()
    return Response(code=200, msg=f"User deleted successfully")