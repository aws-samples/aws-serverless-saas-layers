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

    #TODO: Add a static method to create JWT token which has tenantId in it

    @staticmethod
    def get_headers():
        return {
            "Content-Type": "application/json"
            #TODO: Add Authorization header with JWT
        }