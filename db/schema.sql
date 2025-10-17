-- Drop old tables safely
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS finance CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- USERS TABLE
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- PROJECTS TABLE
CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY,
  projectName VARCHAR(100) NOT NULL,
  clientName VARCHAR(100) NOT NULL,
  startDate DATE,
  endDate DATE,
  status VARCHAR(20) DEFAULT 'Planned',
  assignedTeam VARCHAR(255),
  budget DECIMAL(12,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FINANCE TABLE
CREATE TABLE finance (
    finance_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    amount NUMERIC(15, 2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);

-- DOCUMENTS TABLE (✅ with enum-style constraint)
CREATE TABLE documents (
    document_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    doc_type VARCHAR(20) NOT NULL CHECK (doc_type IN ('invoice', 'contract', 'receipt', 'other')),  -- ✅ limited options
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);
