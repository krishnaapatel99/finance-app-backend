import pool from '../../config/db.js'

export const getProjectData=async(req,res)=>{
    try {
         const result=await pool.query("SELECT * FROM projects ORDER BY startDate ASC");
         res.status(200).json(result.rows);  
    } catch (error) {
        console.log("Error fetching data",error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

export const sendProjectData=async(req,res)=>{
      const { 
        projectName, 
        clientName, 
        startDate, 
        endDate, 
        status, 
        assignedTeam, 
        budget 
    } = req.body;

     if (!projectName || !clientName) {
        return res.status(400).json({ 
            message: 'Project Name and Client Name are required.' 
        });}
    try {
       const queryText = `
    INSERT INTO projects (
        projectName, clientName, startDate, endDate, status, assignedTeam, budget
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
        `;
        const queryValues=[ projectName, 
            clientName, 
            startDate || null, 
            endDate||null,
            status, 
            assignedTeam, 
            parseFloat(budget || 0.00) ]

            const result=await pool.query(queryText,queryValues);
            const newProject=result.rows[0];
            console.log("Project is created", newProject);
             res.status(201).json({ 
            message: 'Project created successfully!', 
            project: newProject 
        });

    } catch (error) {
          console.error(' Error creating project:', error.message);
        // Send a 500 error response to the frontend
        res.status(500).json({ 
            message: 'Failed to create project', 
            error: error.message 
        });
    }
}
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM projects WHERE project=$1`, [id]);
    res.json({ success: true, message: "Record deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting record" });
  }
};
// controllers/projectController.js
import pool from "../config/db.js";

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      projectName,
      clientName,
      startDate,
      endDate,
      status,
      assignedTeam,
      budget,
    } = req.body;

    // Build the update query dynamically (so partial updates work too)
    const fields = [];
    const values = [];
    let index = 1;

    if (projectName) {
      fields.push(`"projectName" = $${index++}`);
      values.push(projectName);
    }
    if (clientName) {
      fields.push(`"clientName" = $${index++}`);
      values.push(clientName);
    }
    if (startDate) {
      fields.push(`"startDate" = $${index++}`);
      values.push(startDate);
    }
    if (endDate) {
      fields.push(`"endDate" = $${index++}`);
      values.push(endDate);
    }
    if (status) {
      fields.push(`"status" = $${index++}`);
      values.push(status);
    }
    if (assignedTeam) {
      fields.push(`"assignedTeam" = $${index++}`);
      values.push(assignedTeam);
    }
    if (budget !== undefined) {
      fields.push(`"budget" = $${index++}`);
      values.push(budget);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields provided to update." });
    }

    // Add project_id at the end for the WHERE clause
    values.push(id);

    const query = `
      UPDATE projects
      SET ${fields.join(", ")}
      WHERE project_id = $${index}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project updated successfully",
      project: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Server error while updating project" });
  }
};
