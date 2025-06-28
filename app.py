from flask import Flask, render_template, redirect, url_for, flash, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager, current_user, login_user, logout_user, login_required

from config import Config
from models import db, User # ApiConfig, NewsSource, CrawledArticle, DraftArticle, PublishedArticle, SystemLog (import others as needed)
from forms import LoginForm, RegistrationForm

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)
login = LoginManager(app)
login.login_view = 'login' # The name of the view to redirect to when login is required
login.login_message = "请先登录以访问此页面。"
login.login_message_category = "info"


@login.user_loader
def load_user(id):
    return User.query.get(int(id))

# Basic route for home/index
@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return render_template('index.html', title='Welcome')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('用户名或密码无效', 'danger')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_for(next_page.lstrip('/')) == url_for('index'): # Security: check if next_page is safe
            next_page = url_for('dashboard')
        flash(f'欢迎回来, {user.username}!', 'success')
        return redirect(next_page)
    return render_template('login.html', title='登录', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('您已成功登出。', 'info')
    return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('恭喜您，注册成功！现在可以登录了。', 'success')
        return redirect(url_for('login'))
    return render_template('register.html', title='注册', form=form)


@app.route('/dashboard')
@login_required # Protect this route
def dashboard():
    return render_template('dashboard.html', title='数据仪表盘')

@app.route('/api_config')
@login_required
def api_config_view():
    return render_template('api_config.html', title='AI API 配置')

@app.route('/news_source_management')
@login_required
def news_source_management_view():
    return render_template('news_source_management.html', title='资讯网站管理')

@app.route('/crawled_content')
@login_required
def crawled_content_view():
    return render_template('crawled_content.html', title='AI抓取资讯')

@app.route('/drafts')
@login_required
def drafts_view():
    return render_template('drafts.html', title='草稿箱')

@app.route('/published_articles')
@login_required
def published_articles_view():
    return render_template('published_articles.html', title='已发布文章')

@app.route('/user_management')
@login_required # Add admin check later
def user_management_view():
    # if not current_user.is_admin:
    #     flash('您没有权限访问此页面。', 'warning')
    #     return redirect(url_for('dashboard'))
    return render_template('user_management.html', title='用户账号管理')

@app.route('/system_logs')
@login_required # Add admin check later
def system_logs_view():
    # if not current_user.is_admin:
    #     flash('您没有权限访问此页面。', 'warning')
    #     return redirect(url_for('dashboard'))
    return render_template('system_logs.html', title='系统日志')


if __name__ == '__main__':
    # Ensure you have run flask db init, migrate, upgrade
    # export FLASK_APP=app.py
    # flask db init  (only once to create migration repository)
    # flask db migrate -m "Initial database schema"
    # flask db upgrade
    app.run(debug=True)
