import { Button, Heading, Text, Section, Hr } from "@react-email/components";
import { EmailLayout } from "../layout";

interface TicketCreateEmailProps {
  customerName: string;
  ticketNumber: string;
  ticketTitle: string;
  ticketDescription: string;
  ticketUrl?: string;
}

export const TicketCreateEmail = ({
  customerName = "John Doe",
  ticketNumber = "000001",
  ticketTitle = "Unable to login to my account",
  ticketDescription = "I've been trying to login but keep getting an error message.",
  ticketUrl = "https://serviq.com/tickets/000001",
}: TicketCreateEmailProps) => (
  <EmailLayout preview={`Ticket #${ticketNumber} has been created`}>
    <Heading className="text-2xl font-bold text-gray-900 mt-0 mb-4">
      Your ticket has been created
    </Heading>

    <Text className="text-gray-700 text-base leading-relaxed mb-4">
      Hi {customerName},
    </Text>

    <Text className="text-gray-700 text-base leading-relaxed mb-6">
      Thank you for contacting us. We've received your support request and our
      team will get back to you shortly.
    </Text>

    <Section className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
      <Text className="text-sm text-gray-500 m-0 mb-2">Ticket Number</Text>
      <Text className="text-xl font-bold text-gray-900 m-0 mb-4">
        #{ticketNumber}
      </Text>

      <Hr className="border-gray-200 my-4" />

      <Text className="text-sm text-gray-500 m-0 mb-2">Subject</Text>
      <Text className="text-base font-semibold text-gray-900 m-0 mb-4">
        {ticketTitle}
      </Text>

      <Text className="text-sm text-gray-500 m-0 mb-2">Description</Text>
      <Text className="text-base text-gray-700 m-0">{ticketDescription}</Text>
    </Section>

    <Section className="text-center mb-6">
      <Button
        href={ticketUrl}
        className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg inline-block no-underline"
      >
        View Ticket Details
      </Button>
    </Section>

    <Section className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
      <Text className="text-sm text-blue-900 m-0">
        <strong>💡 What happens next?</strong>
        <br />
        Our support team will review your ticket and respond within 24 hours.
        You'll receive an email notification when there's an update.
      </Text>
    </Section>

    <Text className="text-gray-600 text-sm mt-6 mb-0">
      Best regards,
      <br />
      The Serviq Support Team
    </Text>
  </EmailLayout>
);

export default TicketCreateEmail;
