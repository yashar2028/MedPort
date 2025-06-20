const About = () => {
  return (
    <div className="container mt-5 mb-5">
      <h1 className="text-primary mb-4">About MedPort</h1>
      <p className="mb-4 text-gray">
        MedPort is a medical tourism platform that connects patients with trusted healthcare providers across the globe.
        Our mission is to make healthcare more accessible, transparent, and affordable for everyone.
      </p>

      <div className="card mb-4">
        <div className="card-body">
          <h3 className="text-secondary mb-2">Our Vision</h3>
          <p>
            We envision a world where high-quality healthcare is accessible regardless of borders. Through digital innovation and human-centered design, we empower patients to make informed decisions about their health journeys.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 className="text-secondary mb-2">Meet the Team</h3>
          <p>
            MedPort was founded by a team of five passionate developers who believe technology can simplify global healthcare access.
          </p>
          <ul className="mt-3">
            <li>👨‍💻 Sina Najafi</li>
            <li>👩‍💻 Youseef Daoud</li>
            <li>👨‍💻 Yashar Najafi</li>
            <li>👩‍💻 Parnian Taji</li>
            <li>👨‍💻 Sepehr Hajimokhtar</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;