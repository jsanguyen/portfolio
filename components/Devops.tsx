import "../app/globals.css";

const Devops = () => {
  return (
    <div className="routeComp">
      <p className="feHeader">
        {" "}
        Azure • AWS • Google Cloud • Kubernetes • Terraform • CI/CD Pipelines • Bash • Prometheus • Datadog • Azure Application Insights • ARM/Bicep • Linux • Windows Server • YAML
      </p>
      <p className="feParagraph">
        • Architected and maintained automated, declarative CI/CD pipelines in
        Azure DevOps to build container images and deploy workloads to Kubernetes
        clusters with zero-downtime.
      </p>

      <p className="feParagraph">
        • Provisioned resilient cloud infrastructure across GCP and AWS using
        Terraform, managing state and automating the deployment of compute
        instances, VPCs, and secure network boundaries.
      </p>

      <p className="feParagraph">
        • Engineered disaster recovery strategies by creating and maintaining a
        repository of version-controlled ARM templates for rapid redeployment.
      </p>

      <p className="feParagraph">
        • Implemented strict least-privilege IAM and RBAC security models to
        govern all service-to-service connections and cluster deployments.
      </p>
      
      <p className="feParagraph">
        • Integrated comprehensive telemetry and Aqua Security vulnerability
        scanning directly into the build process, enforcing a 'shift-left'
        security posture.
      </p>
    </div>
  );
};

export default Devops;
