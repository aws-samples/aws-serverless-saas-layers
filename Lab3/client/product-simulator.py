# Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0

import json
import requests
import sys
import random
from utils import Utils 


def add_update_product(product_url, product_id):
    product_request = json.dumps(
        {
            "Description" : "PRODUCT DESCRIPTION FOR PRODUCT ID : " + str(product_id),
            "SKU" : Utils.random_integer(1,1000),
            "ProductPrice": Utils.random_integer(1,5000)
        }
    )

    url = product_url + "/" + str(product_id)
    response = requests.put(url= url, data=product_request, headers=Utils.get_headers())
    print ("ADD/UPDATE PRODUCT ID {}".format(url))
    print (response)

def get_product(product_url, product_id):
    url = product_url + "/" + str(product_id)

    response = requests.get(url= url, headers=Utils.get_headers())
    print ("GET PRODUCT ID {}".format(url))
    print (response)

def delete_product(product_url, product_id):
    url = product_url + "/" + str(product_id)

    response = requests.get(url= url, headers=Utils.get_headers())
    print ("DELETE PRODUCT ID {}".format(url))
    print (response)

def seed_products(current_product_id, product_url, product_seed_count):
    if current_product_id < product_seed_count:
        add_update_product(product_url, current_product_id)
        current_product_id = current_product_id + 1 
        seed_products(current_product_id, product_url, product_seed_count)

def generate_calls(product_url, product_seed_count, total_number_of_calls):
    product_methods = [add_update_product, get_product, delete_product]
    for x in range(0, total_number_of_calls):
        random.choice(product_methods)(product_url, Utils.random_integer(0, product_seed_count))


if __name__ == "__main__":
    try:
        seed_products(0, sys.argv[1], int(sys.argv[2]))
        generate_calls(sys.argv[1], int(sys.argv[2]), int(sys.argv[3]))
    except Exception as e:
        print("error occured")
        print(e)
        raise