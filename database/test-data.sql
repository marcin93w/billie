--
-- PostgreSQL database dump
--

-- Dumped from database version 10.1
-- Dumped by pg_dump version 10.1

-- Started on 2018-02-17 19:54:01

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public, pg_catalog;

--
-- TOC entry 2822 (class 0 OID 16393)
-- Dependencies: 197
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES ('1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '1291641364275532', '1291641364275532', 'Marcin', 'test user name', 'male', NULL);
INSERT INTO public.users VALUES ('4f87a560-fe09-11e7-894c-6da7f17cf153', '12916413642755321', '12916413642755321', 'test user', 'test user name', 'male', NULL);
INSERT INTO public.users VALUES ('27903030-fb17-11e7-af4e-e9b9ad710463', '1291641364275537', '1291641364275537', 'Adam', 'Adam user name', 'male', NULL);
INSERT INTO public.users VALUES ('a3667680-fa48-11e7-9139-dff5cf304900', '1291641364275530', '1291641364275530', 'Leszek', 'Leszek user name', 'male', NULL);
INSERT INTO public.users VALUES ('5b837a30-0910-11e8-b161-71014b1c9c3c', '1291641364275531', '1291641364275531', 'test user', 'test user name', 'male', 'https://www.w3schools.com/howto/img_avatar.png');
INSERT INTO public.users VALUES ('960a1510-0910-11e8-b161-71014b1c9c3c', '1291641364275534', '1291641364275534', 'test user', 'test user name', 'male', 'https://www.w3schools.com/howto/img_avatar.png');
INSERT INTO public.users VALUES ('b832bde0-0910-11e8-b161-71014b1c9c3c', '1291641364275535', '1291641364275535', 'test user', 'test user name', 'male', 'https://www.w3schools.com/howto/img_avatar.png');
INSERT INTO public.users VALUES ('d6718250-0910-11e8-b161-71014b1c9c3c', '129164136427', '129164136427', 'test user', 'test user name', 'male', 'https://www.w3schools.com/howto/img_avatar.png');
INSERT INTO public.users VALUES ('6971dc10-1039-11e8-a8a9-3f901eb86e68', '12916413642755', '12916413642755', 'test user', 'test user name', 'male', 'https://www.w3schools.com/howto/img_avatar.png');
INSERT INTO public.users VALUES ('dee5e9f0-1039-11e8-8c1c-7b2e2790e0ed', '129164136427554', '129164136427554', 'test user', 'test user name', 'male', 'https://www.w3schools.com/howto/img_avatar.png');
INSERT INTO public.users VALUES ('6db96b60-135b-11e8-b170-77ca37022048', '1291641364275532a', '1291641364275532a', 'test user', 'test user name', 'male', 'https://www.w3schools.com/howto/img_avatar.png');
INSERT INTO public.users VALUES ('ab25cba0-135c-11e8-9baa-6d8456922d28', '1391641364275532', '1391641364275532', 'test user', 'test user name', 'male', 'https://www.w3schools.com/howto/img_avatar.png');
INSERT INTO public.users VALUES ('f3a4e870-135c-11e8-8861-cd2c4eb56a10', '1391641364275532a', '1391641364275532a', 'test user', 'test user name', 'male', 'https://www.w3schools.com/howto/img_avatar.png');
INSERT INTO public.users VALUES ('44e03cc0-135e-11e8-b1f2-65b935fe1d94', '1491641364275532', '1491641364275532', 'test user', 'test user name', 'male', 'https://www.w3schools.com/howto/img_avatar.png');
INSERT INTO public.users VALUES ('64ae53c0-135e-11e8-85d5-31f56ab963a8', '1491641364275532a', '1491641364275532a', 'test user', 'test user name', 'male', 'https://www.w3schools.com/howto/img_avatar.png');
INSERT INTO public.users VALUES ('bb1f2270-1363-11e8-8c9a-4f2c56fe86cf', '12916413642', '12916413642', 'test user', 'test user name', 'male', 'https://www.w3schools.com/howto/img_avatar.png');


--
-- TOC entry 2825 (class 0 OID 24579)
-- Dependencies: 200
-- Data for Name: debt_balances; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.debt_balances VALUES ('1e7a98a0-fb17-11e7-af4e-e9b9ad710463', 'd6718250-0910-11e8-b161-71014b1c9c3c', '13,00 zł');
INSERT INTO public.debt_balances VALUES ('d6718250-0910-11e8-b161-71014b1c9c3c', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '10,00 zł');
INSERT INTO public.debt_balances VALUES ('1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '6971dc10-1039-11e8-a8a9-3f901eb86e68', '10,00 zł');
INSERT INTO public.debt_balances VALUES ('dee5e9f0-1039-11e8-8c1c-7b2e2790e0ed', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '10,00 zł');
INSERT INTO public.debt_balances VALUES ('1e7a98a0-fb17-11e7-af4e-e9b9ad710463', 'a3667680-fa48-11e7-9139-dff5cf304900', '20,00 zł');
INSERT INTO public.debt_balances VALUES ('1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '6db96b60-135b-11e8-b170-77ca37022048', '60,00 zł');
INSERT INTO public.debt_balances VALUES ('ab25cba0-135c-11e8-9baa-6d8456922d28', 'f3a4e870-135c-11e8-8861-cd2c4eb56a10', '10,00 zł');
INSERT INTO public.debt_balances VALUES ('44e03cc0-135e-11e8-b1f2-65b935fe1d94', '64ae53c0-135e-11e8-85d5-31f56ab963a8', '10,00 zł');


--
-- TOC entry 2824 (class 0 OID 16408)
-- Dependencies: 199
-- Data for Name: debts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.debts VALUES ('d27ad0a0-fb02-11e7-9e70-63bd07f32e65', 'a3667680-fa48-11e7-9139-dff5cf304900', NULL, '1411911565550430', 0, '10,00 zł', '2018-01-16 22:18:39.786+01');
INSERT INTO public.debts VALUES ('08099180-0ac5-11e8-b43e-f5b9a34ff5d3', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', NULL, '1411911565550431a', 0, '10,00 zł', '2018-02-05 23:36:39.448+01');
INSERT INTO public.debts VALUES ('697f2280-1039-11e8-a8a9-3f901eb86e68', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '6971dc10-1039-11e8-a8a9-3f901eb86e68', '1411911565550431a', 0, '10,00 zł', '2018-02-12 22:12:20.392+01');
INSERT INTO public.debts VALUES ('697f2281-1039-11e8-a8a9-3f901eb86e68', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '6971dc10-1039-11e8-a8a9-3f901eb86e68', '1411911565550431a', 0, '12,00 zł', '2018-02-12 22:12:20.392+01');
INSERT INTO public.debts VALUES ('697f2282-1039-11e8-a8a9-3f901eb86e68', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '6971dc10-1039-11e8-a8a9-3f901eb86e68', '1411911565550431a', 1, '22,00 zł', '2018-02-12 22:12:20.392+01');
INSERT INTO public.debts VALUES ('1a300b50-fe04-11e7-b761-e152f0cce7fe', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', NULL, '14119115655504315', 0, '10,00 zł', '2018-01-20 18:05:23.077+01');
INSERT INTO public.debts VALUES ('697f2283-1039-11e8-a8a9-3f901eb86e68', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '6971dc10-1039-11e8-a8a9-3f901eb86e68', '1411911565550431a', 0, '10,00 zł', '2018-02-12 22:12:20.392+01');
INSERT INTO public.debts VALUES ('708ee280-103a-11e8-960c-ebaca4fb02ab', 'dee5e9f0-1039-11e8-8c1c-7b2e2790e0ed', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '1411911565550431a', 0, '10,00 zł', '2018-02-12 22:19:41.735+01');
INSERT INTO public.debts VALUES ('69936ed0-fca6-11e7-b3c8-5bc929eeed1e', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '4f87a560-fe09-11e7-894c-6da7f17cf153', '14119115655504313', 0, '10,00 zł', '2018-01-19 00:22:12.413+01');
INSERT INTO public.debts VALUES ('12354050-fe09-11e7-894c-6da7f17cf153', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '4f87a560-fe09-11e7-894c-6da7f17cf153', '14119115655504313', 0, '10,00 zł', '2018-01-20 18:40:57.173+01');
INSERT INTO public.debts VALUES ('fa809bb0-fe0a-11e7-af34-55432e413be9', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '4f87a560-fe09-11e7-894c-6da7f17cf153', '14119115655504313', 0, '10,00 zł', '2018-01-20 18:54:36.394+01');
INSERT INTO public.debts VALUES ('f98dd970-fe19-11e7-ac8d-816f45956bf1', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '4f87a560-fe09-11e7-894c-6da7f17cf153', '14119115655504313', 0, '10,00 zł', '2018-01-20 20:41:57.255+01');
INSERT INTO public.debts VALUES ('b1215ac0-0910-11e8-b161-71014b1c9c3c', '960a1510-0910-11e8-b161-71014b1c9c3c', 'd6718250-0910-11e8-b161-71014b1c9c3c', '1411911565550412', 0, '10,00 zł', '2018-02-03 19:33:13.068+01');
INSERT INTO public.debts VALUES ('754fc5f0-103a-11e8-960c-ebaca4fb02ab', 'dee5e9f0-1039-11e8-8c1c-7b2e2790e0ed', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '1411911565550431a', 0, '10,00 zł', '2018-02-12 22:19:49.711+01');
INSERT INTO public.debts VALUES ('b25da7f0-103a-11e8-ac49-43b1067da2e7', 'dee5e9f0-1039-11e8-8c1c-7b2e2790e0ed', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '1411911565550431a', 0, '10,00 zł', '2018-02-12 22:21:32.143+01');
INSERT INTO public.debts VALUES ('d1d3daf0-103a-11e8-ac49-43b1067da2e7', 'dee5e9f0-1039-11e8-8c1c-7b2e2790e0ed', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '1411911565550431a', 2, '30,00 zł', '2018-02-12 22:22:24.927+01');
INSERT INTO public.debts VALUES ('d56c9210-103a-11e8-ac49-43b1067da2e7', 'dee5e9f0-1039-11e8-8c1c-7b2e2790e0ed', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '1411911565550431a', 0, '10,00 zł', '2018-02-12 22:22:30.961+01');
INSERT INTO public.debts VALUES ('04847ea0-1045-11e8-84d6-1305793d5ca6', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', 'a3667680-fa48-11e7-9139-dff5cf304900', '1411911565550431', 0, '10,00 zł', '2018-02-12 23:35:24.937+01');
INSERT INTO public.debts VALUES ('562f5310-1045-11e8-84d6-1305793d5ca6', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', 'a3667680-fa48-11e7-9139-dff5cf304900', '1411911565550431', 0, '10,00 zł', '2018-02-12 23:37:41.953+01');
INSERT INTO public.debts VALUES ('6dbdff40-135b-11e8-b170-77ca37022048', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '6db96b60-135b-11e8-b170-77ca37022048', '1411911565550431c', 0, '10,00 zł', '2018-02-16 21:53:23.892+01');
INSERT INTO public.debts VALUES ('6dbf5ed0-135b-11e8-b170-77ca37022048', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '6db96b60-135b-11e8-b170-77ca37022048', '1411911565550431c', 1, '30,00 zł', '2018-02-16 21:53:23.901+01');
INSERT INTO public.debts VALUES ('6dbf85e0-135b-11e8-b170-77ca37022048', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '6db96b60-135b-11e8-b170-77ca37022048', '1411911565550431c', 0, '10,00 zł', '2018-02-16 21:53:23.902+01');
INSERT INTO public.debts VALUES ('6dbfacf0-135b-11e8-b170-77ca37022048', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '6db96b60-135b-11e8-b170-77ca37022048', '1411911565550431c', 0, '10,00 zł', '2018-02-16 21:53:23.903+01');
INSERT INTO public.debts VALUES ('36308ae0-fb17-11e7-af4e-e9b9ad710463', '27903030-fb17-11e7-af4e-e9b9ad710463', 'd6718250-0910-11e8-b161-71014b1c9c3c', '1411911565550431', 0, '10,00 zł', '2018-01-17 00:44:37.006+01');
INSERT INTO public.debts VALUES ('7b4f2d90-fc96-11e7-97c3-15e29f73b1bf', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', 'd6718250-0910-11e8-b161-71014b1c9c3c', '1411911565550431', 0, '10,00 zł', '2018-01-18 22:28:10.216+01');
INSERT INTO public.debts VALUES ('9c3dbaa0-fc94-11e7-9713-4198f706d132', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', 'd6718250-0910-11e8-b161-71014b1c9c3c', '1411911565550431', 0, '10,00 zł', '2018-01-18 22:14:46.474+01');
INSERT INTO public.debts VALUES ('98f79050-fc94-11e7-9713-4198f706d132', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', 'd6718250-0910-11e8-b161-71014b1c9c3c', '1411911565550431', 1, '8,00 zł', '2018-01-18 22:14:40.98+01');
INSERT INTO public.debts VALUES ('9ffd1720-fc95-11e7-913c-dbed6c4e30d5', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', 'd6718250-0910-11e8-b161-71014b1c9c3c', '1411911565550431', 3, '4,00 zł', '2018-01-18 22:22:02.258+01');
INSERT INTO public.debts VALUES ('41ad3b20-fdfb-11e7-96b6-abc6538ff712', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', 'd6718250-0910-11e8-b161-71014b1c9c3c', '1411911565550431', 0, '10,00 zł', '2018-01-20 17:02:03.858+01');
INSERT INTO public.debts VALUES ('dfcb69a0-fdfe-11e7-942f-4b8822a8685c', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', 'd6718250-0910-11e8-b161-71014b1c9c3c', '1411911565550431', 0, '10,00 zł', '2018-01-20 17:27:57.626+01');
INSERT INTO public.debts VALUES ('054c1710-fdff-11e7-942f-4b8822a8685c', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', 'd6718250-0910-11e8-b161-71014b1c9c3c', '1411911565550431', 0, '10,00 zł', '2018-01-20 17:29:00.545+01');
INSERT INTO public.debts VALUES ('1fae64a0-fdff-11e7-85d8-3bc5d51634b1', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', 'd6718250-0910-11e8-b161-71014b1c9c3c', '1411911565550431', 0, '10,00 zł', '2018-01-20 17:29:44.809+01');
INSERT INTO public.debts VALUES ('38d488b0-fdff-11e7-85d8-3bc5d51634b1', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', 'd6718250-0910-11e8-b161-71014b1c9c3c', '1411911565550431', 0, '10,00 zł', '2018-01-20 17:30:27.003+01');
INSERT INTO public.debts VALUES ('02b48a00-fe04-11e7-b761-e152f0cce7fe', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', 'd6718250-0910-11e8-b161-71014b1c9c3c', '1411911565550431', 0, '10,00 zł', '2018-01-20 18:04:43.68+01');
INSERT INTO public.debts VALUES ('256ded50-08c9-11e8-b343-f76be21cb6dd', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', 'd6718250-0910-11e8-b161-71014b1c9c3c', '1411911565550431', 3, '76,00 zł', '2018-02-03 11:01:04.421+01');
INSERT INTO public.debts VALUES ('75c7ece0-08cb-11e8-aee4-cfb7529a0df4', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', 'd6718250-0910-11e8-b161-71014b1c9c3c', '1411911565550431', 2, '152,00 zł', '2018-02-03 11:17:38.221+01');
INSERT INTO public.debts VALUES ('69999640-0910-11e8-b161-71014b1c9c3c', '5b837a30-0910-11e8-b161-71014b1c9c3c', 'd6718250-0910-11e8-b161-71014b1c9c3c', '1411911565550431', 0, '10,00 zł', '2018-02-03 19:31:13.06+01');
INSERT INTO public.debts VALUES ('0ac273a0-098b-11e8-a075-832bc1b8598b', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', 'a3667680-fa48-11e7-9139-dff5cf304900', '1411911565550431', 0, '10,00 zł', '2018-02-04 10:09:02.042+01');
INSERT INTO public.debts VALUES ('aedb4570-098b-11e8-a075-832bc1b8598b', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', 'a3667680-fa48-11e7-9139-dff5cf304900', '1411911565550431', 1, '40,00 zł', '2018-02-04 10:13:37.351+01');
INSERT INTO public.debts VALUES ('748c3450-0996-11e8-a075-832bc1b8598b', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', 'a3667680-fa48-11e7-9139-dff5cf304900', '1411911565550431', 0, '10,00 zł', '2018-02-04 11:30:43.989+01');
INSERT INTO public.debts VALUES ('b18882f0-09be-11e8-9a9d-7d5c52e670a3', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', 'a3667680-fa48-11e7-9139-dff5cf304900', '1411911565550431', 0, '40,00 zł', '2018-02-04 16:18:46.174+01');
INSERT INTO public.debts VALUES ('faccbd20-09c1-11e8-9a9d-7d5c52e670a3', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', NULL, '1411911565550431a', 0, '10,00 zł', '2018-02-04 16:42:17.586+01');
INSERT INTO public.debts VALUES ('68ff5960-09d1-11e8-802b-23abed752e24', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', NULL, '1411911565550431a', 0, '10,00 zł', '2018-02-04 18:32:44.917+01');
INSERT INTO public.debts VALUES ('6dbe2650-135b-11e8-b170-77ca37022048', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '6db96b60-135b-11e8-b170-77ca37022048', '1411911565550431c', 1, '20,00 zł', '2018-02-16 21:53:23.893+01');
INSERT INTO public.debts VALUES ('6dbe4d60-135b-11e8-b170-77ca37022048', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '6db96b60-135b-11e8-b170-77ca37022048', '1411911565550431c', 0, '10,00 zł', '2018-02-16 21:53:23.894+01');
INSERT INTO public.debts VALUES ('6dbe4d61-135b-11e8-b170-77ca37022048', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '6db96b60-135b-11e8-b170-77ca37022048', '1411911565550431c', 0, '10,00 zł', '2018-02-16 21:53:23.894+01');
INSERT INTO public.debts VALUES ('6dbe9b80-135b-11e8-b170-77ca37022048', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '6db96b60-135b-11e8-b170-77ca37022048', '1411911565550431c', 0, '10,00 zł', '2018-02-16 21:53:23.896+01');
INSERT INTO public.debts VALUES ('6dbec290-135b-11e8-b170-77ca37022048', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '6db96b60-135b-11e8-b170-77ca37022048', '1411911565550431c', 0, '10,00 zł', '2018-02-16 21:53:23.897+01');
INSERT INTO public.debts VALUES ('6dbe7470-135b-11e8-b170-77ca37022048', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '6db96b60-135b-11e8-b170-77ca37022048', '1411911565550431c', 0, '10,00 zł', '2018-02-16 21:53:23.895+01');
INSERT INTO public.debts VALUES ('6dbee9a0-135b-11e8-b170-77ca37022048', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '6db96b60-135b-11e8-b170-77ca37022048', '1411911565550431c', 0, '10,00 zł', '2018-02-16 21:53:23.898+01');
INSERT INTO public.debts VALUES ('6dbe9b81-135b-11e8-b170-77ca37022048', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '6db96b60-135b-11e8-b170-77ca37022048', '1411911565550431c', 0, '10,00 zł', '2018-02-16 21:53:23.896+01');
INSERT INTO public.debts VALUES ('6dbf37c0-135b-11e8-b170-77ca37022048', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '6db96b60-135b-11e8-b170-77ca37022048', '1411911565550431c', 0, '10,00 zł', '2018-02-16 21:53:23.9+01');
INSERT INTO public.debts VALUES ('f3a7cea0-135c-11e8-8861-cd2c4eb56a10', 'ab25cba0-135c-11e8-9baa-6d8456922d28', 'f3a4e870-135c-11e8-8861-cd2c4eb56a10', '1411911565550431d', 0, '10,00 zł', '2018-02-16 22:04:18.058+01');
INSERT INTO public.debts VALUES ('64b139f0-135e-11e8-85d5-31f56ab963a8', '44e03cc0-135e-11e8-b1f2-65b935fe1d94', '64ae53c0-135e-11e8-85d5-31f56ab963a8', '1411911565550431e', 0, '10,00 zł', '2018-02-16 22:13:45.037+01');


--
-- TOC entry 2826 (class 0 OID 24600)
-- Dependencies: 201
-- Data for Name: pending_debts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.pending_debts VALUES ('c8071670-103c-11e8-86ac-0bd5581df008', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', '1411911565550431b', '10,00 zł', '2018-02-12 22:36:27.479+01', 0);


--
-- TOC entry 2823 (class 0 OID 16405)
-- Dependencies: 198
-- Data for Name: user_threads; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_threads VALUES ('1411911565550431', 'a3667680-fa48-11e7-9139-dff5cf304900', false);
INSERT INTO public.user_threads VALUES ('1411911565550431', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', false);
INSERT INTO public.user_threads VALUES ('4', '27903030-fb17-11e7-af4e-e9b9ad710463', false);
INSERT INTO public.user_threads VALUES ('14119115655504314', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', false);
INSERT INTO public.user_threads VALUES ('14119115655504313', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', false);
INSERT INTO public.user_threads VALUES ('14119115655504315', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', false);
INSERT INTO public.user_threads VALUES ('14119115655504313', '4f87a560-fe09-11e7-894c-6da7f17cf153', false);
INSERT INTO public.user_threads VALUES ('1411911565550431', '5b837a30-0910-11e8-b161-71014b1c9c3c', false);
INSERT INTO public.user_threads VALUES ('1411911565550431', '960a1510-0910-11e8-b161-71014b1c9c3c', false);
INSERT INTO public.user_threads VALUES ('1411911565550412', '960a1510-0910-11e8-b161-71014b1c9c3c', false);
INSERT INTO public.user_threads VALUES ('1411911565550412', 'b832bde0-0910-11e8-b161-71014b1c9c3c', false);
INSERT INTO public.user_threads VALUES ('1411911565550412', 'd6718250-0910-11e8-b161-71014b1c9c3c', false);
INSERT INTO public.user_threads VALUES ('1411911565550431', 'd6718250-0910-11e8-b161-71014b1c9c3c', false);
INSERT INTO public.user_threads VALUES ('1411911565550431a', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', false);
INSERT INTO public.user_threads VALUES ('1411911565550431a', '6971dc10-1039-11e8-a8a9-3f901eb86e68', false);
INSERT INTO public.user_threads VALUES ('1411911565550431a', 'dee5e9f0-1039-11e8-8c1c-7b2e2790e0ed', false);
INSERT INTO public.user_threads VALUES ('1411911565550431b', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', false);
INSERT INTO public.user_threads VALUES ('1411911565550431c', '1e7a98a0-fb17-11e7-af4e-e9b9ad710463', false);
INSERT INTO public.user_threads VALUES ('1411911565550431c', '6db96b60-135b-11e8-b170-77ca37022048', false);
INSERT INTO public.user_threads VALUES ('1411911565550431d', 'ab25cba0-135c-11e8-9baa-6d8456922d28', false);
INSERT INTO public.user_threads VALUES ('1411911565550431d', 'f3a4e870-135c-11e8-8861-cd2c4eb56a10', false);
INSERT INTO public.user_threads VALUES ('1411911565550431e', '44e03cc0-135e-11e8-b1f2-65b935fe1d94', false);
INSERT INTO public.user_threads VALUES ('1411911565550431f', '44e03cc0-135e-11e8-b1f2-65b935fe1d94', false);
INSERT INTO public.user_threads VALUES ('1411911565550431e', '64ae53c0-135e-11e8-85d5-31f56ab963a8', false);


-- Completed on 2018-02-17 19:54:02

--
-- PostgreSQL database dump complete
--
