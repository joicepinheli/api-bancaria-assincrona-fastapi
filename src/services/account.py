from databases.interfaces import Record

from src.database import database
from src.models.account import accounts
from src.schemas.account import AccountIn

class AccountService:
    async def create(self, account):
        # Aqui garantimos que passamos exatamente o que o banco espera
        query = accounts.insert().values(
            name=account.name,
            cpf=account.cpf,
            balance=account.balance,
            user_id=account.user_id, # Agora incluímos o user_id que estava a dar erro antes
            # created_at é automático, não precisamos passar
        )
        
        # Executa o comando e retorna o ID da nova conta
        return await database.execute(query)
    
    async def read_all(self, limit: int, skip: int = 0) -> list[Record]:
        query = accounts.select().limit(limit).offset(skip)
        return await database.fetch_all(query)

    async def create(self, account: AccountIn) -> Record:
        command = accounts.insert().values(user_id=account.user_id, balance=account.balance)
        account_id = await database.execute(command)

        query = accounts.select().where(accounts.c.id == account_id)
        return await database.fetch_one(query)