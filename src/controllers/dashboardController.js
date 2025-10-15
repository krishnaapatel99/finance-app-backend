import pool from "../../config/db.js";

export const getFinanceSummary = async (req, res) => {
  try {
    // Query total income, total expense, and net profit
    const query = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0) AS total_expense,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount END), 0) -
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0) AS net_profit
      FROM finance;
    `;

    const result = await pool.query(query);

   
    const summary = result.rows[0] || {
      total_income: 0,
      total_expense: 0,
      net_profit: 0,
    };

    return res.status(200).json(summary);

  } catch (error) {
    console.error(" Error calculating finance summary:", error.message);

   
    return res.status(500).json({
      total_income: 0,
      total_expense: 0,
      net_profit: 0,
      error: "Internal server error",
      details: error.message,
    });
  }
};

export const getUpcomingEventsData=async(req,res)=>{
    try {
        const result= await pool.query(`
          SELECT *
          FROM projects
          WHERE status = 'Planned'
          
        `);
        res.status(200).json(result.rows);
        console.log(result.rows)
    } catch (error) {
         console.error(" Error fetching upcoming projects:", error.message);
    res.status(500).json({ error: "Internal server error" });
    }
}