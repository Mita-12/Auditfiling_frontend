import React, { useEffect, useState } from "react";
import WhatsAppButton from "../form/WhatsAppPopup";

const sections = [
  { id: "acceptance-of-terms", title: "Acceptance of Terms" },
  { id: "scope-of-services", title: "Scope of Services" },
  { id: "user-obligations", title: "User Obligations" },
  { id: "account-security", title: "Account and Security" },
  { id: "privacy-policy", title: "Privacy Policy" },
  { id: "accuracy-disclaimer", title: "Accuracy of Information and Disclaimer" },
  { id: "limitation-liability", title: "Limitation of Liability" },
  { id: "payments-refunds", title: "Payments, Refunds & Cancellations" },
  { id: "intellectual-property", title: "Intellectual Property" },
  { id: "termination", title: "Termination" },
  { id: "governing-law", title: "Governing Law and Jurisdiction" },
  { id: "contact-information", title: "Contact Information" },
];

export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState("");

  // Handle scroll behavior and active section highlighting
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const el = document.getElementById(hash.substring(1));
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      // Find which section is currently in view
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    handleHash();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSectionClick = (id) => {
    setActiveSection(id);
    window.history.pushState(null, null, `#${id}`);
  };

  return (
    <section className="min-h-screen text-gray-800">
      {/* Hero Section */}
      <div className="relative mt-20 py-20 lg:py-24">
        <div className="absolute inset-0"></div>
        <div className="relative font-serif max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold font-serif text-gray-900 ">
            Terms and Conditions
            <span className="block w-24 h-1 bg-blue-600 mx-auto mt-3 transition-all duration-500"></span>
          </h1>

        </div>
      </div>

      {/* Introduction Card */}
      <div className="max-w-6xl mx-auto px-6 -mt-8 lg:-mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 border border-orange-100">
          <p className="text-lg lg:text-xl leading-relaxed text-gray-700 text-center">
            Welcome to <span className="font-semibold text-black">Auditfiling.com</span>, a entity of{" "}
            <span className="font-semibold text-black">Cloudsat Pvt. Ltd.</span> ("we", "our", or "Auditfiling").
            By accessing or using our website, platform, or any of our services, you ("you", "your", or "client")
            agree to be bound by the following terms and conditions ("Terms"). Please take a moment to read these terms before using our services.

          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-4 lg:py-4 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <nav className="lg:w-75 lg:sticky lg:top-24 lg:self-start bg-white rounded-xl p-6">
          <h1 className="font-semibold text-center text-gray-900 mb-4 text-3xl">Contents</h1>
          <ul className="space-y-3">
            {sections.map((sec) => (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  onClick={() => handleSectionClick(sec.id)}
                  className={`flex items-start py-2 px-3 rounded-lg transition-all duration-200 ${activeSection === sec.id
                    ? "bg-blue-50 text-blue-500 border-l-4 border-blue-500 "
                    : "text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    }`}
                >
                  
                  <span className="text-lg  leading-tight">{sec.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <div className="flex-1 space-y-2">
          <Section id="acceptance-of-terms" title="1. Acceptance of Terms">
            <ul className="space-y-1">
              <ListItem>
                By creating an account or availing any of our services, you agree to comply with these Terms.
              </ListItem>
              <ListItem>
                You must be an Indian resident of legal age to enter into binding contracts.
              </ListItem>
              <ListItem>
                If you disagree with any part of these terms, we request you not to continue using our service.
              </ListItem>
              <ListItem>
                Auditfiling reserves the right to modify, update, or replace any part of these Terms without prior notice.
              </ListItem>
              <ListItem>
                Continued use of our services after such changes constitutes acceptance of the revised Terms.
              </ListItem>
            </ul>
          </Section>

          <Section id="scope-of-services" title="2. Scope of Services">
            <ul className="space-y-1">
              <ListItem>
                Auditfiling.com provides digital and assisted legal, tax, and compliance services, including but not limited to GST filing, ITR filing, company registration, and business compliance management.
              </ListItem>
              <ListItem>
                We may modify, suspend, or discontinue any service or feature at any time, with or without notice.
              </ListItem>
              <ListItem>
                By using our platform, you authorize Auditfiling and its representatives to act on your behalf for submissions, filings, or registrations with government departments such as the Income Tax Department, MCA, and GST portals.
              </ListItem>
            </ul>
          </Section>

          <Section id="user-obligations" title="3. User Obligations">
            <ul className="space-y-1">
              <ListItem>
                You agree to provide accurate, complete, and current information while using our services.
              </ListItem>
              <ListItem>
                You are solely responsible for verifying the accuracy of filings, forms, or other submissions before approval.
              </ListItem>
              <ListItem>
                Unauthorized use, reproduction, or distribution of our services, tools, or content is strictly prohibited.
              </ListItem>
              <ListItem>
                If filing on behalf of another individual or entity, you must have proper authorization.
              </ListItem>
            </ul>
          </Section>

          <Section id="account-security" title="4. Account and Security">
            <ul className="space-y-1">
              <ListItem>
                You're responsible for keeping your account details secure and not sharing them with anyone.
              </ListItem>
              <ListItem>
                Any loss or damage resulting from unauthorized account access is not Auditfiling's responsibility.
              </ListItem>
              <ListItem>
                Notify us immediately if you suspect any breach of security.
              </ListItem>
            </ul>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-4">
              <p className="text-lg font-semibold mb-2">Security Contact:</p>
              <ContactInfo
                label="Email:"
                value="support@auditfiling.com"
                href="mailto:support@auditfiling.com"
              />
              <ContactInfo
                label="Email:"
                value="info@cloudsat.in"
                href="mailto:info@cloudsat.in"
              />
              <ContactInfo
                label="Phone:"
                value="+91 74286 00607"
                href="tel:+917428600607"
              />
               <ContactInfo
                label="Phone:"
                value="+91 9910003219"
                href="tel:+9910003219"
              />
            </div>
          </Section>

          <Section id="privacy-policy" title="5. Privacy Policy">
            <ul className="space-y-1">
              <ListItem>
                Your use of our services is subject to our Privacy Policy, which explains how we collect, use, and protect your information.
              </ListItem>
              <ListItem>
                Continued use implies consent to our privacy practices.
              </ListItem>
            </ul>
          </Section>

          <Section id="accuracy-disclaimer" title="6. Accuracy of Information and Disclaimer">
            <ul className="space-y-1">
              <ListItem>
                We strive to provide accurate and reliable services; however, Auditfiling does not guarantee error-free performance.
              </ListItem>
              <ListItem>
                All filings and documents are prepared based on information provided by you, and the responsibility for correctness lies with the client.
              </ListItem>
              <ListItem>
                Services are provided "as is" and "as available," without any warranties, express or implied.
              </ListItem>
            </ul>
          </Section>

          <Section id="limitation-liability" title="7. Limitation of Liability">
            <ul className="space-y-1">
              <ListItem>
                Auditfiling, its employees, or affiliates will not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our services.
              </ListItem>
              <ListItem>
                Our total liability, in any case, shall not exceed the amount paid by you for the specific service.
              </ListItem>
            </ul>
            <ImportantNote>
              These limitations of liability are fundamental elements of the basis of the bargain between you and Auditfiling.com.
            </ImportantNote>
          </Section>

          <Section id="payments-refunds" title="8. Payments, Refunds & Cancellations">
            <SubSection title="Payments:">
              <ul className="space-y-2">
                <ListItem>
                  All prices are inclusive of applicable GST unless otherwise stated.
                </ListItem>
              </ul>
            </SubSection>

            <SubSection title="Refund Policy:">
              <ul className="space-y-2">
                <ListItem>
                  <strong>For self-filing plans:</strong> Refunds are available only before service usage.
                </ListItem>
                <ListItem>
                  <strong>For assisted plans:</strong> Refunds are available only before an expert begins work.
                </ListItem>
                <ListItem>
                  Once a service has been initiated, refunds or cancellations will not be processed.
                </ListItem>
                <ListItem>
                  All refund requests must be sent to auditfilling@gmail.com and will be handled within 3–5 weeks.
                </ListItem>
                <ListItem>
                  Auditfiling reserves the right to deduct applicable processing or administrative charges on approved refunds.
                </ListItem>
              </ul>
            </SubSection>

            <SubSection title="Refund Contact:">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-lg font-semibold mb-2">Refund Inquiries:</p>
                <ContactInfo
                  label="Email:"
                  value="auditfilling@gmail.com"
                  href="mailto:auditfilling@gmail.com"
                />
                  <ContactInfo
                label="Email:"
                value="info@cloudsat.in"
                href="mailto:info@cloudsat.in"
              />
                
                <p className="text-sm text-gray-600 mt-2">
                  Please include your account details and reason for refund request.
                </p>
              </div>
            </SubSection>
          </Section>

          <Section id="intellectual-property" title="9. Intellectual Property">
            <ul className="space-y-1">
              <ListItem>
                All content, logos, trademarks, and resources on Auditfiling.com are the intellectual property of Cloudsat Pvt. Ltd.
              </ListItem>
              <ListItem>
                You may not copy, distribute, or reproduce any material without our prior written consent.
              </ListItem>
            </ul>
          </Section>

          <Section id="termination" title="10. Termination">
            <ul className="space-y-1">
              <ListItem>
                We reserve the right to suspend or terminate access to our services at any time for violations of these Terms, fraudulent activity, or misuse of our platform.
              </ListItem>
              <ListItem>
                Upon termination, your right to use our services will immediately cease.
              </ListItem>
            </ul>
          </Section>

          <Section id="governing-law" title="11. Governing Law and Jurisdiction">
            <ul className="space-y-1">
              <ListItem>
                All our terms and conditions are governed by and interpreted in accordance with the laws of India.
              </ListItem>
              <ListItem>
                Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in Odisha, India.
              </ListItem>
            </ul>
          </Section>

          <Section id="contact-information" title="12. Contact Information">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="text-lg font-semibold mb-4">For any queries, feedback, or concerns regarding these Terms, please contact us at:</p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Cloudsat Pvt. Ltd.</h4>
                  <p className="text-gray-700">(Cloudsat.in / Auditfiling.com)</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Head Office:</h5>
                    <p className="text-gray-700">
                      H No-511, Sarahah Tower,<br />
                      Subhash Nagar,<br />
                      Gurugram, India
                    </p>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Branch Office:</h5>
                    <p className="text-gray-700">
                      2nd Floor, BMC Panchadeep Market Complex,<br />
                      Bhoumya Nagar, Unit-4,<br />
                      Bhubaneswar, India
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <ContactInfo
                    label="Phone:"
                    value="+91 7428600607"
                    href="tel:+917428600607"
                  />
                  <ContactInfo
                    label="Phone:"
                    value="+91 9910003219"
                    href="tel:+919910003219"
                  />
                  <ContactInfo
                    label="Email:"
                    value="info@auditfillings.in"
                    href="mailto:info@auditfillings.in"
                  />
                  <ContactInfo
                    label="Support:"
                    value="support@auditfiling.com"
                    href="mailto:support@auditfiling.com"
                  />
                    <ContactInfo
                label="Email:"
                value="info@cloudsat.in"
                href="mailto:info@cloudsat.in"
              />
                </div>
              </div>
            </div>
          </Section>

         
        </div>
      </div>
      <WhatsAppButton/>
    </section>
  );
}

// Reusable Components
function Section({ id, title, children }) {
  return (
    <div
      id={id}
      className="bg-white p-4 transition-all duration-300"
    >
      <h1 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
        {title}
      </h1>
      <div className="text-gray-700 leading-relaxed space-y-6">
        {children}
      </div>
    </div>
  );
}

function SubSection({ title, children }) {
  return (
    <div className="mb-1">
      <h3 className="font-semibold text-gray-900 mb-1 text-lg">{title}</h3>
      <div className="ml-4">{children}</div>
    </div>
  );
}

function ListItem({ children }) {
  return (
    <li className="flex items-start">
      <span className="text-blue-500 mr-3 mt-1">•</span>
      <span>{children}</span>
    </li>
  );
}

function ImportantNote({ children }) {
  return (
    <div className="p-2 bg-blue-50 border-l-2 border-blue-500 rounded-r-sm">
      <p className="text-gray-800 font-medium text-lg">{children}</p>
    </div>
  );
}

function ContactInfo({ label, value, href }) {
  return (
    <p className="flex flex-col sm:flex-row sm:items-center">
      <span className="font-medium text-gray-600 sm:w-24 sm:flex-shrink-0">{label}</span>
      {href ? (
        <a
          href={href}
          className="text-blue-500 hover:text-red-700 hover:underline font-medium transition-colors"
        >
          {value}
        </a>
      ) : (
        <span className="font-medium">{value}</span>
      )}
    </p>
  );
}