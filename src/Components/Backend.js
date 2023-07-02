import React from "react";
import "../CSS/FrontEnd.css";

const Backend = () => {
  return (
    <div className="routeComp">
      <p className="feHeader">
        {" "}
        4 Years - Scala • Node.js • Firebase • Oracle • MongoDB
      </p>
      <p className="feParagraph">
        • Developed, tested and maintained Kubernetes job-based Scala pipelines
        to different carriers such as Nationwide, FSL and Chubb. Applications
        deployed and managed via Kubernetes and GCP. All apps dockerized and
        deployed into GCP Kubernetes.
      </p>

      <p className="feParagraph">
        • Create SQL powered REST endpoints with Scala and utilized these
        endpoints for our frontend applications. Endpoints protected with role
        based authentication and managed inside GCP Kubernetes.
      </p>

      <p className="feParagraph">
        • Built file ingress applications within in-house Spark applications.
        Used Apache Spark and Scala to generate eligibility files from BigQuery
        data.
      </p>

      <p className="feParagraph">
        • Wrote and developed job-based SQL reports for internal employees. Sql
        queries were sent to inhouse Scala Application that generated a data
        report for users from in-house buot UIs
      </p>
    </div>
  );
};

export default Backend;
