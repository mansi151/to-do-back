const express = require('express');
const pool = require('../db');
const router = express.Router();
router.post('/todos',async (req,res)=>{
    try{
        const {task,priority,remark} = req.body;
        const newTask = await pool.query(
            `INSERT INTO todos (task,completed,priority,remark,createdat,updatedat) VALUES ($1,false,$2,$3,NOW(),NOW()) RETURNING *`,[task,priority,remark]
        )
        res.status(201).json(newTask.rows[0])
    }
    catch(e){
        console.log(e);
        res.status(500).json({error:e})
    }
})

router.get('/todos',async (req,res)=>{
    try {
        const all =await pool.query(
            `SELECT * FROM todos ORDER BY createdat DESC`
        );
        console.log(all)
        res.status(201).json(all.rows)
    }
    catch(e){
        res.status(500).json({ error: e });
    }
})

router.delete('/todos/:id',async (req,res)=>{
    try {
        console.log('Enter..???')
        const {id} = req.params;
        const result = await pool.query(`DELETE FROM todos WHERE id = $1 RETURNING *`,[id])
        if(result.rowCount === 0){
            return res.status(404).json({error:'Task not found'})
        }
        res.status(200).json({ message: "Task deleted successfully", deletedTask: result.rows[0] });
    }
    catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Failed to delete task" });
      }
})

router.post('/edittodo',async (req,res)=>{
    console.log('Enter.......')
    const {id,task,priority,remark} = req.body 
    console.log(id,task,priority,remark)
    try {
        const result = await pool.query(`UPDATE todos SET task = $1, priority = $2, remark = $3 WHERE id = $4 RETURNING *`,[task,priority,remark,id])
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Task not found" });
          }
          res.status(200).json({ message: "Task updated successfully", updatedTask: result.rows[0] });
    }
    catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Failed to update task" });
      }
})

module.exports = router