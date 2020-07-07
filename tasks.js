const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const mysql = require("mysql");

//////////////////////////////////// connect to the database    //////////////////////////////////
const connection = mysql.createConnection({
  host: process.env.dataBaseHost,
  user: process.env.dataBaseUser,
  password: process.env.dataBasePassword,
  database: "rainbowhaven", // The DS that I created in mysql
});

//////////////////////////////////////   Get    ////////////////////////////////////////////
app.get("/items", function (req, res) {
  const query = "SELECT * FROM items;";
  connection.query(query, function (error, data) {
    if (error) {
      console.timeLog("Error fetching clients", error);
      res.status(500).json({ error: error });
    } else {
      res.status(200).json({ items: data });
    }
  });
});

app.get("/volunteers", function (req, res) {
  const query = "SELECT * FROM volunteer;";
  connection.query(query, function (error, data) {
    if (error) {
      console.timeLog("Error fetching volunteers", error);
      res.status(500).json({ error: error });
    } else {
      res.status(200).json({ volunteer: data });
    }
  });
});

//////////////////////////////////////   Post    ////////////////////////////////////////////
// request includes : full_name, email, address, postcode, phone, completed, date, zone, managerId

app.post("/items", function (req, res) {
  const query =
    "INSERT INTO items (full_name,email,address,postcode,phone, completed,date,zone,managerId) VALUES (?, ?, ?, ?,?,?,?,?,?);";
  const queryTask = "SELECT * FROM items WHERE client_id = ?";
  connection.query(
    query,
    [
      req.body.full_name,
      req.body.email,
      req.body.address,
      req.body.postcode,
      req.body.phone,
      req.body.completed,
      req.body.date,
      req.body.zone,
      req.body.managerId,
    ],
    function (error, data) {
      if (error) {
        console.log("Error adding the client", error);
        res.status(500).json({ error: error });
      } else {
        connection.query(queryTask, [data.insertId], function (error, data) {
          if (error) {
            console.log("Error retreiving the client", error);
            res.status(500).json({ error: error });
          } else {
            res.status(201).json({ task: data });
          }
        });
      }
    }
  );
});

// request includes : full_name, email, phone, address, postcode, password, zone, managerId
app.post("/volunteer", function (req, res) {
  const query =
    "INSERT INTO volunteer (full_name,email,phone, address,postcode,password,zone,managerId) VALUES (?, ?, ?,?,?,?,?,?);";
  const queryTask = "SELECT * FROM volunteer WHERE volunteer_Id = ?";
  connection.query(
    query,
    [
      req.body.full_name,
      req.body.email,
      req.body.phone,
      req.body.address,
      req.body.postcode,
      req.body.password,
      req.body.zone,
      req.body.managerId,
    ],
    function (error, data) {
      if (error) {
        console.log("Error adding the volunteer", error);
        res.status(500).json({ error: error });
      } else {
        connection.query(queryTask, [data.insertId], function (error, data) {
          if (error) {
            console.log("Error retreiving the client", error);
            res.status(500).json({ error: error });
          } else {
            res.status(201).json({ task: data });
          }
        });
      }
    }
  );
});

/////////////////////////////////////// Delete  ////////////////////////////////////

app.delete("/items/:client_id", function (req, res) {
  const taskIdDeleted = "DELETE FROM items WHERE client_id=?";
  const taskDeleted = "SELECT * FROM items;";
  connection.query(taskIdDeleted, [req.params.client_id], function (
    error,
    data
  ) {
    if (error) {
      console.log("Error deleting the client", error);
      res.status(500).json({ error: error });
    } else {
      res.sendStatus(200);
    }
  });
});

app.delete("/volunteer/:volunteer_Id", function (req, res) {
  const taskIdDeleted = "DELETE FROM volunteer WHERE volunteer_Id=?";
  const taskDeleted = "SELECT * FROM volunteer;";
  connection.query(taskIdDeleted, [req.params.volunteer_Id], function (
    error,
    data
  ) {
    if (error) {
      console.log("Error deleting the volunteer", error);
      res.status(500).json({ error: error });
    } else {
      res.sendStatus(200);
    }
  });
});

//////////////////////////////////////   Put   ////////////////////////////////////////////
// request includes : full_name, email, address, postcode, phone, completed, date, zone, managerId
app.put("/items/:client_id", function (req, res) {
  const taskIdUpdated =
    "UPDATE items SET full_name=?, email=?, address=?, postcode=?, phone=?, completed=?, date=?, zone=?, managerId=? WHERE client_id=?;";
  const taskUpdated = "SELECT * FROM items;";
  connection.query(
    taskIdUpdated,
    [
      req.body.full_name,
      req.body.email,
      req.body.address,
      req.body.postcode,
      req.body.phone,
      req.body.completed,
      req.body.date,
      req.body.zone,
      req.body.managerId,
      req.params.client_id,
    ],
    function (error, date) {
      if (error) {
        console.log("Error updating the client", error);
        res.status(500).json({ error: error });
      } else {
        res.sendStatus(200);
      }
    }
  );
});

module.exports.handler = serverless(app);
