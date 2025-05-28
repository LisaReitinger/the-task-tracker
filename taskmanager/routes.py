from flask import render_template, redirect, url_for, flash
from taskmanager import app, db
from taskmanager.forms import RegistrationForm, LoginForm
from taskmanager.models import User

# Keep the home route
@app.route("/")
def home():
    return render_template("index.html")

# Add the register route
@app.route("/register", methods=["GET", "POST"])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(
            username=form.username.data,
            password=form.password.data  
        )
        db.session.add(user)
        db.session.commit()
        flash("Account created successfully!", "success")
        return redirect(url_for("home"))
    return render_template("register.html", form=form)

@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and user.password == form.password.data:  # Later, replace with password hash check
            flash("Login successful!", "success")
            return redirect(url_for("home"))
        else:
            flash("Login unsuccessful. Please check your username and password", "danger")
    return render_template("login.html", form=form)

