1) Install dependencies
sudo python3 -m pip install requests
sudo python3 -m pip install pyjwt

2) Run the order simulator. Pass the api-gateway-url of the deployed server solution. Pass total number of orders to be created and total number of random get/out/delete calls
python3 order-simulator.py "<api-gateway-urtl>/order" 10 25

3) Run the product simulator. Pass the api-gateway-url of the deployed server solution. Pass total number of products to be created and total number of random get/out/delete calls
python3 product-simulator.py "<api-gateway-urtl>/product" 10 25
