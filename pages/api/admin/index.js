// pages/api/admin/index.js
import { serialize } from "cookie";

const handler = (req, res) => {
  const { method } = req;

  if (method === "POST") {
    const { username, password } = req.body;

    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const serialized = serialize("token", process.env.ADMIN_TOKEN, {
        maxAge: 60 * 60, // 1 hour
        sameSite: "strict",
        path: "/",
        httpOnly: true,
      });

      res.setHeader("Set-Cookie", serialized);
      return res.status(200).json({ message: "Success" });
    } else {
      return res.status(400).json({ message: "Wrong Credentials" });
    }
  }

  if (method === "PUT") {
    const serialized = serialize("token", "", {
      maxAge: -1,
      path: "/",
    });

    res.setHeader("Set-Cookie", serialized);
    return res.status(200).json({ message: "Logged out" });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
};

export default handler;
