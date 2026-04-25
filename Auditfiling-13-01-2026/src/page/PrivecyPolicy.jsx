import React, { useEffect, useState } from "react";
import WhatsAppButton from "../form/WhatsAppPopup";

const sections = [
  { id: "info-collect", title: "Information We Collect" },
  { id: "how-use", title: "How We Use Your Information" },
  { id: "data-sharing", title: "Data Sharing and Disclosure" },
  { id: "meta-ads", title: "Meta Ads and Lead Forms" },
  { id: "google-ads", title: "Google Ads, Analytics, and Remarketing" },
  { id: "data-security", title: "Data Security" },
  { id: "data-retention", title: "Data Retention and Deletion" },
  { id: "user-rights", title: "User Rights" },
  { id: "children-privacy", title: "Children's Privacy" },
  { id: "third-party-links", title: "Third-Party Links" },
  { id: "policy-updates", title: "Policy Updates" },
  { id: "file-permissions", title: "File and Media Access Permissions" },
  { id: "grievance", title: "Contact and Grievance Officer" },
  { id: "consent", title: "Consent" },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("");

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
            Privacy Policy
            <span className="block w-24 h-1 bg-blue-600 mx-auto mt-3 transition-all duration-500"></span>
          </h1>
        </div>
      </div>

      {/* Introduction Card */}
      <div className="max-w-6xl mx-auto px-6 -mt-8 lg:-mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10 border border-orange-100">
          <p className="text-lg lg:text-xl leading-relaxed text-gray-700 text-center">
            <span className="font-semibold text-black">            <span className="font-semibold text-black">Cloudsat Pvt. Ltd.</span>
 Private Limited is a legal owner of Auditfiling.com</span> ("Auditfiling", "we", "our", "us") 
            <p className="mt-3">
              This Privacy Policy explains how we collect, use, share, and protect your personal information when you visit our website, use our mobile applications, interact through our online advertisements, or use any of our services.
            </p>
            <p className="text-lg lg:text-xl leading-relaxed mt-3 text-gray-700 text-center">
              By using our website or submitting your information through any online form (including Meta Ads and Google Ads lead forms), you agree to the terms of this Privacy Policy.
            </p>
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-4 lg:py-4 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <nav className="lg:w-75  lg:sticky lg:top-24 lg:self-start bg-white rounded-xl p-6">
          <h1 className="font-semibold text-center text-gray-900 mb-4 text-3xl">Contents</h1>
          <ul className="space-y-3 list-none ">
            {sections.map((sec) => (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  onClick={() => handleSectionClick(sec.id)}
                  className={`flex items-start py-2 px-3 rounded-lg transition-all  duration-200 ${
                    activeSection === sec.id
                      ? "bg-blue-50  text-blue-500 border-l-4 border-blue-500"
                      : "text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                  }`}
                >
                  {/* <span className="text-sm text-gray-400 w-6 flex-shrink-0">
                    {index + 1}.
                  </span> */}
                  <span className="text-lg leading-tight">{sec.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <div className="flex-1 space-y-2">
          <Section id="info-collect" title="1. Information We Collect">
            <p className="mb-1">We collect information directly, automatically, and through third-party integrations as described below:</p>
            <ul className="space-y-1">
              <ListItem>
                <strong>a. Personal Identification Information</strong>
                <p>When you register, submit forms, or interact with our services, we may collect: Full Name, Email Address, Phone Number, Residential or Business Address, Date of Birth / Incorporation Date, PAN, GSTIN, or other tax identifiers</p>
              </ListItem>
              <ListItem>
                <strong>b. Tax and Business Information</strong>
                <p>For the purpose of providing filing and registration services: Income, deductions, financial details, and other relevant records, Company incorporation details, Supporting business documents (licenses, certificates, etc.)</p>
              </ListItem>
              <ListItem>
                <strong>c. Login and Account Information</strong>
                <p>Username, password, and authentication data for account access and verification. Device and Technical Data: IP address, device type, browser, operating system, and usage patterns, Referral sources, session duration, and user interactions with the site</p>
              </ListItem>
            </ul>
          </Section>

          <Section id="how-use" title="2. How We Use Your Information">
            <p>We use collected data to:</p>
            <ul className="space-y-1">
              <ListItem>Provide, manage, and improve our services</ListItem>
              <ListItem>Process tax filings, registrations, and business compliance tasks</ListItem>
              <ListItem>Verify identity and prevent fraudulent activity</ListItem>
              <ListItem>Contact users regarding service updates, confirmations, or support</ListItem>
              <ListItem>Enhance website functionality, analytics, and marketing</ListItem>
              <ListItem>Display personalized ads through Meta, Google, and other online platforms</ListItem>
              <ListItem>Fulfill legal, regulatory, or contractual obligations</ListItem>
            </ul>
            <ImportantNote>
              We <strong>do not</strong> sell or rent personal or tax information to third parties for marketing purposes.
            </ImportantNote>
          </Section>

          <Section id="data-sharing" title="3. Data Sharing and Disclosure">
            <p className="">We may share your data only with:</p>
            <ul className="space-y-1">
              <ListItem>
                <strong>Authorized Government Portals:</strong> Income Tax Department, GSTN, MCA, etc., for filing purposes.
              </ListItem>
              <ListItem>
                <strong>Service Providers:</strong> Payment gateways, analytics tools (Google Analytics, Meta Pixel), cloud storage, and verification partners, all bound by confidentiality agreements.
              </ListItem>
              <ListItem>
                <strong>Advertising Partners:</strong> Meta (Facebook, Instagram) and Google Ads for remarketing and campaign measurement, in accordance with their respective policies.
              </ListItem>
              <ListItem>
                <strong>Legal Authorities:</strong> If required by law, regulation, or court order.
              </ListItem>
            </ul>
            <p className="mt-4">All partners are required to maintain industry-standard security and data protection protocols.</p>
          </Section>

          <Section id="meta-ads" title="4. Meta Ads and Lead Forms">
            <p>
              When you submit your details via Meta (Facebook or Instagram) lead forms, your data is collected according to: Meta Leads Ads Terms & Service, Meta Data Policy. Auditfiling uses this data only to contact you for the requested service or related assistance. Your data is never sold or transferred to unauthorized third parties.
            </p>
          </Section>

          <Section id="google-ads" title="5. Google Ads, Analytics, and Remarketing">
            <p>
              We use Google Ads, Google Analytics, and related services for marketing and performance tracking. Google may use cookies (including the DART cookie) to serve ads based on your visit to our website and other sites on the Internet. These cookies do not collect personally identifiable information. You can opt out of Google's use of cookies by visiting:{" "}
              <a href="https://policies.google.com/privacy" className="text-blue-500 hover:underline">
                https://policies.google.com/privacy
              </a>
            </p>
            <p className="mt-4">
              We may also use Google Signals for cross-device analytics and remarketing tags to re-engage with visitors across Google's network.
            </p>
          </Section>

          <Section id="data-security" title="6. Data Security">
            <p>We maintain robust administrative, technical, and physical safeguards to protect your data:</p>
            <ul className="space-y-1">
              <ListItem>SSL encryption for data transmission</ListItem>
              <ListItem>Secure, access-controlled storage servers</ListItem>
              <ListItem>Regular system and security audits</ListItem>
              <ListItem>Trained personnel bound by confidentiality agreements</ListItem>
            </ul>
            <ImportantNote>
              However, no system is fully secure, and we cannot guarantee absolute protection against unauthorized access.
            </ImportantNote>
          </Section>

          <Section id="data-retention" title="7. Data Retention and Deletion">
            <p>
              We retain personal data as long as necessary to: Provide our services, Comply with legal and regulatory requirements, Resolve disputes. You may request data deletion at any time by contacting us at{" "}
              <a href="mailto:info@cloudsat.in" className="text-blue-500 hover:underline">
                info@cloudsat.in
              </a>
              .
            </p>
          </Section>

          <Section id="user-rights" title="8. User Rights">
            <p>You have the right to:</p>
            <ul className="space-y-1">
              <ListItem>Access and review your personal data</ListItem>
              <ListItem>Request correction of inaccurate information</ListItem>
              <ListItem>Withdraw consent for marketing communications</ListItem>
              <ListItem>Request deletion of your data (subject to regulatory compliance)</ListItem>
            </ul>
            <p className="mt-4">
              For exercising these rights, contact our Grievance Officer listed below.
            </p>
          </Section>

          <Section id="children-privacy" title="9. Children's Privacy">
            <p>
              Our services are intended for users aged 18 and above. We do not knowingly collect or store information from minors.
            </p>
          </Section>

          <Section id="third-party-links" title="10. Third-Party Links">
            <p>
              Our website may contain links to external websites. We are not responsible for their privacy practices or content. We encourage users to review the privacy policies of those websites.
            </p>
          </Section>

          <Section id="policy-updates" title="11. Policy Updates">
            <p>
              We may revise this Privacy Policy periodically to comply with evolving laws or platform policies (Google, Meta, etc.). The updated version will be posted here, and material changes will be communicated via email or site notification.
            </p>
          </Section>

          <Section id="file-permissions" title="12. File and Media Access Permissions (App Users Only)">
            <p>
              If you use our mobile app, we may request permission to access:
            </p>
            <ul className="space-y-1">
              <ListItem>Local storage for uploading or downloading files</ListItem>
              <ListItem>Camera or gallery for document verification</ListItem>
              <ListItem>File reading/writing for generating reports</ListItem>
            </ul>
            <p className="mt-4">
              These permissions are used only with your consent and are compliant with Google Play's Data Safety requirements.
            </p>
          </Section>

          <Section id="grievance" title="13. Contact and Grievance Officer">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="text-lg">
                <strong>Grievance Officer:</strong>
                <br />
                <strong>Mr. Aswini Kumar Padhi</strong> <br />
                <span className="text-gray-600">Cloudsat Pvt. Ltd.</span>
              </p>
              <div className="mt-4 space-y-2">
                <ContactInfo label="Address:" value="BMC Panchadeep Market Complex, Unit – 4, Bhubaneswar, Odisha, India" />
                <ContactInfo label="Email:" value="info@cloudsat.in" href="mailto:info@cloudsat.in" />
                <ContactInfo label="Email:" value="auditfilling@gmail.com" href="mailto:auditfilling@gmail.com" />
                <ContactInfo label="Website:" value="www.auditfiling.com" href="https://www.auditfiling.com" />
                <ContactInfo label="Phone:" value="+91 7428600607" href="tel:+917428600607" />
              </div>
            </div>
          </Section>

          <Section id="consent" title="14. Consent">
            <p>
              By using our website, mobile app, or submitting your information through online ads or forms, you consent to the collection and use of your information as described in this Privacy Policy.
            </p>
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
    <div id={id} className="bg-white p-4 transition-all duration-300">
      <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
        {title}
      </h2>
      <div className="text-gray-700 leading-relaxed text-lg space-y-6 mt-4">
        {children}
      </div>
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
    <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-sm">
      <p className="text-gray-800 font-medium text-lg">{children}</p>
    </div>
  );
}

function ContactInfo({ label, value, href }) {
  return (
    <p className="flex flex-col sm:flex-row sm:items-start">
      <span className="font-medium text-gray-600 sm:w-24 sm:flex-shrink-0">{label}</span>
      {href ? (
        <a
          href={href}
          className="text-blue-500 hover:text-blue-600 hover:underline font-medium transition-colors break-all"
        >
          {value}
        </a>
      ) : (
        <span className="font-medium break-all">{value}</span>
      )}
    </p>
  );
}