--
-- PostgreSQL database dump
--

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

CREATE TABLE public.users (
	"_id" serial NOT NULL,
	"username" varchar NOT NULL,
	"password" varchar NOT NULL
);

CREATE TABLE public.sessions (
	"_id" serial NOT NULL,
	"ssid" varchar NOT NULL,
  "user_id" integer NOT NULL
);

CREATE TABLE public.board (
	"_id" serial NOT NULL,
	"title" varchar NOT NULL
);

CREATE TABLE  public.board_to_user (
	"_id" serial NOT NULL,
  "board_id" integer NOT NULL,
  "user_id" integer NOT NULL
);

CREATE TABLE  public.story (
	"_id" serial NOT NULL,
  "text" varchar NOT NULL,
  "completed" boolean NOT NULL
);

CREATE TABLE  public.story_to_board (
	"_id" serial NOT NULL,
  "story_id" integer NOT NULL,
  "board_id" integer NOT NULL
);

CREATE TABLE  public.task (
	"_id" serial NOT NULL,
  "description" varchar NOT NULL,
  "status" varchar NOT NULL,
  "priority" integer NOT NULL
);

CREATE TABLE  public.task_to_story (
	"_id" serial NOT NULL,
  "task_id" integer NOT NULL,
  "story_id" integer NOT NULL
);

