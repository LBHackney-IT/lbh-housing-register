// For a detailed explanation regarding each routes property, visit:
// https://mocks-server.org/docs/get-started-routes

const applications = require("../data/applications")

const getApplications = {
  id: "get-applications",
  url: "/api/applications",
  method: "GET",
  variants: [
    {
      id: "success",
      response: {
        status: 200,
        body: {
          results: applications
        },
      },
    }
  ]
}

const getApplication = {
  id: "get-application",
  url: "/api/applications/:id",
  method: "GET",
  variants: [
    {
      id: "success",
      response: {
        status: 200,
        body: applications[0],
      },
    },
    {
      id: "simulate",
      response: (req, res) => {
        const applicationId = req.params.id;
        const application = applications.find((applicationData) => applicationData.id === applicationId);
        if (application) {
          res.status(200);
          res.send(application);
        } else {
          res.status(404);
          res.send({
            message: "Application not found",
          });
        }
      },
    },
  ]
}

const addApplication = {
  id: "add-application",
  url: "/api/applications/",
  method: "POST",
  variants: [
    {
      id: "success",
      response: {
        status: 201,
        body: applications[0],
      },
    }
  ]
}

const updateApplication = {
  id: "update-application",
  url: "/api/applications/:id",
  method: "PATCH",
  variants: [
    {
      id: "success",
      response: {
        status: 204,
        body: applications[0],
      },
    },
    {
      id: "simulate",
      response: (req, res) => {
        const applicationId = req.params.id;
        const application = applications.find((applicationData) => applicationData.id === applicationId);
        if (application) {
          res.status(204);
          res.send(application);
        } else {
          res.status(404);
          res.send({
            message: "Application not found",
          });
        }
      },
    },
  ]
}

module.exports = [
  getApplications,
  getApplication,
  addApplication,
  updateApplication
];
