import React, { useState } from 'react';

const Section = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: '1rem' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: '#f0f0f0',
          border: 'none',
          padding: '0.75rem 1rem',
          width: '100%',
          textAlign: 'left',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          cursor: 'pointer',
          borderRadius: '4px'
        }}
      >
        {open ? '▼' : '▶'} {title}
      </button>
      {open && <div style={{ padding: '0.5rem 1rem', backgroundColor: '#fafafa' }}>{children}</div>}
    </div>
  );
};

export default function Privacy() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Privacy Policy</h1>
      <p><strong>Last updated:</strong> June 09, 2025</p>

      <Section title="Introduction">
        <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
        <p>We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.</p>
      </Section>

      <Section title="Interpretation and Definitions">
        <h4>Interpretation</h4>
        <p>Words with capitalized initials have specific meanings defined below.</p>
        <h4>Definitions</h4>
        <ul>
          <li><strong>Account</strong>: Unique login for accessing the Service.</li>
          <li><strong>Affiliate</strong>: An entity under common control with the Company.</li>
          <li><strong>Company</strong>: Refers to MedPort.</li>
          <li><strong>Cookies</strong>: Small files used for tracking and remembering user preferences.</li>
          <li><strong>Country</strong>: Bayern, Germany</li>
          <li><strong>Device</strong>: Any internet-enabled tool like a phone or tablet.</li>
          <li><strong>Personal Data</strong>: Information that can identify a person.</li>
          <li><strong>Service</strong>: The MedPort website.</li>
          <li><strong>Service Provider</strong>: Third-parties helping operate the Service.</li>
          <li><strong>Usage Data</strong>: Data collected from usage, like page visits or device type.</li>
          <li><strong>You</strong>: The person using the Service.</li>
        </ul>
      </Section>

      <Section title="Types of Data Collected">
        <h4>Personal Data</h4>
        <ul>
          <li>Email address</li>
          <li>First and last name</li>
          <li>Usage Data</li>
        </ul>
        <h4>Usage Data</h4>
        <p>This includes IP address, browser type, time spent on pages, and mobile identifiers if accessed via mobile.</p>
      </Section>

      <Section title="Tracking Technologies and Cookies">
        <p>We use cookies, tags, and beacons for analytics and Service improvement.</p>
        <ul>
          <li><strong>Essential Cookies</strong> – Needed for core functionality.</li>
          <li><strong>Acceptance Cookies</strong> – Track cookie preferences.</li>
          <li><strong>Functionality Cookies</strong> – Save user preferences.</li>
        </ul>
        <p>You can configure your browser to refuse Cookies. However, some features may be unavailable without them.</p>
      </Section>

      <Section title="Use of Your Personal Data">
        <ul>
          <li>To provide and improve the Service</li>
          <li>To manage your account and contracts</li>
          <li>To contact you with updates or marketing</li>
          <li>To handle requests or legal requirements</li>
          <li>To evaluate mergers or transfers</li>
        </ul>
      </Section>

      <Section title="Sharing Your Personal Data">
        <ul>
          <li>With Service Providers</li>
          <li>With affiliates and business partners</li>
          <li>With other users (in public areas)</li>
          <li>With your consent</li>
        </ul>
      </Section>

      <Section title="Retention and Transfer of Data">
        <p>We retain your data as long as necessary for legal, operational, and analytical purposes. Data may be processed in other countries, but we ensure protection.</p>
      </Section>

      <Section title="Delete Your Personal Data">
        <p>You can delete your personal data via account settings or by contacting us. Some data may be retained due to legal obligations.</p>
      </Section>

      <Section title="Disclosure of Your Data">
        <ul>
          <li>In business transfers</li>
          <li>To comply with law enforcement</li>
          <li>To protect the Company or public safety</li>
        </ul>
      </Section>

      <Section title="Data Security">
        <p>We implement security practices but cannot guarantee absolute data security online.</p>
      </Section>

      <Section title="Children’s Privacy">
        <p>We don’t knowingly collect data from children under 13. If discovered, such data will be removed promptly.</p>
      </Section>

      <Section title="Links to Other Websites">
        <p>We may link to third-party sites. We are not responsible for their privacy policies or content.</p>
      </Section>

      <Section title="Changes to This Policy">
        <p>We may update this Privacy Policy. You’ll be notified of changes through email or a website notice.</p>
      </Section>
    </div>
  );
}