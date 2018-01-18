# Dota2-Behaviour



Dota2-Behaviour is a webapp created in ReactJS that aims to help players reflect on their in game behaviour through chat logs.


# Features!

  - Login with Steam
  - Shows user's the most negative & positive message they have sent

# What I used to create this:

Here are the list of programming languages, APIs and other tools I used:

* [NodeJS] - Backend Server
* [OpenDota API] - For retrieving the user's matches and chat logs for each match
* [ReactJS] - Frontend framework
* [Google Natural Language API] - Sentiment analysis for the user's messages
* [OAuth 2.0] - Retreiving user IDs from Valve servers


# Limitations

* OpenDota API is only able to retrieve messages sent to the game's All Chat. (In my experience most players make rude comments towards their teammates on Team Chat).

* Google Natural Language API does not understand the game's slang that well. 

# TODO
* Update user UI
* Include more statistics (average sentiment of messages in games won vs lost, difference when playing different heroes, difference when user's are playing alone vs with friends, etc...)
* Deploy onto server
