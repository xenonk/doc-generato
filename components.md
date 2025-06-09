Definitions:
1. Page - What user sees on screen: header, sidebars, contents, etc;
2. Document - The entity responsible for storing, displaying, retrieving, creating, modifying, deleting, and other document operations. A document includes fields (various form elements), a layout for displaying them in the content part of the page, and customizable rules and actions for a specific document type. You can think of documents as a collection of fields that have common methods for processing them. Example of document types: invoice, invoice, commercial offer, request for documents, legal information about the company, export declaration, payment documents, personal account statement and others;
3. Field - A part of a document, a form element that can be modified or simply displayed for reading. There can be many fields in one document. Fields can be of different types: Input, textarea, select, radio button, etc;
4. Blueprint - A document template that contains the layout of elements and variables that are populated by the application. The export component, using various libraries, generates a document in the format chosen by the user;

1. Application global components:

1.1. Page structure components:

1. Page component - сontains the basic elements of any page or document for consistent logic and design. Includes header component, base sidebar component, left sidebar component, right sidebar commponent, main content component, breadcrumbs component;
2. Header component - contains navigation items (pages), search input, user profile block;
3. Base sidebar component - consistent sidebar's wrapper component for all sidebars on all app pages. Includes toggle collapsed/opened button component, consistent design;
4. Left sidebar component - consistent sidebar component for left sidebar on all app pages. Includes params for left sidebar's width and toggle button icon direction on toggles states;
5. Right sidebar component - consistent sidebar component for right sidebar on all app pages. Includes params for left sidebars' width and toggle button icon direction on toggles states;
6. Main content component - consistent wrapper layout for all pages in app. Defines responsive bevariour and other generic consistent layout things;
7. Breadcrumbs component - located at the very top of the main content component. Can be displayed on any page if this option is enabled on the page. Displays the nesting of pages or documents. On the document page, the first element always displays the current document workspace as the first element and current document type as second element;

1.2. Content components:

1. Document component - contains consistent logic for handling CRUD operations for every document in app. Depending on the passed parameters, it uses separate components for different documents for unique visual layout of documents, but all form elements are processed in the same way: input, checkbox, select, textarea, etc. The logic and processing of this component is inextricably linked to the components in the left and right sidebars;
2. Document workspace component - generic components to work with collections of documents. Each document must be and can be only in one workspace at time. This component implements the general logic of linking several documents together in a common space to be able to retrieve values from one document and insert them into another document. Allows you to create a copy of the current document in another workspace. The copies will not be linked to each other. A change in one document will not cause a change in another;
3. Blueprint upload component - generic component for uploading document blueprints (docx, pdf, xlsx and other) and linking it with different documents;
4. Document export component - generic component for exporting documents in various formats: pdf, docx, xlsx, json, txt and others. In the process of document generation, the parameters with which the document should be generated are passed to special handlers. Just for it users add document templates. Document templates contain variables that are replaced by the passed parameters;
5. Version History component - generic component to work with versions of any document in the application. It contains logic for saving a new version of the document, loading the previous version and overwriting the form values on the currently open document;
6. Show Changes component - component for comparing the currently open document and the currently saved version of that document with each other in the versions component. It includes a button that displays the general status of the comparison (whether there are changes compared to the saved version or not), as well as a modal window that displays a list of changed values in the currently opened document;

2. Implementation of document components:

2.1. Left sidebar component:
1. Upload component;
2. Document workspace component;
3. Version History component;
4. Show changes component;

2.2. Main content component:
1. Breadcrumbs component
2. Document component;

2.3. Right sidebar (action bar) component:
1. Document export component;
2. Save button, that links with version History component and allow to save document;