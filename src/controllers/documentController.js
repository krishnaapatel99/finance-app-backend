import pool from '../../config/db.js';

// GET all documents (joined with project names)
export const getAllDocuments = async (req, res) => {
  try {
    const query = `
      SELECT d.document_id AS id,
             d.file_name AS name,
             d.file_url,
             p.projectName AS project
      FROM documents d
      JOIN projects p ON d.project_id = p.project_id
      ORDER BY d.document_id DESC;
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};


// POST - Add new document by link
export const addDocument = async (req, res) => {
  try {
    const { file_url, projectName } = req.body;

    if (!file_url || !projectName)
      return res.status(400).json({ error: "Missing required fields" });

    // Get project_id from project name
    const projectRes = await pool.query(
      "SELECT project_id FROM projects WHERE projectName = $1",
      [projectName]
    );

    if (projectRes.rows.length === 0)
      return res.status(404).json({ error: "Project not found" });

    const project_id = projectRes.rows[0].project_id;

    // Extract file name from link
    const file_name = file_url.split("/").pop();

    const insertQuery = `
      INSERT INTO documents (project_id, file_name, file_url)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const newDoc = await pool.query(insertQuery, [
      project_id,
      file_name,
      file_url,
    ]);

    res.status(201).json({
      message: "Document added successfully",
      document: newDoc.rows[0],
    });
  } catch (err) {
    console.error("Error adding document:", err);
    res.status(500).json({ error: "Failed to add document" });
  }
};

