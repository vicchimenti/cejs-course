try {
    var FullListOutputImports = JavaImporter(
        com.terminalfour.publish.utils.BrokerUtils,
        java.lang.Thread,
        com.terminalfour.publish.utils.TreeTraversalUtils,
        com.terminalfour.spring.ApplicationContextProvider,
        com.terminalfour.content.IContentManager,
        com.terminalfour.version.Version,
        java.io.StringWriter,
        com.terminalfour.utils.T4StreamWriter,
        com.terminalfour.publish.ContentPublisher
    );
    with(FullListOutputImports) {
        var contentLayout = 'v10/text/fulltext-meta-content';
 
        var isFullText= function () {
            return BrokerUtils.isFullTextPage(publishCache);
        };
 
        var getFulltextInfo = function () {
            if (isFullText()) {
                var currentThread = Thread.currentThread();
                return publishCache.getGenericProp('full-text-' + currentThread.getId());
            }
            return false;
        };
 
        var getCachedSectionFromId = function (sectionID) {
            if (typeof sectionID === 'undefined') {
                return section;
            } else if (section.getID() == sectionID) {
                return section;
            }
            sectionID = Number(sectionID);
            if (sectionID === 0) {
                throw 'Passed Incorrect Section ID to getCachedSectionFromId';
            }
            return TreeTraversalUtils.findSection(
                publishCache.getChannel(),
                section,
                sectionID,
                language
            );
        };
 
        var getContentManager = function () {
            return ApplicationContextProvider.getBean(
                IContentManager
            );
        };
 
        var getCachedContentFromId = function (contentID, contentVersion) {
            if (typeof contentID === 'undefined' && typeof contentVersion === 'undefined') {
                return content;
            } else if (Number(contentID) <= 0 && typeof contentVersion !== 'undefined' && content !== null) {
                contentID = content.getID();
            } else {
                contentID = Number(contentID);
            }
            if (content === null && contentID === 0) {
                throw 'Passed Incorrect Content ID to getContentFromId';
            }
            var contentManager = getContentManager();
            if (typeof contentVersion !== 'undefined') {
                return contentManager.get(contentID, language, Version(contentVersion));
            } else {
                return contentManager.get(contentID, language);
            }
        };
 
        var getContentTypeFromId = function (contentID) {
            if (typeof contentID === 'undefined' || (Number(contentID) <= 0 && content !== null)) {
                return content.getContentTypeID();
            }
            contentID = Number(contentID);
            if (content !== null && contentID === 0) {
                throw 'Passed Incorrect Content ID to getContentTypeFromId';
            }
            var contentManager = getContentManager();
            return contentManager.getContentType(contentID);
        };
 
        var processT4Tags = function (t4tag, contentID, sectionID, forMediaFile) {
            var cachedContent = content || null;
            var cachedSection = section;
            if (typeof sectionID !== 'undefined' && sectionID !== null && Number(sectionID) > 0) {
                cachedSection = getCachedSectionFromId(sectionID);
            }
            if (contentID === null && sectionID !== null) {
                cachedContent = null;
            } else if (typeof contentID !== 'undefined' && Number(contentID) > 0) {
                cachedContent = getCachedContentFromId(contentID);
                if (cachedContent === null) {
                    throw 'Could not get cachedContent';
                }
            }
            if (cachedSection === null) {
                throw 'Could not get cachedSection';
            }
            if (forMediaFile !== true) {
                forMediaFile = false;
            }
            var renderedHtml = String(BrokerUtils.processT4Tags(dbStatement, publishCache, cachedSection, cachedContent, language, isPreview, t4tag));
            if (forMediaFile) {
                renderedHtml = renderedHtml.replace(/&/gi, '&');
            }
            return renderedHtml;
        };
 
        var getLayout = function (contentLayout, contentID, sectionID, displayError, forMediaFile) {
            if (typeof contentLayout === 'undefined') {
                throw 'getLayout: contentLayout is required for getLayout (' + contentLayout + ' of ' + content.getID() + ').';
            }
            if (contentLayout === '') {
                return '';
            }
            if (forMediaFile !== true) {
                forMediaFile = false;
            }
            var cachedSection = section;
            var cachedContent = content;
            if (typeof contentID !== 'undefined' && Number(contentID) > 0) {
                if (typeof sectionID !== 'undefined' && Number(sectionID) > 0) {
                    cachedSection = getCachedSectionFromId(sectionID);
                } else {
                    cachedSection = section;
                }
                cachedContent = getCachedContentFromId(contentID);
                if (cachedSection === null || cachedContent === null) {
                    throw 'getLayout: Getting the custom content and section was not possible';
                }
            } else {
                contentID = content.getID();
                if (typeof sectionID !== 'undefined' && Number(sectionID) > 0) {
                    cachedSection = getCachedSectionFromId(sectionID);
                } else {
                    sectionID = section.getID();
                }
            }
            var tid, format, formatString, renderedHtml;
            tid = getContentTypeFromId();
            format = publishCache.getTemplateFormatting(dbStatement, tid, contentLayout);
            formatString = format.getFormatting();
            processorType = format.getProcessor().getProcessorType();
            if (String(processorType) !== 't4tag') {
                try {
                    var sw = new StringWriter();
                    var t4w = new T4StreamWriter(sw);
                    new ContentPublisher()
                        .write(
                            t4w,
                            dbStatement,
                            publishCache,
                            cachedSection,
                            cachedContent,
                            contentLayout,
                            isPreview
                        );
                    renderedHtml = sw.toString();
                } catch (e) {
                    if (typeof displayError === 'undefined') {
                        displayError = true;
                    }
                    if (displayError === true) {
                        throw '(getLayout' +
                            contentLayout +
                            'of ' +
                            contentID +
                            ')' + e;
                    } else {
                        renderedHtml = '';
                    }
                }
            } else {
                renderedHtml = processT4Tags(formatString, contentID, sectionID);
            }
            if (forMediaFile) {
                renderedHtml = renderedHtml.replace(/&/gi, '&');
            }
            return renderedHtml;
        };
        if (!(typeof contentLayout === 'string' || contentLayout instanceof String)) {
            throw "contentLayout must be a string";
        }
        var html = '';
        if (isFullText()) {
            var fullTextInfo = getFulltextInfo();
            if (fullTextInfo.getContentID() == content.getID()) {
                html += getLayout(contentLayout);
            }
        }
        document.write(html);
        document.write('');
    }
} catch (err) {
    var contentID = typeof content !== 'undefined' ? ' content ID: ' + content.getID() : '';
    var sectionID = typeof section !== 'undefined' ? ' section ID: ' + section.getID() : '';
    var message = 'Programmable Layout Error: ' + err + ' occurred in ' + contentID + sectionID + ')';
    var outputImports = JavaImporter(
        org.apache.commons.lang.StringEscapeUtils,
        java.lang.System
    );
    with(outputImports) {
        if (isPreview) {
            document.write(message);
        } else {
            document.write('<script>console.log("' + StringEscapeUtils.escapeJava(message) + '")</script>');
        }
        System.out.println(message);
    }
}