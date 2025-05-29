from flask import render_template, redirect, url_for, flash, request
from taskmanager import app, db
from taskmanager.forms import RegistrationForm, LoginForm
from taskmanager.models import User
from werkzeug.security import generate_password_hash, check_password_hash

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        # Check if username already exists
        existing_user = User.query.filter_by(username=form.username.data).first()
        if existing_user:
            flash("Username already taken. Please choose a different one.", "danger")
            return redirect(url_for('register'))
        
        # Hash password securely
        hashed_password = generate_password_hash(form.password.data, method='pbkdf2:sha256')
        user = User(username=form.username.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        
        flash("Account created successfully! Please log in.", "success")
        return redirect(url_for("login"))
    return render_template("register.html", form=form)

@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and check_password_hash(user.password, form.password.data):
            flash("Login successful!", "success")
            return redirect(url_for("home"))  # Redirect to dashboard if you want
        else:
            flash("Login unsuccessful. Please check your username and password.", "danger")
    return render_template("login.html", form=form)


