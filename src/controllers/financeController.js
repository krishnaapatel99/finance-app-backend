import pool from "../config/db.js";

// GET all finance records grouped by type
export const getFinanceData = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        f.finance_id,
        f.project_id,
        p.projectname AS project_name,
        f.type,
        f.client_name,
        f.amount,
        f.date_received,
        f.payment_mode,
        f.notes
      FROM finance f
      LEFT JOIN projects p ON f.project_id = p.project_id
      ORDER BY f.date_received DESC;
    `);

    const income = result.rows.filter((r) => r.type === "income");
    const expense = result.rows.filter((r) => r.type === "expense");

    res.json({ income, expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching finance records" });
  }
};

// ADD finance record (income or expense)
export const addFinance = async (req, res) => {
  try {
    const { project_id, type, client_name, amount, date_received, payment_mode, notes } = req.body;

    if (!type || !["income", "expense"].includes(type)) {
      return res.status(400).json({ error: "Invalid type" });
    }

    const result = await pool.query(
      `INSERT INTO finance (project_id, type, client_name, amount, date_received, payment_mode, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [project_id, type, client_name, amount, date_received, payment_mode, notes || null]
    );

    res.status(201).json({ message: "Record added", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add record" });
  }
};

// UPDATE finance record
export const updateFinance = async (req, res) => {
  try {
    const { id } = req.params;
    const { project_id, type, client_name, amount, date_received, payment_mode, notes } = req.body;

    const result = await pool.query(
      `UPDATE finance
       SET project_id=$1, type=$2, client_name=$3, amount=$4, date_received=$5, payment_mode=$6, notes=$7
       WHERE finance_id=$8
       RETURNING *`,
      [project_id, type, client_name, amount, date_received, payment_mode, notes, id]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: "Record not found" });

    res.json({ message: "Record updated", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update record" });
  }
};

// DELETE finance record
export const deleteFinance = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM finance WHERE finance_id=$1", [id]);

    if (result.rowCount === 0) return res.status(404).json({ error: "Record not found" });

    res.json({ message: "Record deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete record" });
  }
};
