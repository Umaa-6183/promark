import sqlite3

DB_PATH = "feedback.db"

def init_db():
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
            ",".join(entry["future_interest"]),
            entry["predicted_ad"]
        ))
        conn.commit()

def fetch_all_feedbacks():
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM feedbacks")
        rows = cursor.fetchall()
        return [{
            "token": r[0],
            "name": r[1],
            "phone": r[2],
            "transaction_id": r[3],
            "purchased_item": r[4],
            "future_interest": r[5].split(","),
            "predicted_ad": r[6],
        } for r in rows]
