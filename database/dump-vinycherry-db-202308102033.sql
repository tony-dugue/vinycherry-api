--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3 (Debian 15.3-1.pgdg120+1)
-- Dumped by pg_dump version 15.3

-- Started on 2023-08-10 20:33:27 CEST

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
-- TOC entry 216 (class 1259 OID 16411)
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    email text NOT NULL,
    hash text NOT NULL,
    firstname text,
    lastname text
);


--
-- TOC entry 215 (class 1259 OID 16410)
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3362 (class 0 OID 0)
-- Dependencies: 215
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- TOC entry 214 (class 1259 OID 16401)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 3205 (class 2604 OID 16414)
-- Name: User id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- TOC entry 3355 (class 0 OID 16411)
-- Dependencies: 216
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3353 (class 0 OID 16401)
-- Dependencies: 214
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public._prisma_migrations VALUES ('018f75a2-3c7d-4a21-bc1e-d4137f7bd2f8', '847530d3e60fa58485690508d09c7ba43d2be6aa33cba30f0bb1f61dbff6c8e0', '2023-08-10 18:25:51.15786+00', '20230810175853_', NULL, NULL, '2023-08-10 18:25:51.14744+00', 1);


--
-- TOC entry 3363 (class 0 OID 0)
-- Dependencies: 215
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, false);


--
-- TOC entry 3210 (class 2606 OID 16419)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 3208 (class 2606 OID 16409)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


-- Completed on 2023-08-10 20:33:27 CEST

--
-- PostgreSQL database dump complete
--

