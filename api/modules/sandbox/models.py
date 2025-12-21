from pydantic import BaseModel


class CreateSandboxRequest(BaseModel):
    sandbox_name: str = ""


class UpdateSandboxRequest(BaseModel):
    sandbox_id: int = 0
    sandbox_name: str = ""


class DeleteSandboxRequest(BaseModel):
    sandbox_id: int = 0
