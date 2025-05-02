import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  name: string;
  url: string;
}

export const VerifyEmail = ({ name, url }: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Verify your email address and complete your registration
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <Img
              width={130}
              src="https://i.ibb.co/kVMNgj5T/logo.png"
              alt="logo"
            />
          </Section>
          <Section style={sectionsBorders}>
            <Row>
              <Column style={sectionBorder} />
              <Column style={sectionCenter} />
              <Column style={sectionBorder} />
            </Row>
          </Section>
          <Section style={content}>
            <Text style={paragraph}>Hi {name},</Text>
            <Text style={paragraph}>
              Welcome to Scinapse!
              <br />
              <br />
              Before you start using our platform, we need to verify your email
              address to complete your account setup.
            </Text>
            <Text style={paragraph}>
              Please click the button below to verify your account:
            </Text>
            <Link
              href={url}
              style={{
                backgroundColor: "#000",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "5px",
                fontSize: "14px",
                maxWidth: "580px",
              }}
            >
              Verify My Account
            </Link>{" "}
            <Text style={paragraph}>
              If you didn’t create an account with Scinapse, feel free to ignore
              this email.
            </Text>
            <Text style={paragraph}>
              All the best,
              <br />
              The Scinapse Team
            </Text>
          </Section>
        </Container>

        <Section style={footer}>
          <Row>
            <Text style={{ textAlign: "center", color: "#706a7b" }}>
              &copy; {new Date().getFullYear()} Scinapse, Inc. All Rights
              Reserved.
            </Text>
          </Row>
        </Section>
      </Body>
    </Html>
  );
};

VerifyEmail.PreviewProps = {
  name: "John Doe",
  url: "https://example.com",
} as ResetPasswordEmailProps;

export default VerifyEmail;

const fontFamily = "HelveticaNeue,Helvetica,Arial,sans-serif";

const main = {
  backgroundColor: "#efeef1",
  fontFamily,
  padding: "20px",
  margin: 0,
};

const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
};

const container = {
  maxWidth: "580px",
  margin: "auto",
  backgroundColor: "#ffffff",
};

const footer = {
  maxWidth: "580px",
  margin: "0 auto",
};

const content = {
  padding: "5px 20px 10px 20px",
};

const logo = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 30,
};

const sectionsBorders = {
  width: "100%",
  display: "flex",
};

const sectionBorder = {
  borderBottom: "1px solid rgb(238,238,238)",
  width: "249px",
};

const sectionCenter = {
  borderBottom: "1px solid rgb(145,71,255)",
  width: "102px",
};
