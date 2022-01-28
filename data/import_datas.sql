BEGIN;

INSERT INTO "user" ("id", "username", "email", "password", "confirmationCode") VALUES
(1, 'test', 'test@email.fr', '$2b$12$k38Q/3Jz4Z76TJdShmcBD.91F8fn0hZrhXJuXaB5HmsrSmiZl8cVm', 'activated');

INSERT INTO "tournament" ("id", "name", "date", "location", "nb_players", "speed", "starting_stack", "buy_in", "status", "small_blind", "rebuy", "chips_user", "comments", "user_id") VALUES
(1, 'Tournoi 1', '2021-06-13T11:00:11.832Z', 'Chez Yann', 6, 20, 1500, 0, 'terminé', 10, '1H00', false, '', 1);

INSERT INTO "structure" ("id", "stage", "small_blind", "big_blind", "tournament_id") VALUES
(1, 1, 10, 20, 1),
(2, 2, 20, 40, 1),
(3, 3, 40, 80, 1),
(4, 4, 80, 160, 1),
(5, 5, 160, 320, 1),
(6, 6, 320, 640, 1),
(7, 7, 640, 1280, 1),
(8, 8, 1280, 2560, 1),
(9, 9, 2560, 5120, 1),
(10, 1, 10, 20, 2),
(11, 2, 20, 40, 2),
(12, 3, 40, 80, 2),
(13, 4, 80, 160, 2),
(14, 5, 160, 320, 2),
(15, 6, 320, 640, 2),
(16, 7, 640, 1280, 2),
(17, 8, 1280, 2560, 2),
(18, 9, 2560, 5120, 2);

INSERT INTO "chip" ("id", "quantity", "color", "value", "user_id") VALUES
(6, 50, '#dddddd', 10, 1),
(7, 50, '#00b0ff', 20, 1),
(8, 50, '#789f30', 50, 1),
(9, 50, '#cec56c', 100, 1),
(10, 50, '#212121', 1000, 1);

INSERT INTO "cashprice" ("id", "position", "amount", "tournament_id") VALUES
(1, 1, 100, 1),
(2, 2, 70, 1),
(3, 3, 20, 1),
(4, 1, 100, 2),
(5, 2, 70, 2),
(6, 1, 70, 3),
(7, 2, 20, 3),
(8, 1, 100, 5),
(9, 2, 70, 5),
(10, 3, 20, 5),
(11, 1, 200, 6),
(12, 2, 100, 6),
(13, 3, 50, 6),
(14, 1, 200, 8),
(15, 2, 150, 8),
(16, 1, 100, 8),
(17, 2, 70, 8),
(18, 3, 20, 8);

-- Mise à jour des id
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));
SELECT setval('structure_id_seq', (SELECT MAX(id) from "structure"));
SELECT setval('tournament_id_seq', (SELECT MAX(id) from "tournament"));
SELECT setval('chip_id_seq', (SELECT MAX(id) from "chip"));
-- SELECT setval('distribution_id_seq', (SELECT MAX(id) from "distribution"));
SELECT setval('cashprice_id_seq', (SELECT MAX(id) from "cashprice"));

COMMIT