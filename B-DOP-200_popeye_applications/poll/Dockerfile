# Use an official Python runtime as a parent image
FROM python:latest

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY ./poll .

# Install the Flask framework
RUN pip3 install -r requirements.txt

# Définir des variables d'environnement 
ENV FLASK_APP=app.py 

EXPOSE 80  

CMD ["flask", "run", "--host=0.0.0.0", "--port=80"]

