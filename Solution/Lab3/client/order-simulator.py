# Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0

import json
import requests
import sys
import random
from utils import Utils 


def add_update_order(order_url, order_id):
    order_request = json.dumps(
        {
            "Description" : "ORDER DESCRIPTION FOR ORDER ID : " + str(order_id),
            "Quantity" : Utils.random_integer(1,1000),
            "OrderPrice": Utils.random_integer(1,5000)
        }
    )

    url = order_url + "/" + str(order_id)
    response = requests.put(url= url, data=order_request, headers=Utils.get_headers())
    print ("ADD/UPDATE ORDER ID {}".format(url))
    print (response)

def get_order(order_url, order_id):
    url = order_url + "/" + str(order_id)

    response = requests.get(url= url, headers=Utils.get_headers())
    print ("GET ORDER ID {}".format(url))
    print (response)

def delete_order(order_url, order_id):
    url = order_url + "/" + str(order_id)

    response = requests.get(url= url, headers=Utils.get_headers())
    print ("DELETE ORDER ID {}".format(url))
    print (response)

def seed_orders(current_order_id, order_url, order_seed_count):
    if current_order_id < order_seed_count:
        add_update_order(order_url, current_order_id)
        current_order_id = current_order_id + 1 
        seed_orders(current_order_id, order_url, order_seed_count)

def generate_calls(order_url, order_seed_count, total_number_of_calls):
    order_methods = [add_update_order, get_order, delete_order]
    for x in range(0, total_number_of_calls):
        random.choice(order_methods)(order_url, Utils.random_integer(0, order_seed_count))


if __name__ == "__main__":
    try:
        seed_orders(0, sys.argv[1], int(sys.argv[2]))
        generate_calls(sys.argv[1], int(sys.argv[2]), int(sys.argv[3]))
    except Exception as e:
        print("error occured")
        print(e)
        raise