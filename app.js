const client = require("./connection.js");
const express = require("express");
const app = express();
const port = process.env.PORT || "3300";
const cors = require("cors");
app.use(cors());
// app.use(express.urlencoded({ extended: true }));
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const fs = require('fs');
const bcrypt = require('bcrypt')
const yaml = require('js-yaml')
app.use(bodyParser.json())
client.connect();


app.get('/', (req, res) => {
  res.send('Expreess server is running on 3300!');
});


//get all layouts
app.get("/layouts", (req, res) => {
  client.query(`Select * from lov_layouts`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  client.end;
});


//get a particular layout by param
app.get("/layouts/:ly_key", (req, res) => {
  client.query(
    `Select * from lov_layouts where ly_key='${req.params.ly_key}'`,
    (err, result) => {
      if (!err) {
        res.send(result.rows);
      }
    }
  );
  client.end;
});


//get a particular layout by query
app.get("/layoutsquery/", (req, res) => {
  let layer = req.query.layer
  client.query(
    `Select * from lov_layouts where ly_key='${layer}'`,
    (err, result) => {
      if (!err) {
        res.send(result.rows);
      }
    }
  );
  client.end;
});


//get all users
app.get("/users", (req, res) => {
  client.query(`Select id,name,email,phno from users`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  client.end;
});

//Add an user
app.post("/userinsert", async (req, res) => {
  const user = req.body;
  let password = req.body.password
  let hashedPassword = "";
  await bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.send("Unable to hash password");
    } else {
      // console.log(hash);
      hashedPassword = hash;
      let insertQuery = `insert into users(name, password,email,phno) 
      values('${user.name}','${hashedPassword}','${user.email}',${user.phno})`;

      client.query(insertQuery, (err, result) => {
        if (!err) {
          res.send("Insertion was successful");
        } else {
          console.log(err.message);
        }
      });
      client.end;
    }
  })
})


//update user email
app.put("/useremailupdate/:id", (req, res) => {
  let user = req.body;
  console.log(user)
  let updateQuery = `update users
                       set email = '${user.email}', phno = '${user.phno}'
                       where id = ${req.params.id}`;

  client.query(updateQuery, (err, result) => {
    if (!err) {
      res.send("Update was successful");
    } else {
      console.log(err.message);
    }
  });
  client.end;
});


//delete an user
app.delete("/userdel/:id", (req, res) => {
  let insertQuery = `delete from users where id=${req.params.id}`;
  client.query(insertQuery, (err, result) => {
    if (!err) {
      res.send("Deletion was successful");
    } else {
      console.log(err.message);
    }
  });
  client.end;
});




const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Title',
      description: 'Description of your API',
      version: '1.0.0',
    },
    tags: [
      {
        name: 'Layouts',
        description: 'Endpoints for managing layouts',
      },
      {
        name: 'Users',
        description: 'Endpoints for managing users',
      },
    ],
  },
  apis: ['app.js'], // Replace with your main file name
};
const swaggerSpec = swaggerJsdoc(options)
const yamlSpec = yaml.dump(swaggerSpec)
fs.writeFileSync('output/swagger.yaml', yamlSpec);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
