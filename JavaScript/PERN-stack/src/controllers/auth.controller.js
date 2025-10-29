import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import md5 from "md5";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

    if (result.rowCount === 0) {
      return res.status(400).json({ message: "El correo no existe" });
    }

    const isValidPassword = await bcrypt.compare(password, result.rows[0].password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = await createAccessToken({ id: result.rows[0].id });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 1000,
    });

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const gravatarUrl = `https://www.gravatar.com/avatar/${md5(email)}`;
    const result = await pool.query(
      "INSERT INTO usuarios (name, email, password, gravatar_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, gravatarUrl]
    );

    const token = await createAccessToken({ id: result.rows[0].id });

    res.cookie("token", token, {
      // httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 1000,
    });

    return res.json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "El correo ya existe" });
    }
    next(error);
  }
};

export const signout = (req, res) => {
    res.clearCookie("token");
    return res.json({ message: "Sesión cerrada" });
};

export const logout = signout;


export const profile = async (req, res) => {
    try {
        const result = await pool.query("SELECT id, name, email FROM usuarios WHERE id = $1", [req.usuarioId]);
        return res.json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};