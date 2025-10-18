import pool from '../../config/db.js';

// ✅ GET all documents
export const getAllDocuments = async (req, res) => {
  try {
    const query = `
      SELECT d.document_id AS id,
             d.file_name AS name,
             d.file_url,
             d.doc_type AS type,
             d.upload_date,
             p.projectName AS project
      FROM documents d
      JOIN projects p ON d.project_id = p.project_id
      ORDER BY d.upload_date DESC;
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching documents:", err);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

// ✅ POST - Add a new document
export const addDocument = async (req, res) => {
  try {
    const { file_url, type, project } = req.body;

    if (!file_url || !type || !project)
      return res.status(400).jsozn({ error: "Missing required fields" });

    // ✅ Validate type input
    const allowedTypes = ['invoice', 'contract', 'receipt', 'other'];
    if (!allowedTypes.includes(type))
      return res.status(400).json({ error: "Invalid document type" });

    // Get project_id from project name
    const projectRes = await pool.query(
      "SELECT project_id FROM projects WHERE projectName = $1",
      [project]
    );

    if (projectRes.rows.length === 0)
      return res.status(404).json({ error: "Project not found" });

    const project_id = projectRes.rows[0].project_id;

    // Extract file name
    const file_name = file_url.split("/").pop();

    const insertQuery = `
      INSERT INTO documents (project_id, file_name, file_url, doc_type )
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const newDoc = await pool.query(insertQuery, [
      project_id,
      file_name,
      file_url,
      type,
    
    ]);

    res.status(201).json({
      message: "✅ Document added successfully",
      document: newDoc.rows[0],
    });
  } catch (err) {
    console.error("❌ Error adding document:", err);
    res.status(500).json({ error: "Failed to add document" });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params; // get document ID from route

    if (!id) {
      return res.status(400).json({ error: "Document ID is required" });
    }

    // Check if document exists
    const checkQuery = "SELECT * FROM documents WHERE document_id = $1";
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Delete the document
    const deleteQuery = "DELETE FROM documents WHERE document_id = $1 RETURNING *";
    const deletedDoc = await pool.query(deleteQuery, [id]);

    res.status(200).json({
      message: "✅ Document deleted successfully",
      document: deletedDoc.rows[0]
    });
  } catch (err) {
    console.error("❌ Error deleting document:", err);
    res.status(500).json({ error: "Failed to delete document" });
  }
};