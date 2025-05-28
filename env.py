import os

os.environ["IP"] = "0.0.0.0"
os.environ["PORT"] = "5001"
os.environ["SECRET_KEY"] = "your_secret_key_here"
os.environ["DEBUG"] = "True"
os.environ["DEVELOPMENT"] = "True"
os.environ["DB_URL"] = "postgresql://localhost:5432/taskmanager"