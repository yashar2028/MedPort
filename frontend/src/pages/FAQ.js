const faqs = [
  {
    question: "What is MedPort and how does it work?",
    answer: "MedPort is a trusted intermediary platform connecting patients from Western Europe with top-rated cosmetic surgery providers in countries like Turkey. We help you compare clinics, view verified reviews, and securely book your procedures.",
  },
  {
    question: "Is it safe to travel abroad for cosmetic surgery?",
    answer: "Yes, provided you choose qualified providers. All clinics on MedPort are vetted for their credentials, facility quality, and patient outcomes. We also allow customers to leave detailed reviews, ensuring transparency and accountability.",
  },
  {
    question: "How are providers reviewed and rated?",
    answer: "Our review system allows patients to rate providers based on various analytical criteria such as communication, hygiene, medical outcomes, and aftercare. Only verified patients can leave reviews, making them trustworthy.",
  },
  {
    question: "What procedures can I book through MedPort?",
    answer: "We currently support a wide range of cosmetic procedures including rhinoplasty, liposuction, facelifts, breast augmentation, hair transplants, and more. Each provider lists their specialties on their profile page.",
  },
  {
    question: "How do I compare clinics and doctors?",
    answer: "Use our built-in comparison tool to evaluate providers side-by-side based on price, location, reviews, certifications, and services offered. This helps you make a well-informed decision.",
  },
  {
    question: "Do you offer customer support before, during, and after the procedure?",
    answer: "Absolutely. Our multilingual support team is available to assist you throughout your journey—from initial inquiries to post-procedure follow-ups.",
  },
  {
    question: "Are the reviews on your platform authentic?",
    answer: "Yes. Only users who have booked and completed a procedure through MedPort are eligible to leave reviews. We use verification systems to ensure all reviews reflect real experiences.",
  },
  {
    question: "What happens if something goes wrong with my procedure?",
    answer: "While rare, we understand complications can occur. In such cases, MedPort facilitates communication between you and the clinic to resolve issues. Some clinics offer revision policies or coverage. We advise reading provider terms carefully.",
  },
  {
    question: "How is pricing structured?",
    answer: "Pricing varies by provider and procedure. Clinics list their starting prices transparently, and you can request a full quote after consultation. MedPort does not add hidden fees.",
  },
  {
    question: "Is my personal data secure?",
    answer: "Yes. We take data privacy seriously. Your information is encrypted and shared only with your selected clinic for booking purposes. You can read more in our Privacy Policy.",
  },
];

const FAQ = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-8">Frequently Asked Questions</h1>
      {faqs.map((faq, idx) => (
        <div key={idx} className="mb-6">
          <h2 className="text-xl font-medium text-gray-900 mb-2">{faq.question}</h2>
          <p className="text-gray-700">{faq.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default FAQ;