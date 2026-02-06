from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from supabase import create_client

router = APIRouter()

class WebhookPayload(BaseModel):
    event: str
    table: str
    record: dict


@router.post('/supabase-webhook')
async def supabase_webhook(payload: WebhookPayload):
    # placeholder for handling realtime events (e.g., notifications)
    return {'status': 'ok'}
