# Backstabber = Backend

Just so you know...

## Run

```bash
docker build -t ponyslaystation .
docker run --rm -p 5000:5000 ponyslaystation
```

If you want to install requirements

```bash
pip3 install -r requirements.txt --user
```

## Deployment (just for Lukas)

wait a bit in between commands to see if all is okay

```bash
kubectl delete deployment/ponyslaystation
kubectl delete service ponyslaystation
docker build -t gcr.io/${PROJECT_ID}/ponyslaystation:v1 .
gcloud docker -- push gcr.io/${PROJECT_ID}/ponyslaystation:v1
kubectl run ponyslaystation --image=gcr.io/${PROJECT_ID}/ponyslaystation:v1 --port 5000
kubectl expose deployment ponyslaystation --type=LoadBalancer --port 5000 --target-port 5000
```

check commands
```bash
kubectl get pods
kubectl get service
```
