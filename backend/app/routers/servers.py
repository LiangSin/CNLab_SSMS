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

router = APIRouter(prefix="/servers", tags=["servers"])

load_dotenv()
SHELL_SCRIPT_PATH = os.getenv("SHELL_SCRIPT_PATH")
SSMS_SERVER_IP = os.getenv("SSMS_SERVER_IP")
SSMS_DOMAIN_NAME = os.getenv("SSMS_DOMAIN_NAME")

def get_available_port(db, start_port=25565, end_port=26000):
    sql = text("""
        WITH RECURSIVE candidate_ports(port) AS (
            SELECT :start
            UNION ALL
            SELECT port + 1 FROM candidate_ports WHERE port < :end
        )
        SELECT port
        FROM candidate_ports
        WHERE port NOT IN (SELECT port FROM servers)
        LIMIT 1;
        """)

    result = db.execute(sql, {"start": start_port, "end": end_port}).scalar()
    # print("Available port:", result)
    return result



@router.get("/",response_model=Response[List[schemas.ServerInfoOut]])
def get_servers(db: Session = Depends(get_db)):
    servers = db.query(models.Server).all()
    if servers is None:
        return response.not_found(msg="No servers found",code=404)
    server_out_list = [schemas.ServerInfoOut.from_orm(server) for server in servers]

    return Response(code=200, data=server_out_list, msg="Servers Found successfully")

@router.post("/",response_model=Response[schemas.ServerInfoOut])
def create_server(server: schemas.ServerCreate, db: Session = Depends(get_db)):
    server_id_row = db.execute(text("SELECT seq FROM sqlite_sequence WHERE name='servers';")).fetchone()
    server_id = server_id_row[0] + 1 if server_id_row else 1
    # print(f"Next server_id: {server_id}")

    available_port = get_available_port(db)
    # print(f"Available port: {available_port}")
    if server.server_type == "bedrock":
        subprocess.run([f'{SHELL_SCRIPT_PATH}/create_bedrock.sh', SSMS_SERVER_IP, f'{str(server_id)}-{server.name}', str(available_port)])
    else:
        subprocess.run([f'{SHELL_SCRIPT_PATH}/create_java.sh', SSMS_SERVER_IP, f'{str(server_id)}-{server.name}', str(available_port)])

    db_server = models.Server(
        name=server.name,
        server_type=server.server_type,
        domain_name=SSMS_DOMAIN_NAME,
        ip=SSMS_SERVER_IP,
        port=available_port
    )
    db.add(db_server)
    db.commit()
    db.refresh(db_server)


    return Response(code=200, data=db_server, msg="Server created successfully")

@router.delete("/{server_id}")
def delete_server_by_id(server_id: int, db: Session = Depends(get_db)):
    db_server = db.query(models.Server).filter(models.Server.id == server_id).first()
    print(f'Find db_server: {db_server}')
    if not db_server:
        return HTTPException(status_code=404, detail="server not found")
    
    subprocess.run([f'{SHELL_SCRIPT_PATH}/remove_docker.sh', SSMS_SERVER_IP, f'{str(server_id)}-{db_server.name}'])
    db.delete(db_server)
    db.commit()
    return Response(code=200, msg=f"User deleted successfully")


@router.patch("/{server_id}", response_model=Response[schemas.ServerInfoOut])
def update_server_status(server_id: int, server: schemas.ServerUpdate, db: Session = Depends(get_db)):
    db_server = db.query(models.Server).filter(models.Server.id == server_id).first()
    if not db_server:
        return response.not_found(msg="Server not found",code=404)
    
    print(f'server: {db_server}')
    if db_server.status == "running":
        subprocess.run([f'{SHELL_SCRIPT_PATH}/stop_docker.sh', SSMS_SERVER_IP, f'{str(db_server.id)}-{db_server.name}'])
    else:
        subprocess.run([f'{SHELL_SCRIPT_PATH}/start_docker.sh', SSMS_SERVER_IP, f'{str(db_server.id)}-{db_server.name}'])
    for field, value in server.dict(exclude_unset=True).items():
        setattr(db_server, field, value)
    db.commit()
    return Response(code=200, data=db_server, msg="Server updated successfully")
