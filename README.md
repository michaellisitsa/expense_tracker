# expense_tracker

## Docker
how to set up postgres in python.config
https://www.1strategy.com/blog/2017/05/23/tutorial-django-elastic-beanstalk/
linux extras
https://stackoverflow.com/a/63204453
Change to t3 micro in command line
eb create --single -db -db.engine postgres -db.i db.t3.micro

## Progress
Visit the live website on:
[https://web-expense-tracker.herokuapp.com/](https://web-expense-tracker.herokuapp.com/)

- [x] Sign up with email and password\n
- [x] Enter your expenses and watch the totals increase\n
- [x] Store the type of expense and/or allow filtering by type\n
- [x] Connect to Django Database
- [x] Allow deleting records without refreshing whole page
- [x] Add formsets, to add multiple expenses at one time.
- [x] Add logic to estimate your expenses per month, and a top summary bar.
- [ ] Add diagrams showing history of expense

# Integrated Django & React App

React has been integrated into the Django App.
Refer post https://dev.to/shakib609/deploy-your-django-react-js-app-to-heroku-2bck for details.

# Development

- Run `python manage.py runserver` in the root directory
- For now, you need to authenticate via the standard Django server localhost:8000/
- Then for hot reloading, run `cd reactapp; npm start` and navigate to localhost:3000
