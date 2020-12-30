FROM jjanzic/docker-python3-opencv
COPY . .

RUN pip3 install flask numpy matplotlib

RUN pip3 install torch==1.7.1+cpu torchvision==0.8.2+cpu torchaudio==0.7.2 -f https://download.pytorch.org/whl/torch_stable.html

EXPOSE 5000

CMD ["python3", "flask_app.py"]
