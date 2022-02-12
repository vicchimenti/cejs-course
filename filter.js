{ /* < script type = "text/javascript" > */ }



/***
*   @author Victor Chimenti, MSCS-SE
*   @file profile-filter.js
*
*   jQuery
*   This script searches the Law School faculty profile content items for matches to the
*   user selected search parameters in the filter field dropdown menus
*
*   @version 3.1
*/






$(function () {
    // After the DOM is ready, Wait until the window loads
    $(window).load(function () {
        // Once window loads set a timeout delay
        setTimeout(function () {
            console.log("timeout function");





            //** global array holds list of content items that will render after filter selection **//
            var visibleItems = [];
            var parseItems = {};




            //   ***   Process and Parse Visible Items   ***   //
            $(function () {
                let parseItemsToDisplay = function () {
                    // assign array of currently visible content items
                    visibleItems = $('.cejscourseWrapper').not('.hideByText, .hideBySchool, .hideByLevel');
                    // check to see if array is empty
                    if (visibleItems.length == 0) {
                        // when array is empty show the results message
                        $('.noResultsToShow').removeClass('hideResultsMessage');
                    } else {
                        // when array has content items suppress the results message
                        $('.noResultsToShow').addClass('hideResultsMessage');
                    }
                };
                parseItems.process = parseItemsToDisplay;
            });




            //   ***   Keyword Search   ***   //
            $(function () {
                // scan the keyword each character the user inputs
                $('#keystroke_filter').on('keyup', function () {
                    // Assign Search Key
                    let keyword = $(this).val().toLowerCase();
                    // filter the education abroad items for the input key
                    $(function () {
                        $('.cejscourseWrapper').filter(function () {
                            // when the search key is not present in the item then hide the item
                            $(this).toggleClass('hideByText', !($(this).text().toLowerCase().indexOf(keyword) > -1));
                        });
                    });
                    // parse out unselected content items and limit display to user selected items
                    parseItems.process();
                });
            });





            //   ***   School Filter   ***   //
            $(function () {
                $('form input:radio').change(function () {
                    // Assign Search Key
                    let typeKey = $(this).val();
                    let viewAll = "All";
                    console.log("typeKey: " + typeKey);
                    // If Search Key is Not Null then Compare to the Type List Items in Each Content Item
                    if (typeKey != viewAll) {
                        $('.college').filter(function (i, e) {
                            var typeValue = $(this).text();
                            console.log("typeValue: " + typeValue);
                            // Check to see if the Key and Value are a Match
                            if (typeValue.match(typeKey)) {
                                $(this).parents('.cejscourseWrapper').removeClass('hideBySchool');
                            } else {
                                $(this).parents('.cejscourseWrapper').addClass('hideBySchool');
                            }
                        });
                        // Else the Search Key is Null so Reset all Content Items to Visible
                    } else {
                        $('.cejscourseWrapper').removeClass('hideBySchool');
                    }
                    // parse out unselected content items and limit display to user selected items
                    parseItems.process();
                });
            });





            //   ***   Course Level Filter   ***   //
            $(function () {
                $('form input:radio').change(function () {
                    // Assign Search Key
                    let typeKey = $(this).val();
                    let viewAll = "All";
                    console.log("typeKey: " + typeKey);
                    // If Search Key is Not Null then Compare to the Type List Items in Each Content Item
                    if (typeKey != viewAll) {
                        $('.academicLevel').filter(function (i, e) {
                            var typeValue = $(this).text();
                            console.log("typeValue: " + typeValue);
                            // Check to see if the Key and Value are a Match
                            if (typeValue.match(typeKey)) {
                                $(this).parents('.cejscourseWrapper').removeClass('hideBySchool');
                            } else {
                                $(this).parents('.cejscourseWrapper').addClass('hideBySchool');
                            }
                        });
                        // Else the Search Key is Null so Reset all Content Items to Visible
                    } else {
                        $('.cejscourseWrapper').removeClass('hideBySchool');
                    }
                    // parse out unselected content items and limit display to user selected items
                    parseItems.process();
                });
            });




        }, 10);
    });
});


{ /* </script> */ }