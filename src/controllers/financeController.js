import pool from '../../config/db.js'

export const addIncome = async (req, res) => {
  console.log("=== addIncome Called ===");
  console.log("Request body:", req.body);

  try {
    const { project_id, client_name, amount, date_received, payment_mode, notes } = req.body;

    console.log("Parsed Fields:", {
      project_id, client_name, amount, date_received, payment_mode, notes
    });

    const query = `
      INSERT INTO finance (project_id, type, client_name, amount, date_received, payment_mode, notes)
      VALUES ($1, 'income', $2, $3, $4, $5, $6) RETURNING *
    `;
    const values = [project_id, client_name, amount, date_received, payment_mode, notes];

    console.log("SQL Query:", query);
    console.log("Values:", values);

    const result = await pool.query(query, values);
    console.log("Insert Result:", result.rows[0]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("DB Error in addIncome:", err);
    res.status(500).json({ success: false, message: err.message || "Error adding income" });
  }
};

export const addExpense = async (req, res) => {
  console.log("=== addExpense Called ===");
  console.log("Request body:", req.body);

  try {
    const { project_id, client_name, amount, date_received, payment_mode, notes } = req.body;

    console.log("Parsed Fields:", {
      project_id, client_name, amount, date_received, payment_mode, notes
    });

    const query = `
      INSERT INTO finance (project_id, type, client_name, amount, date_received, payment_mode, notes)
      VALUES ($1, 'expense', $2, $3, $4, $5, $6) RETURNING *
    `;
    const values = [project_id, client_name, amount, date_received, payment_mode, notes];

    console.log("SQL Query:", query);
    console.log("Values:", values);

    const result = await pool.query(query, values);
    console.log("Insert Result:", result.rows[0]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("DB Error in addExpense:", err);
    res.status(500).json({ success: false, message: err.message || "Error adding expense" });
  }
};




// Get all finance records
export const getFinance = async (req, res) => {
  try {
    const query = `
      SELECT f.*, p."projectName" AS project_name
      FROM finance f
      JOIN projects p ON f.project_id = p.project_id
      ORDER BY f.date_received DESC
    `;

    const result = await pool.query(query);
    const income = result.rows.filter(r => r.type === "income");
    const expense = result.rows.filter(r => r.type === "expense");

    res.json({ income, expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching finance data" });
  }
};

// Update finance record
export const updateFinance = async (req, res) => {
  try {
    const { id } = req.params;
    const { project_id, client_name, amount, date_received, payment_mode, notes } = req.body;

    const query = `
      UPDATE finance
      SET project_id=$1, client_name=$2, amount=$3, date_received=$4, payment_mode=$5, notes=$6
      WHERE finance_id=$7
      RETURNING *
    `;
    const values = [project_id, client_name, amount, date_received, payment_mode, notes, id];

    const result = await pool.query(query, values);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating record" });
  }
};

// Delete finance record
export const deleteFinance = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM finance WHERE finance_id=$1`, [id]);
    res.json({ success: true, message: "Record deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting record" });
  }
};
