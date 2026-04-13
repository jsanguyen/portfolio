import "../app/globals.css";

const Splash = () => {
  return (
    <div className="routeComp">
      <h2 className="splashHeader">Thanks for Visiting my Page.</h2>
      <p className="splahParagraph">
        I'm Jonathan, and I appreciate you taking the time to come check out my
        site. It's still a work in progress and I will be adding more to it as
        time goes on.{" "}
      </p>

      <p className="splahParagraph">
        Writing code is what I do for a living and as a hobby. I am a Full-stack
        Software Engineer with 8 years of experience architecting highly
        available, cloud-native infrastructure and building resilient systems.
        You can find out more about the tools I've used with the left hand nav bar.{" "}
      </p>
      <p className="splahParagraph">
        My experience includes architecting web portals that serve hundreds of
        thousands of users, building resilient Go, Node.js, and TypeScript
        systems, and automating zero-downtime CI/CD pipelines across GCP, Azure,
        and AWS. I also have a strong focus on Infrastructure as Code (Terraform)
        and enforcing least-privilege security models in production environments.
      </p>
    </div>
  );
};

export default Splash;
