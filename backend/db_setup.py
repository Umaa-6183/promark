import sqlite3
import os

BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(BASE_DIR, "promark.db")

def init_campaign_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # Create campaigns table
    c.execute('''
    CREATE TABLE IF NOT EXISTS campaigns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT NOT NULL
    )
    ''')

    # Insert sample campaigns only if table is empty
    c.execute("SELECT COUNT(*) FROM campaigns")
    if c.fetchone()[0] == 0:
        sample_data = [
            ("Laptop Bonanza", "Flat ₹10,000 off on selected laptops.", "https://res.cloudinary.com/dnaufetqk/image/upload/v1754715722/mega-sale-special-offer-neon-260nw-2150286415_xwa5oj.webp?text=Laptop+Bonanza"),
            ("Gadget Week", "Smartwatches, earbuds, and more starting at ₹999.", "https://res.cloudinary.com/dnaufetqk/image/upload/v1754715723/Intel_ascent-1400x800_banner._SX1242_QL85__wcbdpr.jpg?text=Gadget+Week"),
            ("Smartphone Fest", "Up to 40% off on Android and iOS smartphones.", "https://res.cloudinary.com/dnaufetqk/image/upload/v1754715722/mega-sale-advertiving-banner-3d-260nw-2000590271_axmpip.webp?text=Smartphone+Fest"),
            ("Smart TV Carnival", "Big screen TVs at unbelievable prices!", "https://res.cloudinary.com/dnaufetqk/image/upload/v1754715722/mega-sale-special-offer-neon-260nw-2160421231_lmbk0e.webp?text=Smart+TV+Carnival"),
            ("Camera Clearance", "Up to 50% off on DSLR and mirrorless cameras.", "https://res.cloudinary.com/dnaufetqk/image/upload/v1754715722/mega-sale-special-offer-neon-260nw-2160421231_lmbk0e.webp?text=Camera+Clearance"),
        ]
        c.executemany("INSERT INTO campaigns (title, description, image_url) VALUES (?, ?, ?)", sample_data)

    conn.commit()
    conn.close()
