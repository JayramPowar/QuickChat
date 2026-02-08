import jwt from "jsonwebtoken";

const generateToken = (id) => {
    const token = jwt.sign({userId:id}, process.env.JWT_SECRET);
    return token;
};

export default generateToken;