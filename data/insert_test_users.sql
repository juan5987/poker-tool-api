BEGIN;

INSERT INTO "user" ("id", "username", "email", "password", "confirmationCode") VALUES 
(11, 'test1', 'test11@email.fr', '$2b$12$k38Q/3Jz4Z76TJdShmcBD.91F8fn0hZrhXJuXaB5HmsrSmiZl8cVm', 'activated'),
(12, 'test12', 'test12@email.fr', '$2b$12$k38Q/3Jz4Z76TJdShmcBD.91F8fn0hZrhXJuXaB5HmsrSmiZl8cVm', 'activated'),
(13, 'test13', 'test13@email.fr', '$2b$12$k38Q/3Jz4Z76TJdShmcBD.91F8fn0hZrhXJuXaB5HmsrSmiZl8cVm', 'activated'),
(14, 'test14', 'test14@email.fr', '$2b$12$k38Q/3Jz4Z76TJdShmcBD.91F8fn0hZrhXJuXaB5HmsrSmiZl8cVm', 'activated'),
(15, 'test15', 'test15@email.fr', '$2b$12$k38Q/3Jz4Z76TJdShmcBD.91F8fn0hZrhXJuXaB5HmsrSmiZl8cVm', 'activated'),
(16, 'test16', 'test16@email.fr', '$2b$12$k38Q/3Jz4Z76TJdShmcBD.91F8fn0hZrhXJuXaB5HmsrSmiZl8cVm', 'activated'),
(17, 'test17', 'test17@email.fr', '$2b$12$k38Q/3Jz4Z76TJdShmcBD.91F8fn0hZrhXJuXaB5HmsrSmiZl8cVm', 'activated'),
(18, 'test18', 'test18@email.fr', '$2b$12$k38Q/3Jz4Z76TJdShmcBD.91F8fn0hZrhXJuXaB5HmsrSmiZl8cVm', 'activated'),
(19, 'test19', 'test19@email.fr', '$2b$12$k38Q/3Jz4Z76TJdShmcBD.91F8fn0hZrhXJuXaB5HmsrSmiZl8cVm', 'activated'),
(20, 'test20', 'test20@email.fr', '$2b$12$k38Q/3Jz4Z76TJdShmcBD.91F8fn0hZrhXJuXaB5HmsrSmiZl8cVm', 'activated');

COMMIT;