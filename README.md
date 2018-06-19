# Reminder Chrome Extension
Developed by Quentin Madruga

## Purpose:
A solo project meant to provide a better understanding of the Chrome Javascript api and its interaction with Chrome extensions and the chrome browser.

## Functionality:
Currently, the extension allows the user to create reminders that get stored locally with the chrome browser. The extension allows the user to delete any created reminder. User's can also set a time for the reminder. After that time has past, the reminder will be sent to a different list of all other expired reminders. It will remain there until dismissed by the user. Every minute the browser will check if a reminder has expired. If it has, the current page the user is on will be alerted of that reminder. This is done whether or not the popup menu is open.

## Resources:
	Chrome Javascript API:
		https://developer.chrome.com/apps/api_index

		Contains the documentation in order to use the chrome api

	The Coding Train YouTube Channel
		https://www.youtube.com/channel/UCvjgXvBlbQiydffZU7m1_aw
		https://www.youtube.com/playlist?list=PLRqwX-V7Uu6bL9VOMT65ahNEri9uqLWfS

		Provided an understanding of how Chrome Extensions operate

## Installation:
	1. Download the Zip package from the Github Repository and extract the file to a pathway of your choosing
	2. Go to the Chrome Extensions setting page: "chrome://extensions/"
	3. Turn on Developer Mode
	4. Click on the "Load Unpacked" button
	5. Move down the pathway: "Reminder-Chrome-Extension/ChromeExt/src" and click Select

	The Reminder Extension button should now be part of the browser

## Reflection:
Creating this Reminder Chrome Extension proved to be a great way of learning how to develop Chrome Extensions. The application uses communication between various components such as the background, content and popup scripts. The prior knowledge of networking protocols and REST api's made it easy to familiarize myself with the chrome.storage api and messaging system. Also prior knowledge of Document Object Model Manipulation with Javascript was beneficial in the listing and removing of the reminders. Overall, the creation of this extension was a good learning experience and a good introduction into creating Chrome Extensions.
