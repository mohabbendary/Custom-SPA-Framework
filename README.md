# Custom SPA Framework for Laravel

This is a lightweight, customizable Single Page Application (SPA) framework designed to work seamlessly with Laravel. It allows you to load dynamic pages without refreshing the browser, while providing advanced features like lazy loading, infinite scroll, real-time notifications, and more.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Functions and Features](#functions-and-features)
5. [Laravel Integration](#laravel-integration)
6. [Customization](#customization)
7. [Contributing](#contributing)

---

## 1. Introduction

This framework enables you to create dynamic web applications using Laravel as the backend. It supports lazy loading, infinite scrolling, multilingual support, real-time notifications, and more.

---

## 2. Installation

To use this framework in your Laravel project, follow these steps:

### Step 1: Include the JavaScript File

Add the `app.js` file to your main Blade template (`resources/views/app.blade.php`):

```html
<script src="{{ asset('js/app.js') }}"></script>
```

### Step 2
Set Up Routes in Laravel Define routes in your `routes/web.php` file to serve dynamic content as JSON:

```php
Route::get('/page/{view}', function ($view) {
    if (view()->exists($view)) {
        return response()->json([
            'html' => view($view)->render(),
            'styles' => [],
            'scripts' => [],
        ]);
    } else {
        return response()->json(['error' => 'Page not found'], 404);
    }
})->name('page');

Route::get('/product/{id}', function ($id) {
    $product = App\Models\Product::find($id);

    if (!$product) {
        return response()->json(['error' => 'Product not found'], 404);
    }

    return response()->json([
        'html' => view('product', ['product' => $product])->render(),
        'styles' => ['/css/product.css'],
        'scripts' => ['/js/product.js'],
    ]);
});
```

### Step 3
Create Blade templates for your pages in the `resources/views/directory`. For example:

```html
<h1>Welcome to Our Website</h1>
<p>This is the home page.</p>
```

```html
<h1>{{ $product->name }}</h1>
<p>{{ $product->description }}</p>
<p>Price: {{ $product->price }}</p>
```

### 3. Usage After setting up the framework, you can start using its features by calling the appropriate functions from the App object.

# Basic Setup
  1. Initialize Lazy Loading:
     Call `App.initializeLazyLoading()` to enable lazy loading for images.
     
      ```javascript
      App.initializeLazyLoading();
      ```
  3. Enable Infinite Scroll:
     Use the enableInfiniteScroll function to add infinite scrolling to a container.
     
      ```javascript
      App.enableInfiniteScroll('#products-container', '/api/products');
      ```
  5. Enable Multilingual Support:
     Use the enableMultilingualSupport function to add language switching.
     
      ```javascript
      const { setLanguage } = App.enableMultilingualSupport('en');
      setLanguage('ar'); // Switch to Arabic
      ```
  7. Enable Real-Time Notifications:
     Use the enableRealTimeNotifications function to display real-time notifications.
     
      ```javascript
      App.enableRealTimeNotifications('/api/notifications');
      ```
 ### 4. Functions and Features
 Here’s a detailed explanation of each function included in the framework:

   ## Lazy Loading for Images
  
   * Automatically adds a loading animation to parent containers of images and loads them only when they are in the viewport.
   
   * Call `App.initializeLazyLoading()` to initialize.
  
   # Infinite Scroll
  
   * Allows users to load more content as they scroll down.
   
   * Usage: 
     ```javascript 
     App.enableInfiniteScroll('#container-id', '/api/data-endpoint');
     ```
  
   ## Dynamic Filtering and Sorting
  
   * Enables filtering and sorting of data dynamically.
   
   * Usage: 
     ```javascript 
     App.enableDynamicFiltering('/api/filter-endpoint', 'filter-form-id', 'results-container-id');
     ```
  
   ## Reader Mode
  
   * Provides a simplified reading experience by adjusting the layout.
   
   * Usage: 
     ```javascript 
     App.enableReaderMode('toggle-button-id', '#content-selector');
     ```
  
   ## Real-Time Notifications
   
   * Displays notifications in real-time using an API endpoint.
   
   * Usage: 
     ```javascript 
     App.enableRealTimeNotifications('/api/notifications');
     ```
  
   ## Print Content
   
   * Prints specific content based on a selector.
   
   * Usage: 
     ```javascript 
     App.printContent('#content-to-print', '/path/to/print.css');
     ```
  
   ## Export to PDF
   
   * Exports content to a PDF file.
   
   * Usage: 
     ```javascript 
     App.exportToPDF('#content-to-export', 'document.pdf');
     ```
  
   ## Multilingual Support
   
   * Supports multiple languages with automatic translation.
   
   * Usage: 
     ```javascript 
     const { setLanguage } = App.enableMultilingualSupport('en');
     setLanguage('ar'); // Switch to Arabic
     ```
  
   ## Auto Dark Mode
   
   * Automatically switches to dark mode based on the time of day.
   
   * Usage: 
     ```javascript 
     App.enableAutoDarkMode();
     ```
  
   # Local Notifications
   
   * Sends local notifications to the user.
   
   * Usage: 
     ```javascript 
     App.enableLocalNotifications(60000); // Send notifications every minute
     ```
  
   ## Form State Saving
   
   * Saves form states in `localStorage` to persist data across sessions.
   
   * Automatically enabled when the script is loaded.
  
   ## Responsive Design Enhancements
   
   * Adds a `mobile-layout` class to the body for responsive design.
   
   * Automatically enabled when the script is loaded.
  
   ## Local Notifications
   
   * Enables advanced search functionality with filters.
   
   * Usage: 
     ```javascript 
     App.enableAdvancedSearch('search-form-id', 'results-container-id');
     ```

 ### 5. Laravel Integration
 How It Works

   #### 1. Dynamic Pages:
   * The framework fetches page content from Laravel endpoints as JSON.
   * Example:
  
     ```php
       Route::get('/page/{view}', function ($view) {
          if (view()->exists($view)) {
              return response()->json([
                  'html' => view($view)->render(),
                  'styles' => [],
                  'scripts' => [],
              ]);
          } else {
              return response()->json(['error' => 'Page not found'], 404);
          }
      });
     ```
     
   #### 2. Dynamic Data:
   * Use Laravel models and controllers to provide dynamic data (e.g., products, articles).
   * Example:
  
     ```php
       Route::get('/product/{id}', function ($id) {
          $product = App\Models\Product::find($id);
          return response()->json([
              'html' => view('product', ['product' => $product])->render(),
              'styles' => ['/css/product.css'],
              'scripts' => ['/js/product.js'],
          ]);
      });
     ```

   #### 3. API Endpoints:
   * Define API endpoints for features like infinite scroll, filtering, and real-time notifications.
   * Example:
  
     ```php
        Route::get('/api/products', function (Request $request) {
          return App\Models\Product::paginate(10, ['*'], 'page', $request->input('page', 1));
        });
     ```
     
 ### 6. Customization
 You can customize the framework by modifying the following:

  1.  **CSS Classes:**
      
      *   Adjust the CSS classes used for lazy loading (**image-container-load**) and other features.
          
  2.  **Notification Messages:**
      
      *   Customize notification messages in the **showNotification** function.
          
  3.  **Language Files:**
      
      *   Add or modify language files in the **resources/lang/** directory for multilingual support.
          
  4.  **Endpoints:**
      
      *   Modify API endpoints in Laravel to fit your project's requirements.


  ### 7. Contributing
  If you want to contribute to this framework, feel free to fork the repository and submit pull requests. Suggestions and improvements are always welcome!
  
  ### 8. Example Project Structure
  Here’s how your Laravel project might look after integrating the framework:
  
  ## Blade Templates:
  * `resources/views/home.blade.php`
  * `resources/views/product.blade.php`
    
  ## Routes:
   * `routes/web.php`
     
    ```php
      Route::get('/page/{view}', [\App\Http\Controllers\PageController::class, 'show']);
      Route::get('/product/{id}', [\App\Http\Controllers\ProductController::class, 'show']);
    ```

  ## Controllers:
  * `app/Http/Controllers/PageController.php`
    
    ```php
      public function show($view) {
          if (view()->exists($view)) {
              return response()->json([
                  'html' => view($view)->render(),
                  'styles' => [],
                  'scripts' => [],
              ]);
          } else {
              return response()->json(['error' => 'Page not found'], 404);
          }
      }
    ```
    
  * `app/Http/Controllers/ProductController.php`

    ```php
      public function show($id) {
          $product = App\Models\Product::find($id);
          return response()->json([
              'html' => view('product', ['product' => $product])->render(),
              'styles' => ['/css/product.css'],
              'scripts' => ['/js/product.js'],
          ]);
      }
    ```

## 9. Known Issues
----------------

*   Ensure that all API endpoints return valid JSON responses.
    
*   Test lazy loading and infinite scroll thoroughly to avoid performance issues.
    

## 10. License
------------

This framework is open-source and available under the MIT License. You are free to use, modify, and distribute it as needed.

## 11. Conclusion
---------------

This SPA framework is designed to simplify the development of dynamic web applications using Laravel. With its modular structure and extensive features, it can be easily integrated into any type of project, whether it's an e-commerce platform, CRM, or LMS.

If you have any questions or need further assistance, feel free to reach out! 😊


## Example Usage
Here’s an example of how to use the framework in a typical Laravel project:

```javascript
  // Initialize lazy loading
  App.initializeLazyLoading();
  
  // Enable infinite scroll for products
  App.enableInfiniteScroll('#products-container', '/api/products');
  
  // Enable multilingual support
  const { setLanguage } = App.enableMultilingualSupport('en');
  setLanguage('ar'); // Switch to Arabic
  
  // Enable real-time notifications
  App.enableRealTimeNotifications('/api/notifications');
  
  // Enable advanced search
  App.enableAdvancedSearch('advanced-search-form', 'search-results-container');
```
      
