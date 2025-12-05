import databases
import sqlalchemy as sa
from sqlalchemy.ext.declarative import declarative_base  # Importação adicionada
from src.config import settings

# Configuração do banco de dados assíncrono
database = databases.Database(settings.database_url)

# Criação do metadata (o registo das tabelas)
metadata = sa.MetaData()

# Criar a Base ligada ao metadata
Base = declarative_base(metadata=metadata)

# Configuração do Engine
if settings.environment == "production":
    engine = sa.create_engine(settings.database_url)
else:
    engine = sa.create_engine(settings.database_url, connect_args={"check_same_thread": False})