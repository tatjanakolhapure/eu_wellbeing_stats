from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'EuropeStats'
COLLECTION_NAME = 'wellbeing'


@app.route("/")
def index():
    """
    A Flask view to serve the main dashboard page.
    """
    return render_template("index.html")


@app.route("/EuropeStats/wellbeing")
def europe_wellbeing():
    """
    A Flask view to serve the project data from
    MongoDB in JSON format.
    """
    # Open a connection to MongoDB using a with statement such that the
    # connection will be closed as soon as we exit the with statement
    with MongoClient(MONGODB_HOST, MONGODB_PORT) as conn:
        # Define which collection we wish to access
        collection = conn[DBS_NAME][COLLECTION_NAME]
        wellbeing = collection.find()
        # Convert data to a list in a JSON object and return the JSON data
        return json.dumps(list(wellbeing))


if __name__ == "__main__":
    app.run(debug=True)