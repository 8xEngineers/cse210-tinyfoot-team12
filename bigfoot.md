---
layout: default
title: Bigfoot (no, not the creature that is very real)
description: Our take on the original library
permalink: /bigfoot
---

# Bigfoot.js Overview

## Introduction
[**Bigfoot.js**](https://bigfootjs.com) is a lightweight JavaScript library designed to enhance the handling of footnotes in web applications. By enabling users to view footnotes through interactive, clickable buttons, Bigfoot.js significantly improves both readability and aesthetic appeal.

## Design Decisions
Developed over 9 years ago, Bigfoot relies on **[Coffeescript](coffeesc…)** and **[SCSS](https://sass-lang.com)** for its core functionality. These files generate the necessary CSS and JavaScript code for the library. It must be noted that these pipelines have now been replaced with more convenient and modern tools. For example, [Littlefoot](http://littlefoot.js.org/) uses Typescript to build the required files and can be built using [`npm`](https://www.npmjs.com).

We tried to reason the decision of choosing Coffeescript instead of native Javascript for the plugin. Coffeescript is a more readable and concise language with less punctuation, function binding and syntactic sugar, which are all beneficial for developers. These could be some of the reasons why the authors chose Coffeescript for building the plugin. However, Coffeescript has its own issues - it has a steep learning curve for new users and it is not as popular as the other alternatives ([Typescript](https://www.typescriptlang.org), [Babel](https://babeljs.io), etc) in the present.

Furthermore, we note the following points -
- **Dependency on jQuery**: Bigfoot.js leverages jQuery for efficient DOM manipulation, event handling, and traversal.
- **Customizability**: The library allows for extensive customization through CSS/SCSS overrides, enabling users to tailor the appearance of footnotes to fit their specific design needs.

The main scripts for the plugin have been written in a _single file_ (not a great decision for modularity) and have been heavily documented providing the users with various customization options. The users can directly add the relevant CSS and add customization options in the Javascript call to Bigfoot to create the desired output. However, if a user requires a more complex setup that requires changing the source code, they have to go through the build process through Coffeescript which is outdated of sorts. 

The architecture of the code has been discussed more specfically in [the next section](#code-organization-and-quality).

## Code Organization and Quality
We have noted the following qualities in the code -
- **Consistent Naming Conventions**: The well-maintained naming conventions within the codebase help users understand the contents and purpose of each file.
- **Cross-Browser Compatibility**: The library is designed to function seamlessly across various web browsers and devices, supporting a variety of platforms with different window sizes.
- **Aesthetic Design**: The CSS focusses on having an aesthetic design, that probably gained the popularity for the library.


The root folder of Bigfoot.js contains the following files:
- **`README.md`**: Provides essential information about the `Bigfoot.js` library, including installation instructions and relevant details for users.
- **`bower.json`**: Manages library dependencies using Bower, specifying the required jQuery version and containing project metadata.
- **`readme-dev.md`**: Offers guidance for developers on how to contribute to or modify the Bigfoot.js library.
- **`dist` folder**: This folder is generated as a result of the build process. It contains the following files:
  - **`bigfoot.js`**: The source code for the library.
  - **`bigfoot.min.js`**: A minified version of `bigfoot.js`, optimized by removing whitespace and comments to reduce file size.
  - **`bigfoot-default.css`**: Contains the default styles for footnote display on webpages.
  - **`bigfoot-default.scss`**: The SCSS version of the default CSS file, allowing users to utilize SASS features like variables and nesting for better style customization.
  - **`src` folder**: Houses the source files for CoffeeScript and SCSS, which are compiled into JavaScript and CSS files using Grunt. More specifically, we have the Coffeescript file (`bigfoot.coffee`) and the SCSS files for different styling options.

As part of the build process, Grunt automates repetitive tasks, including:
- **Compiling CoffeeScript**: Converting `bigfoot.coffee` into JavaScript (`bigfoot.js`).
- **Compiling SCSS**: Transforming SCSS files into CSS, mapping source files to their compiled counterparts.
- **Concatenation**: Combining multiple SCSS files, including base styles and variants.
- **Autoprefixing**: Automatically adding vendor prefixes to the compiled CSS for broader compatibility.
- **Minification**: Using Uglify to compress the compiled JavaScript (`bigfoot.js`) into a smaller file (`bigfoot.min.js`), enhancing performance.

### Modernization Considerations
- **Dependency Management**: Currently utilizing Bower for dependency management, specifically for jQuery. However, Bower has been deprecated and is no longer maintained. Transitioning to more modern tools like NPM or Yarn for dependency management is advisable.
- **`bower.json`**: Specifies a dependency on jQuery version 1.8.0 or higher and organizes project metadata, defining the entry point as `bigfoot.coffee`. It also includes an 'ignore' section to prevent unnecessary files from being installed.

## Code Modifications 
We experimented with the plugin to explore the customization options and limitations in the plugin. The following code depicts a basic use case of the plugin along with the modifications we included.

```html
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Test Bigfoot Experiment</title>
    <link rel="stylesheet" href="bigfoot-default_New.css"> <!-- Link to Bigfoot CSS -->
    <!-- Include jQuery 1.8.3 -->
    <script src="https://code.jquery.com/jquery-1.8.3.min.js"></script>
</head>
<body>
    <h1>Bigfoot</h1>

    <!-- Footnote reference in the text -->
    <p>The message is hidden in the footnote.<sup id="fnref:1"><a href="#fn:1" rel="footnote">"FootNote"</a></sup></p>

    <!-- Hidden footnote content -->
    <div style="display:none;">
        <ol>
            <li id="fn:1">
                <p>CSE 210 is an interesting course. <a href="#fnref:1" rev="footnote">↩</a></p>
            </li>
        </ol>
    </div>

    <!-- Include Bigfoot.js -->
    <script src="bigfoot_New.js"></script>

    <script type="text/javascript">
        // Initialize Bigfoot.js with a custom hoverDelay
        $(document).ready(function() {
            $.bigfoot({
                //
                //    Customization options in Bigfoot
                //
                popoverCreateDelay: 5000,
                hoverDelay:500

            });

            // Modifying the appearance of footnote link through Javascript
            // We have replaced the default ellipses appearance with the text "Learn more" here
            setTimeout(function() {
                $('.bigfoot-footnote__button').text('Learn more');
             }, 100);
        });
    </script>
</body>
</html>
```

### Making modification
To build the modified version of the plugin, run the following commands to make your own build after modifying `bigfoot.coffee` file in the source folder
```
    npm install --global coffeescript
    coffee -c -o dist src/coffee # This only recompiles the main javascript file
```

For example, we have changed the appearance of the ellipses button to  "Learn more" in the modified version (see below). 

Experimenting with this simple example, we have the following observations
- Bigfoot indeed provides an easy interface for users to add customizable pop-over footnotes to their website with ease
- There are plenty of customization options including scope of footnote, appaerance, user-interaction behaviour, etc.
- Eventhough the code is well-documented, it is difficult to add modifications since it is not modular.
- The code has some good engineering practices -
    - It uses a consistent naming convention
    - It uses variable names instead of hard-coded values in SCSS 
    - 
- Although the plugin does not have any bugs, some parts of the source code seem like "band-aid" solutions to the problems. For example, we noticed this part of the code - 
    ```
      #*
      # The tagname of the (possible) parent of the footnote link. This is really only necessary when you want to also get rid of that element — for instance, when the link is inside a `sup` tag. This tag and the link itself will be joined together for attribute from which you can drawn in your markup for footnotes/ buttons.
      #
      # @access public
      # @author Chris Sauve
      # @since 2.1.1
      # @returns {String}
      # @default 'sup'
      anchorParentTagname : 'sup'
    ```
    This part essentially is trying to replace the `<sup>` tags around the footnotes so that its effects are removed. If there are other tags like `<sub>`, then their effects would still be rendered with the footnotes. See below - 

    This footnote embedded with &lt;sup&gt; is displayed normally - <sup id="fnref:1"><a href="#fn:1" id="fnref:1" rel="footnote">1</a></sup> but the one with &lt;sub&gt; is in the subscript - <sub id="fnref:2"><a href="#fn:2" id="fnref:2" rel="footnote">2</a></sub> </p>

    Apart from these, there are other issues such as unused variables, 



## Conclusion
Bigfoot.js presents a well-structured and modular approach to footnote management in web applications. While it effectively serves its purpose, transitioning to modern tools for dependency management and build processes could enhance its performance and maintainability.
