from flask import Flask, request
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from flask_jsonpify import jsonify

app = Flask(__name__)
cors = CORS(app, supports_credentials=True)

api = Api(app)

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:As123456?@localhost:3306/poc'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

from app.routes import poc_routes
from app import scheduler
