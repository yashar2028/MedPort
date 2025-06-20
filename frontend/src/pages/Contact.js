const Contact = () => {
  return (
    <div className="container mt-5 mb-5">
      <h1 className="text-primary mb-4">Contact Us</h1>
      <p className="mb-4 text-gray">
        Have questions or need help? We'd love to hear from you. Fill out the form below and our team will get back to you shortly.
      </p>
      <div className="card">
        <div className="card-body">
          <form>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" placeholder="Your full name" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-control" rows="5" placeholder="Write your message here..." required></textarea>
            </div>
            <button type="submit" className="btn btn-primary mt-3">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;