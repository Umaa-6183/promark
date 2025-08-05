from fastapi import APIRouter
import sqlite3
import os

router = APIRouter()

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'promark.db')

@router.get("/campaigns")
def get_campaigns():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, description, image_url FROM campaigns")
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "id": row[0],
            "title": row[1],
            "description": row[2],
            "image_url": row[3]
        }
        for row in rows
    ]
