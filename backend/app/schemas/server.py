from pydantic import BaseModel
from typing import Optional, List
from enum import Enum
from pydantic import BaseModel

class ServerTypeEnum(str, Enum):
    bedrock = "bedrock"
    java = "java"

class StatusEnum(str, Enum):
    running = "running"
    stopped = "stopped"


class ServerBase(BaseModel):
    
    model_config = {
        "from_attributes": True
    }

class ServerCreate(ServerBase):
    name: str
    server_type: ServerTypeEnum  
    pass
        
class ServerInfoOut(ServerBase):
    id: int
    name: str
    domain_name: str
    ip: str
    port: int
    status: StatusEnum
    server_type: ServerTypeEnum  

class ServerUpdate(ServerBase):
    status: StatusEnum
    