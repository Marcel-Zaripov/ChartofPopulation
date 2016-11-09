import os
from flask import Flask, request, render_template, jsonify
from flask.ext.mongoalchemy import MongoAlchemy

app = Flask(__name__)

# for use of mLab hosted databases
conn_str = 'mongodb://{0}:{1}@{2}.mlab.com:47487/cities'.format(
                        os.environ.get('db_user', 'mainuser'),
                        os.environ.get('db_pass', 'secret'),
                        os.environ.get('db_host', 'ds147487'))

app.config['MONGOALCHEMY_DATABASE'] = 'cities'
app.config['MONGOALCHEMY_CONNECTION_STRING'] = conn_str
db = MongoAlchemy(app)


class City(db.Document):
    city = db.StringField()
    pop = db.IntField()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/cities_pop/')
def get_top_twenty_cities():
    top_twenty = []
    # might use JSONEncoder for future, more complex conversions
    for item in City.query.limit(20):
        top_twenty.append(
            {"city": item.city,
             "pop": item.pop})

    return jsonify(top_twenty)


if __name__ == '__main__':
    app.run(debug=True)
