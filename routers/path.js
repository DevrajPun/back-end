const express = require("express");
const CURDController = require("../controllers/CURDController");
const checkUseAuth = require("../middlewares/auth");
const route = express.Router();

route.get("/", CURDController.test);
route.post("/insert", CURDController.insertUser);
route.get("/login", CURDController.veryLogin);
route.get("/getAll", checkUseAuth, CURDController.getAll);
route.get("/getOne/:id", checkUseAuth, CURDController.getOne);
route.get("/logout/:id", CURDController.logout);

module.exports = route;
