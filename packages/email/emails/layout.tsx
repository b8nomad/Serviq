import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
  Hr,
} from "@react-email/components";
import tailwindConfig from "../tailwind.config";
import { ReactNode } from "react";

interface EmailLayoutProps {
  preview?: string;
  children: ReactNode;
}

export const EmailLayout = ({ preview, children }: EmailLayoutProps) => (
  <Html>
    <Head />
    <Tailwind config={tailwindConfig}>
      <Body className="bg-gray-50 font-sans mx-auto my-0">
        {preview && <Preview>{preview}</Preview>}
        
        <Container className="mx-auto my-8 bg-white rounded-lg shadow-sm max-w-[600px]">
          {/* Header */}
          <Section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg px-8 py-6">
            <div className="flex items-center gap-3">
              <Img
                src="https://imagedelivery.net/lBBQXgdmiVeRtDFy3JLn-w/bacd40ea-55dd-43f2-8b75-0e514da58e00/public"
                alt="Serviq Logo"
                width="40"
                height="40"
                className="inline-block"
              />
              <div>
                <Text className="text-white text-2xl font-bold m-0">
                  Serviq
                </Text>
                <Text className="text-blue-100 text-sm m-0 mt-1">
                  Support Ticket System
                </Text>
              </div>
            </div>
          </Section>

          {/* Content */}
          <Section className="px-8 py-6">
            {children}
          </Section>

          <Hr className="border-gray-200 mx-8" />

          {/* Footer */}
          <Section className="px-8 py-6 bg-gray-50 rounded-b-lg">
            <Text className="text-xs text-gray-500 text-center m-0 mb-3">
              <Link
                className="text-gray-600 underline mx-2"
                href="#"
              >
                Help Center
              </Link>
              •
              <Link
                className="text-gray-600 underline mx-2"
                href="#"
              >
                Contact Support
              </Link>
              •
              <Link
                className="text-gray-600 underline mx-2"
                href="#"
              >
                Privacy Policy
              </Link>
            </Text>
            <Text className="text-xs text-gray-400 text-center m-0 leading-relaxed">
              © {new Date().getFullYear()} Serviq. All rights reserved.
              <br />
              You're receiving this email because you have an active support ticket.
            </Text>
          </Section>
        </Container>

        {/* Unsubscribe footer */}
        <Section className="max-w-[600px] mx-auto px-8">
          <Text className="text-xs text-gray-400 text-center">
            If you no longer wish to receive these notifications,{" "}
            <Link className="text-gray-500 underline" href="#">
              manage your email preferences
            </Link>
          </Text>
        </Section>
      </Body>
    </Tailwind>
  </Html>
);

export default EmailLayout;
