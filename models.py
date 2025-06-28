from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

# It's good practice to initialize db here and then in app.py call db.init_app(app)
# This helps avoid circular imports with Blueprints or other app structures.
db = SQLAlchemy()

class User(UserMixin, db.Model): # Add UserMixin
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True, nullable=False)
    email = db.Column(db.String(120), index=True, unique=True) # Added email
    password_hash = db.Column(db.String(256))
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships (examples, uncomment and adjust as needed)
    # api_configs = db.relationship('ApiConfig', backref='owner', lazy='dynamic')
    # news_sources = db.relationship('NewsSource', backref='owner', lazy='dynamic')
    # crawled_articles = db.relationship('CrawledArticle', backref='author_user', lazy='dynamic')
    # draft_articles = db.relationship('DraftArticle', backref='author_user', lazy='dynamic')
    # published_articles = db.relationship('PublishedArticle', backref='author_user', lazy='dynamic')
    # system_logs = db.relationship('SystemLog', backref='user_obj', lazy='dynamic')


    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'

class ApiConfig(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    platform_name = db.Column(db.String(128), nullable=False, unique=True) # e.g., OpenAI, Google AI, etc.
    api_key = db.Column(db.String(256), nullable=False)
    api_secret = db.Column(db.String(256)) # Optional, some APIs might not have it
    other_config = db.Column(db.Text) # For any other JSON or text-based config
    user_id = db.Column(db.Integer, db.ForeignKey('user.id')) # Link to the user who added this
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<ApiConfig {self.platform_name}>'

class NewsSource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    url = db.Column(db.String(512), nullable=False, unique=True)
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<NewsSource {self.name}>'

class CrawledArticle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(256), nullable=False)
    text_content = db.Column(db.Text)
    # Storing full HTML might be large, consider if just text is enough or if HTML is needed for context
    # html_content = db.Column(db.Text)
    image_urls = db.Column(db.Text) # Store as comma-separated URLs or JSON list
    source_url = db.Column(db.String(512), index=True)
    original_publication_date = db.Column(db.DateTime)
    author = db.Column(db.String(128))
    news_source_id = db.Column(db.Integer, db.ForeignKey('news_source.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    crawled_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<CrawledArticle {self.title[:50]}>'

class DraftArticle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(256), nullable=False)
    generated_content = db.Column(db.Text, nullable=False)
    # Store generated images - could be URLs or paths to locally stored images if AI generates them
    generated_image_urls = db.Column(db.Text) # Store as comma-separated URLs or JSON list
    status = db.Column(db.String(64), default='draft') # e.g., draft, pending_review, approved
    crawled_article_id = db.Column(db.Integer, db.ForeignKey('crawled_article.id')) # Optional: link to original source
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<DraftArticle {self.title[:50]}>'

class PublishedArticle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(256), nullable=False)
    content = db.Column(db.Text, nullable=False) # Final content published
    # wechat_article_url = db.Column(db.String(512)) # URL of the article on WeChat MP
    # wechat_publish_status = db.Column(db.String(64)) # e.g., success, failed, pending
    # wechat_publish_response = db.Column(db.Text) # Store API response from WeChat
    platform_name = db.Column(db.String(128), default="WeChat") # In case you expand to other platforms
    platform_article_id = db.Column(db.String(256)) # Article ID on the platform
    publish_status = db.Column(db.String(64), default='unknown') # e.g., success, failed
    publish_response_details = db.Column(db.Text) # For storing any messages from the publishing API
    draft_article_id = db.Column(db.Integer, db.ForeignKey('draft_article.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    published_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<PublishedArticle {self.title[:50]}>'

class SystemLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    level = db.Column(db.String(64), index=True) # e.g., INFO, ERROR, WARNING
    module = db.Column(db.String(128)) # e.g., WebScraper, AIContentGenerator, WeChatPublisher
    message = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True) # Optional, for user-specific actions

    def __repr__(self):
        return f'<SystemLog {self.timestamp} [{self.level}] {self.module}: {self.message[:50]}>'

# You might want to add relationships like:
# User.api_configs = db.relationship('ApiConfig', backref='owner', lazy='dynamic')
# User.news_sources = db.relationship('NewsSource', backref='owner', lazy='dynamic')
# etc.
# For now, keeping it simple with ForeignKeys. We can add full relationships later if needed for querying.
