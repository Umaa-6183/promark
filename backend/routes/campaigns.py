from fastapi import APIRouter
import sqlite3

router = APIRouter()

@router.get("/campaigns")
def get_campaigns():
    conn = sqlite3.connect("promark.db")
    c = conn.cursor()
    c.execute("SELECT id, title, description, image_url FROM campaigns")
    rows = c.fetchall()
    conn.close()
    return [{"id": row[0], "title": row[1], "description": row[2], "image_url": row[3]} for row in rows]
