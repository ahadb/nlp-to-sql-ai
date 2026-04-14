# server/app/routers/chat.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatMessage(BaseModel):
    message: str
    schema_id: Optional[str] = "all"
    user_id: Optional[str] = "default"

class ChatResponse(BaseModel):
    status: str
    message: str
    sql_query: Optional[str]
    query_results: Optional[Dict[str, Any]]
    context: Optional[Dict[str, Any]]
    timestamp: str

@router.post("/message", response_model=ChatResponse)
async def send_message(chat_message: ChatMessage):
    """Send a message to the AI chat and get response with SQL and insights"""
    try:
        chat_service = ChatService()
        response = await chat_service.process_message(
            message=chat_message.message,
            schema_id=chat_message.schema_id
        )
        return ChatResponse(**response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")

@router.get("/history/{user_id}")
async def get_chat_history(user_id: str):
    """Get chat history for a user"""
    try:
        chat_service = ChatService()
        history = await chat_service.get_chat_history(user_id)
        return {"status": "success", "history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get chat history: {str(e)}")

@router.get("/context/{schema_id}")
async def get_data_context(schema_id: str):
    """Get current data context for a schema"""
    try:
        chat_service = ChatService()
        context = await chat_service._get_data_context(schema_id)
        return {"status": "success", "context": context}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get context: {str(e)}")