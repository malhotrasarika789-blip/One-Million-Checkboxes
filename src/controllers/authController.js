import jwt from "jsonwebtoken";

export const login = async (
    req,
    res
) => {

    const { username } = req.body;

    if (!username) {

        return res.status(400).json({
            message: "Username required",
        });
    }

    const token = jwt.sign(
        {
            username,
        },

        process.env.JWT_SECRET,

        {
            expiresIn: "1d",
        }
    );

    res.json({
        token,
    });
};