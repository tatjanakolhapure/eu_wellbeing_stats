from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'europeStats'
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
    FIELDS = {
        '_id': False, 'country': True, 'life_satisfaction': True, 'soc_support': True,
        'life_expectancy': True, 'good_health': True, 'unemployment_rate': True,
        'feel_safe': True, 'life_is_worthwhile': True, 'mental_health_index': True,
        'pers_relationships_satisfaction': True, 'job_satisfaction' : True,
        'green_areas_satisfaction': True, 'close_to_neighbours': True,
        'accommodation_satisfaction': True, 'risk_of_poverty': True, 'net_income': True,
        'finances_satisfaction': True, 'ends_meet': True, 'happiness': True, 'loneliness': True
    }
    # Open a connection to MongoDB using a with statement such that the
    # connection will be closed as soon as we exit the with statement
    with MongoClient(MONGODB_HOST, MONGODB_PORT) as conn:
        # Define which collection we wish to access
        collection = conn[DBS_NAME][COLLECTION_NAME]
        # Retrieve a result set only with the fields defined in FIELDS
        wellbeing = collection.find(projection=FIELDS)
        # Convert data to a list in a JSON object and return the JSON data
        return json.dumps(list(wellbeing))


if __name__ == "__main__":
    app.run(debug=True)