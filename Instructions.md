

Important! – Please follow instructions carefully, to avoid immediate disqualification. Please
check your work and make sure only the necessary files are uploaded to your git repo.

## Overview

Build a small interactive website that visualizes topics from a news article as a 3D word cloud.
● Frontend: Use React Three Fiber (React + Three.js) to render a creative, interactive
word cloud.
● Backend: Use Python + FastAPI to crawl the article, extract text, run topic modeling, and
return the results to the frontend.

Goal: Demonstrate ability to integrate a custom UI with a backend pipeline that does light data
mining and ML/NLP.

## ⸻
## Frontend Requirements
● Must be written in Typescript using React and React Three Fiber (Three.js for
## React).
## ● Include:
○ Input control: A simple text field for entering a URL. Pre-populate with a
few sample article links for convenience.
○ API call: Send the URL to the backend and handle loading/error states.
○ 3D Visualization: Render the returned word cloud/topics in an engaging
way.
● Words can vary in size, color, or position by relevance/frequency.
● Use your artistic freedom—creativity is encouraged (rotation, animation,
interactivity, etc.).
## ⸻
## Backend Requirements
● Must be written in Python using FastAPI.
● Provide clear API endpoints to support the frontend. At minimum:
● POST /analyze – accepts { "url": "<article_url>" } and returns topic/word cloud
data.
● The backend should:
○ Fetch article text from the provided URL.
■ Crawling can be basic (no need to handle every edge case). Show
that you can retrieve and clean meaningful text.
○ Process and analyze text:
■ Perform topic modeling or keyword extraction (e.g., TF-IDF, LDA,
LSA, BERTopic).
■ Produce a list of important words/topics with weights or scores.
● Prepare word cloud data:
■ Return structured data (e.g., JSON array with { word, weight }).






## ⸻
## Running The Project
● Include a minimal README describing setup, libraries used, how to run the
project, and any additional notes you have
● The project must include one setup script in the root directory that:
○ Installs all dependencies for both frontend and backend
○ Starts both servers concurrently
○ No need to handle scripting cases for other operating systems aside from
macOS

## ⸻
## Notes / Flexibility
● Please name your Github repo in this format: 3D-Word-Cloud-{first_name}. For
example, if your name is Alice, the name of your repo is: 3D-Word-Cloud-Alice
● Use any Python libraries you’re comfortable with to complete the task.
● Emphasis is on end-to-end flow: user inputs URL → backend processes text →
frontend visualizes topics.
● Focus on clarity, code organization, and creativity, not on handling every possible
outcome.
● We want to see structured / consistent commit history based on features as you
are developing. We should be able to look at the commit history and see the
order in which you completed the project.