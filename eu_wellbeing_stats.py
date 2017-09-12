from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
import os

app = Flask(__name__)

MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
DBS_NAME = os.getenv('MONGO_DB_NAME', 'europeStats')
COLLECTION_NAME = 'wellbeing'


@app.route("/")
def index():
    """
    A Flask view to serve the main dashboard page.
    """
    return render_template("index.html")


@app.route("/europeStats/wellbeing")
def europe_wellbeing():
    """
    A Flask view to serve the project data from
    MongoDB in JSON format.
    """
    # A constant that defines the record fields that we wish to retrieve.
    FIELDS = {'_id': False}
    # Open a connection to MongoDB using a with statement such that the
    # connection will be closed as soon as we exit the with statement
    with MongoClient(MONGO_URI) as conn:
        # Define which collection we wish to access
        collection = conn[DBS_NAME][COLLECTION_NAME]
        # Retrieve a result set only with the fields defined in FIELDS
        wellbeing = collection.find(projection=FIELDS)
        # Convert data to a list in a JSON object and return the JSON data
        return json.dumps(list(wellbeing))


if __name__ == "__main__":
    app.run()