# To-Do's

This is a demo application for the management of to-do's and to-do lists.  The frontend is written in React.  The backend uses PHP & MySQL.  The communication between the client and the backend is handled through API calls formatted via GraphQL.  


# Getting Started

Once you've downloaded the source code, you'll need to run 

    npm install
Because none of the node modules are included in this repository.

## Features

 - Users can create a single-use session by logging in as "GUEST".  Or they can register with a unique username/password, which will allow them to retrieve their values in subsequent sessions.
 - User can create new to-do lists, edit the names of existing lists, or delete existing lists.
 - User can create new to-do's under a given list.  The name of existing to-do's can be edited in place.  Individual to-do's can be deleted, just like to-do lists.
 - Each to-do begins in a default state of `isComplete = false`, `priority = 'Medium'`, and `dueDate = Date.now()`.  All of these values can be edited in place.  `isComplete` is managed by the checkbox in front of each to-do.  Once the checkbox is checked, the name of the to-do is displayed as stricken through.  `priority` is managed with a menu that allows the user to switch between High, Medium, or Low.  `dueDate` is managed with a datepicker that only allows the selection of future values.  Editing any of these fields results in GraphQL calls back to the PHP API, which will save the values for future persistence.
 - For to-do lists with two-or-more to-do's, a Sort By menu is exposed that allows the user to sort the to-do's by Priority or by Due Date.  Sorting them results in GraphQL calls that will save the new sort order for future persistence.
 - The to-do's can also be manually sorted using drag-n-drop.  This allows the user to individually move each of the to-do's into the preferred position.





## Architecture

The following explains the particular architectural decisions made for this app:

**State Management**
There is no third-party statement management tool used.  The state values needed to run the app are very slight and this did not justify the overhead (both in download packages, and in coding constructs) needed to implement 3rd-party state management tools.  This is especially true of Redux - which is a powerful tool, but for this application, it would be like building a sand castle with a bulldozer.  

**Component Caching**
In this app, I've used a simple technique for sharing references between existing components.  Each component imports an initially-empty object called `components`.  In the constructor, the component adds a reference to itself into the `components` object.  For example, this code is found in the `<DataLayer/>` component:

    constructor(props) {
       super(props);
       components.DisplayLayer = this;
    }

This means that, in any other component, if that component has included this line at the top of the file:

    import components from '../utilities/components';

Then the other component will be able to directly query the variables of `<DataLayer/>`.  The other components *will even be able to call the methods that exist on* `<DataLayer/>`.  For example, imagine that we have the following component:

    import Bar from './bar';
    import components from '../utilities/components';
    import React from 'react';
    
    export default class Foo extends React.Component {
       constructor(props) {
          super(props);
          components.Foo = this;
       }

       sayHello() {
          console.log('The Foo component is saying "Hello"');
       }

       render() {
          return <Bar />;
       }
    }

We can now do this with the `<Bar/>` component:

    import components from '../utilities/components';
    import React from 'react';
    
    export default class Bar extends React.Component {
       render() {
          components.Foo.sayHello();
          return <div>...</div>;
       }
    }
And the `<Bar/>` component will have successfully invoked a method on `<Foo/>`.  Of course, this doesn't have to be conducted in a simple parent-child relationship.  Using the basic `components` object cache, a distant descendant can call methods on it ancestors that live far up the chain.  Also, this means that it's very easy for one component to inquire about the value of `state` variables in another component.

I'll be perfectly honest here.  The few times that I've discussed or shown this approach to another "React Guy", I've always received the same response:  *"Don't do that."*  But here's the funny thing:  I've yet to hear anyone give me a rational, empirical reason why this approach is wrong.  The objections I've received normally fall into two categories:

 1. **You're creating dependencies between the components in your app.**  Which is `true`.  But the same people who say that will happily clutter their app with a massive amount of Redux boilerplate - and state management tools are just another form of dependency.  Also, this approach needn't be used *everywhere* in the app.  It logically flows that it would only be applied on singletons.  You definitely wouldn't want to write it into any kind of utility component that's meant to be shared across the app, or even between multiple apps.  And if a given component doesn't need to utilize the shared info/functionality in `components`, it doesn't have to.
 
 3. **This isn't "the way" that you do things in React.**  Yeah.  I've actually heard that from people several times.  Of course Redux wasn't the original way to handle state management in apps.  But people didn't like the "base" functionality, so they worked on a separate state management solution.  I don't really care if something is "the way" that other React developers do things.  I only care whether it's an elegant solution.

**Layered Architecture**
Whenever I'm doing green-fields development, I tend to use an approach with multiple, nested layers.  The layers tend to act like a data cache (because a layer that's higher in the structure may be storing some values which will, eventually, get used in lower levels of the structure).  This is also an effective way to build single-page apps, because all of the data/logic resides in the multiple layers.  Thus, there is no need to ever "refresh" the apps web page.

In this app, the layers are as such:

    <App/> --> <DataLayer/> --> <DisplayLayer/> --> <FixedTemplate/> 

**Dynamic Module Swapping**

The app is a Single Page Application (SPA).  This means that the page is never refreshed and the application never redirects the user to a new URL.  Inside the app, this is accomplished using module swapping.  There are 4 modules in the application:

 1. `<LoginModule/>`
 2. `<LogoutModule/>`
 3. `<RegisterModule/>`
 4. `<TodosModule/>`

Obviously, the bulk of a user's time would typically be spent in the `<TodosModule/>`.  The logic is contained in `<FixedTemplate/>` that determines which module to display on the screen at any given time.


**Type Checking(ish)**
Since this app is done in "regular" React/JavaScript, with no TypeScript or Flow, I've still implemented my default solution for type checking on methods.  Because you can never theoretically know exactly how other future developers will choose to invoke your methods, I feel it's good practice to always check the *types* of values that have been passed into a method.

For this reason, I have a utility library that I frequently use.  It's in `utilities/is.js`.  It contains a series of simple Boolean checks to determine whether a value is of a given type.  These are then used as such:

    import is from '../utilities/is';
    import React from 'react';
    
    export default class Foo extends React.Component {
       iterateOverThisArray(appendMessageToOutput = '', array = []) {
          if (!is.anArray(array) || !is.aPopulatedString(appendMessageToOutput)) return;
          array.forEach(element => `${element} ${appendMessageToOutput}`);
       }
    
       render() {
          return null;
       }
    }

**GraphQL**
Data is passed between the React frontend and the PHP backend using GraphQL.  After looking at several React libraries to handle this, I decided to simply pass the GraphQL queries manually.  For example, retrieving to-do lists is handled in `<DataLayer/>` as such:

    getTodoLists() {  
       const {sessionId, userId} = components.DisplayLayer.state;  
       const query = JSON.stringify({  
          query : `  
             { 
                getTodoLists(userId: "${userId}", sessionId: "${sessionId}") {  
                   todoListId, 
                   name, 
                } 
             } 
          `  
       });  
       let parameters = JSON.parse(JSON.stringify(constant.commonHeaders));  
       parameters.body = query;  
       const promise = fetch(constant.apiUrl, parameters)  
          .then(response => response.json())  
          .catch(error => {  
             console.error('failed getTodoLists()');  
             console.error(error);  
       });  
       promise.then(response => {  
          if (response.data && response.data.getTodoLists) {  
             if (!is.anArray(response.data.getTodoLists)) {  
                components.TodosModule.updateTodoLists([]);  
             } else {  
                components.TodosModule.updateTodoLists(response.data.getTodoLists);  
             }  
          }  
       });  
    }

On the backend (PHP), I'm using `graphql-php` to parse the submitted queries.

**Drag-n-Drop**
Aside from being able to sort the to-do's by priority or due date, they can also be individually moved within the state using drag-n-drop.  Once they've been moved, their newly-set sort order is preserved for future sessions.

**Data Persistence**
On the frontend, temporal values are stored in `localStorage`.  This makes the app less brittle for the user because, if they choose to manually refresh the page or they navigate away-then-back, the system will remember that they are logged in and they won't have to reauthenticate.  This is especially critical for GUEST sessions, because if the system did not remember they were logged in, they would lose all their data if they accidentally refreshed the page or navigated away-then-back.

On the backend, primary data persistence is provided by MySQL.  The schema for the database is included in the repository.  The app is supported by three tables: `todo`, `todoList`, and `user`.

Temporal server-side persistence is also provided by PHP's native `$_SESSION` support.  Specifically, this is used to maintain a session between the frontend client and the backend API.  PHP generates a `sessionId` which is passed back to the client.  After authenticating, the client then must pass the `userId` and `sessionId` back to the backend API on every subsequent call.  This guards against XRF attacks.


