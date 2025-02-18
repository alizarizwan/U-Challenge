create database uchallenge;

use uchallenge;

CREATE TABLE players (
    player_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    university_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE universities (
    university_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    total_players INT DEFAULT 0,
    total_score INT DEFAULT 0
);

CREATE TABLE games (
    game_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE player_scores (
    player_score_id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    game_id INT NOT NULL,
    score INT DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (game_id) REFERENCES games(game_id)
);

INSERT INTO universities (name) VALUES
('Ontario Tech University'),
('University of Toronto'),
('University of Guelph'),
('Algoma University'),
('Lakehead University'),
('University of Waterloo'),
('Laurentian University'),
('Queen\'s University'),
('Trent University'),
('York University'),
('University of Windsor'),
('Western University'),
('Wilfrid Laurier University'),
('Toronto Metropolitan University'),
('University of Ottawa'),
('OCAD University'),
('McMaster University'),
('Nipissing University'),
('Brock University'),
('Carleton University'),
('Other');


INSERT INTO games (name) VALUES
('Pop-Culture Trivia'),
('Sports Trivia'),
('STEM Trivia'),
('General Knowledge'),
('History Trivia'),
('Snake'),
('Tic-Tac-Toe'),
('Hangman'),
('Ping-Pong'),
('Space Invaders'),
('Cookie Clicker'),
('Black-Jack'),
('Roulette'),
('Higher or Lower');

CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    feedback_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);