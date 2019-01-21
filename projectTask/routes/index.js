var express = require("express");
var router = express.Router();

var projectControl = require("../controller/projectController");

/* Function to get home page : This function calls displaySearchForm,
   which renders search form on screen.
*/
router.get("/", function (req, res) {
  return projectControl.getProjectList(req, res);
});
router.get("/viewAll/:id", projectControl.getProjectList);

router.get("/showAddForm", function (req, res) {
  return projectControl.showAddForm(req, res);
});

router.post("/addProject", function (req, res) {
  return projectControl.addProjectDetails(req, res);
});
router.get("/editProject/:id", projectControl.displayEditProjectDetails);
router.post("/updateProject", function (req, res) {
  return projectControl.editProjectDetails(req, res);
});
router.get("/project/:id", projectControl.projectDetails);
router.post("/addForm", projectControl.addFormDetails);
router.get("/deleteForm/:id", projectControl.deleteFormDetails);

router.get("/deleteUser/:id", projectControl.deleteUserDetails);

module.exports = router;
