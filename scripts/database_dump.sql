--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 15.13 (Debian 15.13-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: bookingstatus; Type: TYPE; Schema: public; Owner: admin1
--

CREATE TYPE public.bookingstatus AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED'
);


ALTER TYPE public.bookingstatus OWNER TO admin1;

--
-- Name: paymentstatus; Type: TYPE; Schema: public; Owner: admin1
--

CREATE TYPE public.paymentstatus AS ENUM (
    'PENDING',
    'PAID',
    'REFUNDED',
    'FAILED'
);


ALTER TYPE public.paymentstatus OWNER TO admin1;

--
-- Name: userrole; Type: TYPE; Schema: public; Owner: admin1
--

CREATE TYPE public.userrole AS ENUM (
    'USER',
    'PROVIDER',
    'ADMIN'
);


ALTER TYPE public.userrole OWNER TO admin1;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: admin1
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    user_id integer,
    provider_id integer,
    treatment_price_id integer,
    appointment_date timestamp with time zone,
    status public.bookingstatus,
    special_requests text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.bookings OWNER TO admin1;

--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: admin1
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bookings_id_seq OWNER TO admin1;

--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin1
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: admin1
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    booking_id integer,
    amount double precision,
    currency character varying,
    status public.paymentstatus,
    stripe_payment_intent_id character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.payments OWNER TO admin1;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: admin1
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payments_id_seq OWNER TO admin1;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin1
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: provider_specialties; Type: TABLE; Schema: public; Owner: admin1
--

CREATE TABLE public.provider_specialties (
    provider_id integer NOT NULL,
    specialty_id integer NOT NULL
);


ALTER TABLE public.provider_specialties OWNER TO admin1;

--
-- Name: provider_treatments; Type: TABLE; Schema: public; Owner: admin1
--

CREATE TABLE public.provider_treatments (
    provider_id integer NOT NULL,
    treatment_id integer NOT NULL
);


ALTER TABLE public.provider_treatments OWNER TO admin1;

--
-- Name: providers; Type: TABLE; Schema: public; Owner: admin1
--

CREATE TABLE public.providers (
    id integer NOT NULL,
    user_id integer,
    name character varying,
    description text,
    address character varying,
    city character varying,
    country character varying,
    phone character varying,
    website character varying,
    license_number character varying,
    is_verified boolean,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    average_rating double precision,
    total_reviews integer,
    featured boolean
);


ALTER TABLE public.providers OWNER TO admin1;

--
-- Name: providers_id_seq; Type: SEQUENCE; Schema: public; Owner: admin1
--

CREATE SEQUENCE public.providers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.providers_id_seq OWNER TO admin1;

--
-- Name: providers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin1
--

ALTER SEQUENCE public.providers_id_seq OWNED BY public.providers.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: admin1
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id integer,
    provider_id integer,
    rating integer,
    comment text,
    treatment_received character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    verified_booking boolean,
    site_quality integer,
    transportation integer,
    accommodation integer
);


ALTER TABLE public.reviews OWNER TO admin1;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: admin1
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reviews_id_seq OWNER TO admin1;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin1
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: specialties; Type: TABLE; Schema: public; Owner: admin1
--

CREATE TABLE public.specialties (
    id integer NOT NULL,
    name character varying,
    description text
);


ALTER TABLE public.specialties OWNER TO admin1;

--
-- Name: specialties_id_seq; Type: SEQUENCE; Schema: public; Owner: admin1
--

CREATE SEQUENCE public.specialties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.specialties_id_seq OWNER TO admin1;

--
-- Name: specialties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin1
--

ALTER SEQUENCE public.specialties_id_seq OWNED BY public.specialties.id;


--
-- Name: treatment_prices; Type: TABLE; Schema: public; Owner: admin1
--

CREATE TABLE public.treatment_prices (
    id integer NOT NULL,
    provider_id integer,
    treatment_id integer,
    price double precision,
    currency character varying,
    description text
);


ALTER TABLE public.treatment_prices OWNER TO admin1;

--
-- Name: treatment_prices_id_seq; Type: SEQUENCE; Schema: public; Owner: admin1
--

CREATE SEQUENCE public.treatment_prices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.treatment_prices_id_seq OWNER TO admin1;

--
-- Name: treatment_prices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin1
--

ALTER SEQUENCE public.treatment_prices_id_seq OWNED BY public.treatment_prices.id;


--
-- Name: treatments; Type: TABLE; Schema: public; Owner: admin1
--

CREATE TABLE public.treatments (
    id integer NOT NULL,
    name character varying,
    description text,
    category character varying,
    average_duration character varying,
    recovery_time character varying
);


ALTER TABLE public.treatments OWNER TO admin1;

--
-- Name: treatments_id_seq; Type: SEQUENCE; Schema: public; Owner: admin1
--

CREATE SEQUENCE public.treatments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.treatments_id_seq OWNER TO admin1;

--
-- Name: treatments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin1
--

ALTER SEQUENCE public.treatments_id_seq OWNED BY public.treatments.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: admin1
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying,
    username character varying,
    hashed_password character varying,
    full_name character varying,
    role public.userrole,
    created_at timestamp with time zone DEFAULT now(),
    is_active boolean,
    stripe_customer_id character varying
);


ALTER TABLE public.users OWNER TO admin1;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: admin1
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO admin1;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin1
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: providers id; Type: DEFAULT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.providers ALTER COLUMN id SET DEFAULT nextval('public.providers_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: specialties id; Type: DEFAULT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.specialties ALTER COLUMN id SET DEFAULT nextval('public.specialties_id_seq'::regclass);


--
-- Name: treatment_prices id; Type: DEFAULT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.treatment_prices ALTER COLUMN id SET DEFAULT nextval('public.treatment_prices_id_seq'::regclass);


--
-- Name: treatments id; Type: DEFAULT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.treatments ALTER COLUMN id SET DEFAULT nextval('public.treatments_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: admin1
--

COPY public.bookings (id, user_id, provider_id, treatment_price_id, appointment_date, status, special_requests, created_at, updated_at) FROM stdin;
2	11	6	12	2025-07-18 00:00:00+00	COMPLETED		2025-06-30 12:57:49.393356+00	2025-06-30 12:59:15.832861+00
1	26	6	12	2025-07-09 00:00:00+00	COMPLETED		2025-06-30 12:56:06.883406+00	2025-06-30 12:59:16.810461+00
4	22	5	10	2025-07-28 00:00:00+00	COMPLETED		2025-06-30 13:02:03.004481+00	2025-06-30 13:03:03.769764+00
3	23	5	11	2025-07-30 00:00:00+00	COMPLETED		2025-06-30 13:01:30.48742+00	2025-06-30 13:03:08.02974+00
5	25	9	17	2025-07-18 00:00:00+00	COMPLETED		2025-06-30 13:04:00.701109+00	2025-06-30 13:04:33.651521+00
6	23	5	11	2025-07-10 00:00:00+00	PENDING	No	2025-06-30 13:07:59.876584+00	\N
7	24	2	4	2025-07-17 00:00:00+00	COMPLETED		2025-06-30 13:10:27.440121+00	2025-06-30 13:11:06.790661+00
8	24	13	23	2025-07-18 00:00:00+00	PENDING		2025-06-30 14:11:51.148721+00	\N
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: admin1
--

COPY public.payments (id, booking_id, amount, currency, status, stripe_payment_intent_id, created_at, updated_at) FROM stdin;
1	1	3500	USD	PENDING	pi_3RfhFkR8SHLd1Q5T2rMCuBWg	2025-06-30 12:56:07.200699+00	2025-06-30 12:56:07.973215+00
2	2	3500	USD	PENDING	pi_3RfhHOR8SHLd1Q5T2TLhN3oG	2025-06-30 12:57:49.710524+00	2025-06-30 12:57:50.18875+00
3	3	3700	EUR	PENDING	pi_3RfhKxR8SHLd1Q5T2iSdRidx	2025-06-30 13:01:30.77954+00	2025-06-30 13:01:31.288048+00
4	4	4000	EUR	PENDING	pi_3RfhLTR8SHLd1Q5T0Ll0VMcJ	2025-06-30 13:02:03.235989+00	2025-06-30 13:02:03.742992+00
5	5	1087	USD	PENDING	pi_3RfhNNR8SHLd1Q5T2qgh4luW	2025-06-30 13:04:00.905544+00	2025-06-30 13:04:01.413847+00
6	6	3700	EUR	PENDING	pi_3RfhRER8SHLd1Q5T15s2LrMC	2025-06-30 13:08:00.093427+00	2025-06-30 13:08:00.606057+00
7	7	400	USD	PENDING	pi_3RfhTcR8SHLd1Q5T2OiHfrUp	2025-06-30 13:10:27.661106+00	2025-06-30 13:10:28.018649+00
8	8	2999	EUR	PENDING	pi_3RfiR1R8SHLd1Q5T1UEvAKQX	2025-06-30 14:11:51.3814+00	2025-06-30 14:11:51.880729+00
\.


--
-- Data for Name: provider_specialties; Type: TABLE DATA; Schema: public; Owner: admin1
--

COPY public.provider_specialties (provider_id, specialty_id) FROM stdin;
1	2
1	4
1	7
1	8
2	8
2	9
3	7
3	9
3	10
4	8
4	9
5	1
5	2
5	3
6	1
6	3
6	4
7	8
7	9
8	1
8	2
8	3
8	4
9	2
9	3
10	1
10	3
10	8
11	1
11	2
11	3
12	1
12	5
13	2
13	3
13	4
14	5
14	9
15	1
15	2
16	1
16	2
16	3
16	5
17	1
17	3
18	1
18	3
18	6
19	8
19	9
20	10
\.


--
-- Data for Name: provider_treatments; Type: TABLE DATA; Schema: public; Owner: admin1
--

COPY public.provider_treatments (provider_id, treatment_id) FROM stdin;
1	1
1	2
1	3
2	3
2	4
3	1
3	2
3	3
3	4
4	4
5	2
5	3
5	4
5	5
5	6
6	1
7	5
8	1
8	2
8	3
8	4
9	6
10	7
10	9
11	8
11	9
12	3
12	4
13	1
14	8
15	7
15	9
16	2
16	3
16	4
17	3
17	5
18	4
18	7
18	8
19	9
20	6
\.


--
-- Data for Name: providers; Type: TABLE DATA; Schema: public; Owner: admin1
--

COPY public.providers (id, user_id, name, description, address, city, country, phone, website, license_number, is_verified, created_at, updated_at, average_rating, total_reviews, featured) FROM stdin;
3	3	Delhi Skin & Aesthetics	Highly-rated skin and anti-aging treatment clinic using FDA-approved technologies.	B-72, Greater Kailash I	Delhi	India	+91 11 4567 8910	https://www.delhiskinclinic.in/	IN-DCGI-98234	f	2025-06-29 20:55:17.684682+00	\N	0	0	f
4	4	Mexico MedSpa Group	Network of certified medical spas offering Botox, fillers, and wellness services in Cancun.	Av. Tulum 100	Cancun	Mexico	+52 998 800 2211	https://www.mexicomedspa.com/	MX-COFEPRIS-49203	f	2025-06-29 20:58:59.632172+00	\N	0	0	f
1	1	Istanbul Aesthetic Center	Leading clinic in Istanbul known for its advanced hair transplants and plastic surgery. English-speaking staff and JCI accreditation.	Abide-i Hürriyet Cd. No:290	Istanbul	Turkey	+90 212 314 55 00	www.istanbulaestheticcenter.com	TR-MOH-10001	f	2025-06-29 20:44:08.047777+00	2025-06-29 21:06:54.817251+00	0	0	f
7	7	Phuket Rejuvenation Clinic	Holistic and cosmetic treatments in a luxury tropical setting.	77 Moo 6, Kathu	Phuket	Thailand	+66 76 321 456	https://www.phuketrejuvenation.com/	TH-MOH-29870	f	2025-06-29 21:09:07.702767+00	\N	0	0	f
8	8	Mumbai Aesthetic Surgery Center	Offers a range of aesthetic surgeries and laser treatments using modern equipment.	403 Linking Rd	Mumbai	India	+91 22 4012 9999		+91 22 4012 9999\\	f	2025-06-29 21:11:32.421785+00	\N	0	0	f
10	10	Rio Derma Institute	Focused on dermatological and laser treatments for all skin types.	Av. Atlântica 2320	Rio de Janeiro	Brazil	+55 21 9876 5432	https://www.dermainstitute.com.br/	BR-ANVISA-78203	f	2025-06-29 21:19:12.022996+00	\N	0	0	f
11	12	Ankara Aesthetic Hub	Trusted cosmetic surgery center for facial rejuvenation and breast augmentation.	Tunali Hilmi Cd. No:145	Ankara	Turkey	+90 312 789 0044	https://www.ankaraaesthetic.com/	TR-MOH-10976	f	2025-06-30 12:16:47.31743+00	\N	0	0	f
12	13	Chiang Mai Laser & Skin	Boutique clinic for laser therapy, acne scars, and pigmentation removal.	Nimmanhaemin Rd Soi 7	Chiang Mai	Thailand	+66 53 248 888	https://www.cm-laserskinclinic.com/	TH-MOH-20312	f	2025-06-30 12:20:03.739822+00	\N	0	0	f
13	14	Bangalore Hair Solutions	Hair transplant and PRP specialists with state-of-the-art facilities.	Indiranagar 100 Ft Rd	Bangalore	India	+91 80 6754 1234	https://www.bangalorehairsolutions.com/	IN-DCGI-77895	f	2025-06-30 12:22:55.503002+00	\N	0	0	f
14	15	Tijuana Medical Spa	Affordable MedSpa treatments with U.S. standard procedures and safety.	 Zona Río, Paseo de los Héroes 10538	Tijuana	Mexico	+52 664 204 3333	https://www.tijuanamedspa.com/	MX-COFEPRIS-65021	f	2025-06-30 12:26:47.11344+00	\N	0	0	f
15	16	Belo Horizonte Rejuvenate	Rejuvenation center offering microdermabrasion, Botox, and facial peels	Av. do Contorno 5811	Belo Horizonte	Brazil	+55 31 3350 0021	https://www.bh-rejuvenate.com.br/	BR-ANVISA-34129	f	2025-06-30 12:30:38.724561+00	\N	0	0	f
16	17	Izmir Cosmetic Lounge	Aesthetic services in a luxurious setting offering fillers, laser and peels.	Mimar Sinan Blv. No:77	Izmir	Turkey	+90 232 456 7890	https://www.izmircosmeticlounge.com	TR-MOH-11432	f	2025-06-30 12:33:54.118465+00	\N	0	0	f
17	18	Pattaya Anti-Aging Center	Anti-aging therapies and nutritional guidance for long-term wellness.	400/45 Pattaya 3rd Rd	Pattaya	Thailand	+66 38 720 123	https://www.pattayaantiaging.com/	TH-MOH-33120	f	2025-06-30 12:36:57.531352+00	\N	0	0	f
18	19	Chennai Smile & Skin	Clinic combining cosmetic dentistry and skin care under one roof.\n\n	T. Nagar, Ranganathan St	Chennai	India	+91 44 2223 9988	https://www.chennaismileandskin.in/	IN-DCGI-11290	f	2025-06-30 12:39:37.303061+00	\N	0	0	f
19	20	Guadalajara Aesthetic Experts	Plastic surgery and medspa treatments provided by board-certified professionals.	Av. Vallarta 3262	Guadalajara	Mexico	+52 33 3620 0000	https://www.guadalajara-aesthetic.com/	MX-COFEPRIS-70900	f	2025-06-30 12:42:23.177345+00	\N	0	0	f
20	21	Porto Alegre Body & Beauty	Leading beauty clinic in southern Brazil known for liposuction and body lifts.	Rua dos Andradas 1001	Porto Alegre	Brazil	+55 51 3300 1212	https://www.portobeautyclinic.com.br/	BR-ANVISA-44567	f	2025-06-30 12:44:32.079412+00	\N	0	0	f
6	6	Antalya Hair Experts	Specializing in hair transplant techniques like FUE and DHI with multilingual support.	Lara Cd. No:120	Antalya	Turkey	+90 532 111 0098	https://www.antalyaexpertshair.com/	TR-MOH-10087  7.	f	2025-06-29 21:06:12.956098+00	2025-06-30 13:15:16.528924+00	4	2	f
5	5	São Paulo Plastic Institute	Premier plastic surgery center with highly experienced surgeons and post-op care.	Rua Oscar Freire, 251	São Paulo	Brazil	+55 11 3088 4455	https://www.saopauloplastic.com.br/	BR-ANVISA-123456	f	2025-06-29 21:02:24.30086+00	2025-06-30 13:09:20.492765+00	5	2	f
2	2	Bangkok Beauty Clinic	Modern clinic offering non-invasive facial treatments and cosmetic dermatology in central Bangkok.	88 Sukhumvit Rd	Bangkok	Thailand	+66 2 888 9090	www.bangkokbeautyclinic.co.th	TH-MOH-20348	f	2025-06-29 20:50:57.78116+00	2025-06-30 13:11:55.21937+00	5	1	f
9	9	Cancun Body Contour Clinic	Certified specialists in body sculpting, liposuction, and cellulite treatments.	Blvd. Kukulcán Km 12	Cancun	Mexico	+52 998 123 7890	https://www.cancuncontour.com/	 MX-COFEPRIS-43921	f	2025-06-29 21:16:12.443693+00	2025-06-30 13:12:53.509636+00	3	1	f
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: admin1
--

COPY public.reviews (id, user_id, provider_id, rating, comment, treatment_received, created_at, updated_at, verified_booking, site_quality, transportation, accommodation) FROM stdin;
1	11	6	4	This was a very complete facility. Everything went smoothly.	1	2025-06-30 13:05:46.578223+00	\N	t	4	3	5
2	22	5	5	Service was good and affordable.	2	2025-06-30 13:07:00.612988+00	\N	t	5	4	2
3	23	5	5	Very good offers and a recovery program.	3	2025-06-30 13:09:20.486462+00	\N	t	3	4	2
4	24	2	5	Good experience with the staff.	3	2025-06-30 13:11:55.213244+00	\N	t	3	1	5
5	25	9	3	Facility access could be better as well as the location access. 	6	2025-06-30 13:12:53.504422+00	\N	t	4	1	3
6	26	6	4		1	2025-06-30 13:15:16.523484+00	\N	t	2	4	2
\.


--
-- Data for Name: specialties; Type: TABLE DATA; Schema: public; Owner: admin1
--

COPY public.specialties (id, name, description) FROM stdin;
1	Dermatology	Specializes in skin care and cosmetic dermatological procedures.
2	Plastic Surgery	Focuses on surgical cosmetic enhancements like facelifts and rhinoplasty.
3	Aesthetic Medicine	Non-invasive treatments like Botox, fillers, and laser therapies.
4	Hair Restoration	Treatments for hair loss including hair transplants and PRP therapy.
5	Laser Therapy	Specializes in laser-based procedures for hair removal, skin resurfacing, etc.
6	Cosmetic Dentistry	Aesthetic dental treatments like veneers and teeth whitening.
7	Body Contouring	Non-surgical fat reduction and shaping treatments.
8	Anti-Aging Medicine	Holistic and medical approaches to slow aging.
9	Medical Spa (MedSpa)	Hybrid of medical clinic and spa providing cosmetic treatments.
10	Oculoplastic Surgery	Cosmetic and reconstructive surgery around the eyes.
\.


--
-- Data for Name: treatment_prices; Type: TABLE DATA; Schema: public; Owner: admin1
--

COPY public.treatment_prices (id, provider_id, treatment_id, price, currency, description) FROM stdin;
1	1	1	2500	EUR	Common Price
2	1	2	2000	EUR	Common Price
3	1	3	1500	EUR	Common Price (plus external fees)
4	2	3	400	USD	Common Price
5	2	4	1055	USD	Common Price
6	3	1	1700	EUR	Common Price
7	3	3	300	EUR	Basic Service
8	3	2	4800	EUR	Special Price
9	4	4	3455	EUR	Common Price
10	5	2	4000	EUR	Special Price
11	5	3	3700	EUR	Common Price
12	6	1	3500	USD	Common Price
13	7	5	567	GBP	Common Price
14	8	2	3544	USD	Common Price
15	8	3	3400	EUR	Special Price
16	8	4	2900	USD	Common Price (with extra fee)
17	9	6	1087	USD	Common Price
18	10	7	699	USD	Common Price
19	10	9	999	USD	Special Price
20	11	8	3690	USD	Common Price
21	11	9	344	USD	Special Price
22	12	3	899	GBP	Common Price
23	13	1	2999	EUR	Common Price
24	14	8	3967	USD	Common Price
25	15	7	2800	USD	Common Price
26	15	9	2000	USD	Common Price
27	16	2	4500	USD	Common Price
28	16	2	4870	USD	Common Price (extra facilities)
29	16	3	3456	USD	Common Price
30	16	4	2699	USD	Common Price
31	17	3	3588	GBP	Common Price
32	18	4	2344	USD	Common Price
33	18	7	799	USD	Common Price
34	18	8	499	USD	Common Price
35	19	9	1099	USD	Common Price
36	20	6	1899	USD	Common Price
\.


--
-- Data for Name: treatments; Type: TABLE DATA; Schema: public; Owner: admin1
--

COPY public.treatments (id, name, description, category, average_duration, recovery_time) FROM stdin;
1	Hair Transplant	Surgical technique to move hair follicles from one part of the body to the balding area.	Hair Restoration	4-8 hours	7-10 days
2	Botox Injections	Botulinum toxin injections to reduce wrinkles and fine lines.	Aesthetic Medicine	15-30 minutes	1-2 days
3	Laser Hair Removal	Laser treatment to remove unwanted hair permanently.	Laser Therapy	30-60 minutes	None to 1 day
4	Chemical Peel	Application of a chemical solution to improve and smooth facial skin.	Aesthetic Medicine	30-45 minutes	5-7 days
5	Rhinoplasty	Surgical procedure to alter the shape of the nose.	Plastic Surgery	1-2 hours	1-2 weeks
6	Liposuction	Surgical fat removal from specific body areas.	Body Contouring	1-3 hours	1-2 weeks
7	Dermal Fillers	Injections to fill lines and restore facial volume.	Aesthetic Medicine	30 minutes	1-2 days
8	Teeth Whitening	Cosmetic dental procedure to whiten discolored teeth.	Cosmetic Dentistry	45-60 minutes	None
9	Microdermabrasion	Non-invasive exfoliation treatment to rejuvenate skin.	MedSpa	30-60 minutes	1-2 days
10	Blepharoplasty	Surgical eyelid lift to remove excess skin or fat.	Oculoplastic Surgery	1-2 hours	1-2 weeks
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin1
--

COPY public.users (id, email, username, hashed_password, full_name, role, created_at, is_active, stripe_customer_id) FROM stdin;
1	sinanajafiyellow44@gmail.com	qg44	$2b$12$TUBktR8SsIb8LxySzvqTiuea0xH1zIKnRImoe/6FsXliwrSllQqsG	Goerge	PROVIDER	2025-06-29 20:35:43.196397+00	t	\N
2	sinanajafiyellow45@gmail.com	wg44	$2b$12$1kaYSpzSP7aJriC.VDBDeuZYY4CAchEVjsf3Y7TcAKu5dXFLWGuwu	John Ash	PROVIDER	2025-06-29 20:48:27.587649+00	t	\N
3	sinanajafiyellow46@gmail.com	eg44	$2b$12$k0G/JJE0hp3P7v3fPrgxPeYkI1nnql2Uk0WLXXo4KFRHjaA7KC5eq	John Willoughby	PROVIDER	2025-06-29 20:52:59.147227+00	t	\N
4	sinanajafiyellow47@gmail.com	rg44	$2b$12$i9pSJ0ROJgtWezunctexk.Fk4ZMCQnt0/OfDlTOiRLx5zjEXi4vda	Ham Gut	PROVIDER	2025-06-29 20:56:59.549592+00	t	\N
5	sinanajafiyellow48@gmail.com	tg44	$2b$12$Hj5.GKAfVMwsaWnThiFkAuHM0MhPqBsHmuxLNPX.ogCophlAvm8i2	John Ken	PROVIDER	2025-06-29 21:00:18.159985+00	t	\N
6	sinanajafiyellow49@gmail.com	yg44	$2b$12$M/s7HMV9rY46YXDz3IH1cOwkumGGx4fVRI7tMls19lMpwc3mjXLNm	Gar Plw	PROVIDER	2025-06-29 21:04:15.547802+00	t	\N
7	sinanajafiyellow50@gmail.com	ug44	$2b$12$S4EC2RuIfgxXdY72tQGzbes81yBrnAXfQo5C7F0x9I5ysZpigSDoC	Jack Jackson	PROVIDER	2025-06-29 21:07:31.903397+00	t	\N
8	sinanajafiyellow51@gmail.com	ig44	$2b$12$MbYkZquUOFfjyGdatTlEf.xIK5mzDEvp1ELOnp4z2GC7doK.in3Lu	Jacky Jackson	PROVIDER	2025-06-29 21:10:16.6843+00	t	\N
9	sinanajafiyellow52@gmail.com	og44	$2b$12$h4Y6SR78BR0jQssqa8z6H.1F9eSTrPfK95KEMMb0.XC/2odoWG.xi	John Kenny	PROVIDER	2025-06-29 21:13:22.943239+00	t	\N
10	sinanajafiyellow53@gmail.com	pg44	$2b$12$b2gCI8JNdiBfOxV3qVoARuODfNrV9/ET/aFF6Jbl2ttIjXAmweILu	Pol Yrew	PROVIDER	2025-06-29 21:17:33.637494+00	t	\N
11	yashar.najafi1@stud.th-deg.de	ag44	$2b$12$Y9nx7GKu7CgIGICbpAZvmeBLBEXuPiLajzPf92D5N8poctzZADGwy	John Welly	USER	2025-06-30 12:14:42.615664+00	t	\N
12	yashar.najafi2@stud.th-deg.de	sg44	$2b$12$3ES2CReJ5jVX03Gk3hmEYOZP46D5H734OuO33dxPayUDVUCZT9dA2	Tim Cruise	PROVIDER	2025-06-30 12:15:18.037015+00	t	\N
13	yashar.najafi3@stud.th-deg.de	dg44	$2b$12$EFZlPdZyAoukpHnw9KNSIe0hGJTqW1Hf9OCODhtc5ImCkobMYDDIG	Mol Gru	PROVIDER	2025-06-30 12:18:09.876933+00	t	\N
14	yashar.najafi4@stud.th-deg.de	fg44	$2b$12$VV6HdahuPZGV9RHKgAomgOwv14Bbu12DAP9AhpuLWcEeFg6Bpp6yy	Harry Nelson	PROVIDER	2025-06-30 12:21:02.505711+00	t	\N
15	yashar.najafi6@stud.th-deg.de	gg44	$2b$12$0V5PK8RLF4BC8Si2c9ejyu0HyGNXLV/hqroiN7ByJzAucGOVwNB/i	Bannt Rop	PROVIDER	2025-06-30 12:23:59.936648+00	t	\N
16	yashar.najafi7@stud.th-deg.de	hg44	$2b$12$Ipn0Bhrj53FeL.OkFnb0NOodPvgmxAZnfc68Xwrvi0F91p7o/l0ka	Can Youw	PROVIDER	2025-06-30 12:28:34.226125+00	t	\N
17	yashar.najafi8@stud.th-deg.de	jg44	$2b$12$NwO2.LT0Xr0VfFvVDk50hucQ2ADrQ9sN4STvs/lzAzBzkohx8eFSG	Gam Tare	PROVIDER	2025-06-30 12:32:13.613482+00	t	\N
18	yashar.najafi9@stud.th-deg.de	kg44	$2b$12$AelX8J3MSB6pgkmdZDLL8epn7KvyL7vYf9P51lo8Ccx/zZJd1kji6	Willy Jones	PROVIDER	2025-06-30 12:35:39.489728+00	t	\N
19	yashar.najafi10@stud.th-deg.de	lg44	$2b$12$kG/44is6XkjFWqvZcyqj9OLoVv1XXlQWoY1bsW.GcAwHnMZLqYav6	Fall Towq	PROVIDER	2025-06-30 12:37:49.250499+00	t	\N
20	yashar.najafi11@stud.th-deg.de	zg44	$2b$12$Fby8HNQl6NfTfP6hz9pcDOAxtAmPW8s5sopdJuVqKDm./KLQJdWQy	Dole Dale	PROVIDER	2025-06-30 12:40:53.651753+00	t	\N
21	yashar.najafi12@stud.th-deg.de	xg44	$2b$12$YB7qPt2Ga/.FjPXhrvpL9e096s2ZTvTYRk70RsfopvK08eOOCqrwy	Karl Johnyy	PROVIDER	2025-06-30 12:43:13.536596+00	t	\N
22	yashar.najafi13@stud.th-deg.de	ag55	$2b$12$8N.uD31DngUXpnpe5iR0ZuhZLocaD9fTbKlrGoV6GByOgWWRME/MW	Amy Anderson	USER	2025-06-30 12:45:31.780325+00	t	\N
23	sinanajafiyellow30@gmail.com	ag66	$2b$12$O0F.zdqNgLj5rSi/rjR.LehnQXkvHd0oWUNqJ3pR7Y6xeYhdELfz6	May Ana	USER	2025-06-30 12:46:13.97884+00	t	\N
24	sinanajafiyellow31@gmail.com	ag77	$2b$12$KMQs6Z1Ko419LHvxMDYcP.K7YzE0GYlSNgt3UutFCewTScCBVm/CG	Karl Ham	USER	2025-06-30 12:46:49.193858+00	t	\N
25	sinanajafiyellow32@gmail.com	ag88	$2b$12$ElFt.01o2okOE/cI1av4eu8YsNgfVZ/i2D.PDhUmsizHqntRd7Cy.	Ashly Peters	USER	2025-06-30 12:47:27.486387+00	t	\N
26	sinanajafiyellow33@gmail.com	ag99	$2b$12$YizdxPuLhQRwP48UYD9jKOOyYX5jVG5w5ut18tAThs3y6S.llNqd6	Jimmy Payna	USER	2025-06-30 12:48:06.396471+00	t	\N
\.


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin1
--

SELECT pg_catalog.setval('public.bookings_id_seq', 8, true);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin1
--

SELECT pg_catalog.setval('public.payments_id_seq', 8, true);


--
-- Name: providers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin1
--

SELECT pg_catalog.setval('public.providers_id_seq', 20, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin1
--

SELECT pg_catalog.setval('public.reviews_id_seq', 6, true);


--
-- Name: specialties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin1
--

SELECT pg_catalog.setval('public.specialties_id_seq', 1, false);


--
-- Name: treatment_prices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin1
--

SELECT pg_catalog.setval('public.treatment_prices_id_seq', 36, true);


--
-- Name: treatments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin1
--

SELECT pg_catalog.setval('public.treatments_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin1
--

SELECT pg_catalog.setval('public.users_id_seq', 26, true);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: payments payments_booking_id_key; Type: CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_booking_id_key UNIQUE (booking_id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: provider_specialties provider_specialties_pkey; Type: CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.provider_specialties
    ADD CONSTRAINT provider_specialties_pkey PRIMARY KEY (provider_id, specialty_id);


--
-- Name: provider_treatments provider_treatments_pkey; Type: CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.provider_treatments
    ADD CONSTRAINT provider_treatments_pkey PRIMARY KEY (provider_id, treatment_id);


--
-- Name: providers providers_pkey; Type: CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.providers
    ADD CONSTRAINT providers_pkey PRIMARY KEY (id);


--
-- Name: providers providers_user_id_key; Type: CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.providers
    ADD CONSTRAINT providers_user_id_key UNIQUE (user_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: specialties specialties_pkey; Type: CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.specialties
    ADD CONSTRAINT specialties_pkey PRIMARY KEY (id);


--
-- Name: treatment_prices treatment_prices_pkey; Type: CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.treatment_prices
    ADD CONSTRAINT treatment_prices_pkey PRIMARY KEY (id);


--
-- Name: treatments treatments_pkey; Type: CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.treatments
    ADD CONSTRAINT treatments_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_bookings_id; Type: INDEX; Schema: public; Owner: admin1
--

CREATE INDEX ix_bookings_id ON public.bookings USING btree (id);


--
-- Name: ix_payments_id; Type: INDEX; Schema: public; Owner: admin1
--

CREATE INDEX ix_payments_id ON public.payments USING btree (id);


--
-- Name: ix_providers_country; Type: INDEX; Schema: public; Owner: admin1
--

CREATE INDEX ix_providers_country ON public.providers USING btree (country);


--
-- Name: ix_providers_id; Type: INDEX; Schema: public; Owner: admin1
--

CREATE INDEX ix_providers_id ON public.providers USING btree (id);


--
-- Name: ix_providers_name; Type: INDEX; Schema: public; Owner: admin1
--

CREATE INDEX ix_providers_name ON public.providers USING btree (name);


--
-- Name: ix_reviews_id; Type: INDEX; Schema: public; Owner: admin1
--

CREATE INDEX ix_reviews_id ON public.reviews USING btree (id);


--
-- Name: ix_specialties_id; Type: INDEX; Schema: public; Owner: admin1
--

CREATE INDEX ix_specialties_id ON public.specialties USING btree (id);


--
-- Name: ix_specialties_name; Type: INDEX; Schema: public; Owner: admin1
--

CREATE UNIQUE INDEX ix_specialties_name ON public.specialties USING btree (name);


--
-- Name: ix_treatment_prices_id; Type: INDEX; Schema: public; Owner: admin1
--

CREATE INDEX ix_treatment_prices_id ON public.treatment_prices USING btree (id);


--
-- Name: ix_treatments_category; Type: INDEX; Schema: public; Owner: admin1
--

CREATE INDEX ix_treatments_category ON public.treatments USING btree (category);


--
-- Name: ix_treatments_id; Type: INDEX; Schema: public; Owner: admin1
--

CREATE INDEX ix_treatments_id ON public.treatments USING btree (id);


--
-- Name: ix_treatments_name; Type: INDEX; Schema: public; Owner: admin1
--

CREATE INDEX ix_treatments_name ON public.treatments USING btree (name);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: admin1
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: admin1
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: ix_users_username; Type: INDEX; Schema: public; Owner: admin1
--

CREATE UNIQUE INDEX ix_users_username ON public.users USING btree (username);


--
-- Name: bookings bookings_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.providers(id);


--
-- Name: bookings bookings_treatment_price_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_treatment_price_id_fkey FOREIGN KEY (treatment_price_id) REFERENCES public.treatment_prices(id);


--
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: payments payments_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: provider_specialties provider_specialties_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.provider_specialties
    ADD CONSTRAINT provider_specialties_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.providers(id);


--
-- Name: provider_specialties provider_specialties_specialty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.provider_specialties
    ADD CONSTRAINT provider_specialties_specialty_id_fkey FOREIGN KEY (specialty_id) REFERENCES public.specialties(id);


--
-- Name: provider_treatments provider_treatments_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.provider_treatments
    ADD CONSTRAINT provider_treatments_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.providers(id);


--
-- Name: provider_treatments provider_treatments_treatment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.provider_treatments
    ADD CONSTRAINT provider_treatments_treatment_id_fkey FOREIGN KEY (treatment_id) REFERENCES public.treatments(id);


--
-- Name: providers providers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.providers
    ADD CONSTRAINT providers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: reviews reviews_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.providers(id);


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: treatment_prices treatment_prices_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.treatment_prices
    ADD CONSTRAINT treatment_prices_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.providers(id);


--
-- Name: treatment_prices treatment_prices_treatment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin1
--

ALTER TABLE ONLY public.treatment_prices
    ADD CONSTRAINT treatment_prices_treatment_id_fkey FOREIGN KEY (treatment_id) REFERENCES public.treatments(id);


--
-- PostgreSQL database dump complete
--

