import type { Metadata } from "next";
import "./globals.css";
import NavLinks from "@/components/NavLinks"; 

export const metadata: Metadata = {
  title: "Jonathan Nguyen | Senior Software Engineer",
  description: "Software Developer based in ATL, GA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
<html lang="en">
      <body suppressHydrationWarning>
        <div className="container">
          <div className="header">
            <p className="header-name">Jonathan Nguyen</p>
            <div className="Header-About">
              Software Engineer | ATL, GA <br />
            </div>
          </div>

          <main >{children}</main>

          <div className="leftHandNav" style={{ marginRight: "45%" }}>
            <nav>
              <NavLinks /> 
            </nav>

            <div className="row">
                <a className="column" target="_blank" rel="noopener noreferrer" href="https://github.com/jsanguyen">
                  <img src="/GitHub-Mark-32px.png" alt="Git" />
                </a>
              <a className="column" target="_blank" rel="noopener noreferrer" href="https://linkedin.com/in/jonathan-nguyen-11302b138/">
                <img src="/linkedin-logo-32px.png" alt="LinkedIn" />
              </a>
            </div>

            <div style={{ marginTop: "20px" }}>
              <a 
                href="https://resume-482017663846-us-east-2-an.s3.us-east-2.amazonaws.com/Jonathan+Nguyen+-+Resume+(2026).docx" 
                download 
                className="resume-button"
              >
                Download Resume
              </a>
            </div>
          </div>

          <div className="footer">
            A labor of <span style={{ color: "red" }}>love</span>. Made with Next.js and CSS. Hosted with AWS.
          </div>
        </div>
      </body>
    </html>
  );
}