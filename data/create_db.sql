BEGIN;

-- TABLES SUPPRESSION
DROP TABLE IF EXISTS 
"user",
"structure",
"tournament",
"chip",
"distribution",
"tounament_has_structure",
"structure_default",
"cashprice";

CREATE TABLE IF NOT EXISTS "user" (
    --"id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id" serial PRIMARY KEY,
    "username" VARCHAR(128) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "confirmationCode" TEXT,
    "forgotPasswordCode" TEXT,
    "passwordCanBeModified" BOOLEAN,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TEXT
);

CREATE TABLE IF NOT EXISTS "tournament" (
    --"id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id" serial PRIMARY KEY,
    "name" VARCHAR(128) NOT NULL,
    "date" DATE NOT NULL,
    "location" TEXT NOT NULL,
    "nb_players" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "starting_stack" INTEGER NOT NULL,
    "buy_in" INTEGER NOT NULL,
    "status" VARCHAR(128) NOT NULL,
    "small_blind" INTEGER NOT NULL,
    "chips_user" BOOLEAN NOT NULL DEFAULT FALSE,
    "rebuy" TEXT,
    "comments" TEXT,
    "user_id" INTEGER NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TEXT
);

CREATE TABLE IF NOT EXISTS "structure" (
    --"id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id" serial PRIMARY KEY,
    "stage" INTEGER NOT NULL,
    "small_blind" INTEGER NOT NULL,
    "big_blind" INTEGER NOT NULL,
    "tournament_id" INTEGER NOT NULL REFERENCES "tournament"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "chip" (
    --"id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id" serial PRIMARY KEY,
    "quantity" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "distribution" (
    --"id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id" serial PRIMARY KEY,
    "quantity" INTEGER NOT NULL,
    "color" VARCHAR(7) NOT NULL,
    "value" INTEGER NOT NULL,
    "tournament_id" INTEGER NOT NULL REFERENCES "tournament"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "cashprice" (
    --"id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id" serial PRIMARY KEY,
    "position" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "tournament_id" INTEGER NOT NULL REFERENCES "tournament"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

COMMIT;