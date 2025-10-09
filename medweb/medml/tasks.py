import requests
import dramatiq
from dramatiq.brokers.redis import RedisBroker
from dramatiq.results import Results
from dramatiq.results.backends.redis import RedisBackend

result_backend = RedisBackend(host="localhost", port=6380)
redis_broker = RedisBroker(host="localhost", port=6380)
redis_broker.add_middleware(Results(backend=result_backend))
dramatiq.set_broker(redis_broker)

@dramatiq.actor(store_results=True)
def predict_all(file_path: str, projection_type: str, id: int):
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
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {response.headers}")

        if response.status_code == 400:
            # Покажите детали ошибки от сервера
            print("Server validation errors:", response.json())
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise Exception(f"API request failed: {e}")
