import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.set("port", 4000);

// Archivos estáticos
app.use(express.static(__dirname + "/public"));

//! Rutas
app.get("/", (req, res) => res.sendFile(__dirname + "/pages/intro.html")); // 🔥 Ahora la raíz es la intro
app.get("/login", (req, res) => res.sendFile(__dirname + "/pages/login.html"));
app.get("/register", (req, res) => res.sendFile(__dirname + "/pages/register.html"));
app.get("/play", (req, res) => res.sendFile(__dirname + "/pages/play.html"));
app.get("/game", (req, res) => res.sendFile(__dirname + "/pages/game.html"));

app.listen(app.get("port"));
console.log("Servidor corriendo en puerto", app.get("port"));
