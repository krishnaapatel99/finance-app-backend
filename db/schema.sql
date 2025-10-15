DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS finance CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(50) NOT NULL
);

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


CREATE TABLE finance (
    finance_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')), -- Constrained to 'income' or 'expense'
    amount NUMERIC(15, 2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    -- Foreign key constraint to link to the projects table
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);

CREATE TABLE documents (
    document_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    -- Foreign key constraint to link to the projects table
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);