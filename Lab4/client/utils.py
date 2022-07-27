# Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0

import random
import jwt
import random

SECRET_KEY="af92fb8f-ebbf-4df6-a54f-6355b0e9ea28"

class Utils:
    def __init__(self):
        pass
    
    @staticmethod
    def random_integer(start, end):
        return random.randrange(start,end,1)

    @staticmethod
    def create_jwt():
        encoded_jwt = jwt.encode({'tenantId': random.choice(['tenant1', 'tenant2', 'tenant3'])}, SECRET_KEY, algorithm='HS256')
        return encoded_jwt

    @staticmethod
    def get_headers():
        return {
            "Content-Type": "application/json",
            "Authorization":"Bearer " + Utils.create_jwt()
        }