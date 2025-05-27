from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from .base import Base
import enum
class ServerTypeEnum(str, enum.Enum):
    bedrock = "bedrock"
    java = "java"

class StatusEnum(str, enum.Enum):
    running = "running"
    stopped = "stopped"
class Server(Base):
    __tablename__ = "servers" 
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    server_type = Column(Enum(ServerTypeEnum), nullable=False)
    domain_name = Column(String, nullable=False)
    ip = Column(String, index=True, nullable=False)
    port = Column(Integer, nullable=False)
    status = Column(Enum(StatusEnum), nullable=False, default="running")
