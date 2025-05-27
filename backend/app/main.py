from fastapi import FastAPI
from app.routers import users, servers

app = FastAPI()

app.include_router(users.router)
app.include_router(servers.router)

from fastapi.middleware.cors import CORSMiddleware
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://admin.cnlab",
    "http://admin.cnlab:5173",
    "http://192.168.1.200",
    "http://192.168.1.200:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"msg": "Welcome to the API"}
