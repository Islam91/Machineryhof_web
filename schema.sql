CREATE TABLE IF NOT EXISTS contact_inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  inquiry_type TEXT,
  product_interest TEXT,
  message TEXT,
  created_at TEXT NOT NULL
);
