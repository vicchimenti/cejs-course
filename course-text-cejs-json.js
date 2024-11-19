/***
 *     @author Victor Chimenti, MSCS
 *     @file text/cejs-json (based off v10/text/new-fulltext.js)
 *     @see CEJS Course
 *              ID: 5650
 *              text/cejs-json 
 *
 *     Document will write client side to output JSON for the search
 *
 *	   Used existing PL code as a starting point, adapted to file Terminalfour PHP Search Module
 *
 *     @version 1.0
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
        let _tag = String(BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, tag)).trim();
        return _tag == '' ? '' : _tag;
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

   let mediaPath = BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, '<t4 type="media" formatter="path/*" id="' + itemId + '" cdn="true" pxl-filter-id="69" />');
   let mediaInfo = getMediaInfo(itemId);
   let media = readMedia(itemId);
   let info = new ImageInfo();
   info.setInput(media);

   let mediaHTML = (info.check()) ?
                   '<figure class="figure"><img src="' + mediaPath + '" class="listgroupImage figure-img img-fluid" aria-label="' + mediaInfo.getName() + '" alt="' + mediaInfo.getDescription() + '" loading="auto" /></figure>' :
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
       environmentalIssues: getContentValues('<t4 type="content" name="Environmental Issues" output="normal" display_field="value" />'),
       cejsName: '',
          cejsType: 'course',
       school: getContentValues('<t4 type="content" name="Course College" output="normal" display_field="value" />'),
       courseLevel: getContentValues('<t4 type="content" name="Section Academic Level" output="normal" modifiers="striptags,htmlentities" />'),
       subject: getContentValues('<t4 type="content" name="Subject" output="normal" modifiers="striptags,htmlentities" />'),
       subtitleString: '',
       icons: getContentValues('<t4 type="content" name="Icon ID" output="normal" modifiers="striptags,htmlentities" />'),
          iconsString: '',
       lsapIcons: getContentValues('<t4 type="content" name="LSAP ID" output="normal" modifiers="striptags,htmlentities" />'),   
       lsapIconsString: '',
       description: getContentValues('<t4 type="content" name="Description" output="normal" modifiers="medialibrary,nav_sections" />'),
       //primarySectionName: getContentValues('<t4 type="content" name="Primary Section Name" output="normal" modifiers="striptags,htmlentities" />'),
       //sectionName: getContentValues('<t4 type="content" name="Section Name" output="normal" modifiers="striptags,htmlentities" />'),
       sectionId: getContentValues('<t4 type="content" name="Section ID" output="normal" modifiers="striptags,htmlentities" />'),
       contentId: getContentValues('<t4 type="meta" meta="content_id" />'),
       url: getContentValues('<t4 type="content" name="Article Title" output="fulltext" use-element="true" filename-element="Article Title" modifiers="striptags,htmlentities" />'),
          department: '',
          publisher: '',
          journalLink: '',
          fullName: '',
          faculty: '',
          bioLink: '',
          citations: '',
          researchType: ''
    };


   /* 
     list['laudatoSiGoal'] = processTags('<t4 type="content" name="Icon ID" output="normal" modifiers="striptags,htmlentities" />');
     list['sDevGoal'] = processTags('<t4 type="content" name="LSAP ID" output="normal" modifiers="striptags,htmlentities" />'); */

    /***
     *  check for fulltext content
     * 
     * */
   cejscDict.cejsName =  String((cejscDict.articleTitle && cejscDict.courseName)
                       ? cejscDict.courseName + ' : ' + cejscDict.articleTitle
                       : cejscDict.contentName);


   /***
     *  check for subject Description
     * 
     * */
    let subjectString =    (cejscDict.subject)
                           ? '<span class="card-text subject"><em>' + cejscDict.subject + '</em></span>'
                           : '<span class="card-text subject visually-hidden hidden">No valid subject provided</span>';




   /***
   *  check for subject college
   * 
   * */
   let collegeString = (cejscDict.school)
                       ? '<span class="card-text college">' + cejscDict.school + '</span>'
                       : '<span class="card-text college visually-hidden hidden">No valid subject provided</span>';




   /***
   *  check for subject level
   * 
   * */
   let courseLevelString =   (cejscDict.courseLevel)
                               ? '<span class="card-text courseLevel">' + cejscDict.courseLevel + '</span>'
                               : '<span class="card-text courseLevel visually-hidden hidden">No valid subject provided</span>';




   /***
   *  define subtitle
   * 
   * */
   cejscDict.subtitleString =  String((cejscDict.subject && cejscDict.school && cejscDict.courseLevel)
                           ? subjectString + ' | ' + collegeString + ' | ' + courseLevelString 
                           : (cejscDict.subject && cejscDict.school && !cejscDict.courseLevel)
                           ? subjectString + ' | ' + collegeString 
                           : (cejscDict.subject && !cejscDict.school && cejscDict.courseLevel)
                           ? subjectString + ' | ' + courseLevelString 
                           : (!cejscDict.subject && cejscDict.school && cejscDict.courseLevel)
                           ? collegeString + ' | ' + courseLevelString 
                           : (!cejscDict.subject && !cejscDict.school && cejscDict.courseLevel)
                           ? courseLevelString 
                           : (!cejscDict.subject && cejscDict.school && !cejscDict.courseLevel)
                           ? collegeString 
                           : (cejscDict.subject && !cejscDict.school && !cejscDict.courseLevel)
                           ? subjectString 
                           : '');




   /***
     *  Parse and format icons
     * 
     * */
   if (cejscDict.icons) {

       let iconArray = cejscDict.icons.split(',');
       let iconPathArray = [];

       iconArray.sort();

       for (let icon in iconArray) {

           iconPathArray[icon] = mediaTag(iconArray[icon].trim());
       }

       let iconValues = assignSdgList(iconPathArray);
       cejscDict.iconsString = String('<ul class="iconDashboard list-group list-group-horizontal">' + iconValues + '</ul>');
   }




   /***
    *  Parse and format lsap icons
    * 
    * */
   if (cejscDict.lsapIcons) {

       let iconArray = cejscDict.lsapIcons.split(',');
       let iconPathArray = [];

       iconArray.sort();

       for (let icon in iconArray) {

           iconPathArray[icon] = mediaTag(iconArray[icon].trim());
       }

       let iconValues = assignLsapList(iconPathArray);
       cejscDict.lsapIconsString = String('<ul class="lsapIconDashboard list-group list-group-horizontal">' + iconValues + '</ul>');
   }


      /***
     *  Course Level
     * 
     * */
   if (cejscDict.courseLevel) {

       let courseLevelArray = cejscDict.courseLevel.split(',');

       for (let i in courseLevelArray) {

           if (courseLevelArray[i] == 'UG') {
                 courseLevelArray[i] = 'Undergraduate';
           } else if (courseLevelArray[i] == 'GR') {
                 courseLevelArray[i] = 'Graduate';
           } else if (courseLevelArray[i] == 'LW') {
                 courseLevelArray[i] = 'Law';
           } 	
       }

       cejscDict.courseLevel = courseLevelArray.join(',');
   }

    

   
    /***
     *  write JSON
     * 
     * */

   var jsonObj = new org.json.JSONObject(cejscDict);
   document.write(jsonObj.toString() + ',');


} catch (err) {
   document.write(err.message);
}