import sqlite3

conn = sqlite3.connect('promark.db')
c = conn.cursor()

c.execute('''
CREATE TABLE IF NOT EXISTS campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL
)
''')

# Optional: insert initial campaigns
sample_data = [
    ("Summer Sale", "Get 50% off on all summer items", "https://via.placeholder.com/300x150.png?text=Summer+Sale"),
    ("Buy 1 Get 1", "Exclusive offer on selected products", "https://via.placeholder.com/300x150.png?text=BOGO"),
    ("Back to School", "Special discounts for students", "https://via.placeholder.com/300x150.png?text=Back+to+School"),
    ("Diwali Offer", "Light up your home with our Diwali deals", "https://via.placeholder.com/300x150.png?text=Diwali+Offer"),
    ("New Arrivals", "Check out our latest collection", "https://via.placeholder.com/300x150.png?text=New+Arrivals"),
]

c.executemany("INSERT INTO campaigns (title, description, image_url) VALUES (?, ?, ?)", sample_data)
conn.commit()
conn.close()
