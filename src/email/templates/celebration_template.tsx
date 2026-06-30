import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "react-email";

type Props = {
  name: string;
  pageviews: number;
  logTitle: string;
  logUrl: string;
};

const CelebrationTemplate = ({ name, pageviews, logTitle, logUrl }: Props) => {
  const previewText = `Your log just hit ${pageviews} views`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={brand}>TechLog</Text>

          <Section style={card}>
            <Heading style={heading}>Congrats, {name}!</Heading>

            <Text style={paragraph}>
              Your log "{logTitle}" just hit <strong>{pageviews}</strong> views.
              Turns out people like you. Well, your log. Probably you too.
            </Text>

            <Text style={paragraph}>
              <Link href={logUrl} style={link}>
                View your log
              </Link>
            </Text>

            <Hr style={hr} />

            <Text style={footerInCard}>
              We are glad you are here. The TechLog team
            </Text>
          </Section>

          <Text style={footer}>
            You are receiving this email because you have a log on TechLog.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f8fafc",
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  color: "#0f172a",
  padding: "20px 0",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "0 20px",
};

const brand = {
  fontSize: "18px",
  fontWeight: 700,
  color: "#0d7d8f",
  margin: "0 0 12px 0",
};

const card = {
  background: "#ffffff",
  borderRadius: "8px",
  padding: "24px",
  border: "1px solid #e2e8f0",
};

const heading = {
  margin: "0 0 8px 0",
  fontSize: "20px",
  lineHeight: "28px",
};

const paragraph = {
  margin: "0 0 16px 0",
  color: "#334155",
  fontSize: "15px",
  lineHeight: "22px",
};

const link = {
  color: "#0d7d8f",
  fontSize: "15px",
  fontWeight: 600,
  textDecoration: "underline",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "20px 0 12px 0",
};

const footerInCard = {
  margin: 0,
  color: "#94a3b8",
  fontSize: "13px",
};

const footer = {
  margin: "14px 0 0 0",
  color: "#94a3b8",
  fontSize: "12px",
};

export default CelebrationTemplate;
