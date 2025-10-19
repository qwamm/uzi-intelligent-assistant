import requests
import dramatiq
from dramatiq.results import Results
from dramatiq.brokers.rabbitmq import RabbitmqBroker
from dramatiq.results.backends.redis import RedisBackend

broker = RabbitmqBroker(host="localhost", port=5672)
result_backend = RedisBackend(host="localhost", port=6380)
broker.add_middleware(Results(backend=result_backend))
dramatiq.set_broker(broker)

@dramatiq.actor(store_results=True)
def predict_all(file_path: str, projection_type: str, id: int):
    broker.add_middleware(Results(backend=result_backend))
    NN_API_URL = 'http://127.0.0.1:80'
    api_url = f"{NN_API_URL}/predict/all/"
    file_path = file_path.replace('\\', '/')
    payload = {
        'file_path': file_path,
        'projection_type': projection_type,
        'id': id
    }
    print(file_path)
    try:
        response = requests.post(api_url, json=payload, timeout=3000)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise Exception(f"API request failed: {e}")
