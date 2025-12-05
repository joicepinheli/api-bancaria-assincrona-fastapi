import sys
import os

# Garante que o Python encontra a pasta 'src'
sys.path.append(os.getcwd())

from sqlalchemy import create_engine
from src.config import settings
from src.database import Base

# IMPORTANTE: Importar todos os modelos aqui para serem registados na Base
from src.models.account import Account
# Se tiveres Transaction, descomenta a linha abaixo:
# from src.models.transaction import Transaction

def create_tables():
    print("1. A preparar conexão...")
    
    # TRUQUE: O 'aiosqlite' é um driver assíncrono.
    # Como este script é síncrono (simples), removemos essa parte da URL
    # para usar o driver padrão do Python (sqlite3).
    db_url = settings.database_url.replace('+aiosqlite', '')
    
    print(f"2. A conectar ao banco em: {db_url}")
    
    # Cria um motor temporário apenas para esta operação
    engine = create_engine(db_url)
    
    print("3. A criar tabelas...")
    # O comando mágico que transforma as classes em tabelas reais
    Base.metadata.drop_all(bind=engine) # Opcional: Limpa o banco antigo (cuidado!)
    Base.metadata.create_all(bind=engine)
    
    print("✅ Sucesso! Tabelas criadas.")

if __name__ == "__main__":
    create_tables()