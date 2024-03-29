/***
 *     @author Victor Chimenti, MSCS
 *     @file v9-fulltext.js
 *     @see CEJS Course
 *              ID: 5650
 *              v9/fulltext
 *
 *     Document will write client side once when the page loads
 *
 *     @version 7.7
 */








/***
 *      Import T4 Utilities
 */
 importClass(com.terminalfour.media.IMediaManager);
 importClass(com.terminalfour.spring.ApplicationContextProvider);
 importClass(com.terminalfour.publish.utils.BrokerUtils);
 importClass(com.terminalfour.media.utils.ImageInfo);
 
 
 
 
 /***
  *      Extract values from T4 element tags
  *      and confirm valid existing content item field
  */
  function getContentValues(tag) {
     try {
         let _tag = BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, tag).trim();
         return {
             isError: false,
             content: _tag == '' ? null : _tag
         };
     } catch (error) {
         return {
             isError: true,
             message: error.message
         };
     }
 }
 
 
 
 
 /***
  *      Returns a media object
  */
 function getMediaInfo(mediaID) {
 
     let mediaManager = ApplicationContextProvider.getBean(IMediaManager);
     let media = mediaManager.get(mediaID, language);
 
     return media;
 }
 
 
 
 
 /***
  *      Returns a media stream object
  */
 function readMedia(mediaID) {
 
     let mediaObj = getMediaInfo(mediaID);
     let oMediaStream = mediaObj.getMedia();
 
     return oMediaStream;
 }




/***
 *      Returns a formatted html img tag
 */
 function mediaTag(itemId) {

    let mediaPath = BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, '<t4 type="media" formatter="path/*" id="' + itemId + '" />');
    let mediaInfo = getMediaInfo(itemId);
    let media = readMedia(itemId);
    let info = new ImageInfo();
    info.setInput(media);

    let mediaHTML = (info.check()) ?
                    '<figure class="figure"><img src="' + mediaPath + '" class="listgroupImage figure-img img-fluid" aria-label="' + mediaInfo.getName() + '" alt="' + mediaInfo.getDescription() + '" width="' + info.getWidth() + '" height="' + info.getHeight() + '" loading="auto" /></figure>' :
                    '<span class="listgroupImage visually-hidden hidden">Invalid Image ID</span>';

    return mediaHTML;
 }
 
 
 
 
/***
 *      Returns an array of list items
 */
function assignSdgList(arrayOfValues) {

    let listValues = '';

    for (let i = 0; i < arrayOfValues.length; i++) {

        listValues += '<li class="list-group-item sdgIcon">' + arrayOfValues[i].trim() + '</li>';
    }

    return listValues;
}




/***
 *      Returns an array of sdg items
 */
function assignLsapList(arrayOfValues) {

    let listValues = '';

    for (let i = 0; i < arrayOfValues.length; i++) {

        listValues += '<li class="list-group-item lsapIcon">' + arrayOfValues[i].trim() + '</li>';
    }

    return listValues;
}
 
 
 
 
 /***
  *      Write the document
  */
 function writeDocument(array) {
 
     for (let i = 0; i < array.length; i++) {
 
         document.write(array[i]);
     }
 }
 
 
 
 
 /***
  *      Main
  */
 try {
 
 
     /***
      *      Dictionary of content
      * */
     let cejscDict = {

        contentName: getContentValues('<t4 type="content" name="Name" output="normal" modifiers="striptags,htmlentities" />'),
        articleTitle: getContentValues('<t4 type="content" name="Article Title" output="normal" modifiers="striptags,htmlentities" />'),
        courseName: getContentValues('<t4 type="content" name="Course Name" output="normal" modifiers="striptags,htmlentities" />'),
        college: getContentValues('<t4 type="content" name="College" output="normal" modifiers="striptags,htmlentities" />'),
        academicLevel: getContentValues('<t4 type="content" name="Section Academic Level" output="normal" modifiers="striptags,htmlentities" />'),
        subjectDescription: getContentValues('<t4 type="content" name="Subject" output="normal" modifiers="striptags,htmlentities" />'),
        icons: getContentValues('<t4 type="content" name="Icon ID" output="normal" modifiers="striptags,htmlentities" />'),
        lsapIcons: getContentValues('<t4 type="content" name="LSAP ID" output="normal" modifiers="striptags,htmlentities" />'),             
        courseDescription: getContentValues('<t4 type="content" name="Description" output="normal" modifiers="medialibrary,nav_sections" />'),
        primarySectionName: getContentValues('<t4 type="content" name="Primary Section Name" output="normal" modifiers="striptags,htmlentities" />'),
        sectionName: getContentValues('<t4 type="content" name="Section Name" output="normal" modifiers="striptags,htmlentities" />'),
        sectionId: getContentValues('<t4 type="content" name="Section ID" output="normal" modifiers="striptags,htmlentities" />'),
        contentId: getContentValues('<t4 type="meta" meta="content_id" />'),
        anchorTag: getContentValues('<t4 type="meta" meta="html_anchor" />')

     };
 
 
 
 
     /***
      *  default html initializations
      * 
      * */
      let beginningHTML = '<article class="cejscourseItem standardContent card border-0" id="cejscourse' + cejscDict.contentId.content + 'fulltext" role="contentinfo" aria-label="' + cejscDict.articleTitle.content + '">';
      let endingHTML = '</article>';
      let openHeaderWrapper = '<div class="card-header col-12 border-0 bg-transparent">';
      let closeHeaderWrapper = '</div>';
      let openBodyWrapper = '<div class="articleSummary card-body col-12">';
      let closeBodyWrapper = '</div>';
      let openFooter = '<div class="card-footer border-0 bg-transparent visually-hidden hidden d-none">';
      let closeFooter = '</div>';
      let descriptionString = '<p class="card-text courseDescription visually-hidden hidden">No valid description provided</p>';
      let listOfIcons = '<ul class="iconDashboard list-group list-group-horizontal hidden visually-hidden">No valid icon provided</ul>';
      let listOfLsapIcons = '<ul class="lsapIconDashboard list-group list-group-horizontal hidden visually-hidden">No icons provided</ul>';

 
 
 
 
 
 
     /***
      *  check for fulltext content
      * 
      * */
      let titleLink =   (cejscDict.articleTitle.content && cejscDict.courseName.content)
                        ? '<h1 id="pageTitle" class="card-title">' + cejscDict.courseName.content + ' : ' + cejscDict.articleTitle.content + '</h1>'
                        : '<h1 id="pageTitle" class="card-title">' + cejscDict.contentName.content + '</h1>';





    /***
      *  check for subject Description
      * 
      * */
     let subjectString =    (cejscDict.subjectDescription.content)
                            ? '<span class="card-text subject"><em>' + cejscDict.subjectDescription.content + '</em></span>'
                            : '<span class="card-text subject visually-hidden hidden">No valid subject provided</span>';




    /***
    *  check for subject college
    * 
    * */
    let collegeString = (cejscDict.college.content)
                        ? '<span class="card-text college">' + cejscDict.college.content + '</span>'
                        : '<span class="card-text college visually-hidden hidden">No valid subject provided</span>';




    /***
    *  check for subject level
    * 
    * */
    let academicLevelString =   (cejscDict.academicLevel.content)
                                ? '<span class="card-text academicLevel">' + cejscDict.academicLevel.content + '</span>'
                                : '<span class="card-text academicLevel visually-hidden hidden">No valid subject provided</span>';




    /***
    *  define subtitle
    * 
    * */
    let subtitleString =    (cejscDict.subjectDescription.content && cejscDict.college.content && cejscDict.academicLevel.content)
                            ? '<p class="card-subtitle">' + subjectString + ' | ' + collegeString + ' | ' + academicLevelString + '</p>'
                            : (cejscDict.subjectDescription.content && cejscDict.college.content && !cejscDict.academicLevel.content)
                            ? '<p class="card-subtitle">' + subjectString + ' | ' + collegeString + '</p>'
                            : (cejscDict.subjectDescription.content && !cejscDict.college.content && cejscDict.academicLevel.content)
                            ? '<p class="card-subtitle">' + subjectString + ' | ' + academicLevelString + '</p>'
                            : (!cejscDict.subjectDescription.content && cejscDict.college.content && cejscDict.academicLevel.content)
                            ? '<p class="card-subtitle">' + collegeString + ' | ' + academicLevelString + '</p>'
                            : (!cejscDict.subjectDescription.content && !cejscDict.college.content && cejscDict.academicLevel.content)
                            ? '<p class="card-subtitle">' + academicLevelString + '</p>'
                            : (!cejscDict.subjectDescription.content && cejscDict.college.content && !cejscDict.academicLevel.content)
                            ? '<p class="card-subtitle">' + collegeString + '</p>'
                            : (cejscDict.subjectDescription.content && !cejscDict.college.content && !cejscDict.academicLevel.content)
                            ? '<p class="card-subtitle">' + subjectString + '</p>'
                            : '<span class="card-subtitle visually-hidden hidden">No valid subtitle provided</span>';




    /***
      *  Parse and format icons
      * 
      * */
    if (cejscDict.icons.content) {

        let iconArray = cejscDict.icons.content.split(',');
        let iconPathArray = [];

        iconArray.sort();

        for (let icon in iconArray) {

            iconPathArray[icon] = mediaTag(iconArray[icon].trim());
        }

        let iconValues = assignSdgList(iconPathArray);
        listOfIcons = '<ul class="iconDashboard list-group list-group-horizontal">' + iconValues + '</ul>';
    }




    /***
     *  Parse and format lsap icons
     * 
     * */
    if (cejscDict.lsapIcons.content) {

        let iconArray = cejscDict.lsapIcons.content.split(',');
        let iconPathArray = [];

        iconArray.sort();

        for (let icon in iconArray) {

            iconPathArray[icon] = mediaTag(iconArray[icon].trim());
        }

        let iconValues = assignLsapList(iconPathArray);
        listOfLsapIcons = '<ul class="lsapIconDashboard list-group list-group-horizontal">' + iconValues + '</ul>';
    }




    /***
      *  check for description
      * 
      * */
    if (cejscDict.courseDescription.content) {
        descriptionString = '<p class="card-text courseDescription">' + cejscDict.courseDescription.content + '</p>';
        openFooter = '<div class="card-footer border-0 bg-transparent">';
    }

     

    
     /***
      *  write document once
      * 
      * */
      writeDocument(
        [
            beginningHTML,
            cejscDict.anchorTag.content,
            openHeaderWrapper,
            titleLink,
            subtitleString,
            closeHeaderWrapper,
            openBodyWrapper,
            listOfLsapIcons,
            listOfIcons,
            closeBodyWrapper,
            openFooter,
            descriptionString,
            closeFooter,
            endingHTML
        ]
    );

 
 
 
 
 } catch (err) {
     document.write(err.message);
 }