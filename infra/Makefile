.PHONY: up down reset

up:
	kind get clusters | grep -qx gamekube || kind create cluster --name gamekube --config kind/config.yaml
	helm upgrade --install cert-manager helm/cert-manager --namespace cert-manager --create-namespace --wait
	helm upgrade --install ingress helm/ingress --namespace ingress --create-namespace --wait
	helm upgrade --install gamekube helm/gamekube --namespace gamekube --create-namespace --wait

down:
	kind get clusters | grep -qx gamekube && kind delete cluster --name gamekube || true

reset: down up
