CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"base_price" numeric(12, 2),
	"is_active" boolean DEFAULT true NOT NULL
);
