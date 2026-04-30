# AutoLink Backend

Fresh Django REST backend repository for AutoLink, a cross-platform social communication automation system.

## Architecture

- Django + Django REST Framework API at `/api/v1/`
- MySQL database, configurable through `.env`
- JWT authentication with Simple JWT
- Celery + Redis background worker entry points
- Modular apps for users, authentication, platforms, automation, subscriptions, payments, reports, and admin panel
- Service layer in `core/services/`

## Setup

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
Copy-Item .env.example .env
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## API Base

`http://127.0.0.1:8000/api/v1/`

## Frontend Apps

This repo also includes:

- `web/` - React user web app
- `admin/` - React admin dashboard
- `mobile/` - Flutter mobile scaffold

When Node/npm is available:

```powershell
cd web
npm install
npm run dev
```

```powershell
cd admin
npm install
npm run dev
```

Immediate no-build previews:

- `web/preview.html`
- `admin/preview.html`

Flutter:

```powershell
cd mobile
flutter pub get
flutter run
```

## Main Endpoints

- `POST /api/v1/auth/register/`
- `POST /api/v1/auth/login/`
- `POST /api/v1/auth/logout/`
- `GET /api/v1/user/profile/`
- `PUT /api/v1/user/update/`
- `POST /api/v1/platform/connect/`
- `GET /api/v1/platform/list/`
- `DELETE /api/v1/platform/disconnect/<id>/`
- `POST /api/v1/automation/create/`
- `GET /api/v1/automation/list/`
- `PUT /api/v1/automation/update/<id>/`
- `DELETE /api/v1/automation/delete/<id>/`
- `POST /api/v1/automation/toggle/<id>/`
- `GET /api/v1/subscription/status/`
- `POST /api/v1/subscription/upgrade/`
- `POST /api/v1/payments/`
- `GET /api/v1/reports/summary/`
- `GET /api/v1/reports/activity/`
- `GET /api/v1/admin/dashboard/`
