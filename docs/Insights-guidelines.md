# Insight guidelines

## Example

Before we get started, [here](https://github.com/sagelabs/content/blob/master/Linux/System%20Management/finding-open-files-with-lsof.md)'s an example insight and [here](https://insights.enki.com/insight/5767a0cb47bdc6a758158cd8)’s how it looks on **Enki**:

# What is an insight?
## **Insight**

An **insight** is a short and concise piece of knowledge containing raw learning material. These can vary in purpose and sometimes look, but generally an insight **should**:

  - express meaningful (and interesting) information
  - convey information into a mobile-friendly structure
  - **not** contain false information
  - **not** be purely opinionated


Multiple **insights**  are chained up and presented to a user in the form of a **Workout.**
Insights are **directly** linked to other specific content-types:

  - Practice Question (PQ)
  - Revise Question (RQ)


This means each insight has its own **PQ** and **RQ.**  The main difference between them is that the **PQ** is shown directly within an insight, while the **RQ** is shown externally (before/without) seeing the insight.

## **Workout**

A **Workout** is a bundle of ~5 insights and the "unit of learning" a user is meant to complete in a single session. From a user's perspective, they complete at least one workout per day.

Workouts can be:

  - **Normal** **workouts (randomly generated)** - 5 Insights of the same **Level** and **Subtopic** (a user opts-in for)
     For example 5 random `beginner` insights on `Ecmascript 2015` (JavaScript) can make up such a workout

  - **Custom Workouts** - the exact insights and their order can be “hardcoded” into a custom workout
    The purpose of these workouts is to provide a mean of structure and elaboration on a certain subtopic/subject of discussion.

  - **Revision Workouts -** a workout generated based on a user’s seen insights (no new content is required), in which **revise questions** are asked before the posibility of reviewing the insight
    The purpose of this workout is to ensure the user remembers the concepts learnt in a previous workout
## **Practice Question**

A **Practice Question** is a multiple-gaps exercise shown to users directly when reading the **insight**, at the bottom. Because it’s attached to the related **insight**, this question doesn’t have to be too general, but more specific with the information.


  Keep in mind that this is not a **must** as there are certain theoretical insights that won’t fit a good practice question.


## **Revise Question**

A **Revise Question** is also a multiple-gaps exercise with the exact format as the **PQ**.
These are shown in either **Revision-Workouts** or in **Quick-Tests**, their purpose being to test the user’s knowledge on specific insights/subject areas that he already went though.


  This question will be shown first without its related insights so the information on this should be a little bit more general and easier to remember than the Practice Question.


# What is an insight made out of?

A single **insight** is made out of multiple fields.
Some of these are **mandatory** (**M)**, while other’s can sometimes be omitted.

Insights are broken down into two sections, __YAML__ and __Markdown__.

The YAML section should be at the top of the document, wrapped with with three dashes and a new line: `---\n`, and contain the following properties.

## YAML
### **Author [M]**

This field should specify the username of the user creating the insight.

The author is specified by the following line:

    author: catalin


### **Levels [M]**

The **levels** mandatory field indicates the target audience of an insight, experience-wise.

The levels currently available for an insight are:

- `beginner`
- `basic`
- `medium`
- `advanced`

This allows different recipes of level combinations such as:

- `beginner` - fit for people with little to none knowledge on the subject
- `medium` , `advanced` - fit for both confident and experts
- `beginner` , `basic` , `medium` , `advanced`  - will be seen by all users, regardless of their level

The levels should be specified in the following format:

    levels:

      - advanced

      - medium

      - basic

      - beginner


### **Tags**

This field is used to add specific tags to insights for later querying and filtering

ex. For a python insight `python 3.0` could be a representative tag ..

Tags are specified by a simple list such as:

    tags:

      - polyfill

      - another-tag


### **Type [M]**

Because games are fundamentally insights as well, this field is used to differentiate the type of game.

For **insights**, this field should be set to `normal` .
For games check the game guideline:
- fill the gap
- bug splat
- tetris

This field should look like:

    type: normal

### **Standards [M]**

A Topic's [**standards**](https://github.com/sagelabs/standards/) represent major concepts within the topic that the user should understand. These standards are broken down into more granular ideas as **Objectives** (See [Standards Repo](https://github.com/sagelabs/standards/) for a comprehensive list of standards). All content should have an associated standard.

Standards are defined with the following syntax:

`<topic>.<standard>.<objective #>: <points value>`

This insight, [Double and single quotes](https://raw.githubusercontent.com/enkidevs/curriculum/f4beeefe8bfdf191d6498dc35d0815ed57fa12e5/javascript/core/syntax/double-and-single-quotes.md), is associated with the `2nd` objective of the `javascript-syntax` standard in the `js` topic, so it will list `js.javascript-syntax.2` as one of its standards. 

#### **Points**

Points are a great way to **weight content within a standard**. 

As a general rule, **Insights** are worth **10 points**, while more hands-on **Exercises** and other assessment are worth 1000 points.

### **inAlgoPool**

You can use the **inAlgoPool** boolean flag to state if an insight should be included in the random workout generations.
Custom workouts can only be made up of insights with this field set to **false**.

To use it simply append:

    inAlgoPool: false



### **Category [M]**

The category filed is also a mandatory field used to indicate the user the type of information he is presented with.

The possible categories are:

- `fundamental`
  - the goal is to teach a core feature or fact of the **topic** or **subtopic** (e.g a core feature of `JavaScript` )
  - a feature or fact should only be considered `fundamental` if it's an important characteristic of the topic/language (in other words: *it makes it special*)
  - basic facts and features (expected and commonly found in other languages) should not be considered `fundamental`

- `feature`
  - the goal is to teach that something exists (a function, a method, etc..)
  - the insight also need to explain briefly what it does
  - the user is trusted to guess/understand when and why to use it
  - it must be non-trivial that this feature exists (some people may not suspect it does)
  - the title should be the name of the feature/function/method

- `good practice`
  - the goal is to recommend the user to get into a good habit (of doing something in a particular way)
  - the **insight** should explain briefly why this is considered a "*good*" habit
  - it should not be phrased as "you should always do X" (because there are always exceptions), but rather as "you would usually want to do X by default" (in a patronising way)
  - reviewers should not be too picky if they don't agree 100% with the recommendation (these types of insights will always sound a bit subjective)

- `how to`
  - the goal is to teach one possible way of doing something (typically by combining multiple functions and features)
  - the name of the insight should the name of what we want to teach to do (and NOT the name of the function or method used to do it)
  - to be interesting, the insights must be teaching a particularly good way of doing something (either a short way, an efficient way, an elegant way, or an idiomatic way)

- `pattern / idioms`  
  - the goal is to teach a common pattern or common way of doing something
  - to be interesting, the insight must explain briefly why this is commonly used
  - the difference between `idiom` s and `how-to` s is sometimes subtle, but the presentation is typically different because an `idiom` insight should directly present a "pattern" (for the people who recognise to skip the rest of the insight), rather than presenting first a goal and then a way of achieving it
  - unlike `how-to` s, `idioms` are not necessary a "good" way of doing something, just a common way (worth learning because you will probably encounter it in existing code and will need to understand it)

- `caveats / gotchas`
  - the goal is to warn users about common bugs and misconceptions

The **category** field should look like:

    category: good practice


### **Notes**

The notes field is the place where internal observations can be made on an insight.
These are not shown to the user

Simply add:

    notes: 'here is my note'

### **Parent**

This is an optional field used to express **weak** parent-child relationships between **insights**.

With it you can tell a **parent** insight such that the current **insight** won’t be shown to the user before he didn’t see the **parent** insight.
To use this field simply set its value to the **slug** (short file title) of the **parent** insight.

Keep in mind this won’t make chained insights go into the same workout. To achieve that please refer to **Custom Workouts.**

Example parent usage:

    parent: session-handling-in-express


### **Links**

The links fields is not a mandatory one, but it’s often used to link insight to external resources that can act as either further reading on the topic discussed or the source of the information.

To attach **links**, the following format must be used:

    links:

      - >-
        [facebook.github.io](https://facebook.github.io/react/tips/false-in-jsx.html){website}

    //  - >-
    //   [short-name](full-url){resource-type}

## Markdown

### **Title [M]**

The title should be able to express the main idea of the **content**.
It must be between `4` and `120` characters long.

  *Note*: Keep in mind that the title of the insight is also shown with the **RQ**. That being said, you should take care when writing those such that the title doesn’t directly give away the answer.

The title can use `code blocks`  inside it.

The title is specified at the top of the insight file preceded with an `#` :

     # Custom `propType`'s to be required

### **Content [M]**

The **content** is the main part of the **insight**, here going most of the information.
The **content** of an insight is the place to provide more detail, explanation and examples.

Within the content one can use:

  - `code blocks`
[](https://paper.dropbox.com/doc/Insight-guidelines-imighkPA8aXadMfQ2ukka#:h2=Code-blocks)  - `code snippets`
  - `footnotes`

The maximum permitted column width of the content is `44` chars long. That means no words (or lines within code snippets) should exceed `44` chars.
If a line of your code is beyond `44` characters, please add a line break at a readable point and continue on the next line with a two-space indent to indicate continuation. This ensures the insight will be readable on a mobile screen.

The **content** of the insight is specified like:

    ---
    ## Content

    The usage of the `false` keyword in **JSX** and implicitly **React** is worth mentioning because of its volatile behaviour.

    First of all, `false` is widely used to specify that a **React** element has no child:
    ```
    ReactDOM.render(<div>{false}</div>,
                                  myNode);
    ```



### **Practice Question**

Even though **PQ**s are not mandatory, we want to keep a high rate of practical insights.
That means most of the insight **should** have a **PQ**. (`>70%` of insights).

Keep in mind, `code snippets` and `code blocks` can go inside the **Practice** question.
For example:

    ---
    ## Practice

    You can get *detailed* information about your Linux distribution by running:
    ```
    $ ???
    ```
    *`lsb_release -a`
    *`lsb_release -i`
    *`ls_release -a`
    *`lin_release`


### **Revise Question**

**RQ** is also a non-compulsory field, however we want a **RQ** for every insight.
The percentage of insights with RQ we aim for is `100-99%` .
This will guarantee the insight can also go into a **Quick-Test** or a **Revision Workout**.


Keep in mind, `code snippets` and `code blocks` can go inside the **Revision** question.
For example:

    ---
    ##Revision

    You can get *detailed* information about your Linux distribution by running:
    ```
    $ ???
    ```
    *`lsb_release -a`
    *`lsb_release -i`
    *`ls_release -a`
    *`lin_release`


### **Footnotes**

**Footnotes** are used to elaborate on some information that isn’t necessarily of interest to **all** users or necessarily relevant to the main topic of the insight.


Within **Footnotes** you can also use both `code blocks` and `code snippets` .
The **Footnotes** field looks like:

    ---
    ## Footnotes

    [1:LSB]
    **LSB** in the `lsb_release` command stands for *Linux Standard Base* which is a joint project by several Linux Distributions aiming to standardise the software system architecture.


# What should I keep in mind when writing an insight?
1. General Editorial Guidelines
2. Editorial Guidelines for Linux Content


# How do I write an insight?


## **Insight Creation**

To see the procedure of insight creation check [this](https://github.com/enkidevs/guidelines/blob/master/docs/GETTING_STARTED.md).


## **Insight format**

The full markdown format of an insight should look like:


    ---
    author: authorName

    levels:

      - basic

    inAlgoPool: false

    category: insightCategory

    tags:

      - insightTag1

    type: normal
    
    standards:
      cs.idenfity-mcguffins.0: 10

    notes: 'a random note'

    parent: parent-insight-slug

    links:

      - >-
        [short-name](full-url){resource-type)

    ---
    ## Content
    # Insight Title

    Insight content goes here[1]
    ---
    ## Practice

    Practice question content goes heres
    ---
    ## Revision

    Revision question content goes heres
    ---
    ## Footnotes

    [1:Footnote Name]
    Footnotes content that will be linked with the word in content marked with [1].



## **Specific Insight Syntax**

**Code blocks**
Text inside two ``` (back ticks) will be automatically converted into a code-block coloured by the topic colour:

// TODO: add image

**Code snippets**

Wrapping multi-line text with ````` (three back ticks) will convert it to a code snippet. In addition, you can also specify the language used for parsing after the first set of back ticks:


    ```javascript
    var x = []
    // code snippet using javaScript highlighting
    ```

    ```java
    private static int x = 30;
    // code snippet using Java highlighting
    ```

//TODO add images


******Fill-the-gap questions**

These questions can need to have 1+ gaps (specified by `???` ) and a number of answers (specified by lines starting with `*` ). The line number specifies the number of the gap correctly fitting the answer.

For example:


    The sky is ???.
    Grass is ???.

     *blue
     *green
     *red
     *yellow

     // blue will correctly fit the first gap
     // green will correctly fit the second gap


// TODO: to add images

**Footnotes syntax**

You can add footnotes to words in your insight (content field) by specifying a number inside `[]` (square brackets) and in the **Footnotes** field (under **Content**) elaborating the footnote.


    ---
    ## Content

    Insight content goes here[1]
    ---
    ## Footnotes

    [1:Footnote Name]
    Footnotes content that will be linked with the word in content marked with [1].


Within footnotes, `code blocks` and `code snippets` can be used for illustration purposes.
