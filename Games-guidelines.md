# Games guidelines

# What is a game?

An **Enki** game is a mobile-friendly,  **interactive** activity that puts the user’s knowledge to a test. It shouldn’t take more than a couple of minutes to finish, after which the user gets a score based on the number of correct answers.

A game can be found under a **T****opic** and a **S****ubtopic**, much like an **I****nsight**. Therefore, the activities should be restricted to that particular subtopic.

A **game** should:

- increase a user’s interest in the game’s topic/subtopic
- test a user’s knowledge with regard to **game** level
- have questions that could be explained in a small number of sentences
- be fun

Note that in order to reach a larger audience of **users,** a game **level** will most commonly be set to **all** [beginner, basic, medium, advanced]. In this case, one **game** may be seen as *challenging* by **beginners** and *obvious* ******by ********experts**.

In addition, **game explanations** are not currently implemented for all types of game. However, to prepare a game for the upcoming update it’s advised to have the explanations for each question noted somewhere (e.g. in **Notes** field).


# What is a game made out of?

A game is a *particular* type of **insight****,** written in the same way. Thus, most of the fields they share with insights. The ones that differ are listed below:


## **Type [M]**

This field is used to differentiate the **G****ames** (and their type) from **I****nsights**. So far, there are 3 types of games:

- fill the gap 
- bug spot
- tetris

This field should look like:

    type: fillTheGap
    type: bugSpot
    type: tetris 


With any of these values, the parser is told to expect a **Game Content** field, which is quite explanatory. The syntax for each type of game will be explained in a bit.


## **Content** **[M]**

This field has a different meaning for games than it has for insights. Here, it gives a brief explanation of the game content. Take, for example, the `Be strict` **JavaScript/Core** game:


    ## Content
    
    Do you know what is allowed and not allowed in `strict mode` in JS? Can you spot the lines that would produce errors?



## **Game Content [M]**

Every game type has a different format. 

Note that in this field you can make use of:

  - **code blocks**
  - **code snippets**

Games are made out of *a list of questions* separated by `---` ***,*** each one specific to the **type***:*

    ---
    ## Game Content
    
    Question 1 
    ---
    
    Question 2
    ---
    // etc.

The only game not abiding to this format is the **tetris** one.


 **1. fillTheGap**
 
****Right now, there are two ways of creating content for this game

  
  1. Standard `fillTheGap` exercise working in the same way as **Practice Questions**. 
    You can define multiple (or just one) missing *gap(s)* (marked by `???` ) an user has to fill. 
    Answers are specified by `*` , first ones being the *correct* ones**.**
    
  Take the following snippet as example to **one** question format:
    ```
    ???
    x.equals('abc') // true
    x.equalsIgnoreCase('ABC') //true
    ```
    * String x = "abc";
    * ArrayList x = "abc";
    * StringBuffer x = new StringBuffer("abc");
    ---



  b. Simplified *multiple choice* question. You can have a single question *without* any `???` gap, there being only one *correct* answer (first one specified by `*` ).


  The syntax for multiple choice questions:
    ```
    Which command can update a user's 
    authentication token?
    ```
    * passwd
    * password
    * auth-token
    * ps
    ---
  
  In both cases, the first `*` denotes the right answer and `---`  means the end of the question. The question or snippet should be enclosed in code tags (three backticks ```). 
  
  

 **2. bugSpot**

  
  This game works by presenting the users a snippet of code for which they have to tap on the line of code that would produce an error or exception. 


  To mark which line is **wrong** (the *correct* answer of the game), it must be followed by a *commented line* ******with the explanation.
  
  Here’s one of the questions of the `Be Strict.` game:
    ---
    ## Game Content
    
    function foo() {
      "use strict";
      eval(42); 
    // eval not allowed in strict
    } 
    foo();
    ---


  During the game, each line of code is selectable. You point out the problematic line by adding a comment with an explanation of why the code isn’t working below it. Three dashes `---` are used to separate questions. There’s no need for the separator after the last question.


 **3. tetris**
 
****
  This is a true/false type of game.
  You must split the content of the game in two main categories (e.g. `true` or `false` / `java8`  or `not java8).`  
  
   The syntax is the following:
    ---
    ## Game Content
    
    remote:local
    
    ```false
    git clone <url>
    git pull
    git push
    ```
    ```true
    git init
    git commit
    git add .
    git rm README.md
    ```
  
  The first two fields, split by a `:` , represent the names of the `this is false` and `this is true` columns, respectively. When the users play the game, the would swipe either left if they think the answer is remote ( `false` with regard to being local), or right for a local command (`true` with regard to being local). 


  The answers should be placed inside code snippets, specifying which set of options is false and which one is true.

