var projectModel = require("../model/projectModel");

/***************************************************************************************
 * This function renders add project form on screen
 ***************************************************************************************/

function showAddForm(req, res) {
  res.render("addProject");
}

/***************************************************************************************
 * This function adds the project in db
 ***************************************************************************************/
function addProjectDetails(req, res) {
  // Default form that will be added while adding project.
  console.log("---------", req.body);
  const formData = {
    name: req.body.projForm,
    shape: "Polygon"
  };

  // Default user
  const userData = {
    fname: "Shanaya",
    lname: "Malsawant",
    age: 20
    // imageUrl: ""
  };
  var projectData = {
    projectName: req.body.projName,
    description: req.body.projDescription,
    form: formData,
    reminder: req.body.projReminder,
    user: userData,
    symbol: req.body.projSymbol
  };

  // Saves the data in db
  var entity = new projectModel(projectData);
  entity.save(function (error, success) {
    // If error exists assign error to object and use that object to show the error
    if (error) {
      var errMsg = "Error :  " + error;
      // Renders addProject view and show error there
      res.render("addProject", {
        error: errMsg
      });
      return;
    }
    // renders addProject with success msg
    res.render("addProject", {
      success: success
    });
  });
}

/***************************************************************************************
 * This function validates edit form
 ***************************************************************************************/
function editProjectValidation(req) {
  let projectName = req.body.projName.trim();
  let description = req.body.projDescription.trim();

  // Check if field is empty for following fields`
  req.assert("projectName", "Project name is required").notEmpty();
  req.assert("description", "Description is required").notEmpty();
  return req;
}

/***************************************************************************************
 * This function renders edit project form on screen
 * Populates the selected project.
 ***************************************************************************************/
function displayEditProjectDetails(req, res) {
  let query = {
    $and: []
  };

  if (req.params.id) query.$and.push({ _id: req.params.id });

  projectModel.findOne(query).exec(function (error, result) {
    if (error) {
      var msg = "Error : " + error;
      res.render("editProject", {
        error: msg
      });
      return;
    }
    // renders editProject form and passes the object
    res.render("editProject", {
      projectData: result
    });
  });
}

/***************************************************************************************
 * This function updates the selected project in db
 ***************************************************************************************/
function editProjectDetails(req, res) {
  // Calls validation function
  editProjectValidation(req);

  var editFormError = req.validationErrors();
  // If any validation error found then it returns object with error
  if (editFormError) {
    res.render("editProject", {
      editFormError: editFormError
    });
    return;
  }
  var projectData = {
    projectName: req.body.projName,
    description: req.body.projDescription
  };

  // Saves the data in db
  projectModel.update(
    { _id: req.body.projectId },
    {
      $set: projectData
    },
    function (error, success) {
      // If error exists assign error to object and use that object to show the error
      if (error) {
        var errMsg = "Error: " + error;
        // Renders editProject view and show error there
        res.render("editProject", {
          error: errMsg
        });
        return;
      }
      // renders editProject form and passes the object
      res.render("editProject", {
        success: success
      });
    }
  );
}

/***************************************************************************************
 * This function retrieves list of all projects
 * Populates the selected project.
 ***************************************************************************************/
function getProjectList(req, res) {
  let viewAll = parseInt(req.params.id);
  // Perform sort on updated date
  projectModel
    .find()
    .sort({
      updatedAt: "desc"
    })
    .exec(function (error, result) {
      if (error) {
        var errMsg = "Error!! :" + error;
        // Renders listProject view and show error there
        res.render("listProject", {
          error: errMsg
        });
        return;
      }
      // renders listProject form and passes the object with list of projs
      if (viewAll == 1)
        res.render("viewAllProjects", { projectListData: result });
      else
        res.render("listProject", { projectListData: result });
    });
}
/***************************************************************************************
 * This function retrieves the project details of selected project
 ***************************************************************************************/
async function projectDetails(req, res) {
  let query = {
    $and: []
  };
  try {
    // executes query to get details of all projects
    let projectListData = await projectModel.find().exec();
    if (req.params.id) {
      query.$and.push({
        _id: req.params.id
      });
    }
    // executes query to get details of only selected project
    let projectSpecificData = await projectModel.findOne(query).exec();
    res.render("listProject", {
      projectListData,
      projectSpecificData
    });
  } catch (err) {
    var errMsg = "Error!! " + err;
    res.render("listProject", {
      err: errMsg
    });
  }
}

function displayDate(date) {
  let date = new Date(date);
  return (
    date.getDate() + " " + (date.getMonth() + 1) + " " + date.getFullYear()
  );
}


/***************************************************************************************
 * This function adds form to selected project
 ***************************************************************************************/
async function addFormDetails(req, res) {
  let query = {
    $and: []
  };
  try {
    let data = req.body;
    let projectSpecificData = await projectModel
      .findOneAndUpdate(
        { _id: data.projectId },
        {
          $push: {
            form: data
          }
        },
        { new: true }
      ).exec();

    let projectListData = await projectModel.find().exec();
    if (projectSpecificData) {
      res.render("listProject", {
        projectListData,
        projectSpecificData
      });
    }
  } catch (error) {
    var errMsg = "Error: " + error;
    res.render("listProject", {
      error: errMsg
    });
  }
}


/***************************************************************************************
 * This function deletes form from selected project
 ***************************************************************************************/
async function deleteFormDetails(req, res) {
  try {
    let data = req.body;
    let projectSpecificData = await projectModel
      .findOneAndUpdate(
        {
          "form._id": {
            $in: [req.params.id]
          }
        },
        {
          $pull: {
            form: {
              _id: req.params.id
            }
          }
        },
        { new: true }
      )
      .exec();

    let projectListData = await projectModel.find().exec();
    if (projectSpecificData) {
      res.render("listProject", {
        projectListData,
        projectSpecificData
      });
    }
  } catch (error) {
    var errMsg = "Error: " + error;
    res.render("listProject", {
      error: errMsg
    });
  }
}


/***************************************************************************************
 * This function delets user from selected project
 ***************************************************************************************/
async function deleteUserDetails(req, res) {
  console.log("in delete", req.params);
  try {
    let projectSpecificData = await projectModel
      .findOneAndUpdate(
        {
          "user._id": {
            $in: [req.params.id]
          }
        },
        {
          $pull: {
            user: {
              _id: req.params.id
            }
          }
        },
        {
          new: true
        }
      )
      .exec();
    let projectListData = await projectModel.find().exec();
    if (projectSpecificData) {
      res.render("listProject", {
        projectListData,
        projectSpecificData,
        userSelected: true
      });
    }

  } catch (error) {
    var errMsg = "Error: " + error;
    res.render("listProject", {
      error: errMsg
    });
  }
}

module.exports = {
  showAddForm,
  addProjectDetails,
  getProjectList,
  projectDetails,
  addFormDetails,
  displayEditProjectDetails,
  editProjectValidation,
  editProjectDetails,
  deleteFormDetails,
  deleteUserDetails
};
