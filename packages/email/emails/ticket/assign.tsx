import { Button, Heading, Text, Section, Hr } from "@react-email/components";
import { EmailLayout } from "../layout";

interface TicketAssignEmailProps {
  customerName: string;
  ticketNumber: string;
  ticketTitle: string;
  agentName: string;
  agentTitle?: string;
  ticketUrl?: string;
  estimatedResponseTime?: string;
}

export const TicketAssignEmail = ({
  customerName = "John Doe",
  ticketNumber = "000001",
  ticketTitle = "Unable to login to my account",
  agentName = "Sarah Johnson",
  agentTitle = "Senior Support Engineer",
  ticketUrl = "https://serviq.com/tickets/000001",
  estimatedResponseTime = "4 hours",
}: TicketAssignEmailProps) => (
  <EmailLayout
    preview={`Ticket #${ticketNumber} has been assigned to ${agentName}`}
  >
    <Heading className="text-2xl font-bold text-gray-900 mt-0 mb-4">
      Your ticket has been assigned
    </Heading>

    <Text className="text-gray-700 text-base leading-relaxed mb-4">
      Hi {customerName},
    </Text>

    <Text className="text-gray-700 text-base leading-relaxed mb-6">
      Good news! Your support ticket has been assigned to one of our specialists
      who will help resolve your issue.
    </Text>

    <Section className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
          {agentName.charAt(0)}
        </div>
        <div>
          <Text className="text-lg font-bold text-gray-900 m-0">
            {agentName}
          </Text>
          <Text className="text-sm text-gray-600 m-0">{agentTitle}</Text>
        </div>
      </div>
    </Section>

    <Section className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
      <Text className="text-sm text-gray-500 m-0 mb-2">Ticket Number</Text>
      <Text className="text-xl font-bold text-gray-900 m-0 mb-4">
        #{ticketNumber}
      </Text>

      <Hr className="border-gray-200 my-4" />

      <Text className="text-sm text-gray-500 m-0 mb-2">Subject</Text>
      <Text className="text-base font-semibold text-gray-900 m-0">
        {ticketTitle}
      </Text>
    </Section>

    <Section className="text-center mb-6">
      <Button
        href={ticketUrl}
        className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg inline-block no-underline"
      >
        View Ticket & Reply
      </Button>
    </Section>

    <Section className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
      <Text className="text-sm text-amber-900 m-0">
        <strong>📧 Responding to this email</strong>
        <br />
        You can reply directly to this email and your response will be added to
        the ticket automatically.
      </Text>
    </Section>

    <Text className="text-gray-600 text-sm mt-6 mb-0">
      Best regards,
      <br />
      The Serviq Support Team
    </Text>
  </EmailLayout>
);

export default TicketAssignEmail;
