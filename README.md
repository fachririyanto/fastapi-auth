# FastAPI Auth
Role-based authentication using FastAPI (Python). Designed for an internal application where user registration is not allowed; users can join only by invitation from superadmin or admin roles.

### Tech Stack
- Database: PostgreSQL
- Backend: FastAPI (Python)
- Frontend: Vite, ReactJS, TypeScript, Tailwind (Shadcn)

### Modules
* [X] Authentication
  * [X] Login
  * [X] Forgot Password
  * [X] Reset Password
  * [X] Confirm Account
  * [X] Logout
* [X] Module Account
  * [X] Update Profile
  * [X] Change Password
* [X] Module User
  * [X] List Users
  * [X] Create User
  * [X] Change User Role
  * [X] Change User Active Status
  * [X] Delete User
* [X] Module Role
  * [X] List Roles
  * [X] Create Role
  * [X] Update Role
  * [X] Delete Role
* [X] Module Sandbox (Custom CRUD)
  * [X] List Sandbox
  * [X] Create Sandbox
  * [X] Update Sandbox
  * [X] Delete Sandbox

## How to run project
First, make sure you have PostgreSQL installed in your local computer or you can use Docker to run the database, for example [db-in-docker](https://github.com/fachririyanto/db-in-docker).

### Backend installation
Go to /api directory in your terminal, then type command below to create a python virtual environment:
```
python -m venv .venv

# or with uv

uv venv
```

The run command below to install the package:
```
pip install -r requirements.txt

# or with uv

uv pip install -r requirements.txt
```

Next create a .env file, you can copy the value from .env.example file to get started, then fill with the correct credentials. After that you must run the migration to install the neccessary tables. You can run the command below to create the tables.
```
# install tables
python cli_install.py
python cli_install --module sandbox # to install the specific module

# reinstall tables
python cli_reinstall.py
python cli_reinstall.py --module sandbox # to re-install the specific module

# uninstall tables
python cli_uninstall.py
python cli_uninstall.py --module sandbox # to un-install the specific module
```

After finish run the migration, now you can run the API by running the command below:
```
fastapi dev main.py
```

You can access the API at (http://127.0.0.1:8000) or the swagger at (http://127.0.0.1:8000/docs).

### Frontend installation
Go to /webapp directory in your terminal, then type the command below to install the package.
```
npm install

# or with bun

bun install
```

Create a .env file, you can copy the value from .env.example file to get started, then fill with the correct value.

Then run the frontend by running the command below:
```
npm run dev

# or with bun

bun run dev
```

You can access the frontend at (http://localhost:5173).

### Login credentials
You can test the login API with this login credentials:
1. Super Admin (Role: Super Admin)
   - email: superadmin@example.ai
   - password: Abcd@1234

2. Admin (Role: Admin)
   - email: admin@example.ai
   - password: Abcd@1234

3. Fachri (Role: User)
   - email: fachri@example.ai
   - password: Abcd@1234
