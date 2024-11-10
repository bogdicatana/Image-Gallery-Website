# Image Gallery Website

An interactive image gallery website with smooth animations. Features a horizontal sliding gallery with image expansion and grid view capabilities as well as a lua script to let the user.

## Features

- Horizontal sliding image gallery
- Smooth animations and transitions
- Click to expand images
- Grid view for rest of the images in the category
- Blur effects for non-centered images
- Dynamic image loading from JSON

## Demo


https://github.com/user-attachments/assets/66d3e27e-91fd-4ebe-9639-1eed12ca8d8e



## Setup

1. Place your images in the `resources` folder with the following structure:

        ├── resources/ 
            ├── Category_Name_1/ │ 
                ├── image1.jpg  
                ├── image2.jpg 
                │ └── ... 
            ├── Category_Name_2/ 
                │ └── ...

2. Start the local server:

    ``` bash
    python3 -m http.server 8000 &
    ```

    OR

    ``` bash
    ./start.sh
    ```

3. Visit http://localhost:8000/website.html in your web browser

4. To stop the server:

    For UNIX-based systems only:

    ``` bash
    ./stop.sh
    ```

## Usage

### Controls

- Mouse drag/swipe: Navigate through images horizontally

- Mouse wheel: Scroll through images

- Click on an image in the gallery view: Expand the image

- × button in the top right: Return to gallery view

- Vertical scroll: Browse grid view (when image is expanded)

Technical Requirements

- Modern web browser with JavaScript enabled

- Python 3 (for local server)

- Lua with required modules: LuaFileSystem (lfs), dkjson

### Structure

- website.html - Main HTML structure

- stylesheet.css - All styling definitions

- script.js - Interactive gallery functionality

- getImages.lua - Image indexing script

- images.json - Generated image catalog

- start.sh & stop.sh - Server control scripts
