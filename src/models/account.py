import sqlalchemy as sa
from src.database import Base

class Account(Base):
    __tablename__ = "accounts"

    id = sa.Column(sa.Integer, primary_key=True, index=True)
    
    # Adicionei name e cpf pois vi que usaste no JSON do Postman anteriormente
    name = sa.Column(sa.String, nullable=False)
    cpf = sa.Column(sa.String, nullable=False, unique=True) # unique=True impede CPFs duplicados
    
    # Se o teu projeto exige user_id (relação com outra tabela), descomenta a linha abaixo:
    user_id = sa.Column(sa.Integer, nullable=False, index=True)
    
    # Usei Float para simplificar o saldo com SQLite
    balance = sa.Column(sa.Float, nullable=False, default=0.0)
    
    # Data de criação automática
    created_at = sa.Column(sa.DateTime, default=sa.func.now())

accounts = Account.__table__