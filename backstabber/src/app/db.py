from app import FlaskApp
from flask_sqlalchemy import SQLAlchemy

# database
db: SQLAlchemy = SQLAlchemy(FlaskApp)
