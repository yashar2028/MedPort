# MedPort

**MedPort** is a full-stack healthcare marketplace platform that connects patients with cosmetic healthcare providers. Designed for both customers and clinics, MedPort streamlines treatment discovery, booking, and feedback in one seamless experience.

---

## Key Features

### 👩‍⚕️ Provider Discovery
- Browse a list of cosmetic healthcare providers.
- Filter by treatment type, location, and price and other information.
- View detailed profiles including credentials, offers, and contact info.

### 💉 Treatment Listings
- Explore various cosmetic treatments offered across providers.
- View descriptions, expected outcomes, and associated providers.

### 📅 Booking System
- Users can schedule appointments directly with providers.
- Dynamic form to collect treatment and patient info.

### ⭐ Reviews & Ratings
- Patients can leave structured reviews including sub-ratings (e.g., site quality, transportation, accommodation).
- Provider profiles display aggregated scores and individual feedback.
- Via Dynamic collection and patient verification that happens on the provider side, it is ensured that only patients who went through the specifc service fully are allowed leave a review.

### 🧑‍💻 Provider Dashboard
- Manage treatment pricing, profile info, and bookings.

### 🔐 Authentication
- Role-based access for users and providers.

---

## Run (locally with docker):
```bash
docker-compose --env-file .env.prod.example up --build
```

## Run Dev (workflows seperately):
```bash
./scripts/start.sh
```
---

Use the Docker Compose command and make sure --env-file is passed.
Sample .env file is provided for database credentials. Other variables such as SSH key and Stripe privates are stored in Secrets.

[Database pre-load](https://github.com/yashar2028/MedPort/tree/medport_prod/scripts)

[Cloud Deployment Workflow (verified)](https://github.com/yashar2028/MedPort/blob/medport_prod/.github/workflows/deploy_medport_prod.yml)

## Contributers
Backend Development: [Yashar Najafi](https://github.com/yashar2028)

Frontend Development: [Sina Najafi](https://github.com/SinaNajafi1)

Frontend Development: [Youssef Daoud ](https://github.com/MrHowtz)

Business Development : [Sepehr Hajimokhtar](https://github.com/sepehrmokhtar)

Product Management: [Parnian Taji](https://github.com/ParnianTj)
