import json
import urllib2
import operator
import logging
from itertools import groupby
from popchartapp import City


url = 'http://media.mongodb.org/zips.json'
logging.basicConfig(format='%(message)s', level=logging.INFO)


def process_json():
    # export data from url
    # NEXT: it may be useful to put raw data in
    # database first, before cleansing
    data = []
    for line in urllib2.urlopen(url):
        data.append(json.loads(line))

    data.sort(key=operator.itemgetter('city'))

    # group entries for one cities (e.g. diffrent zipcode zones)
    # mark each city with state for clarity and precision
    # because there are cities with same name in dif states
    groups = groupby(data, lambda e: "{0}, {1}".format(e['city'], e['state']))

    # sum up reslulting pop for each city
    result = sorted([{'city': key, 'pop': sum(item['pop'] for item in gen)}
                    for key, gen in groups],
                    key=operator.itemgetter('pop'),
                    reverse=True)

    populate_database(result)
    logging.info("Done!")


def populate_database(json):
    existing = City.query.all()
    if existing < 1:
        for item in json:
            logging.info("Dumping next: {0} --- {1}".format(
                                item['city'], item['pop']))
            City(city=item['city'], pop=item['pop']).save()
    else:
        city_names = [i['city'] for i in existing]
        for item in json:
            if item['city'] not in city_names:
                logging.info("Dumping next: {0} --- {1}".format(
                                    item['city'], item['pop']))
                City(city=item['city'], pop=item['pop']).save()


if __name__ == '__main__':
    process_json()
