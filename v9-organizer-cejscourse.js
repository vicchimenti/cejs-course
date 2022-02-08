    /***
     *     @author Victor Chimenti, MSCS
     *     @file v9-organizer-cejscourse.js
     *     v9/organizer/cejscourse
     *     id:5650
     *
     *     This content type will work in conjunction with the Organizer and each item
     *     will contain one announcement.
     *
     *     Document will write once when the page loads
     *
     *     @version 7.9.9
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
             }
         } catch (error) {
             return {
                 isError: true,
                 message: error.message
             }
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
      *      Write the document
      */
     function writeDocument(array) {
     
         for (let i = 0; i < array.length; i++) {
     
             document.write(array[i]);
         }
     }
 
 
 
 
 
 
 
 
 /***
  *  Main
  */
 try {
 
 
     /***
      *      Dictionary of content
      * */
     let cejscDict = {
         contentName: getContentValues('<t4 type="content" name="Name" output="normal" modifiers="striptags,htmlentities" />'),
         articleTitle: getContentValues('<t4 type="content" name="Article Title" output="normal" modifiers="striptags,htmlentities" />'),
         articleImage: getContentValues('<t4 type="content" name="Image" output="normal" formatter="path/*" />'),
         icons: getContentValues('<t4 type="content" name="Icon ID" output="normal" modifiers="striptags,htmlentities" />'),
         primarySectionName: getContentValues('<t4 type="content" name="Primary Section Name" output="normal" modifiers="striptags,htmlentities" />'),
         subjectDescription: getContentValues('<t4 type="content" name="Subject" output="normal" modifiers="striptags,htmlentities" />'),
         hardMedia:getContentValues('<t4 type="media" formatter="path/*" id="3694397" />'),

         courseDescription: getContentValues('<t4 type="content" name="Description" output="normal" modifiers="medialibrary,nav_sections,htmlentities" />'),
         fullTextLink: getContentValues('<t4 type="content" name="Article Title" output="fulltext" use-element="true" filename-element="Article Title" modifiers="striptags,htmlentities" />'),
         contentId: getContentValues('<t4 type="meta" meta="content_id" />')
     };
 
 
 
 
 
 
 
 
     /***
      *  default html initializations
      * 
      * */
     let beginningHTML = '<article class="cejscourseWrapper card shadow border-0 radius-0 mb-3" id="cejscourse' + cejscDict.contentId.content + 'zonea" aria-label="' + cejscDict.articleTitle.content + '">';
     let endingHTML = '</article>';
     let openImageWrapper = '<div class="imageWrapper col-12 d-none visually-hidden hidden">';
     let closeImageWrapper = '</div>';
     let openRow = '<div class="row g-0 noGap">';
     let closeRow = '</div>';
     let openBodyWrapper = '<div class="articleSummary col-12 card-body">';
     let closeBodyWrapper = '</div>';
     let imageString = '<span class="imageString hidden visually-hidden" />No Image Provided</span>';

     let imageString2 = '<span class="imageString hidden visually-hidden" />No Image Provided</span>';
     let openFig = '<figure class="figure hidden visually-hidden">';
     let closeFig = '</figure>';

 
 
 
 
 
 
 
 
     /***
      *  check for fulltext content
      * 
      * */
      let titleLink =   (cejscDict.courseDescription.content)
                        ? '<h3 class="card-title border-0"><a href="' + cejscDict.fullTextLink.content + '" class="card-link" title="See the full course details: ' + cejscDict.articleTitle.content + '">' + cejscDict.articleTitle.content + '</a></h3>'
                        : '<h3 class="card-title border-0">' + cejscDict.articleTitle.content + '</h3>';




    /***
      *  check for subject Description
      * 
      * */
      let subjecString =    (cejscDict.subjectDescription.content)
                            ? '<p class="card-subtitle primarySectionName"><strong>Subject: </strong><em>' + cejscDict.subjectDescription.content + '</em></p>'
                            : '<p class="card-text primarySectionName visually-hidden hidden">No valid primary section name provided</p>';




    /***
      *  check for primary section name
      * 
      * */
      let primaryNameString =   (cejscDict.primarySectionName.content)
                                ? '<p class="card-text primarySectionName"><strong>Primary Section Name: </strong>' + cejscDict.primarySectionName.content + '</p>'
                                : '<p class="card-text primarySectionName visually-hidden hidden">No valid primary section name provided</p>';





    /***
      *  check for icon id
      * 
      * */
      let iconString =   (cejscDict.icons.content)
                        ? '<p class="card-text icons"><strong>Media Library Image ID: </strong>' + cejscDict.icons.content + '</p>'
                        : '<p class="card-text icons visually-hidden hidden">No valid icon provided</p>';
 
 
 
 
     /***
      *  Parse for image
      * 
      * */
     if (cejscDict.articleImage.content) {
 
         let imageId = content.get('Image').getID();
         let mediaInfo = getMediaInfo(imageId);
         let media = readMedia(imageId);
         let info = new ImageInfo;
         info.setInput(media);
 
         imageString =   (info.check())
                         ? '<img src="' + cejscDict.articleImage.content + '" class="articleImage figure-img card-img-top" aria-label="' + mediaInfo.getName() + '" alt="' + mediaInfo.getDescription() + '" width="' + info.getWidth() + '" height="' + info.getHeight() + '" loading="auto" />'
                         : '<img src="' + cejscDict.articleImage.content + '" class="articleImage figure-img card-img-top" alt="' + cejscDict.articleTitle.content + '" loading="auto" />';
   
         openFig = '<figure class="figure">';
         openImageWrapper = '<div class="imageWrapper col-12 col-lg-4">';
         openBodyWrapper = '<div class="articleSummary col-12 col-lg-8 card-body">';

     }




    /***
      *  Parse for icons
      * 
      * */
    if (cejscDict.icons.content) {

        let iconArray = cejscDict.icons.content.split(',');
        let arrlength = iconArray.length;
        let pathArray = [];
        pathArray.length = arrlength;

        for (let i = 0; i < arrlength; i++) {
            let mediaPath = BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, '<t4 type="media" formatter="path/*" id="' + iconArray[i] + '" />').trim();
            // let mediaPath = BrokerUtils.processT4Tags (dbStatement, publishCache, section, galleryContent, language, isPreview, tag);
            pathArray[i] = mediaPath;
        }

        let imageId = iconArray[0];

        // let imageId = content.get('Image').getID();
        let mediaInfo = getMediaInfo(imageId);
        let media = readMedia(imageId);
        let info = new ImageInfo;
        info.setInput(media);



        imageString2 =   (info.check())
                        ? '<img src="' + pathArray[0] + '" class="articleImage figure-img card-img-top" aria-label="' + mediaInfo.getName() + '" alt="' + mediaInfo.getDescription() + '" width="' + info.getWidth() + '" height="' + info.getHeight() + '" loading="auto" />'
                        : '<img src="' + cejscDict.articleImage.content + '" class="articleImage figure-img card-img-top" alt="' + cejscDict.articleTitle.content + '" loading="auto" />';
    
        // openFig = '<figure class="figure">';
        // openImageWrapper = '<div class="imageWrapper col-12 col-lg-4">';
        // openBodyWrapper = '<div class="articleSummary col-12 col-lg-8 card-body">';

    } 


 
 
  
     /***
      *  write document once
      * 
      * */
     writeDocument(
         [
             beginningHTML,
             openRow,
             openImageWrapper,
             openFig,
             imageString,
             closeFig,
             closeImageWrapper,
             openBodyWrapper,
             titleLink,
             subjecString,
             primaryNameString,
             imageString2,
             iconString,
             cejscDict.hardMedia.content,
             closeBodyWrapper,
             closeRow,
             endingHTML
         ]
     );
 
 
 
 
 } catch (err) {
     document.write(err.message);
 }