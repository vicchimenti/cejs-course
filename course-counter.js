/***
 * Display number of available courses
 * 
 */


 let countedCourses = document.querySelectorAll('article.cejscourseWrapper:not( .hideByText, .hideBySchool, .hideByLevel, .hideByGoal, .hideByLsap)');

 console.log("countedCourses: " + countedCourses.length);