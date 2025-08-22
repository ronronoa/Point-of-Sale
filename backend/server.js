import express from 'express'
import mysql from 'mysql2'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pos_db"
})

db.connect((err) => {
    if(err){
        console.error("Database connection failed: ", err)
    } else {
        console.log("Connected to MySQL database")
    }
})

app.post("/api/auth/login", (req, res) => {
    const { username, password} = req.body;
    const sql = "SELECT * FROM users WHERE username = ?"

    db.query(sql, [username], async(err, result) => {
        if (err) return res.status(500).json({message: "Server error"});
        if (result.length === 0)
            return res.status(401).json({message: "Invalid credentials"})

        const user = result[0]
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(401).json({message: "Invalid credentials"})

        const token = jwt.sign({id: user.id, role: user.role}, "secretkey", {
            expiresIn: "1h"
        });

        res.json({token, role: user.role})
    })
})

app.post("/api/auth/register", async (req, res) => {
    try {
        const { username, password, role} = req.body;

        if(!username || !password || !role) {
            return res.status(400).json({ message: "All fields are required"})
        }

        if(password.length < 4) {
            return res.status(400).json({ message: "Password must be at least 4 characters"})
        }

        const checkUser = "SELECT * FROM users WHERE username = ?";
        db.query(checkUser, [username], async (err, result) => {
            if(err) return res.status(500).json({message: "Server error"})

            if(result.length > 0) {
                return res.status(409).json({ message: "Username already exists."})
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            const sql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)"
            db.query(sql, [username, hashedPassword, role], (err) => {
                if(err) return res.status(500).json({ message: "Failed to register user"})
                return res.status(201).json({ message: "User added successfully" })
            })
        })
    } catch (error) {
        res.status(500).json({message: "Server error"})
    }
})

app.listen(5000, () => console.log("Service is running at port 5000"))