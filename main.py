from flask import (Flask, render_template, 
                   url_for, request, 
                   session, redirect, 
                   flash, get_flashed_messages)


app = Flask(__name__,
            template_folder='app/templates',
            static_folder='app/static')

@app.before_request
def init_website():
    ...

@app.route('/login')
def handle_homepage():
    return render_template('login.html')


@app.route('/admin')
def handle_admin():
    return render_template('admin_panel.html', active_page='admin')


@app.route('/team')
def handle_team():
    return render_template('team.html', active_page='team')


@app.route('/invoices')
def handle_invoices():
    return render_template('invoices.html', active_page='invoices')

@app.route('/todo')
def handle_todo():
    return render_template('todo.html', active_page='todo')

@app.route('/calendar')
def handle_calendar():
    return render_template('calendar.html', active_page='calendar')


@app.route('/profile')
def handle_profile():
    return render_template('profile.html', active_page='profile')


if __name__ == "__main__":
    app.run(port=5000, debug=True)