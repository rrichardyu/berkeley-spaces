FROM python:3.12-slim
WORKDIR /api
COPY requirements.txt /api/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /api/requirements.txt
COPY . /api
EXPOSE 8000
CMD ["fastapi", "run", "main.py", "--port", "8000"]