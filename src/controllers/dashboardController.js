import pool from "../../config/db.js";

export const getFinanceSummary = async (req, res) => {
  try {
    const query = `
      WITH revenue AS (
        SELECT COALESCE(SUM(budget), 0) AS total_revenue
        FROM projects
      ),
      expense AS (
        SELECT COALESCE(SUM(amount), 0) AS total_expense
        FROM finance
        WHERE type = 'expense'
      )
      SELECT 
        revenue.total_revenue AS total_income,  
        expense.total_expense,
        (revenue.total_revenue - expense.total_expense) AS net_profit
      FROM revenue, expense;
    `;

    const result = await pool.query(query);
    const summary = result.rows[0] || {
      total_income: 0,
      total_expense: 0,
      net_profit: 0,
    };

    return res.status(200).json(summary);
  } catch (error) {
    console.error("❌ Error calculating finance summary:", error.message);
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