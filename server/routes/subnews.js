const express = require('express');
const router = express.Router();
const dbpool = require('../config/pgdb');

router.post("/create", async (req, res) => {
    const { name, seats, location } = req.body; 
    console.log("Creating a new subnews:", req.body);

    try {
        if (!name || !seats || !location) {
            return res.status(400).json({ error: "Missing required fields" });
        } else {
            
            const result = await dbpool.query("SELECT subnewsid FROM subnews ORDER BY subnewsid DESC LIMIT 1;");
            const subnewsid = result.rows.length > 0 ? result.rows[0].subnewsid + 1 : 1;
            
        
            const query = `INSERT INTO subnews (subnewsid, name, seats, location) VALUES ($1, $2, $3, $4);`;
            const newsubnews = await dbpool.query(query, [subnewsid, name, seats, location]);
            console.log("Created subnews:", newsubnews.rows[0]);
            res.json(newsubnews.rows[0]);
        }
    } catch (error) {
        console.error("Error creating subnews:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



router.get("/", async (req, res) => {
    try {
        const allsubnews = await dbpool.query("SELECT * FROM subnews");
        console.log("Fetched all subnews:", allsubnews.rows);
        res.json(allsubnews.rows);
    } catch (error) {
        console.error("Error fetching subnews:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/:subnewsid", async (req, res) => {
    const subnewsid = req.params.subnewsid;
    console.log("Deleting subnews with id:", subnewsid);

    try {
       
        const subnewsCheckResult = await dbpool.query("SELECT * FROM subnews WHERE subnewsid = $1", [subnewsid]);
        if (subnewsCheckResult.rows.length === 0) {
            return res.status(404).json({ error: "subnews not found" });
        }

        await dbpool.query("DELETE FROM subnews WHERE subnewsid = $1", [subnewsid]);

        const result = await dbpool.query("DELETE FROM subnews WHERE subnewsid = $1 RETURNING *", [subnewsid]);
        console.log("Deleted subnews:", result.rows[0]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error deleting subnews:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.put("/:subnewsid", async (req, res) => {
try{
    const { subnewsid } = req.params;
   
    const {  name, seats, location } = req.body;    
    console.log("Updating subnews with id:", subnewsid);
    const updatedsubnews = await dbpool.query("UPDATE subnews SET name = $1, seats = $2, location = $3 WHERE subnewsid = $4 RETURNING *", [name, seats, location, subnewsid]);
    console.log("Updated subnews:", updatedsubnews.rows[0]);   
    if (updatedsubnews.rowCount === 0) {
        console.log(`subnews not found for update with id: ${subnewsid}`);
        return res.status(404).json({ error: " subnews not found for update" });
    }
    res.json(updatedsubnews.rows[0]);
}  
 catch (error) {
    console.error("Error updating subnews:", error);
    res.status(500).json({ error: "Internal Server Error" });  
}
}
)


router.get("/:subnewsid", async (req, res) => {
    const { subnewsid } = req.params;
    console.log("Fetching subnews with id:", subnewsid);
    try{
        const subnews = await dbpool.query("SELECT * FROM subnews WHERE subnewsid = $1", [subnewsid]);
        if (subnews.rows.length === 0) {
            console.log(`subnews not found with id: ${subnewsid}`);
            return res.status(404).json({ error: "subnews not found" });
        }
        console.log("Fetched subnews:", subnews.rows[0]);
        res.json(subnews.rows[0]);
    }
    catch (error) {
        console.error("Error fetching subnews:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
