# Conversation Path Project

This repo contains 2 JSON files that each represent a "lesson" that Woebot gives to users - labels.json and allornothing.json. Each JSON is keyed by an ID, and each object corresponds to a message set that Woebot sends the user. The conversation starts at the object with the lesson-"start" tag, and proceeds to the next route based on which option the user chooses.

Each response object contains:

- text: What Woebot says to them. If multiple messages, | separates each one.
- replies: The reply buttons that the user sees after the final message in the set (If any).
- payloads: The payload that Facebook sends to us when they click that button.
- routes: The route IDs that the user goes to next. If multiple replies, then | separate the options.
- tag: Equal to "bye" if the route is a final message in the lesson.
- lesson: The name of the lesson.
- stage: Indicates if that message set is considered an "endpoint" - i.e. if the user has gotten that far, they've completed enough of the lesson for Woebot to not pester them about continuing it the next day.

Here are the steps of this project:

1.  Create a function that computes all of the possible conversation paths that a user could go through, based on the available answers. The root route is "labels-start" for labels.json and "allornothing-start" for allornothing.json and the ending leaf routes are any with tag = "bye". The function should take in the lesson JSON and return an array of ids that are the paths.
2.  If you have time: Create a function that takes in a lesson JSON and ID and returns true if the user has reached or gone past an "endpoint" in the conversation. There are some nodes that have "stage" = "endpoint", and they signify that the user has basically completed the necessary parts of the lesson (even if they haven't reached "bye"). That is helpful for us to know if a user has learnt the teachings in a lesson that serves as a prerequisite to other lessons. This function will only be relevant to labels.json, as the other lesson does not have an endpoint.

Guidelines:

The purpose of this project is to see how you write and organize your code. Out of respect for your time, please cap the time you spend on it to 3 hours (less is fine too).
