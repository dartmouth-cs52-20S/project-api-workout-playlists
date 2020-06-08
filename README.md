# Workout Playlists

![](https://i.imgur.com/MJr8KLd.jpg)


### Project Description

We're interested in making it easier and more enjoyable for people to work out. We find ourselves postponing our workouts to find/curate the ideal playlist, and it eats in to time we could be doing something else (like working out)! We made this app to be a convenient way to make workout/user preferenced tailored playlists!

This is the API we made to handle requests for user authentication, playlist creation, and interaction with the Spotify API.

## Architecture

### Code Organization
1. Auth Controller
    * Communicates with FE about account/authentication
    * Sends account information to Spotify API
2. User Controller
    * Stores user information in our database, including preferences and playlists
3. Playlist Controller
    * Communicates with Spotify to fetch songs for playlists
    * Handles storing playlists and all other auxiliary functions

### Tools
Spotify API

## Setup
No setup involved for the APIs on a user end.

### Dev Environment Setup
Client id, client secret obtained from Spotify, kept in env.

## Deployment
Deployed to Heroku.

## Authors

 * Catherine Parnell
 * Grant Dumanian
 * Elizabeth Wilson
 * Jennifer Qian
 * Isaiah Martin

## Acknowledgments
Spotify, our amAZING TA's Emma & Shosh, and last but not least, our incredible prof Tim Tregubov
