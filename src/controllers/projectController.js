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