## Electronic Voting Machine

### The challenge and specification sent by the professor:

✅ = Done

## FN00. Main Screen Prototype ✅
---
1. Create an electronic voting machine screen. This screen should contain a field for entering the candidate's voter number and a field to display the candidate's name. The screen should also display the candidate's photo. If the voter doesn't remember the candidate's number, they can select the candidate's number from a list. The machine should have "Confirm," "Cancel," "Blank" buttons. 


## FN01. Initial Load of Candidates and Electronic Voting Machine Settings ✅
---
1. Create a Node project with Express to map routes for our election system. 

2. Create a `config.csv` file on the server/backend with the following format: 
   (electionType, candidateNumber, candidateName, photoUrl) 

   Example content for the CSV file:

~~~
    a,10,felisberto,img/foto.jpg
    a,11,alberto,img/foto2.jpg
    a,12,alberto,img/foto2.jpg
~~~

3. In the backend, create an endpoint/route (`[get]/cargainicial`) to provide data from the `config.csv` file. This data should be provided in the response body in an array format. 

4. In the frontend (voting machine), implement a function to request "configuration"/initial load data. Call the function when loading the voting machine (when turning on the voting machine) — this will return an array. Use the received data to load/configure the voting machine:
- If the position [0,0] of the config array contains "a," then hide the RG field on the screen.
- When the user enters a candidate number, read positions 1, 2, 3, and load them into the fields displayed on the screen. 


## FN02. Vote Registration ✅
---
1. Create a new endpoint/route (`[POST]/voto`) to register/save votes. This endpoint should receive form data in the request body. Each new vote should be recorded in a file named `votacao.csv` with the following format: 
(RG, candidateNumber, voteTimestamp)

Example content for the CSV file:

~~~
4072676,12,202109022123219999
4072676,11,202109022123219999

// Anonymous vote, leave RG empty:
,11,202109022123219999
,11,202109022123219999
~~~


If the vote is successfully registered/saved, respond with the following JSON:
~~~
{
   "Status": "200",
   "mensagem": "Vote Registered Successfully"
}
~~~

If there is an error while registering the vote, respond with the following JSON:

~~~
{
   "Status": "500",
   "mensagem": "Error registering vote, contact the system administrator"
}
~~~

In the frontend, implement a function that makes requests to the new endpoint /voto.
    Call the function with the voting data for each new vote.
Display the message returned by the endpoint on the screen.
    - If the status is 200, display the message for 2 seconds.
    - If the status is 500, display the message indefinitely and highlight it (e.g., in red).

Disable the buttons and fields on the screen during the time the message is being displayed.

## FN03. Vote Counting ✅
---

Create a new endpoint/route ([get]/apuracao) to return the vote count.

Read the votacao.csv file and count the number of votes for each candidate, blank votes, and null votes.
At the end of the counting, return an array in the response with the following format:

~~~
[[candidateNumber, voteCount, candidateName, candidatePhotoUrl]]
~~~

where candidateNumber can take the candidate's number or the terms ("Blanks" or "Nulls").
Note: The array should be sorted in descending order by the vote count.
Create a new frontend project to present the vote count.

The layout/design of this HTML page can be freely defined by the developer.




