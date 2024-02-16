FROM pytorch/pytorch:1.11.0-cuda11.3-cudnn8-runtime
WORKDIR /usr/src/web/dj_nnapi

RUN python -m pip install --upgrade pip
# RUN rm /etc/apt/sources.list.d/cuda.list
# RUN rm /etc/apt/sources.list.d/nvidia-ml.list
RUN apt-get update
RUN apt-get install ffmpeg libsm6 libxext6  -y
RUN apt-get install netcat -y

# RUN rm -rf /opt/conda/lib/python3.8/site-packages/ruamel*

COPY ./config/nnreq.txt ./nnreq.txt
RUN pip install -r ./nnreq.txt

COPY ./config/requirements.txt .
RUN pip install -r ./requirements.txt

ARG MEDIA_ROOT
ENV MEDIA_ROOT=$MEDIA_ROOT

ENV PYTHONUNBUFFERED=1
RUN pip install imagecodecs[all]
COPY entrypoint.sh entrypoint.sh
COPY dj_nnapi/ dj_nnapi2/
ENTRYPOINT [ "./entrypoint.sh" ]

