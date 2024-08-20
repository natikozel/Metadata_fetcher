# Full-Stack Metadata Fetcher

## Overview

The Full-Stack Metadata Fetcher is a web application designed to fetch and display metadata from a list of provided
URLs.
The application consists of a front-end built with React and a back-end built with Node and Express.js.
It includes features such as rate limiting, CSRF protection, and data sanitization to ensure security and reliability.
The application also has comprehensive error handling and testing using Jest.
The back-end processes the URLs, sanitizes them, and fetches metadata while the front-end handles user input and
displays the fetched metadata.

## Setup

1. **Clone the repository**:
    ```sh
    git clone https://github.com/natikozel/Metadata-Fetcher.git
    ```

2. **Install dependencies for both front-end and back-end**:
    ```sh
    cd frontend
    npm install
    cd ../backend
    npm install
    ```

3. **Environment Variables**:
    - Create a `.env` file in the root directory.
    - Add the following environment variables:
        ```
        PORT=8080
        ```

4. **Run the application**:
    - Open a new terminal and run the front-end:
        ```sh
        cd frontend
        npm start
        ```
    - Open another terminal and run the back-end:
        ```sh
        cd backend
        npm run dev
        ```

## Testing

1. **Run unit tests for the front-end**:
    ```sh
    cd frontend
    npm test
    ```

2. **Run unit tests for the back-end**:
    ```sh
    cd backend
    npm test
    ```

## Design Choices and Trade-offs

1. **Rate Limiting**:
    - **Choice**: Implemented a custom rate limiting middleware.
    - **Trade-off**: Provides more control and customization but requires additional maintenance and testing.

2. **CSRF Protection**:
    - **Choice**: Used `csurf` middleware for CSRF protection.
    - **Trade-off**: Ensures security against CSRF attacks but requires additional setup for handling CSRF tokens in
      tests.

3. **Error Handling**:
    - **Choice**: Centralized error handling using a custom `FetchError` class and middleware.
    - **Trade-off**: Simplifies error management but requires consistent use of the custom error class throughout the
      application.

4. **Testing**:
    - **Choice**: Used `jest` for mocking and running tests.
    - **Trade-off**: Provides a robust testing framework but requires additional setup for mocking middleware and
      handling asynchronous tests.

5. **Security**:
    - **Choice**: Used `helmet` for setting various HTTP headers to secure the app.
    - **Trade-off**: Enhances security but may require configuration adjustments for specific use cases.

6. **Data Sanitization**:
    - **Choice**: Used `xss` and `ssrf` libraries for sanitizing URLs.
    - **Trade-off**: Protects against XSS and SSRF attacks but adds overhead to request processing.

7. **Middleware**:
    - **Choice**: Modularized middleware for rate limiting, header protection, and error handling.
    - **Trade-off**: Improves code organization and reusability but increases the number of files and complexity.

8. **Frontend State Management**:
    - **Choice**: Used Redux to manage state and handle HTTP requests.
    - **Trade-off**: Provides a predictable state container but adds complexity and boilerplate code.

9. **Frontend Component Structure**:
    - **Choice**: Split frontend into multiple components.
    - **Trade-off**: Enhances code maintainability and reusability but requires careful management of component
      interactions.

10. **Backend URL Validation**:
    - **Choice**: Used regex to verify URLs.
    - **Trade-off**: Ensures URLs are valid but requires careful crafting and testing of regex patterns.

11. **Backend Metadata Fetching**:
    - **Choice**: Used `fetchMetadata.js` to handle all types of possible errors.
    - **Trade-off**: Centralizes error handling for metadata fetching but requires comprehensive error handling logic.


## Live Demo

[Link to live demo](https:TODO)