import { Button } from "@react-email/button";
import { type NextPage } from "next";
import { Html } from "@react-email/html";

const EmailPage: NextPage = () => {
    return (
        <Html>
          <Button
            href="https://example.com"
            style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
          >
            Click me
          </Button>
        </Html>
      );
    }
export default EmailPage