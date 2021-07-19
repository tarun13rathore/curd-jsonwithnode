const courseRoutes = (app, fs) => {
  // variables
  const dataPath = "./db.json";

  // refactored helper methods
  const readFile = (
    callback,
    returnJson = false,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        throw err;
      }

      callback(returnJson ? JSON.parse(data) : data);
    });
  };

  const writeFile = (
    fileData,
    callback,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
      if (err) {
        throw err;
      }

      callback();
    });
  };

  // READ
  // Notice how we can make this 'read' operation much more simple now.
  app.get("/course", (req, res) => {
    readFile((data) => {
      res.send(data);
    }, true);
  });

  //add new course-----------------------ok
  app.post("/course", (req, res) => {
    readFile((data) => {
      // Note: this needs to be more robust for production use.
      // e.g. use a UUID or some kind of GUID for a unique ID value.
      const newCourseId = Date.now().toString();

      // add the new course
      data[newCourseId] = req.body;

      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send("new course added");
      });
    }, true);
  });

  // UPDATE
  app.put("/course/:id", (req, res) => {
    readFile((data) => {
      // add the new course
      const courseId = req.params["id"];
      data[courseId] = req.body;

      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send(`course id:${courseId} updated`);
      });
    }, true);
  });

  // DELETE
  app.delete("/course/:id", (req, res) => {
    readFile((data) => {
      // add the new course
      const courseId = req.params["id"];
      delete data[courseId];

      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send(`course id:${courseId} removed`);
      });
    }, true);
  });
};

module.exports = courseRoutes;
