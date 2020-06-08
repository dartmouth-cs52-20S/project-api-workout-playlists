# Workout Playlists

![](https://i.imgur.com/MJr8KLd.jpg)


### Project Description

We're interested in making it easier and more enjoyable for people to work out. We find ourselves postponing our workouts to find/curate the ideal playlist, and it eats in to time we could be doing something else (like working out)! We made this app to be a convenient way to make workout/user preferenced tailored playlists!

This is the API we made to handle requests for user authentication, playlist creation, and interaction with the Spotify API.

### Sample Screenshots/Mockups

## Architecture


### Code Organization
**Back end API use**
1. User/Auth API
    * Communicates with FE about account/authentication
    * Sends account information to Spotify API

2. Spotify API
    * Takes info from user API to create create playlists based on user preferences
    * (Potentially) takes info from Health API to influence playlist creation based off of workout intensity/duration
    * Sends playlist to FE


### Tools
Spotify API, Authentication API 

## Setup
No setup involved for the APIs on a user end.

### Dev Environment Setup
Getting an API key

## Deployment
The APIs are working in the background so there's no deployment on this side

## Authors

 * Catherine Parnell
 * Grant Dumanian
 * Elizabeth Wilson
 * Jennifer Qian
 * Isaiah Martin
 

## Acknowledgments
