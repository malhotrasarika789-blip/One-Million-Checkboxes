import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", (req, res) => {

    const { username } = req.body;

    if (!username) {

        return res.json({
            message: "Username required"
        });
    }

    const token = jwt.sign(
        { username },
        process.env.JWT_SECRET
    );

    res.json({ token });
});

export default router;