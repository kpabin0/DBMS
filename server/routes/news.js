const express = require('express');
const router = express.Router();
const dbpool = require('../config/pgdb');

router.post("/create", async (req, res) => {
    const { name, seats, location } = req.body; 
    console.log("Creating a new news:", req.body);

    try {
        if (!name || !seats || !location) {
            return res.status(400).json({ error: "Missing required fields" });
        } else {
            
            const result = await dbpool.query("SELECT newsid FROM news ORDER BY newsid DESC LIMIT 1;");
            const newsid = result.rows.length > 0 ? result.rows[0].newsid + 1 : 1;
            
        
            const query = `INSERT INTO news (newsid, name, seats, location) VALUES ($1, $2, $3, $4);`;
            const newnews = await dbpool.query(query, [newsid, name, seats, location]);
            console.log("Created news:", newnews.rows[0]);
            res.json(newnews.rows[0]);
        }
    } catch (error) {
        console.error("Error creating news:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



router.get("/", async (req, res) => {
    try {
        const allnews = await dbpool.query("SELECT * FROM news");
        console.log("Fetched all news:", allnews.rows);
        res.json(allnews.rows);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/:newsid", async (req, res) => {
    const newsid = req.params.newsid;
    console.log("Deleting news with id:", newsid);

    try {
       
        const newsCheckResult = await dbpool.query("SELECT * FROM news WHERE newsid = $1", [newsid]);
        if (newsCheckResult.rows.length === 0) {
            return res.status(404).json({ error: "news not found" });
        }

        await dbpool.query("DELETE FROM news WHERE newsid = $1", [newsid]);

        const result = await dbpool.query("DELETE FROM news WHERE newsid = $1 RETURNING *", [newsid]);
        console.log("Deleted news:", result.rows[0]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error deleting news:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.put("/:newsid", async (req, res) => {
try{
    const { newsid } = req.params;
   
    const {  name, seats, location } = req.body;    
    console.log("Updating news with id:", newsid);
    const updatednews = await dbpool.query("UPDATE news SET name = $1, seats = $2, location = $3 WHERE newsid = $4 RETURNING *", [name, seats, location, newsid]);
    console.log("Updated news:", updatednews.rows[0]);   
    if (updatednews.rowCount === 0) {
        console.log(`news not found for update with id: ${newsid}`);
        return res.status(404).json({ error: " news not found for update" });
    }
    res.json(updatednews.rows[0]);
}  
 catch (error) {
    console.error("Error updating news:", error);
    res.status(500).json({ error: "Internal Server Error" });  
}
}
)


router.get("/:newsid", async (req, res) => {
    const { newsid } = req.params;
    console.log("Fetching news with id:", newsid);
    try{
        const news = await dbpool.query("SELECT * FROM news WHERE newsid = $1", [newsid]);
        if (news.rows.length === 0) {
            console.log(`news not found with id: ${newsid}`);
            return res.status(404).json({ error: "news not found" });
        }
        console.log("Fetched news:", news.rows[0]);
        res.json(news.rows[0]);
    }
    catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
