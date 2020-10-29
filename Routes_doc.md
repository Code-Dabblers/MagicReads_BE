# Routes

✅ -> Indicates that the route is working.

-   / - Public Stories — GET request for all Public Stories data
-   /user — GET request for User Dashboard

    -   /user/register — POST request to add the user ✅
    -   /user/login — POST request to log in the user ✅
    -   /user/logout — GET request Redirected to "/" landing page after user is logged out ✅
    -   /user/library — GET request to fetch the stories from the user library
    -   /user/readingList — GET request to fetch the stories from the user reading list
    -   /user/settings — GET to show current info and PUT request to update user info

-   /search — search and filter stories

    -   /search/:query — GET request to send the data acc to query
    -   /search/:query?/:tag — GET request to send the data acc to tag

-   /story

    -   /story/:storyID — GET story details ✅
    -   /story/:storyID/chapter/:chapterID — GET request to get the particular chapter
    -   /story/:storyID/chapter/:chapterID/comment — PUT request to update comments in Chapter
    -   /story/:storyID/chapter/:chapterID/comment/:commentId — DELETE request to delete comments in Chapter
    -   /story/:storyID/vote — PUT request to update vote counter ✅

-   /create

    -   /create — POST request to save Story data (protected route) - this will return the story Id which will be passed onto a route to edit that chapter ✅
    -   /create/story/:storyID/chapter — POST request to store the chapter (protected route) ✅

-   /edit
    -   /edit/story/:storyID/details — PUT request to update story details (protected route)
    -   /edit/story/:storyID/chapter/:chapterID — PUT request to update a chapter (protected route)

Notes ➖

~ **[multer](https://www.npmjs.com/package/multer)** npm package will be useful for image upload for story cover, chapter cover and  
profile picture
