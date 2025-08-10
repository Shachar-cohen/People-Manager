# People Manager App

This is my People Manager application, a full-stack project I built using **Angular** for the frontend and **ASP.NET Core Web API** for the backend.  
The app lets you manage a people database — add, view, update, and delete records, with a simple login system and validation for all fields.


## Features
- **Login system** with predefined credentials
- **Add Person** with validation (unique ID, email, phone number)
- **View People** with search filter
- **Update Person** details
- **Delete Person** (soft delete with restore option)
- Responsive design


## Default Login
- **Username:** `admin`  
- **Password:** `1234`


## How to Run the Project

### 1. Requirements
Make sure you have installed:
- .NET 6 SDK or later
- Node.js (LTS version recommended)
- Angular CLI (`npm install -g @angular/cli`)


### 2. Clone the Repository
```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

### 3. Build the Angular Frontend
bash
Copy
Edit
cd people-app
npm install
ng build --configuration production

//This will create a build in dist/people-app/.


### 4. Copy the Build to the API wwwroot Folder
bash
Copy
Edit
# From the people-app folder
xcopy /E /I /Y dist\people-app ..\PeopleApi\wwwroot


### 5. Run the ASP.NET Core API
bash
Copy
Edit
cd ../PeopleApi
dotnet restore
dotnet run

### 6. Open the App
Go to:
http://localhost:5279


### How to Use:

Log in with the default credentials (admin / 1234).

Use the menu to:

Add new people

View all records and search by name

Edit existing records

Delete and restore people

All actions have validation and status messages.

###Notes:
The delete feature is soft delete, meaning data can be restored.

All data is stored in the backend database, and the API returns only active (non-deleted) people by default.
