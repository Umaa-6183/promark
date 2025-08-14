import sqlite3
import os
import json

BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(BASE_DIR, "feedbacks.db")

def create_feedback_table():
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS feedbacks (
                token TEXT PRIMARY KEY,
                name TEXT,
                phone TEXT,
                transaction_id TEXT,
                purchased_item TEXT,
                future_interest TEXT,
                predicted_ad TEXT
            )
        """)
        conn.commit()

def insert_feedback(entry):
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO feedbacks (token, name, phone, transaction_id, purchased_item, future_interest, predicted_ad)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            entry["token"],
            entry["name"],
            entry["phone"],
            entry["transaction_id"],
            entry["purchased_item"],
            json.dumps(entry["future_interest"]),
            entry["predicted_ad"]
        ))
        conn.commit()

def get_all_feedbacks():
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM feedbacks")
        rows = cursor.fetchall()
        return [
            {
                "token": row[0],
                "name": row[1],
                "phone": row[2],
                "transaction_id": row[3],
                "purchased_item": row[4],
                "future_interest": json.loads(row[5]),
                "predicted_ad": row[6]
            }
            for row in rows
        ]

if __name__ == "__main__":
    create_feedback_table()
    print("feedbacks.db created (if it did not exist) and feedbacks table ensured.")
